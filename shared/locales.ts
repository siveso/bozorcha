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