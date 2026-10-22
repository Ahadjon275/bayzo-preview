(function () {
  const KEY = "bayzo-lang";
  const pair = {
    "Логотип Bayzo": ["Логотипи Bayzo", "Bayzo logo"],
    "Чистый продукт": ["Маҳсулоти пок", "Clean product"],
    "Основное меню": ["Менюи асосӣ", "Main menu"],
    "Главная": ["Асосӣ", "Home"],
    "Каталог": ["Каталог", "Catalog"],
    "О нас": ["Дар бораи мо", "About"],
    "Рецепты": ["Рецептҳо", "Recipes"],
    "Вакансии": ["Вакансияҳо", "Jobs"],
    "Контакты": ["Тамос", "Contacts"],
    "Язык": ["Забон", "Language"],
    "Открыть меню": ["Кушодани меню", "Open menu"],
    "Таджикистан · с 2018 года": ["Тоҷикистон · аз соли 2018", "Tajikistan · since 2018"],
    "Натуральный вкус родного края": ["Таъми табиии зодгоҳ", "The natural taste of home"],
    "С нашей фермы к вашему столу. Мясо цыплёнка-бройлера, выращенное в замкнутом цикле и проверенное на каждом этапе.": ["Аз фермаи мо ба дастархони шумо. Гӯшти чӯҷаи бройлер, ки дар даври пӯшида парвариш ёфта, дар ҳар марҳила санҷида мешавад.", "From our farm to your table. Broiler meat raised in a closed cycle and checked at every step."],
    "Смотреть каталог": ["Дидани каталог", "View catalog"],
    "О компании": ["Дар бораи ширкат", "About the company"],
    "Производство Bayzo": ["Истеҳсоли Bayzo", "Bayzo production"],
    "лет качества": ["соли сифат", "years of quality"],
    "наград": ["мукофот", "awards"],
    "стран присутствия": ["кишвари ҳузур", "countries"],
    "Почему Bayzo": ["Чаро Bayzo", "Why Bayzo"],
    "Производим сами — от корма до прилавка": ["Худамон истеҳсол мекунем — аз хӯрок то раф", "We produce it ourselves — from feed to the shelf"],
    "Своя ферма": ["Фермаи худӣ", "Our own farm"],
    "Выращиваем цыплёнка-бройлера в Б. Гафурове и контролируем путь от яйца до упаковки.": ["Чӯҷаи бройлерро дар Б. Ғафуров парвариш мекунем ва роҳро аз тухм то баста назорат мекунем.", "We raise broilers in B. Gafurov and control the path from egg to pack."],
    "Свой комбикорм": ["Хӯроки омехтаи худӣ", "Our own feed"],
    "С 2021 года завод выпускает до 5 тонн корма в час из проверенного сырья.": ["Аз соли 2021 корхона то 5 тонна хӯрок дар як соат аз ашёи санҷидашуда мебарорад.", "Since 2021 the plant has produced up to 5 tonnes of feed an hour from checked raw materials."],
    "Халяль": ["Ҳалол", "Halal"],
    "Мясо выпускается по стандартам шариата. Сертификаты можно посмотреть ниже.": ["Гӯшт аз рӯи меъёрҳои шариат истеҳсол мешавад. Сертификатҳоро поёнтар дидан мумкин аст.", "The meat is produced to halal standards. Certificates are below."],
    "По всей стране": ["Дар тамоми кишвар", "Across the country"],
    "Поставки от Согда до Хатлона и Бадахшана. Короткий номер — 88 11.": ["Расонидан аз Суғд то Хатлон ва Бадахшон. Рақами кӯтоҳ — 88 11.", "Deliveries from Sughd to Khatlon and Badakhshan. Short number — 88 11."],
    "Ферма Bayzo": ["Фермаи Bayzo", "Bayzo farm"],
    "Одно из ведущих птицеводческих предприятий Таджикистана. Мы производим мясо бройлера и собственные комбикорма — от инкубационного яйца до упаковки на прилавке.": ["Яке аз корхонаҳои пешбари парандапарварии Тоҷикистон. Мо гӯшти бройлер ва хӯроки омехтаи худро истеҳсол мекунем — аз тухми инкубатсионӣ то баста дар раф.", "One of Tajikistan’s leading poultry producers. We make broiler meat and our own feed — from hatching egg to the packed shelf."],
    "Замкнутый цикл": ["Даври пӯшида", "Closed cycle"],
    "Контроль качества на выращивании, корме и переработке.": ["Назорати сифат дар парвариш, хӯрок ва коркард.", "Quality control in growing, feed and processing."],
    "Завод мощностью до 5 тонн в час с 2021 года.": ["Корхона бо иқтидори то 5 тонна дар як соат аз соли 2021.", "A plant of up to 5 tonnes an hour since 2021."],
    "170 сотрудников": ["170 корманд", "170 employees"],
    "Команда выросла с 32 человек и работает в Б. Гафурове.": ["Даста аз 32 нафар калон шуд ва дар Б. Ғафуров кор мекунад.", "The team grew from 32 people and works in B. Gafurov."],
    "Продукция выпускается по стандартам шариата и международным нормам.": ["Маҳсулот аз рӯи меъёрҳои шариат ва қоидаҳои байналмилалӣ истеҳсол мешавад.", "Products are made to halal standards and international rules."],
    "Подробнее о нас": ["Бештар дар бораи мо", "More about us"],
    "Ассортимент": ["Гуногунӣ", "Range"],
    "Наша продукция": ["Маҳсулоти мо", "Our products"],
    "Весь каталог": ["Тамоми каталог", "Full catalog"],
    "Филе куриной грудки без кожи": ["Филеи синаи мурғ бе пӯст", "Skinless chicken breast fillet"],
    "Филе грудки без кожи": ["Филеи сина бе пӯст", "Skinless breast fillet"],
    "Голень цыплёнка-бройлера": ["Соқи чӯҷаи бройлер", "Broiler drumstick"],
    "Голень с кожей": ["Соқ бо пӯст", "Drumstick with skin"],
    "Тушка цыплёнка-бройлера": ["Тушаи чӯҷаи бройлер", "Whole broiler"],
    "Окорочка Bayzo": ["Ронҳои Bayzo", "Bayzo thighs"],
    "Халяль · 10 кг": ["Ҳалол · 10 кг", "Halal · 10 kg"],
    "Окорочка в коробке": ["Ронҳо дар қуттӣ", "Thighs in a box"],
    "Для дома": ["Барои хона", "For home"],
    "К столу каждый день": ["Ҳар рӯз ба дастархон", "On the table every day"],
    "Охлаждённые тушка, филе, голень и крыло. Рядом — рецепты, которые готовятся из этой же продукции.": ["Туша, филе, соқ ва боли хунуккарда. Дар паҳлӯ — рецептҳое, ки аз ҳамин маҳсулот тайёр мешаванд.", "Chilled whole bird, fillet, drumstick and wing. Beside them, recipes made from the same products."],
    "Смотреть рецепты": ["Дидани рецептҳо", "View recipes"],
    "Для магазинов и опта": ["Барои мағозаҳо ва яклухт", "For shops and wholesale"],
    "Станьте партнёром": ["Шарик шавед", "Become a partner"],
    "Коробки по 10 кг, заморозка и стабильные поставки по Таджикистану. Напишите нам — ответим по заявке.": ["Қуттиҳои 10 кг, яхкунӣ ва расонидани устувор дар Тоҷикистон. Ба мо нависед — ба дархост ҷавоб медиҳем.", "10 kg boxes, frozen products and steady deliveries across Tajikistan. Write to us and we will answer."],
    "Оставить заявку": ["Гузоштани дархост", "Send a request"],
    "История": ["Таърих", "History"],
    "Как росла ферма": ["Ферма чӣ гуна калон шуд", "How the farm grew"],
    "Основание ООО «Чучаи Байзо» и открытие предприятия при участии Президента Республики Таджикистан.": ["Таъсиси ҶДММ «Чучаи Байзо» ва ифтитоҳи корхона бо иштироки Президенти Ҷумҳурии Тоҷикистон.", "Founding of Chuchai Bayzo LLC and the opening of the plant with the President of the Republic of Tajikistan."],
    "Запуск собственного комбикормового завода мощностью до 5 тонн в час.": ["Ба кор даровардани корхонаи худии хӯроки омехта бо иқтидори то 5 тонна дар як соат.", "Launch of our own feed plant, up to 5 tonnes an hour."],
    "Сейчас": ["Ҳоло", "Now"],
    "170 сотрудников, 28+ наград и поставки продукции в 9+ стран.": ["170 корманд, 28+ мукофот ва расонидани маҳсулот ба 9+ кишвар.", "170 employees, 28+ awards and deliveries to 9+ countries."],
    "Качество": ["Сифат", "Quality"],
    "Стандарты и сертификаты": ["Стандартҳо ва сертификатҳо", "Standards and certificates"],
    "Сертификат": ["Сертификат", "Certificate"],
    "Сертификат халяль": ["Сертификати ҳалол", "Halal certificate"],
    "География": ["Ҷуғрофия", "Geography"],
    "Карта нашего присутствия": ["Харитаи ҳузури мо", "Where we are"],
    "Продукция Bayzo есть в городах и районах по всему Таджикистану — от Согда до Хатлона и Горного Бадахшана.": ["Маҳсулоти Bayzo дар шаҳрҳо ва ноҳияҳои тамоми Тоҷикистон ҳаст — аз Суғд то Хатлон ва Бадахшони Кӯҳӣ.", "Bayzo products are in towns and districts across Tajikistan — from Sughd to Khatlon and Gorno-Badakhshan."],
    "Худжанд": ["Хуҷанд", "Khujand"],
    "Б. Гафуров": ["Б. Ғафуров", "B. Gafurov"],
    "Истаравшан": ["Истаравшан", "Istaravshan"],
    "Душанбе": ["Душанбе", "Dushanbe"],
    "Гиссар": ["Ҳисор", "Hisor"],
    "Бохтар": ["Бохтар", "Bokhtar"],
    "Куляб": ["Кӯлоб", "Kulob"],
    "Хорог": ["Хоруғ", "Khorog"],
    "Карта присутствия Bayzo в Таджикистане": ["Харитаи ҳузури Bayzo дар Тоҷикистон", "Map of Bayzo across Tajikistan"],
    "Партнёры": ["Шарикҳо", "Partners"],
    "Нам доверяют ведущие бренды": ["Ба мо брендҳои пешсаф бовар доранд", "Leading brands trust us"],
    "Партнёр": ["Шарик", "Partner"],
    "Кухня": ["Ошхона", "Kitchen"],
    "Рецепты с нашей продукцией": ["Рецептҳо бо маҳсулоти мо", "Recipes with our products"],
    "Все рецепты": ["Ҳамаи рецептҳо", "All recipes"],
    "Крылышки": ["Болчаҳо", "Wings"],
    "Хрустящая панировка и кефирный маринад": ["Панировкаи хушк ва маринади кефир", "Crisp coating and a kefir marinade"],
    "Филе": ["Филе", "Fillet"],
    "Сливочно-грибной соус и кармашки с сыром": ["Чошнии қаймоқию занбӯруғӣ ва ҷайбчаҳо бо панир", "Creamy mushroom sauce and cheese pockets"],
    "Окорочка": ["Ронҳо", "Thighs"],
    "Запечённые с чесноком и травами": ["Бо сир ва гиёҳҳо пухташуда", "Baked with garlic and herbs"],
    "Связь": ["Алоқа", "Contact"],
    "Закажите чистый продукт Bayzo": ["Маҳсулоти поки Bayzo-ро фармоиш диҳед", "Order clean Bayzo product"],
    "Позвонить 88 11": ["Занг ба 88 11", "Call 88 11"],
    "Написать нам": ["Ба мо нависед", "Write to us"],
    "ООО «Чучаи Байзо». Натуральный вкус родного края — с нашей фермы к вашему столу.": ["ҶДММ «Чучаи Байзо». Таъми табиии зодгоҳ — аз фермаи мо ба дастархони шумо.", "Chuchai Bayzo LLC. The natural taste of home — from our farm to your table."],
    "Разделы": ["Бахшҳо", "Sections"],
    "Б. Гафуров, джамоат Исфисор, ул. Чувашня 20/1": ["Б. Ғафуров, ҷамоати Исфисор, кӯч. Чувашня 20/1", "B. Gafurov, Isfisor jamoat, Chuvashnya St. 20/1"],
    "Текущий сайт bayzo.tj": ["Сомонаи ҳозираи bayzo.tj", "Current site bayzo.tj"],
    "Продукция": ["Маҳсулот", "Products"],
    "Охлаждённое и замороженное мясо цыплёнка-бройлера, оптовые коробки по 10 кг, субпродукты и нут. Купить можно в фирменной сети и у партнёров.": ["Гӯшти хунуккарда ва яхкардаи чӯҷаи бройлер, қуттиҳои яклухти 10 кг, маҳсулоти иловагӣ ва нахӯд. Харидан дар шабакаи фирмӣ ва назди шарикҳо мумкин аст.", "Chilled and frozen broiler meat, 10 kg wholesale boxes, offal and chickpeas. Buy them in the company shops and from partners."],
    "Все": ["Ҳама", "All"],
    "Охлаждённая": ["Хунуккарда", "Chilled"],
    "Замороженная": ["Яхкарда", "Frozen"],
    "Коробки 10 кг": ["Қуттиҳои 10 кг", "10 kg boxes"],
    "Субпродукты": ["Маҳсулоти иловагӣ", "Offal"],
    "Нут": ["Нахӯд", "Chickpeas"],
    "Охлаждённая · Халяль": ["Хунуккарда · Ҳалол", "Chilled · Halal"],
    "Крыло цыплёнка-бройлера": ["Боли чӯҷаи бройлер", "Broiler wing"],
    "Филе куриной грудки без кожи, заморозка": ["Филеи синаи мурғ бе пӯст, яхкарда", "Skinless chicken breast fillet, frozen"],
    "Замороженная · Халяль": ["Яхкарда · Ҳалол", "Frozen · Halal"],
    "Голень с кожей, заморозка": ["Соқ бо пӯст, яхкарда", "Drumstick with skin, frozen"],
    "Крыло цыплёнка-бройлера, заморозка": ["Боли чӯҷаи бройлер, яхкарда", "Broiler wing, frozen"],
    "Тушка цыплёнка-бройлера, заморозка": ["Тушаи чӯҷаи бройлер, яхкарда", "Whole broiler, frozen"],
    "Филе в коробке 10 кг": ["Филе дар қуттии 10 кг", "Fillet in a 10 kg box"],
    "10 кг · Халяль": ["10 кг · Ҳалол", "10 kg · Halal"],
    "Филе грудки без кожи в коробке": ["Филеи сина бе пӯст дар қуттӣ", "Skinless breast fillet in a box"],
    "Окорочка в коробке 10 кг": ["Ронҳо дар қуттии 10 кг", "Thighs in a 10 kg box"],
    "Крыло в коробке 10 кг": ["Бол дар қуттии 10 кг", "Wing in a 10 kg box"],
    "Крыло в коробке": ["Бол дар қуттӣ", "Wing in a box"],
    "Голень в коробке 10 кг": ["Соқ дар қуттии 10 кг", "Drumstick in a 10 kg box"],
    "Голень в коробке": ["Соқ дар қуттӣ", "Drumstick in a box"],
    "Мышечные желудки": ["Меъдаҳои мушакӣ", "Gizzards"],
    "Субпродукты · Халяль": ["Маҳсулоти иловагӣ · Ҳалол", "Offal · Halal"],
    "Сердечки цыплёнка-бройлера": ["Дилчаҳои чӯҷаи бройлер", "Broiler hearts"],
    "Печень цыплёнка-бройлера": ["Ҷигари чӯҷаи бройлер", "Broiler liver"],
    "Нут Bayzo": ["Нахӯди Bayzo", "Bayzo chickpeas"],
    "Нут 150 г и 300 г": ["Нахӯд 150 г ва 300 г", "Chickpeas, 150 g and 300 g"],
    "ООО «Чучаи Байзо». Натуральный вкус родного края.": ["ҶДММ «Чучаи Байзо». Таъми табиии зодгоҳ.", "Chuchai Bayzo LLC. The natural taste of home."],
    "Каталог на bayzo.tj": ["Каталог дар bayzo.tj", "Catalog on bayzo.tj"],
    "Компания": ["Ширкат", "Company"],
    "Традиции качества и современные технологии": ["Анъанаи сифат ва технологияи муосир", "A tradition of quality and modern technology"],
    "ООО «Чучаи Байзо» — одно из ведущих птицеводческих предприятий Таджикистана. Мы производим мясо бройлера и сбалансированные комбикорма.": ["ҶДММ «Чучаи Байзо» — яке аз корхонаҳои пешбари парандапарварии Тоҷикистон. Мо гӯшти бройлер ва хӯроки омехтаи мутавозин истеҳсол мекунем.", "Chuchai Bayzo LLC is one of Tajikistan’s leading poultry producers. We make broiler meat and balanced feed."],
    "Предприятие Bayzo": ["Корхонаи Bayzo", "The Bayzo plant"],
    "С 2018 года": ["Аз соли 2018", "Since 2018"],
    "Компания основана в рамках государственной программы индустриализации и прошла путь от локального производства до масштабного комплекса. Предприятие открыто при участии Лидера нации, Президента Республики Таджикистан уважаемого Эмомали Рахмона.": ["Ширкат дар доираи барномаи давлатии саноатӣ таъсис ёфт ва аз истеҳсоли маҳаллӣ то маҷмааи калон расид. Корхона бо иштироки Пешвои миллат, Президенти Ҷумҳурии Тоҷикистон муҳтарам Эмомалӣ Раҳмон ифтитоҳ шуд.", "The company was founded under the state industrialisation programme and grew from a local plant into a large complex. It was opened with the Leader of the Nation, the President of the Republic of Tajikistan, Emomali Rahmon."],
    "Миссия — давать людям экологически чистый, натуральный и доступный мясной продукт по международным стандартам качества.": ["Рисолат — додани маҳсулоти гӯштии аз ҷиҳати экологӣ пок, табиӣ ва дастрас аз рӯи стандартҳои байналмилалии сифат.", "Our mission is to give people clean, natural and affordable meat to international quality standards."],
    "Выращивание": ["Парвариш", "Growing"],
    "На площади 1,33 га в Б. Гафуровском районе работают цеха с современным оборудованием. Мы отбираем инкубационные яйца у проверенных поставщиков.": ["Дар масоҳати 1,33 га дар ноҳияи Б. Ғафуров сехҳо бо таҷҳизоти муосир кор мекунанд. Тухми инкубатсиониро аз таъминкунандагони санҷидашуда интихоб мекунем.", "Workshops with modern equipment operate on 1.33 ha in B. Gafurov district. We select hatching eggs from checked suppliers."],
    "Кормопроизводство": ["Истеҳсоли хӯрок", "Feed production"],
    "С 2021 года собственный завод выпускает до 5 тонн комбикорма в час. Сырьё — из Казахстана, Латвии и Узбекистана.": ["Аз соли 2021 корхонаи худӣ то 5 тонна хӯроки омехта дар як соат мебарорад. Ашё аз Қазоқистон, Латвия ва Ӯзбекистон аст.", "Since 2021 our own plant has produced up to 5 tonnes of compound feed an hour. Raw materials come from Kazakhstan, Latvia and Uzbekistan."],
    "Контроль и люди": ["Назорат ва одамон", "Control and people"],
    "Натуральный вкус без вредных добавок. Штат вырос с 32 до 170 сотрудников — это вклад в экономику региона.": ["Таъми табиӣ бе иловаҳои зараровар. Шумораи кормандон аз 32 то 170 расид — ин саҳм ба иқтисоди минтақа аст.", "A natural taste without harmful additives. Staff grew from 32 to 170 — a contribution to the region’s economy."],
    "Путь компании": ["Роҳи ширкат", "The company’s path"],
    "Компания создана в рамках программы индустриализации. Предприятие открыто при участии Президента Республики Таджикистан уважаемого Эмомали Рахмона.": ["Ширкат дар доираи барномаи саноатӣ таъсис ёфт. Корхона бо иштироки Президенти Ҷумҳурии Тоҷикистон муҳтарам Эмомалӣ Раҳмон ифтитоҳ шуд.", "The company was created under the industrialisation programme. The plant was opened with the President of the Republic of Tajikistan, Emomali Rahmon."],
    "Запущен завод комбикормов. Мощность — до 5 тонн в час, сырьё из Казахстана, Латвии и Узбекистана.": ["Корхонаи хӯроки омехта ба кор даромад. Иқтидор — то 5 тонна дар як соат, ашё аз Қазоқистон, Латвия ва Ӯзбекистон.", "The feed plant started. Capacity is up to 5 tonnes an hour, with raw materials from Kazakhstan, Latvia and Uzbekistan."],
    "Штат вырос с 32 до 170 человек. Продукция Bayzo представлена по Таджикистану и поставляется в 9+ стран.": ["Шумораи кормандон аз 32 то 170 расид. Маҳсулоти Bayzo дар Тоҷикистон ҳаст ва ба 9+ кишвар расонида мешавад.", "Staff grew from 32 to 170. Bayzo products are across Tajikistan and supplied to 9+ countries."],
    "Цитата компании": ["Сухани ширкат", "Company line"],
    "«Чучаи Байзо» — на службе вашего здоровья": ["«Чучаи Байзо» — дар хизмати саломатии шумо", "“Chuchai Bayzo” — in the service of your health"],
    "Связаться": ["Тамос гирифтан", "Get in touch"],
    "Простые домашние блюда из крылышек, филе, голени, тушки, окорочков и субпродуктов Bayzo.": ["Таомҳои оддии хонагӣ аз болча, филе, соқ, туша, рон ва маҳсулоти иловагии Bayzo.", "Simple home dishes from Bayzo wings, fillet, drumsticks, whole birds, thighs and offal."],
    "Крылышки в панировке": ["Болчаҳо дар панировка", "Coated wings"],
    "Крылышки в хрустящей панировке": ["Болчаҳо дар панировкаи хушк", "Wings in a crisp coating"],
    "Маринад на кефире, сухая панировка и запекание до золотистой корочки.": ["Маринад дар кефир, панировкаи хушк ва пухтан то қишри тиллоӣ.", "A kefir marinade, a dry coating and baking to a golden crust."],
    "Филе в соусе": ["Филе дар чошнӣ", "Fillet in sauce"],
    "Филе в сливочно-грибном соусе": ["Филе дар чошнии қаймоқию занбӯруғӣ", "Fillet in creamy mushroom sauce"],
    "Нежная грудка без кожи, грибы и сливки. Рядом — кармашки с сыром и помидорами.": ["Синаи нарм бе пӯст, занбӯруғ ва қаймоқ. Дар паҳлӯ — ҷайбчаҳо бо панир ва помидор.", "Tender skinless breast, mushrooms and cream. Beside it, pockets with cheese and tomato."],
    "Голень в глазури": ["Соқ дар глазур", "Glazed drumstick"],
    "Голень": ["Соқ", "Drumstick"],
    "Голени в горчично-медовой глазури": ["Соқҳо дар глазури хардалу асал", "Drumsticks in a mustard-honey glaze"],
    "Сладко-острая глазурь карамелизуется в духовке и держит мясо сочным.": ["Глазури ширин-тез дар танӯр карамел мешавад ва гӯштро сероб нигоҳ медорад.", "The sweet-hot glaze caramelises in the oven and keeps the meat juicy."],
    "Целая тушка": ["Тушаи бутун", "Whole bird"],
    "Тушка": ["Туша", "Whole bird"],
    "Курица по-домашнему": ["Мурғ ба тарзи хонагӣ", "Home-style chicken"],
    "Целая тушка на овощной подушке: картофель, морковь и специи родной кухни.": ["Тушаи бутун бар болини сабзавот: картошка, сабзӣ ва ҳанутҳои ошхонаи ватанӣ.", "A whole bird on a bed of vegetables: potato, carrot and the spices of home cooking."],
    "Окорочка с чесноком и травами": ["Ронҳо бо сир ва гиёҳҳо", "Thighs with garlic and herbs"],
    "Запекание в рукаве или на соляной подушке — мясо остаётся мягким.": ["Пухтан дар остин ё бар болини намак — гӯшт нарм мемонад.", "Baking in a sleeve or on a bed of salt keeps the meat tender."],
    "Печень в сметане": ["Ҷигар дар қаймоқ", "Liver in sour cream"],
    "Печень в сметане с луком": ["Ҷигар дар қаймоқ бо пиёз", "Liver in sour cream with onion"],
    "Быстрое блюдо из печени, сердечек или желудков — для будней и плова.": ["Таоми тез аз ҷигар, дилча ё меъда — барои рӯзҳои корӣ ва палав.", "A quick dish of liver, hearts or gizzards — for weekdays and for plov."],
    "Готовьте из чистого продукта — с нашей фермы к вашему столу.": ["Аз маҳсулоти пок пухтед — аз фермаи мо ба дастархони шумо.", "Cook with a clean product — from our farm to your table."],
    "Фирменный магазин и производство в Б. Гафурове. Позвоните, напишите или оставьте заявку — мы ответим.": ["Мағозаи фирмӣ ва истеҳсолот дар Б. Ғафуров. Занг занед, нависед ё дархост гузоред — мо ҷавоб медиҳем.", "The company shop and the plant are in B. Gafurov. Call, write or leave a request — we will answer."],
    "Телефон": ["Телефон", "Phone"],
    "Короткий номер для звонков по Таджикистану": ["Рақами кӯтоҳ барои зангҳо дар Тоҷикистон", "A short number for calls inside Tajikistan"],
    "Почта": ["Почта", "Email"],
    "Адрес": ["Суроға", "Address"],
    "Таджикистан, Б. Гафуров, джамоат Исфисор, ул. Чувашня 20/1": ["Тоҷикистон, Б. Ғафуров, ҷамоати Исфисор, кӯч. Чувашня 20/1", "Tajikistan, B. Gafurov, Isfisor jamoat, Chuvashnya St. 20/1"],
    "Открыть на карте": ["Кушодан дар харита", "Open on the map"],
    "Откроется почтовая программа, чтобы отправить сообщение на info@bayzo.tj. Если письмо не открылось, напишите на эту почту или позвоните на 88 11.": ["Барномаи почта кушода мешавад, то паём ба info@bayzo.tj равад. Агар мактуб кушода нашавад, ба ҳамин почта нависед ё ба 88 11 занг занед.", "Your mail app will open to send a message to info@bayzo.tj. If it does not open, write to that address or call 88 11."],
    "Имя": ["Ном", "Name"],
    "Как к вам обращаться": ["Чӣ тавр муроҷиат кунем", "How should we address you"],
    "Сообщение": ["Паём", "Message"],
    "Опт, магазин или вопрос по продукции": ["Яклухт, мағоза ё савол дар бораи маҳсулот", "Wholesale, a shop, or a product question"],
    "Отправить": ["Фиристодан", "Send"],
    "Чистый продукт с фермы в Таджикистане.": ["Маҳсулоти пок аз ферма дар Тоҷикистон.", "Clean product from a farm in Tajikistan."],
    "Работа в Bayzo": ["Кор дар Bayzo", "Work at Bayzo"],
    "Открытые позиции ООО «Чучаи Байзо»: офис, магазины, комбикормовый завод, птицефабрика и доставка. Резюме — на": ["Вазифаҳои кушодаи ҶДММ «Чучаи Байзо»: идора, мағозаҳо, корхонаи хӯрок, фабрикаи паранда ва расонидан. Резюме — ба", "Open roles at Chuchai Bayzo LLC: office, shops, feed plant, poultry farm and delivery. Send a CV to"],
    "Офис · февраль 2026": ["Идора · феврали 2026", "Office · February 2026"],
    "Специалист по мониторингу": ["Мутахассиси мониторинг", "Monitoring specialist"],
    "Ищем человека, который видит финансовые и операционные риски на ранней стадии и помогает сделать процессы устойчивее.": ["Шахсеро меҷӯем, ки хатарҳои молиявӣ ва амалиётиро барвақт мебинад ва равандҳоро устувортар мекунад.", "We are looking for someone who spots financial and operational risks early and makes processes steadier."],
    "Задачи": ["Вазифаҳо", "Tasks"],
    "Оценка финансовых и операционных рисков.": ["Баҳодиҳии хатарҳои молиявӣ ва амалиётӣ.", "Assessing financial and operational risks."],
    "Мониторинг дебиторской задолженности и контроль лимитов.": ["Мониторинги қарзи дебиторӣ ва назорати лимитҳо.", "Monitoring receivables and credit limits."],
    "Разбор инцидентов и поиск причин уязвимостей.": ["Таҳлили ҳодисаҳо ва ҷустуҷӯи сабабҳои осебпазирӣ.", "Reviewing incidents and finding the causes of weaknesses."],
    "Аналитические отчёты для руководства и предложения по процессам.": ["Гузоришҳои таҳлилӣ барои роҳбарият ва пешниҳодҳо оид ба равандҳо.", "Analytical reports for management and proposals on processes."],
    "Нужно": ["Лозим аст", "Requirements"],
    "Высшее образование: экономика, финансы или аудит.": ["Маълумоти олӣ: иқтисод, молия ё аудит.", "A degree in economics, finance or audit."],
    "От 1 года в риск-менеджменте, внутреннем контроле или экономическом анализе.": ["Аз 1 сол дар идораи хатар, назорати дохилӣ ё таҳлили иқтисодӣ.", "At least one year in risk management, internal control or economic analysis."],
    "Продвинутый Excel и знание 1С.": ["Excel-и пешрафта ва дониши 1С.", "Advanced Excel and knowledge of 1C."],
    "Условия": ["Шартҳо", "Conditions"],
    "Зарплата выше среднерыночной, KPI и премии.": ["Маош аз бозори миёна баландтар, KPI ва мукофот.", "Pay above the market, plus KPI and bonuses."],
    "Офис, социальный пакет, скидки на продукцию компании.": ["Идора, бастаи иҷтимоӣ, тахфиф ба маҳсулоти ширкат.", "An office, a benefits package and discounts on company products."],
    "Выплаты в срок. Наставничество и рост внутри компании.": ["Пардохт сари вақт. Роҳнамоӣ ва рушд дар дохили ширкат.", "Pay on time. Mentoring and growth inside the company."],
    "Продажи · февраль 2026": ["Фурӯш · феврали 2026", "Sales · February 2026"],
    "Мерчандайзер": ["Мерчандайзер", "Merchandiser"],
    "Следить, чтобы продукция «Чучаи Байзо» выглядела аккуратно на полках и была доступна покупателям.": ["Пайгирӣ кардан, ки маҳсулоти «Чучаи Байзо» дар рафҳо озода бошад ва ба харидорон дастрас монад.", "Keep Chuchai Bayzo products tidy on the shelves and available to shoppers."],
    "Выкладка по планограммам, ценники, POS-материалы и чистота оборудования.": ["Гузоштани мол аз рӯи планограмма, нархнома, маводи POS ва тозагии таҷҳизот.", "Shelf layout by planogram, price tags, POS materials and clean equipment."],
    "Остатки на полках и складах торговых точек, ежедневные отчёты.": ["Боқимонда дар рафҳо ва анборҳои нуқтаҳои савдо, гузоришҳои ҳаррӯза.", "Stock on shelves and in store warehouses, and daily reports."],
    "Визиты строго по утверждённому маршруту.": ["Ташрифҳо қатъӣ аз рӯи маршрути тасдиқшуда.", "Visits strictly on the approved route."],
    "Возраст 18–35 лет.": ["Синну сол 18–35.", "Age 18–35."],
    "Ответственность и вежливое общение с персоналом магазинов.": ["Масъулият ва муоширати боадабона бо кормандони мағоза.", "Responsibility and polite contact with shop staff."],
    "Опыт мерчандайзера или торгового представителя — преимущество. Без опыта рассматриваем: есть обучение.": ["Таҷрибаи мерчендайзер ё намояндаи савдо — бартарӣ аст. Бе таҷриба ҳам мебинем: омӯзиш ҳаст.", "Merchandiser or sales-rep experience is an advantage. We also consider people without experience: training is provided."],
    "Стабильная компания, зарплата в срок, скидки на продукцию, рост внутри компании.": ["Ширкати устувор, маош сари вақт, тахфиф ба маҳсулот, рушд дар дохили ширкат.", "A stable company, pay on time, product discounts and growth inside the company."],
    "IT · февраль 2026": ["IT · феврали 2026", "IT · February 2026"],
    "IT-специалист": ["Мутахассиси IT", "IT specialist"],
    "Техническая поддержка инфраструктуры компании и бесперебойная работа сервисов.": ["Дастгирии техникии инфрасохтори ширкат ва кори бетанаффуси хизматҳо.", "Technical support for the company’s infrastructure and uninterrupted services."],
    "Серверы Windows и Linux, сети и защита корпоративной информации.": ["Серверҳои Windows ва Linux, шабакаҳо ва ҳифзи маълумоти корпоративӣ.", "Windows and Linux servers, networks and protection of company information."],
    "Helpdesk, рабочие места и оргтехника.": ["Helpdesk, ҷойҳои корӣ ва техникаи идоравӣ.", "Helpdesk, workstations and office equipment."],
    "Резервное копирование и восстановление данных, обновление ПО.": ["Нусхаи эҳтиётӣ ва барқарорсозии маълумот, навсозии нармафзор.", "Backup and data recovery, and software updates."],
    "Опыт в IT от 1 года, понимание сетей и серверных ОС.": ["Таҷриба дар IT аз 1 сол, фаҳмиши шабакаҳо ва системаҳои амалиётии сервер.", "At least one year in IT, and an understanding of networks and server operating systems."],
    "SQL — преимущество.": ["SQL — бартарӣ аст.", "SQL is an advantage."],
    "Зарплата обсуждается на собеседовании.": ["Маош дар мусоҳиба муҳокима мешавад.", "Pay is discussed at the interview."],
    "Бесплатные горячие обеды на своей кухне, обучение за счёт компании.": ["Ноҳорпии гарми ройгон дар ошхонаи худ, омӯзиш аз ҳисоби ширкат.", "Free hot lunches in the company kitchen, and training paid by the company."],
    "Птицефабрика · январь 2026": ["Фабрикаи паранда · январи 2026", "Poultry farm · January 2026"],
    "Ветеринарный врач": ["Духтури байторӣ", "Veterinarian"],
    "Здоровье бройлерного поголовья и стандарты биобезопасности на производстве.": ["Саломатии саршумори бройлер ва стандартҳои бехатарии биологӣ дар истеҳсолот.", "Broiler flock health and biosecurity standards on the farm."],
    "Ежедневный осмотр поголовья, дозировки и контроль препаратов.": ["Муоинаи ҳаррӯзаи саршумор, миқдори дору ва назорати препаратҳо.", "Daily flock inspection, dosages and control of medicines."],
    "Диагностика, вакцинация, дезинфекция, дезинсекция и дератизация.": ["Ташхис, ваксина, безараргардонӣ, нест кардани ҳашарот ва хояндаҳо.", "Diagnosis, vaccination, disinfection, pest control and rodent control."],
    "Патологоанатомические вскрытия, заключения и профильная отчётность.": ["Кушодани паталогӣ, хулосаҳо ва ҳисоботи ихтисосӣ.", "Post-mortem examination, conclusions and specialist reports."],
    "Высшее образование по специальности «Ветеринария».": ["Маълумоти олӣ аз рӯи ихтисоси «Байторӣ».", "A degree in veterinary medicine."],
    "Опыт с бройлерами, ремонтным молодняком или родительским стадом.": ["Таҷриба бо бройлерҳо, ҷавонаҳои ивазкунанда ё галаи волидайн.", "Experience with broilers, replacement stock or a parent flock."],
    "Оклад и премия, уровень обсуждается индивидуально.": ["Маоши асосӣ ва мукофот, сатҳаш алоҳида муҳокима мешавад.", "Salary and a bonus, discussed individually."],
    "Бесплатное горячее питание. График 6/1, полный день.": ["Хӯроки гарми ройгон. Ҷадвал 6/1, рӯзи пурра.", "Free hot meals. Schedule 6/1, full day."],
    "Комбикормовый завод · январь 2026": ["Корхонаи хӯроки омехта · январи 2026", "Feed plant · January 2026"],
    "Технолог комбикормового завода": ["Технологи корхонаи хӯроки омехта", "Feed-plant technologist"],
    "Рецептуры, качество и процессы на заводе: от приёмки сырья до готовой продукции.": ["Рецептҳо, сифат ва равандҳо дар корхона: аз қабули ашё то маҳсулоти тайёр.", "Recipes, quality and processes at the plant: from raw-material intake to the finished product."],
    "Новые рецептуры и технологии, стандарты качества и документация.": ["Рецептҳо ва технологияҳои нав, стандартҳои сифат ва ҳуҷҷатҳо.", "New recipes and technologies, quality standards and documentation."],
    "Контроль качества на всех этапах и оптимизация производства.": ["Назорати сифат дар ҳамаи марҳилаҳо ва беҳтар кардани истеҳсолот.", "Quality control at every stage and more efficient production."],
    "Обучение персонала по производству и качеству.": ["Омӯзиши кормандон оид ба истеҳсолот ва сифат.", "Training staff in production and quality."],
    "Высшее образование в сфере пищевой промышленности.": ["Маълумоти олӣ дар соҳаи саноати хӯрокворӣ.", "A degree in food industry."],
    "Опыт на производстве, знание технологических процессов и систем контроля качества.": ["Таҷриба дар истеҳсолот, дониши равандҳои технологӣ ва системаҳои назорати сифат.", "Production experience, and knowledge of process technology and quality-control systems."],
    "Достойная зарплата, полный день, график 6/1.": ["Маоши арзанда, рӯзи пурра, ҷадвал 6/1.", "Fair pay, a full day, schedule 6/1."],
    "Горячий обед за счёт компании.": ["Ноҳорпии гарм аз ҳисоби ширкат.", "A hot lunch paid by the company."],
    "Производство · апрель 2024": ["Истеҳсолот · апрели 2024", "Production · April 2024"],
    "Помощник инженера": ["Ёрдамчии муҳандис", "Assistant engineer"],
    "Помощь в обслуживании техники, подготовка рабочего места и заполнение документации.": ["Ёрӣ дар хизматрасонии техника, омода кардани ҷойи кор ва пур кардани ҳуҷҷатҳо.", "Help with equipment maintenance, preparing the workplace and filling in documents."],
    "Высшее или среднее специальное инженерное образование.": ["Маълумоти олии муҳандисӣ ё миёнаи махсус.", "A higher or vocational engineering education."],
    "Опыт от 1 года, дальше обучение проводит наставник.": ["Таҷриба аз 1 сол, баъд роҳнамо меомӯзонад.", "At least one year of experience; after that a mentor provides training."],
    "Полный день, готовность к многозадачности.": ["Рӯзи пурра, омодагӣ ба чанд вазифа.", "Full day, and readiness for several tasks at once."],
    "105 сомони в день.": ["105 сомонӣ дар як рӯз.", "105 somoni a day."],
    "Пн–сб, 8:00–18:00. Обед за счёт компании.": ["Душанбе–шанбе, 8:00–18:00. Ноҳорӣ аз ҳисоби ширкат.", "Monday–Saturday, 8:00–18:00. Lunch paid by the company."],
    "Звонить в рабочее время с 8:00 до 17:00.": ["Занг дар вақти корӣ аз 8:00 то 17:00.", "Call during working hours, 8:00 to 17:00."],
    "Птицефабрика · апрель 2024": ["Фабрикаи паранда · апрели 2024", "Poultry farm · April 2024"],
    "Рабочий на птицефабрике": ["Коргар дар фабрикаи паранда", "Poultry-farm worker"],
    "Подсобный рабочий в цехе выращивания бройлеров. Опыт не требуется.": ["Коргари ёрирасон дар сехи парвариши бройлерҳо. Таҷриба лозим нест.", "A helper in the broiler house. No experience required."],
    "Подстилка в птичниках, промывка линий поения и кормления.": ["Зерхок дар парандахонаҳо, шустани хатҳои об ва хӯрок.", "Litter in the houses, and washing the drinking and feeding lines."],
    "Выбраковка и сортировка птицы, отлов и погрузка.": ["Ҷудо кардан ва ҷобаҷо кардани паранда, доштан ва бор кардан.", "Culling and sorting birds, catching and loading."],
    "Хозяйственные и подсобные работы.": ["Корҳои хоҷагӣ ва ёрирасон.", "Housekeeping and support work."],
    "Среднее образование, возраст 18–45 лет.": ["Маълумоти миёна, синну сол 18–45.", "Secondary education, age 18–45."],
    "Готовность к физическому труду и работе в коллективе.": ["Омодагӣ ба меҳнати ҷисмонӣ ва кор дар даста.", "Readiness for physical work and for working in a team."],
    "Б. Гафуров, джамоат Исфисор, ул. Чувашня 20/1.": ["Б. Ғафуров, ҷамоати Исфисор, кӯч. Чувашня 20/1.", "B. Gafurov, Isfisor jamoat, Chuvashnya St. 20/1."],
    "График 6/1, с 06:00 до 18:00. Зарплата два раза в месяц.": ["Ҷадвал 6/1, аз 06:00 то 18:00. Маош ду маротиба дар як моҳ.", "Schedule 6/1, from 06:00 to 18:00. Pay twice a month."],
    "Питание, спецодежда и обувь за счёт предприятия.": ["Хӯрок, либоси корӣ ва пойафзол аз ҳисоби корхона.", "Meals, work clothes and footwear paid by the company."],
    "Доставка · апрель 2024": ["Расонидан · апрели 2024", "Delivery · April 2024"],
    "Водитель-экспедитор": ["Ронанда-экспедитор", "Driver"],
    "Адресная доставка по городу Душанбе и области, документы и контроль состояния автомобиля.": ["Расонидани суроғавӣ дар шаҳри Душанбе ва атрофи он, ҳуҷҷатҳо ва назорати ҳолати мошин.", "Address delivery in Dushanbe and the surrounding region, paperwork and checking the vehicle."],
    "Возраст от 35 лет, категория B.": ["Синну сол аз 35, категорияи B.", "Age 35 or older, category B."],
    "Опыт на крупногабаритных автомобилях от 1 года.": ["Таҷриба бо мошинҳои калонҳаҷм аз 1 сол.", "At least one year driving large vehicles."],
    "Готовность участвовать в погрузке.": ["Омодагӣ ба боркунӣ.", "Willingness to help with loading."],
    "Зарплата два раза в месяц, график 6/1.": ["Маош ду маротиба дар як моҳ, ҷадвал 6/1.", "Pay twice a month, schedule 6/1."],
    "Без скрытых штрафов и депозитов. Бесплатная сотовая связь.": ["Бе ҷарима ва депозити пинҳонӣ. Алоқаи мобилӣ ройгон.", "No hidden fines or deposits. A free mobile line."],
    "Официальное трудоустройство по ТК РТ. Питание и жильё за счёт компании.": ["Корҳои расмӣ аз рӯи Кодекси меҳнати ҶТ. Хӯрок ва манзил аз ҳисоби ширкат.", "Official employment under the Labour Code of Tajikistan. Meals and housing paid by the company."],
    "Отклик": ["Дархост", "Apply"],
    "Пришлите резюме": ["Резюме фиристед", "Send your CV"],
    "Напишите на почту отдела кадров или позвоните. Если подходящей позиции нет в списке, резюме всё равно можно отправить.": ["Ба почтаи шуъбаи кадрҳо нависед ё занг занед. Агар вазифаи мувофиқ дар рӯйхат набошад, резюмеро ҳар ҳол фиристодан мумкин аст.", "Write to the HR email or call. If none of the roles fit, you can still send a CV."]
  };

  const titles = {
    "index.html": ["Bayzo — Маҳсулоти пок", "Bayzo — Clean product", "Bayzo — Чистый продукт"],
    "catalog.html": ["Каталог — Bayzo", "Catalog — Bayzo", "Каталог — Bayzo"],
    "about.html": ["Дар бораи мо — Bayzo", "About — Bayzo", "О нас — Bayzo"],
    "recipes.html": ["Рецептҳо — Bayzo", "Recipes — Bayzo", "Рецепты — Bayzo"],
    "contacts.html": ["Тамос — Bayzo", "Contacts — Bayzo", "Контакты — Bayzo"],
    "vacancies.html": ["Вакансияҳо — Bayzo", "Jobs — Bayzo", "Вакансии — Bayzo"]
  };

  const descriptions = {
    "index.html": [
      "ҶДММ «Чучаи Байзо» — гӯшти табиии бройлер аз ферма дар Тоҷикистон. Аз фермаи мо ба дастархони шумо.",
      "Chuchai Bayzo LLC — natural broiler meat from a farm in Tajikistan. From our farm to your table.",
      "ООО «Чучаи Байзо» — натуральное мясо бройлера с фермы в Таджикистане. С нашей фермы к вашему столу."
    ],
    "catalog.html": [
      "Каталоги Bayzo: гӯшти хунуккарда ва яхкардаи бройлер, қуттиҳои 10 кг, маҳсулоти иловагӣ ва нахӯд.",
      "Bayzo catalog: chilled and frozen broiler meat, 10 kg boxes, offal and chickpeas.",
      "Каталог Bayzo: охлаждённое и замороженное мясо бройлера, коробки 10 кг, субпродукты и нут."
    ],
    "about.html": [
      "ҶДММ «Чучаи Байзо» — корхонаи парандапарварии Тоҷикистон. Даври пӯшида, хӯроки худӣ, стандартҳои байналмилалӣ.",
      "Chuchai Bayzo LLC — a poultry company in Tajikistan. A closed cycle, our own feed, international standards.",
      "ООО «Чучаи Байзо» — птицеводческое предприятие Таджикистана. Замкнутый цикл, свой комбикорм, международные стандарты."
    ],
    "recipes.html": [
      "Рецептҳо бо маҳсулоти Bayzo: болча, филе, соқ, туша, рон ва маҳсулоти иловагӣ.",
      "Recipes with Bayzo products: wings, fillet, drumstick, whole bird, thighs and offal.",
      "Рецепты с продукцией Bayzo: крылышки, филе, голень, тушка, окорочка и субпродукты."
    ],
    "contacts.html": [
      "Тамоси Bayzo: телефон 88 11, info@bayzo.tj, Б. Ғафуров, ҷамоати Исфисор, кӯч. Чувашня 20/1.",
      "Bayzo contacts: phone 88 11, info@bayzo.tj, B. Gafurov, Isfisor jamoat, Chuvashnya St. 20/1.",
      "Контакты Bayzo: телефон 88 11, info@bayzo.tj, Б. Гафуров, джамоат Исфисор, ул. Чувашня 20/1."
    ],
    "vacancies.html": [
      "Вакансияҳои ҶДММ «Чучаи Байзо»: идора, истеҳсолот, фабрикаи паранда ва расонидан. Резюме ба hr@bayzo.tj.",
      "Jobs at Chuchai Bayzo LLC: office, production, poultry farm and delivery. CV to hr@bayzo.tj.",
      "Вакансии ООО «Чучаи Байзо»: офис, производство, птицефабрика и доставка. Резюме на hr@bayzo.tj."
    ]
  };

  const dict = { tg: {}, en: {} };
  Object.keys(pair).forEach((src) => {
    dict.tg[src] = pair[src][0];
    dict.en[src] = pair[src][1];
  });

  const originals = new WeakMap();

  function textNodes(root) {
    const nodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest("script, style")) return NodeFilter.FILTER_REJECT;
        if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function pageFile() {
    const file = (location.pathname.split("/").pop() || "index.html").split("?")[0];
    return file.endsWith(".html") ? file : "index.html";
  }

  function apply(lang) {
    const map = lang === "ru" ? null : dict[lang];
    textNodes(document.body).forEach((node) => {
      if (!originals.has(node)) originals.set(node, node.textContent);
      const original = originals.get(node);
      const trimmed = original.trim();
      const next = map && map[trimmed] ? map[trimmed] : trimmed;
      const lead = original.match(/^\s*/)[0];
      const tail = original.match(/\s*$/)[0];
      node.textContent = lead + next + tail;
    });
    document.querySelectorAll("[alt], [aria-label], [placeholder]").forEach((el) => {
      let bag = originals.get(el);
      if (!bag || typeof bag === "string") {
        bag = {};
        originals.set(el, bag);
      }
      ["alt", "aria-label", "placeholder"].forEach((attr) => {
        if (!el.hasAttribute(attr)) return;
        if (!(attr in bag)) bag[attr] = el.getAttribute(attr);
        const src = bag[attr];
        el.setAttribute(attr, map && map[src] ? map[src] : src);
      });
    });
    const page = pageFile();
    const pack = titles[page];
    if (pack) document.title = lang === "tg" ? pack[0] : lang === "en" ? pack[1] : pack[2];
    const meta = document.querySelector('meta[name="description"]');
    const about = descriptions[page];
    if (meta && about) meta.setAttribute("content", lang === "tg" ? about[0] : lang === "en" ? about[1] : about[2]);
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      const on = btn.dataset.lang === lang;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    try { localStorage.setItem(KEY, lang); } catch (err) { /* private mode */ }
  }

  function current() {
    const query = new URLSearchParams(location.search).get("lang");
    if (query === "ru" || query === "tg" || query === "en") return query;
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "ru" || saved === "tg" || saved === "en") return saved;
    } catch (err) { /* ignore */ }
    return "ru";
  }

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => apply(btn.dataset.lang));
  });
  apply(current());
})();
