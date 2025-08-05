interface Props {
  params: { lang: string };
}

export default function AboutPage({ params }: Props) {
  const { lang } = params;

  if (!["en", "vi"].includes(lang)) {
    return <div>Not Found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <a href={`/${lang}`} className="text-2xl font-bold text-gray-900">Meraki</a>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href={`/${lang}`} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  {lang === "en" ? "Home" : "Trang chủ"}
                </a>
                <a href={`/${lang}/about`} className="text-gray-900 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                  {lang === "en" ? "About" : "Giới thiệu"}
                </a>
                <a href={`/${lang}/journal`} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  {lang === "en" ? "Journal" : "Nhật ký"}
                </a>
                <a href={`/${lang}/testimonials`} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  {lang === "en" ? "Kind Words" : "Lời cảm ơn"}
                </a>
                <a href={`/${lang}/blog`} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  {lang === "en" ? "Blog" : "Blog"}
                </a>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <a href="/en/about" className={`px-2 py-1 text-sm rounded ${lang === "en" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}`}>
                EN
              </a>
              <a href="/vi/about" className={`px-2 py-1 text-sm rounded ${lang === "vi" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}`}>
                VI
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-light text-gray-900 mb-6">
            {lang === "en" ? "About Meraki" : "Về Meraki"}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {lang === "en" 
              ? "We believe every love story deserves to be celebrated with passion, creativity, and attention to detail. Meraki - a Greek word meaning to do something with soul, creativity, or love - perfectly captures our approach to wedding planning."
              : "Chúng tôi tin rằng mỗi câu chuyện tình yêu đều xứng đáng được tôn vinh với đam mê, sự sángtạo và sự chú ý đến từng chi tiết. Meraki - một từ tiếng Hy Lạp có nghĩa là làm điều gì đó với tâm hồn, sự sáng tạo hoặc tình yêu - thể hiện hoàn hảo cách tiếp cận của chúng tôi trong việc lên kế hoạch đám cưới."
            }
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-6">
                {lang === "en" ? "Our Story" : "Câu chuyện của chúng tôi"}
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  {lang === "en" 
                    ? "Founded in 2020, Meraki Wedding Planner began as a dream to create extraordinary wedding experiences that reflect each couple's unique love story. Our founder, passionate about bringing couples' visions to life, started with a simple belief: every wedding should be as unique as the love it celebrates."
                    : "Được thành lập vào năm 2020, Meraki Wedding Planner bắt đầu từ một giấc mơ tạo ra những trải nghiệm đám cưới đặc biệt phản ánh câu chuyện tình yêu độc đáo của mỗi cặp đôi. Người sáng lập của chúng tôi, với niềm đam mê mang tầm nhìn của các cặp đôi thành hiện thực, bắt đầu với một niềm tin đơn giản: mỗi đám cưới đều phải độc đáo như tình yêu mà nó tôn vinh."
                  }
                </p>
                <p>
                  {lang === "en" 
                    ? "Over the years, we've had the privilege of planning over 200 weddings across Vietnam, each one a testament to the power of love and the importance of celebrating it beautifully. From intimate gatherings to grand celebrations, we approach each event with the same level of dedication and creativity."
                    : "Trong những năm qua, chúng tôi có vinh dự được lên kế hoạch cho hơn 200 đám cưới trên khắp Việt Nam, mỗi đám cưới đều là minh chứng cho sức mạnh của tình yêu và tầm quan trọng của việc tôn vinh nó một cách đẹp đẽ. Từ những buổi tụ tập ấm cúng đến những lễ kỷ niệm hoành tráng, chúng tôi tiếp cận mỗi sự kiện với cùng mức độ tận tâm và sáng tạo."
                  }
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                {lang === "en" ? "Team Photo" : "Ảnh đội ngũ"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              {lang === "en" ? "Our Values" : "Giá trị của chúng tôi"}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {lang === "en" 
                ? "These core values guide everything we do, from our first consultation to your last dance"
                : "Những giá trị cốt lõi này hướng dẫn mọi thứ chúng tôi làm, từ cuộc tư vấn đầu tiên đến điệu nhảy cuối cùng của bạn"
              }
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">♥</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                {lang === "en" ? "Passion" : "Đam mê"}
              </h3>
              <p className="text-gray-600">
                {lang === "en" 
                  ? "We pour our hearts into every detail, treating each wedding as if it were our own"
                  : "Chúng tôi dành trái tim cho từng chi tiết, đối xử với mỗi đám cưới như thể đó là của chính chúng tôi"
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                {lang === "en" ? "Creativity" : "Sáng tạo"}
              </h3>
              <p className="text-gray-600">
                {lang === "en" 
                  ? "Every couple is unique, and so should be their wedding. We bring fresh ideas to life"
                  : "Mỗi cặp đôi đều độc đáo và đám cưới của họ cũng vậy. Chúng tôi biến những ý tưởng tươi mới thành hiện thực"
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                {lang === "en" ? "Excellence" : "Xuất sắc"}
              </h3>
              <p className="text-gray-600">
                {lang === "en" 
                  ? "We maintain the highest standards in every aspect of our service and execution"
                  : "Chúng tôi duy trì các tiêu chuẩn cao nhất trong mọi khía cạnh của dịch vụ và thực hiện"
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            {lang === "en" ? "Ready to Start Planning?" : "Sẵn sàng bắt đầu lên kế hoạch?"}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {lang === "en" 
              ? "Let's create something beautiful together. Get in touch to schedule your consultation."
              : "Hãy cùng tạo ra điều gì đó đẹp đẽ. Liên hệ để lên lịch tư vấn."
            }
          </p>
          <div className="space-x-4">
            <a 
              href={`mailto:hello@meraki-wedding.com`}
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              {lang === "en" ? "Get In Touch" : "Liên hệ"}
            </a>
            <a 
              href={`/${lang}/journal`}
              className="inline-block border border-gray-900 text-gray-900 px-8 py-3 rounded-md hover:bg-gray-900 hover:text-white transition-colors"
            >
              {lang === "en" ? "View Our Work" : "Xem tác phẩm"}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Meraki</h3>
              <p className="text-gray-400">
                {lang === "en" 
                  ? "Creating beautiful weddings with love and passion"
                  : "Tạo nên những đám cưới đẹp với tình yêu và đam mê"
                }
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">
                {lang === "en" ? "Services" : "Dịch vụ"}
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li>{lang === "en" ? "Wedding Planning" : "Tổ chức tiệc cưới"}</li>
                <li>{lang === "en" ? "Event Coordination" : "Điều phối sự kiện"}</li>
                <li>{lang === "en" ? "Venue Selection" : "Chọn địa điểm"}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">
                {lang === "en" ? "Quick Links" : "Liên kết nhanh"}
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href={`/${lang}/about`} className="hover:text-white">{lang === "en" ? "About" : "Giới thiệu"}</a></li>
                <li><a href={`/${lang}/journal`} className="hover:text-white">{lang === "en" ? "Portfolio" : "Danh mục"}</a></li>
                <li><a href={`/${lang}/testimonials`} className="hover:text-white">{lang === "en" ? "Testimonials" : "Lời cảm ơn"}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">
                {lang === "en" ? "Contact" : "Liên hệ"}
              </h4>
              <p className="text-gray-400 text-sm">
                Email: hello@meraki-wedding.com<br/>
                Phone: +84 123 456 789
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Meraki Wedding Planner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
