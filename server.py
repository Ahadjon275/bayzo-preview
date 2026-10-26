"""Сайт Bayzo и админка. Запуск: py -3 server.py"""

import hashlib
import hmac
import json
import re
import secrets
import time
from http.cookies import SimpleCookie
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
CONTENT = ROOT / "data" / "content.json"
PRIVATE = ROOT / "data" / "content.private.json"
AUTH = ROOT / "data" / "auth.json"
PASSWORD_FILE = ROOT / "data" / "password.txt"
ORDERS = ROOT / "data" / "orders.json"
HOST = "127.0.0.1"
PORT = 8765
COOKIE = "bayzo_admin"
MAX_BODY = 1_000_000
sessions = {}
attempts = {}
order_attempts = {}

BLOCKED = {"/data/auth.json", "/data/password.txt", "/data/orders.json", "/data/content.private.json"}


def image_kind(data):
    if data.startswith(b"\xff\xd8\xff"):
        return "jpg"
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "png"
    if data.startswith(b"GIF87a") or data.startswith(b"GIF89a"):
        return "gif"
    if data.startswith(b"RIFF") and data[8:12] == b"WEBP":
        return "webp"
    return ""


def hash_password(password, salt=None):
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.scrypt(password.encode("utf-8"), salt=salt, n=2**14, r=8, p=1)
    return salt.hex() + ":" + digest.hex()


def check_password(password, stored):
    try:
        salt_hex, digest_hex = stored.split(":", 1)
        salt = bytes.fromhex(salt_hex)
        digest = bytes.fromhex(digest_hex)
    except ValueError:
        return False
    test = hashlib.scrypt(password.encode("utf-8"), salt=salt, n=2**14, r=8, p=1)
    return hmac.compare_digest(test, digest)


def ensure_auth():
    if AUTH.exists():
        return
    password = secrets.token_urlsafe(9)
    AUTH.parent.mkdir(parents=True, exist_ok=True)
    AUTH.write_text(json.dumps({"user": "bayzo", "password": hash_password(password)}), encoding="utf-8")
    PASSWORD_FILE.write_text(password + "\n", encoding="utf-8")
    print("Админка: http://%s:%s/admin" % (HOST, PORT))
    print("Логин: bayzo")
    print("Пароль: %s" % password)
    print("Пароль также записан в data/password.txt и в git не попадает.")


def read_auth():
    auth = json.loads(AUTH.read_text(encoding="utf-8"))
    users = auth.get("users")
    if isinstance(users, list) and users:
        return users
    if auth.get("user") and auth.get("password"):
        users = [{"login": auth["user"], "password": auth["password"], "role": "owner"}]
        write_users(users)
        return users
    return []


def write_users(users):
    AUTH.parent.mkdir(parents=True, exist_ok=True)
    AUTH.write_text(json.dumps({"users": users}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def public_users(users):
    return [{"login": item["login"], "role": item["role"]} for item in users]


def clean_login(value):
    login = clean_text(value, 32)
    if not re.fullmatch(r"[A-Za-z0-9_-]{3,32}", login):
        raise ValueError("Логин: от 3 до 32 знаков, только буквы, цифры, _ и -")
    return login


def take_id(item, used):
    raw = clean_text(item.get("id"), 32)
    if re.fullmatch(r"[a-f0-9]{16}", raw) and raw not in used:
        used.add(raw)
        return raw
    fresh = secrets.token_hex(8)
    while fresh in used:
        fresh = secrets.token_hex(8)
    used.add(fresh)
    return fresh


def clean_text(value, limit=4000):
    if not isinstance(value, str):
        return ""
    return value.replace("\x00", "").strip()[:limit]


def clean_lines(value):
    if isinstance(value, str):
        value = value.splitlines()
    if not isinstance(value, list):
        return []
    lines = []
    for item in value[:40]:
        text = clean_text(item, 500)
        if text:
            lines.append(text)
    return lines


def clean_image(value):
    image = clean_text(value, 500)
    if image.startswith("uploads/"):
        if ".." in image or "\\" in image or image.count("/") != 1:
            return ""
        return image
    if image.startswith("https://"):
        return image
    return ""


def clean_content(payload):
    if not isinstance(payload, dict):
        raise ValueError("Нужен объект с контактами, вакансиями и товарами")
    raw = payload.get("contacts") if isinstance(payload.get("contacts"), dict) else {}
    contacts = {
        "phoneShort": clean_text(raw.get("phoneShort"), 40) or "88 11",
        "phoneShortHref": clean_text(raw.get("phoneShortHref"), 80) or "tel:8811",
        "phoneHr": clean_text(raw.get("phoneHr"), 40),
        "phoneHrHref": clean_text(raw.get("phoneHrHref"), 80),
        "email": clean_text(raw.get("email"), 120),
        "hrEmail": clean_text(raw.get("hrEmail"), 120),
        "address": clean_text(raw.get("address"), 300),
        "map": clean_text(raw.get("map"), 500),
    }
    for key in ("phoneShortHref", "phoneHrHref"):
        if contacts[key] and not contacts[key].startswith("tel:"):
            contacts[key] = "tel:" + "".join(ch for ch in contacts[key] if ch.isdigit() or ch == "+")
    for key in ("email", "hrEmail"):
        if contacts[key] and "@" not in contacts[key]:
            raise ValueError("В почте нужен знак @")
    if contacts["map"] and not contacts["map"].startswith("https://"):
        contacts["map"] = ""
    vacancies = []
    vacancy_ids = set()
    for item in (payload.get("vacancies") or [])[:80]:
        if not isinstance(item, dict):
            continue
        title = clean_text(item.get("title"), 160)
        vacancies.append({
            "id": take_id(item, vacancy_ids),
            "tag": clean_text(item.get("tag"), 80),
            "title": title,
            "lead": clean_text(item.get("lead"), 800),
            "tasks": clean_lines(item.get("tasks")),
            "needs": clean_lines(item.get("needs")),
            "terms": clean_lines(item.get("terms")),
            "showEmail": bool(item.get("showEmail", True)),
            "hidden": bool(item.get("hidden")),
        })
    products = []
    product_ids = set()
    allowed = {"fresh", "frozen", "box", "offal", "nut"}
    for item in (payload.get("products") or [])[:200]:
        if not isinstance(item, dict):
            continue
        title = clean_text(item.get("title"), 160)
        cat = clean_text(item.get("cat"), 20)
        products.append({
            "id": take_id(item, product_ids),
            "cat": cat if cat in allowed else "fresh",
            "badge": clean_text(item.get("badge"), 80),
            "title": title,
            "image": clean_image(item.get("image")),
            "hidden": bool(item.get("hidden")),
        })
    partners = []
    partner_ids = set()
    for item in (payload.get("partners") or [])[:80]:
        if not isinstance(item, dict):
            continue
        image = clean_image(item.get("image"))
        partners.append({
            "id": take_id(item, partner_ids),
            "name": clean_text(item.get("name"), 80),
            "image": image,
            "hidden": bool(item.get("hidden")),
        })
    stores = []
    store_ids = set()
    for item in (payload.get("stores") or [])[:80]:
        if not isinstance(item, dict):
            continue
        address = clean_text(item.get("address"), 300)
        link = clean_text(item.get("map"), 500)
        if link and not link.startswith("https://"):
            link = ""
        stores.append({
            "id": take_id(item, store_ids),
            "address": address,
            "hours": clean_text(item.get("hours"), 80),
            "map": link,
            "hidden": bool(item.get("hidden")),
        })
    recipes = []
    recipe_ids = set()
    for item in (payload.get("recipes") or [])[:80]:
        if not isinstance(item, dict):
            continue
        title = clean_text(item.get("title"), 160)
        recipes.append({
            "id": take_id(item, recipe_ids),
            "badge": clean_text(item.get("badge"), 80),
            "title": title,
            "lead": clean_text(item.get("lead"), 400),
            "text": clean_text(item.get("text"), 4000),
            "image": clean_image(item.get("image")),
            "hidden": bool(item.get("hidden")),
        })
    return {"contacts": contacts, "vacancies": vacancies, "products": products, "partners": partners, "stores": stores, "recipes": recipes}


def keep_existing(previous, cleaned):
    for key in ("vacancies", "products", "partners", "stores", "recipes"):
        old_ids = [item.get("id") for item in (previous.get(key) or []) if isinstance(item, dict) and item.get("id")]
        new_ids = {item.get("id") for item in cleaned.get(key) or []}
        if any(item_id not in new_ids for item_id in old_ids):
            raise ValueError("Удалять нельзя. Карточку можно скрыть.")


def ready_for_site(key, item):
    if not isinstance(item, dict) or item.get("hidden"):
        return False
    if key == "partners":
        return bool(item.get("image"))
    if key == "stores":
        return bool(item.get("address"))
    if key in ("vacancies", "products", "recipes"):
        return bool(item.get("title"))
    return False


def public_content(full):
    published = {"contacts": full.get("contacts") or {}}
    for key in ("vacancies", "products", "partners", "stores", "recipes"):
        published[key] = []
        for item in full.get(key) or []:
            if not ready_for_site(key, item):
                continue
            copy = dict(item)
            copy.pop("hidden", None)
            published[key].append(copy)
    return published


def read_json_file(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json_file(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def read_full():
    if PRIVATE.exists():
        return read_json_file(PRIVATE)
    if CONTENT.exists():
        return read_json_file(CONTENT)
    return {"contacts": {}, "vacancies": [], "products": [], "partners": [], "stores": [], "recipes": []}


def write_full(full):
    write_json_file(PRIVATE, full)
    write_json_file(CONTENT, public_content(full))


def ensure_ids():
    if not PRIVATE.exists() and not CONTENT.exists():
        return
    data = read_full()
    for key in ("vacancies", "products", "partners", "stores", "recipes"):
        used = set()
        for item in data.get(key) or []:
            if not isinstance(item, dict):
                continue
            raw = item.get("id")
            if not isinstance(raw, str) or not re.fullmatch(r"[a-f0-9]{16}", raw) or raw in used:
                item["id"] = secrets.token_hex(8)
                while item["id"] in used:
                    item["id"] = secrets.token_hex(8)
            used.add(item["id"])
            if "hidden" not in item:
                item["hidden"] = False
    write_full(data)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "same-origin")
        super().end_headers()

    def do_GET(self):
        path = urlparse(self.path).path
        if path in BLOCKED:
            self.send_error(404)
            return
        if path == "/admin":
            self.path = "/admin/index.html"
        if path == "/api/session":
            who = self.session()
            if not who:
                self.send_json({"ok": False})
                return
            self.send_json({"ok": True, "login": who["login"], "role": who["role"]})
            return
        if path == "/api/admin/content":
            if not self.session():
                self.send_json({"error": "Нужен вход"}, 401)
                return
            self.send_json(read_full())
            return
        if path == "/api/admin/users":
            self.list_users()
            return
        if path == "/api/admin/orders":
            self.list_orders()
            return
        super().do_GET()

    def do_POST(self):
        path = urlparse(self.path).path
        if path == "/api/logout":
            self.drop_session()
            self.send_json({"ok": True}, extra_headers=self.cookie("", 0))
            return
        if path == "/api/login":
            self.login()
            return
        if path == "/api/admin/content":
            self.save_content()
            return
        if path == "/api/admin/users":
            self.create_user()
            return
        if path == "/api/admin/users/remove":
            self.remove_user()
            return
        if path == "/api/admin/upload":
            self.upload()
            return
        if path == "/api/order":
            self.save_order()
            return
        if path == "/api/admin/orders/remove":
            self.remove_order()
            return
        self.send_error(404)

    def login(self):
        ip = self.client_address[0]
        now = time.time()
        bucket = [stamp for stamp in attempts.get(ip, []) if now - stamp < 300]
        if len(bucket) >= 8:
            attempts[ip] = bucket
            self.send_json({"error": "Слишком много попыток. Подождите 5 минут."}, 429)
            return
        payload = self.read_json()
        login = payload.get("login") if isinstance(payload, dict) else ""
        password = payload.get("password") if isinstance(payload, dict) else ""
        users = read_auth()
        found = None
        if isinstance(login, str) and isinstance(password, str):
            key = login.strip().casefold()
            secret = password.strip()
            for item in users:
                if str(item.get("login", "")).casefold() == key and check_password(secret, item.get("password", "")):
                    found = item
                    break
        if not found:
            bucket.append(now)
            attempts[ip] = bucket
            self.send_json({"error": "Неверный логин или пароль"}, 401)
            return
        attempts.pop(ip, None)
        token = secrets.token_urlsafe(32)
        role = found.get("role") if found.get("role") in ("owner", "editor") else "editor"
        sessions[token] = {"until": now + 60 * 60 * 12, "login": found["login"], "role": role}
        self.send_json({"ok": True, "login": found["login"], "role": role}, extra_headers=self.cookie(token, 43200))

    def read_orders(self):
        if not ORDERS.exists():
            return []
        try:
            data = json.loads(ORDERS.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return []
        return data if isinstance(data, list) else []

    def write_orders(self, orders):
        ORDERS.parent.mkdir(parents=True, exist_ok=True)
        ORDERS.write_text(json.dumps(orders, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    def save_order(self):
        ip = self.client_address[0]
        now = time.time()
        bucket = [stamp for stamp in order_attempts.get(ip, []) if now - stamp < 600]
        if len(bucket) >= 6:
            order_attempts[ip] = bucket
            self.send_json({"error": "Слишком много заявок. Позвоните на 88 11."}, 429)
            return
        payload = self.read_json()
        if not isinstance(payload, dict):
            payload = {}
        name = clean_text(payload.get("name"), 80)
        phone = clean_text(payload.get("phone"), 40)
        product = clean_text(payload.get("product"), 80)
        message = clean_text(payload.get("message"), 1000)
        digits = re.sub(r"\D", "", phone)
        if len(name) < 2 or len(digits) < 5 or not product:
            self.send_json({"error": "Напишите имя, телефон и какое мясо нужно."}, 400)
            return
        orders = self.read_orders()
        orders.insert(0, {
            "id": secrets.token_hex(8),
            "at": time.strftime("%Y-%m-%d %H:%M"),
            "name": name,
            "phone": phone,
            "product": product,
            "message": message,
        })
        self.write_orders(orders[:200])
        bucket.append(now)
        order_attempts[ip] = bucket
        self.send_json({"ok": True})

    def list_orders(self):
        if not self.session():
            self.send_json({"error": "Нужен вход"}, 401)
            return
        self.send_json({"orders": self.read_orders()})

    def remove_order(self):
        if not self.session():
            self.send_json({"error": "Нужен вход"}, 401)
            return
        payload = self.read_json()
        target = clean_text(payload.get("id") if isinstance(payload, dict) else "", 32)
        orders = [item for item in self.read_orders() if item.get("id") != target]
        self.write_orders(orders)
        self.send_json({"orders": orders})

    def require_owner(self):
        who = self.session()
        if not who:
            self.send_json({"error": "Нужен вход"}, 401)
            return None
        if who["role"] != "owner":
            self.send_json({"error": "Это может только главный администратор"}, 403)
            return None
        return who

    def list_users(self):
        if not self.require_owner():
            return
        self.send_json({"users": public_users(read_auth())})

    def create_user(self):
        if not self.require_owner():
            return
        payload = self.read_json()
        try:
            login = clean_login(payload.get("login") if isinstance(payload, dict) else "")
            password = payload.get("password") if isinstance(payload, dict) else ""
            if not isinstance(password, str) or len(password) < 8 or len(password) > 80:
                raise ValueError("Пароль должен быть от 8 до 80 знаков")
        except ValueError as exc:
            self.send_json({"error": str(exc)}, 400)
            return
        users = read_auth()
        if any(item.get("login") == login for item in users):
            self.send_json({"error": "Такой логин уже есть"}, 400)
            return
        users.append({"login": login, "password": hash_password(password), "role": "editor"})
        write_users(users)
        self.send_json({"ok": True, "users": public_users(users)})

    def remove_user(self):
        if not self.require_owner():
            return
        payload = self.read_json()
        login = clean_text(payload.get("login") if isinstance(payload, dict) else "", 32)
        users = read_auth()
        target = next((item for item in users if item.get("login") == login), None)
        if not target or target.get("role") == "owner":
            self.send_json({"error": "Этого пользователя нельзя убрать"}, 400)
            return
        users = [item for item in users if item.get("login") != login]
        write_users(users)
        self.send_json({"ok": True, "users": public_users(users)})

    def save_content(self):
        who = self.session()
        if not who:
            self.send_json({"error": "Нужен вход"}, 401)
            return
        try:
            cleaned = clean_content(self.read_json())
            if who["role"] != "owner":
                keep_existing(read_full(), cleaned)
        except ValueError as exc:
            self.send_json({"error": str(exc)}, 400)
            return
        write_full(cleaned)
        self.send_json({"ok": True, "content": cleaned})

    def upload(self):
        if not self.session():
            self.send_json({"error": "Нужен вход"}, 401)
            return
        try:
            filename, data = self.read_file()
        except ValueError as exc:
            self.send_json({"error": str(exc)}, 400)
            return
        folder = ROOT / "uploads"
        folder.mkdir(exist_ok=True)
        target = folder / filename
        target.write_bytes(data)
        self.send_json({"ok": True, "url": "uploads/" + filename})

    def read_file(self):
        ctype = self.headers.get("Content-Type", "")
        if "boundary=" not in ctype:
            raise ValueError("Выберите файл изображения")
        boundary = ctype.split("boundary=", 1)[1].strip().strip('"')
        length = int(self.headers.get("Content-Length") or 0)
        if length <= 0 or length > 8 * 1024 * 1024:
            raise ValueError("Файл должен быть меньше 8 МБ")
        raw = self.rfile.read(length)
        marker = ("--" + boundary).encode("utf-8")
        found = None
        for part in raw.split(marker):
            if b'name="file"' not in part:
                continue
            header, sep, data = part.partition(b"\r\n\r\n")
            if not sep:
                continue
            if data.endswith(b"\r\n"):
                data = data[:-2]
            found = data
            break
        if not found:
            raise ValueError("Файл не получен")
        kind = image_kind(found)
        if not kind:
            raise ValueError("Нужна фотография JPG, PNG, WEBP или GIF")
        return secrets.token_hex(8) + "." + kind, found

    def session(self):
        now = time.time()
        expired = [token for token, data in sessions.items() if not isinstance(data, dict) or data.get("until", 0) < now]
        for token in expired:
            sessions.pop(token, None)
        token = self.cookies().get(COOKIE)
        data = sessions.get(token) if token else None
        if not isinstance(data, dict) or data.get("until", 0) < now:
            return None
        return data

    def drop_session(self):
        token = self.cookies().get(COOKIE)
        if token:
            sessions.pop(token, None)

    def cookies(self):
        jar = SimpleCookie(self.headers.get("Cookie"))
        return {key: morsel.value for key, morsel in jar.items()}

    def cookie(self, token, max_age):
        return ["Set-Cookie: %s=%s; HttpOnly; SameSite=Lax; Path=/; Max-Age=%s" % (COOKIE, token, max_age)]

    def read_json(self):
        length = int(self.headers.get("Content-Length") or 0)
        if length < 0 or length > MAX_BODY:
            return {}
        raw = self.rfile.read(length) if length else b""
        if not raw:
            return {}
        try:
            return json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError:
            return {}

    def send_json(self, payload, status=200, extra_headers=None):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        for header in extra_headers or []:
            name, value = header.split(": ", 1)
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        if str(args[0]).startswith("4") or str(args[0]).startswith("5"):
            super().log_message(fmt, *args)


if __name__ == "__main__":
    ensure_auth()
    ensure_ids()
    ThreadingHTTPServer.allow_reuse_address = True
    httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    print("Сайт: http://%s:%s/" % (HOST, PORT))
    print("Админка: http://%s:%s/admin" % (HOST, PORT))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nОстановлено")
