"""Сайт Bayzo и админка. Запуск: py -3 server.py"""

import hashlib
import hmac
import json
import secrets
import time
from http.cookies import SimpleCookie
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
CONTENT = ROOT / "data" / "content.json"
AUTH = ROOT / "data" / "auth.json"
PASSWORD_FILE = ROOT / "data" / "password.txt"
HOST = "127.0.0.1"
PORT = 8765
COOKIE = "bayzo_admin"
MAX_BODY = 1_000_000
sessions = {}
attempts = {}

BLOCKED = {"/data/auth.json", "/data/password.txt"}


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
    return json.loads(AUTH.read_text(encoding="utf-8"))


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
    for item in (payload.get("vacancies") or [])[:80]:
        if not isinstance(item, dict):
            continue
        title = clean_text(item.get("title"), 160)
        if not title:
            continue
        vacancies.append({
            "tag": clean_text(item.get("tag"), 80),
            "title": title,
            "lead": clean_text(item.get("lead"), 800),
            "tasks": clean_lines(item.get("tasks")),
            "needs": clean_lines(item.get("needs")),
            "terms": clean_lines(item.get("terms")),
            "showEmail": bool(item.get("showEmail", True)),
        })
    products = []
    allowed = {"fresh", "frozen", "box", "offal", "nut"}
    for item in (payload.get("products") or [])[:200]:
        if not isinstance(item, dict):
            continue
        title = clean_text(item.get("title"), 160)
        if not title:
            continue
        cat = clean_text(item.get("cat"), 20)
        products.append({
            "cat": cat if cat in allowed else "fresh",
            "badge": clean_text(item.get("badge"), 80),
            "title": title,
            "image": clean_image(item.get("image")),
        })
    partners = []
    for item in (payload.get("partners") or [])[:80]:
        if not isinstance(item, dict):
            continue
        image = clean_image(item.get("image"))
        if not image:
            continue
        partners.append({
            "name": clean_text(item.get("name"), 80),
            "image": image,
        })
    stores = []
    for item in (payload.get("stores") or [])[:80]:
        if not isinstance(item, dict):
            continue
        address = clean_text(item.get("address"), 300)
        if not address:
            continue
        link = clean_text(item.get("map"), 500)
        if link and not link.startswith("https://"):
            link = ""
        stores.append({
            "address": address,
            "hours": clean_text(item.get("hours"), 80),
            "map": link,
        })
    return {"contacts": contacts, "vacancies": vacancies, "products": products, "partners": partners, "stores": stores}


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
            self.send_json({"ok": self.authorized()})
            return
        if path == "/api/admin/content":
            if not self.authorized():
                self.send_json({"error": "Нужен вход"}, 401)
                return
            self.send_json(json.loads(CONTENT.read_text(encoding="utf-8")))
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
        if path == "/api/admin/upload":
            self.upload()
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
        password = payload.get("password") if isinstance(payload, dict) else ""
        auth = read_auth()
        if not isinstance(password, str) or not check_password(password, auth.get("password", "")):
            bucket.append(now)
            attempts[ip] = bucket
            self.send_json({"error": "Неверный пароль"}, 401)
            return
        attempts.pop(ip, None)
        token = secrets.token_urlsafe(32)
        sessions[token] = now + 60 * 60 * 12
        self.send_json({"ok": True}, extra_headers=self.cookie(token, 43200))

    def save_content(self):
        if not self.authorized():
            self.send_json({"error": "Нужен вход"}, 401)
            return
        try:
            cleaned = clean_content(self.read_json())
        except ValueError as exc:
            self.send_json({"error": str(exc)}, 400)
            return
        CONTENT.write_text(json.dumps(cleaned, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        self.send_json({"ok": True})

    def upload(self):
        if not self.authorized():
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

    def authorized(self):
        now = time.time()
        expired = [token for token, until in sessions.items() if until < now]
        for token in expired:
            sessions.pop(token, None)
        token = self.cookies().get(COOKIE)
        return bool(token and sessions.get(token, 0) >= now)

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
    ThreadingHTTPServer.allow_reuse_address = True
    httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    print("Сайт: http://%s:%s/" % (HOST, PORT))
    print("Админка: http://%s:%s/admin" % (HOST, PORT))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nОстановлено")
