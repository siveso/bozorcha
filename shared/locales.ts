// Supported languages
export type Language = 'uz' | 'ru';

// Language labels
export const LANGUAGE_LABELS: Record<Language, string> = {
  uz: "O'zbek",
  ru: "Русский"
};

// Translation keys and values
export interface Translations {
  // Header
  search_placeholder: string;
  categories: string;
  electronics: string;
  clothing: string;
  appliances: string;
  books: string;
  sports: string;
  beauty: string;
  
  // Navigation
  home: string;
  products: string;
  blog: string;
  about: string;
  cart: string;
  wishlist: string;
  
  // Product
  add_to_cart: string;
  add_to_wishlist: string;
  buy_now: string;
  price: string;
  description: string;
  category: string;
  
  // Cart
  your_cart: string;
  empty_cart: string;
  start_shopping: string;
  clear_cart: string;
  order_summary: string;
  product_count: string;
  total_amount: string;
  delivery: string;
  free: string;
  final_total: string;
  place_order: string;
  continue_shopping: string;
  
  // Order form
  order_form: string;
  full_name: string;
  phone_number: string;
  email: string;
  address: string;
  additional_notes: string;
  cancel: string;
  confirm: string;
  submitting: string;
  
  // Messages
  order_success: string;
  order_error: string;
  added_to_cart: string;
  added_to_wishlist: string;
  
  // SEO
  homepage_title: string;
  homepage_description: string;
  cart_title: string;
  cart_description: string;
  
  // Blog
  blog_title: string;
  latest_posts: string;
  read_more: string;
  
  // Footer
  company_info: string;
  quick_links: string;
  contact_info: string;
  follow_us: string;
  
  // Admin Panel
  admin_panel: string;
  dashboard: string;
  products_management: string;
  categories_management: string;
  orders_management: string;
  blog_management: string;
  trends_analysis: string;
  seo_tools: string;
  logout: string;
  add_new: string;
  edit: string;
  delete: string;
  save: string;
  
  // Product Management
  product_name: string;
  product_description: string;
  product_price: string;
  product_category: string;
  product_images: string;
  youtube_video: string;
  stock_quantity: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  rating: string;
  review_count: string;
  active: string;
  inactive: string;
  
  // Categories
  category_name: string;
  category_slug: string;
  category_description: string;
  
  // Orders
  order_number: string;
  customer_name: string;
  order_status: string;
  order_total: string;
  order_date: string;
  pending: string;
  processing: string;
  shipped: string;
  delivered: string;
  cancelled: string;
  
  // Blog
  post_title: string;
  post_content: string;
  post_excerpt: string;
  post_tags: string;
  publish_date: string;
  post_status: string;
  draft: string;
  published: string;
  
  // Trends
  trend_keyword: string;
  search_volume: string;
  competition: string;
  trend_score: string;
  last_updated: string;
  generate_content: string;
  
  // SEO
  seo_analysis: string;
  seo_score: string;
  page_title: string;
  page_description: string;
  analyze_page: string;
}

// Uzbek translations
export const UZ_TRANSLATIONS: Translations = {
  // Header
  search_placeholder: "Mahsulotlarni qidiring...",
  categories: "Barcha kategoriyalar",
  electronics: "Elektronika",
  clothing: "Kiyim",
  appliances: "Uy jihozlari",
  books: "Kitoblar",
  sports: "Sport",
  beauty: "Go'zallik",
  
  // Navigation
  home: "Bosh sahifa",
  products: "Mahsulotlar",
  blog: "Blog",
  about: "Aloqa",
  cart: "Savat",
  wishlist: "Sevimlilar",
  
  // Product
  add_to_cart: "Savatga qo'shish",
  add_to_wishlist: "Sevimlilar ro'yxatiga qo'shish",
  buy_now: "Hoziroq sotib olish",
  price: "Narx",
  description: "Tavsif",
  category: "Kategoriya",
  
  // Cart
  your_cart: "Sizning savatingiz",
  empty_cart: "Savatingiz bo'sh",
  start_shopping: "Xaridni boshlash",
  clear_cart: "Savatni tozalash",
  order_summary: "Buyurtma xulasasi",
  product_count: "Mahsulotlar soni:",
  total_amount: "Jami summa:",
  delivery: "Yetkazish:",
  free: "Bepul",
  final_total: "Umumiy summa:",
  place_order: "Buyurtma berish",
  continue_shopping: "Xaridni davom etish",
  
  // Order form
  order_form: "Buyurtma berish",
  full_name: "To'liq ism",
  phone_number: "Telefon raqam",
  email: "Email",
  address: "Manzil",
  additional_notes: "Qo'shimcha izoh",
  cancel: "Bekor qilish",
  confirm: "Tasdiqlash",
  submitting: "Yuborilmoqda...",
  
  // Messages
  order_success: "Buyurtma muvaffaqiyatli qabul qilindi!",
  order_error: "Buyurtmani yuborishda xatolik. Qaytadan urinib ko'ring.",
  added_to_cart: "Mahsulot savatga qo'shildi",
  added_to_wishlist: "Mahsulot sevimlilarga qo'shildi",
  
  // SEO
  homepage_title: "Bozorcha - O'zbekistonning Eng Yaxshi Onlayn Do'koni",
  homepage_description: "Bozorcha orqali eng sifatli mahsulotlarni arzon narxlarda xarid qiling. Elektronika, kiyim-kechak, uy jihozlari va boshqa ko'p narsalar.",
  cart_title: "Savat - Bozorcha",
  cart_description: "Sizning xaridlar savatingiz",
  
  // Blog
  blog_title: "Blog",
  latest_posts: "So'nggi maqolalar",
  read_more: "Batafsil",
  
  // Footer
  company_info: "Kompaniya haqida",
  quick_links: "Tezkor havolalar",
  contact_info: "Bog'lanish",
  follow_us: "Ijtimoiy tarmoqlar",
  
  // Admin Panel
  admin_panel: "Bozorcha Admin Panel",
  dashboard: "Boshqaruv paneli",
  products_management: "Mahsulotlar",
  categories_management: "Kategoriyalar",
  orders_management: "Buyurtmalar",
  blog_management: "Blog",
  trends_analysis: "Tendensiyalar",
  seo_tools: "SEO",
  logout: "Chiqish",
  add_new: "Yangi mahsulot",
  edit: "Tahrirlash",
  delete: "O'chirish",
  save: "Saqlash",
  
  // Product Management
  product_name: "Mahsulot nomi",
  product_description: "Tavsif",
  product_price: "Narx",
  product_category: "Kategoriya",
  product_images: "Rasmlar",
  youtube_video: "YouTube video",
  stock_quantity: "Miqdor",
  meta_title: "Meta sarlavha",
  meta_description: "Meta tavsif",
  keywords: "Kalit so'zlar",
  rating: "Reyting",
  review_count: "Rasmlar",
  active: "Faol",
  inactive: "Nofaol",
  
  // Categories
  category_name: "Kategoriya nomi",
  category_slug: "Slug",
  category_description: "Tavsif",
  
  // Orders
  order_number: "Buyurtma raqami",
  customer_name: "Mijoz ismi",
  order_status: "Holat",
  order_total: "Jami summa",
  order_date: "Sana",
  pending: "Kutilmoqda",
  processing: "Jarayonda",
  shipped: "Yuborilgan",
  delivered: "Yetkazilgan",
  cancelled: "Bekor qilingan",
  
  // Blog
  post_title: "Maqola sarlavhasi",
  post_content: "Mazmun",
  post_excerpt: "Qisqacha",
  post_tags: "Teglar",
  publish_date: "Nashr sanasi",
  post_status: "Holat",
  draft: "Qoralama",
  published: "Nashr qilingan",
  
  // Trends
  trend_keyword: "Kalit so'z",
  search_volume: "Qidiruv hajmi",
  competition: "Raqobat",
  trend_score: "Trend ball",
  last_updated: "Oxirgi yangilanish",
  generate_content: "Kontent yaratish",
  
  // SEO
  seo_analysis: "SEO tahlil",
  seo_score: "SEO ball",
  page_title: "Sahifa sarlavhasi",
  page_description: "Sahifa tavsifi",
  analyze_page: "Sahifani tahlil qilish",
};

// Russian translations
export const RU_TRANSLATIONS: Translations = {
  // Header
  search_placeholder: "Поиск товаров...",
  categories: "Все категории",
  electronics: "Электроника",
  clothing: "Одежда",
  appliances: "Бытовая техника",
  books: "Книги",
  sports: "Спорт",
  beauty: "Красота",
  
  // Navigation
  home: "Главная",
  products: "Товары",
  blog: "Блог",
  about: "Контакты",
  cart: "Корзина",
  wishlist: "Избранное",
  
  // Product
  add_to_cart: "В корзину",
  add_to_wishlist: "В избранное",
  buy_now: "Купить сейчас",
  price: "Цена",
  description: "Описание",
  category: "Категория",
  
  // Cart
  your_cart: "Ваша корзина",
  empty_cart: "Корзина пуста",
  start_shopping: "Начать покупки",
  clear_cart: "Очистить корзину",
  order_summary: "Итого",
  product_count: "Количество товаров:",
  total_amount: "Общая сумма:",
  delivery: "Доставка:",
  free: "Бесплатно",
  final_total: "Итого к оплате:",
  place_order: "Оформить заказ",
  continue_shopping: "Продолжить покупки",
  
  // Order form
  order_form: "Оформление заказа",
  full_name: "Полное имя",
  phone_number: "Номер телефона",
  email: "Email",
  address: "Адрес",
  additional_notes: "Дополнительные заметки",
  cancel: "Отмена",
  confirm: "Подтвердить",
  submitting: "Отправка...",
  
  // Messages
  order_success: "Заказ успешно принят!",
  order_error: "Ошибка при отправке заказа. Попробуйте еще раз.",
  added_to_cart: "Товар добавлен в корзину",
  added_to_wishlist: "Товар добавлен в избранное",
  
  // SEO
  homepage_title: "Bozorcha - Лучший Интернет-Магазин Узбекистана",
  homepage_description: "Покупайте качественные товары по доступным ценам через Bozorcha. Электроника, одежда, бытовая техника и многое другое.",
  cart_title: "Корзина - Bozorcha",
  cart_description: "Ваша корзина покупок",
  
  // Blog
  blog_title: "Блог",
  latest_posts: "Последние статьи",
  read_more: "Подробнее",
  
  // Footer
  company_info: "О компании",
  quick_links: "Быстрые ссылки",
  contact_info: "Контакты",
  follow_us: "Социальные сети",
  
  // Admin Panel
  admin_panel: "Bozorcha Админ Панель",
  dashboard: "Панель управления",
  products_management: "Товары",
  categories_management: "Категории",
  orders_management: "Заказы",
  blog_management: "Блог",
  trends_analysis: "Тенденции",
  seo_tools: "SEO",
  logout: "Выход",
  add_new: "Новый товар",
  edit: "Редактировать",
  delete: "Удалить",
  save: "Сохранить",
  
  // Product Management
  product_name: "Название товара",
  product_description: "Описание",
  product_price: "Цена",
  product_category: "Категория",
  product_images: "Изображения",
  youtube_video: "YouTube видео",
  stock_quantity: "Количество",
  meta_title: "Мета заголовок",
  meta_description: "Мета описание",
  keywords: "Ключевые слова",
  rating: "Рейтинг",
  review_count: "Отзывы",
  active: "Активный",
  inactive: "Неактивный",
  
  // Categories
  category_name: "Название категории",
  category_slug: "Слаг",
  category_description: "Описание",
  
  // Orders
  order_number: "Номер заказа",
  customer_name: "Имя клиента",
  order_status: "Статус",
  order_total: "Общая сумма",
  order_date: "Дата",
  pending: "Ожидание",
  processing: "В обработке",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменен",
  
  // Blog
  post_title: "Заголовок статьи",
  post_content: "Содержание",
  post_excerpt: "Краткое описание",
  post_tags: "Теги",
  publish_date: "Дата публикации",
  post_status: "Статус",
  draft: "Черновик",
  published: "Опубликовано",
  
  // Trends
  trend_keyword: "Ключевое слово",
  search_volume: "Объем поиска",
  competition: "Конкуренция",
  trend_score: "Баллы тренда",
  last_updated: "Последнее обновление",
  generate_content: "Создать контент",
  
  // SEO
  seo_analysis: "SEO анализ",
  seo_score: "SEO баллы",
  page_title: "Заголовок страницы",
  page_description: "Описание страницы",
  analyze_page: "Анализировать страницу",
};

// Combined translations
export const TRANSLATIONS: Record<Language, Translations> = {
  uz: UZ_TRANSLATIONS,
  ru: RU_TRANSLATIONS,
};

// Get translation
export function getTranslation(key: keyof Translations, language: Language = 'uz'): string {
  return TRANSLATIONS[language][key] || TRANSLATIONS.uz[key];
}

// Get all translations for a language
export function getTranslations(language: Language = 'uz'): Translations {
  return TRANSLATIONS[language];
}