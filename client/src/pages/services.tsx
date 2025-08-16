import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Truck, CreditCard, Shield, Clock, Users, Headphones, Award } from "lucide-react";
import { SeoHead } from "@/components/seo/SeoHead";

export default function Services() {
  const services = [
    {
      icon: <ShoppingCart className="h-8 w-8 text-blue-600" />,
      title: "Online Shopping",
      title_ru: "Онлайн Покупки",
      description: "Mahsulotlarni qulay va tez sotib olish imkoniyati",
      description_ru: "Удобные и быстрые покупки товаров",
      features: ["24/7 xizmat", "Keng assortiment", "Qulay narxlar", "Sifatli mahsulotlar"]
    },
    {
      icon: <Truck className="h-8 w-8 text-green-600" />,
      title: "Tez Yetkazib Berish",
      title_ru: "Быстрая Доставка",
      description: "Butun O'zbekiston bo'ylab tez va ishonchli yetkazib berish",
      description_ru: "Быстрая и надёжная доставка по всему Узбекистану",
      features: ["Ertalabgi buyurtma - kechqurun yetkazib berish", "Bepul yetkazib berish 200,000 so'mdan yuqori", "Real-time tracking", "Professional kuryer xizmati"]
    },
    {
      icon: <CreditCard className="h-8 w-8 text-purple-600" />,
      title: "Ko'p Turdagi To'lov",
      title_ru: "Различные Способы Оплаты",
      description: "Qulay to'lov usullari - naqd, bank kartasi, online to'lov",
      description_ru: "Удобные способы оплаты - наличные, карта, онлайн платежи",
      features: ["Visa, MasterCard qabul qilinadi", "Click, Payme orqali to'lov", "Naqd to'lov yetkazib berishda", "Bo'lib to'lash imkoniyati"]
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Kafolat va Sifat",
      title_ru: "Гарантия и Качество",
      description: "Barcha mahsulotlar uchun rasmiy kafolat va sifat nazorati",
      description_ru: "Официальная гарантия и контроль качества всех товаров",
      features: ["1 yilgacha kafolat", "Sifat sertifikatlari", "30 kun ichida almashish", "Tekshirilgan mahsulotlar"]
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      title: "24/7 Onlayn Xizmat",
      title_ru: "24/7 Онлайн Сервис",
      description: "Har doim ochiq onlayn do'kon va mijozlar xizmati",
      description_ru: "Круглосуточный интернет-магазин и служба поддержки",
      features: ["24 soat ochiq", "Chat yordami", "Telefon qo'llab-quvvatlashi", "Email konsultatsiya"]
    },
    {
      icon: <Users className="h-8 w-8 text-teal-600" />,
      title: "VIP Mijozlar Dasturi",
      title_ru: "VIP Программа Клиентов",
      description: "Sodiq mijozlar uchun maxsus chegirmalar va imtiyozlar",
      description_ru: "Специальные скидки и привилегии для постоянных клиентов",
      features: ["VIP status", "Qo'shimcha chegirmalar", "Birinchi yangiliklar", "Birthday bonuslari"]
    }
  ];

  const stats = [
    { number: "50,000+", label: "Baxtli mijozlar", label_ru: "Довольных клиентов" },
    { number: "1000+", label: "Mahsulot turlari", label_ru: "Видов товаров" },
    { number: "99%", label: "Mijoz mamnuniyati", label_ru: "Удовлетворённость клиентов" },
    { number: "24/7", label: "Qo'llab-quvvatlash", label_ru: "Поддержка клиентов" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <SeoHead metadata={{ 
        title: "Xizmatlarimiz - Bozorcha | Professional E-commerce Solutions",
        description: "Bozorcha da bizning keng xizmatlar doirasi: tez yetkazib berish, ko'p turdagi to'lov, 24/7 qo'llab-quvvatlash va mijozlar dasturi. Professional e-commerce yechimlar.",
        keywords: ["xizmatlar", "yetkazib berish", "to'lov", "qo'llab-quvvatlash", "VIP dastur", "mijozlar xizmati"]
      }} />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Bizning <span className="text-blue-600">Xizmatlarimiz</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Bozorcha da mijozlarimizga eng yaxshi xizmat ko'rsatish uchun professional yechimlar taklif etamiz
          </p>
          <Badge variant="secondary" className="text-lg px-6 py-2">
            <Award className="h-5 w-5 mr-2" />
            #1 E-commerce Platform in Uzbekistan
          </Badge>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Bizning xizmatlarimizdan foydalanishga tayyormisiz?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Bugundan boshlab Bozorcha ning professional xizmatlaridan foydalaning va eng yaxshi shopping tajribasini yaşating
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Xarid qilishni boshlash
            </Button>
            <Button size="lg" variant="outline">
              <Headphones className="h-5 w-5 mr-2" />
              Qo'llab-quvvatlash bilan bog'lanish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}