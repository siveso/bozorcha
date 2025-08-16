import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  comment: string;
  avatar?: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Aziza Karimova",
    role: "Tadbirkor",
    company: "Tashkent",
    rating: 5,
    comment: "Bozorcha dan xarid qilish juda qulay! Mahsulotlar sifatli va yetkazib berish tez. Hamma narsadan mamnunman.",
    verified: true
  },
  {
    id: "2",
    name: "Sardor Alimov", 
    role: "IT mutaxassis",
    company: "Samarkand",
    rating: 5,
    comment: "MacBook sotib oldim va juda mamnunman. Original mahsulot, kafolat bor va narxi boshqa do'konlardan arzon edi.",
    verified: true
  },
  {
    id: "3",
    name: "Dilafruz Nazarova",
    role: "O'qituvchi",
    company: "Bukhara",
    rating: 5,
    comment: "Samsung Galaxy telefon buyurtma qildim. 2 kunda yetib keldi va hamma narsa o'z vaqtida bo'ldi. Rahmat!",
    verified: true
  },
  {
    id: "4",
    name: "Bobur Umarov",
    role: "Biznes egasi",
    company: "Namangan",
    rating: 5,
    comment: "Ofisim uchun bir nechta texnika sotib oldim. Xizmat a'lo darajada, chegirmalar ham bor edi. Tavsiya qilaman!",
    verified: true
  },
  {
    id: "5",
    name: "Nilufar Abdullayeva",
    role: "Designer",
    company: "Fergana",
    rating: 5,
    comment: "Blog maqolalari juda foydali! Shopping bo'yicha maslahatlar va eng so'nggi mahsulotlar haqida bilib olaman.",
    verified: true
  },
  {
    id: "6",
    name: "Jamshid Rahimov",
    role: "Student",
    company: "Andijan",
    rating: 4,
    comment: "Narxlar yaxshi va mahsulotlar ham sifatli. Faqat ba'zan yetkazib berish bir oz kechikadi, lekin umuman yaxshi.",
    verified: true
  }
];

export function Testimonials() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900" data-testid="section-testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="heading-testimonials">
            Mijozlarimiz Fikrlari
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-testid="text-testimonials-description">
            Bizning mijozlarimiz Bozorcha xizmatlari haqida nima deyishadi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300" data-testid={`card-testimonial-${testimonial.id}`}>
              <CardContent className="p-6">
                <div className="absolute top-4 right-4 text-blue-100 dark:text-blue-900/20">
                  <Quote className="h-8 w-8" />
                </div>
                
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4" data-testid={`avatar-${testimonial.id}`}>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white" data-testid={`name-${testimonial.id}`}>
                        {testimonial.name}
                      </h4>
                      {testimonial.verified && (
                        <Badge variant="secondary" className="text-xs" data-testid={`badge-verified-${testimonial.id}`}>
                          Tasdiqlangan
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400" data-testid={`role-${testimonial.id}`}>
                      {testimonial.role} • {testimonial.company}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-3" data-testid={`rating-${testimonial.id}`}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {testimonial.rating}/5
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed" data-testid={`comment-${testimonial.id}`}>
                  "{testimonial.comment}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-md">
            <div className="flex -space-x-2">
              {testimonials.slice(0, 5).map((testimonial, index) => (
                <Avatar key={testimonial.id} className="h-8 w-8 border-2 border-white dark:border-gray-800">
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              50,000+ baxtli mijozlar
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}