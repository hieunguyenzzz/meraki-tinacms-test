import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { Metadata } from 'next';

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = params;
  
  return {
    title: lang === 'en' ? "Let's Connect - Meraki Wedding Planner" : 'Liên hệ - Meraki Wedding Planner',
    description: lang === 'en' 
      ? 'Get in touch with Meraki Wedding Planner to start planning your dream wedding'
      : 'Liên hệ với Meraki Wedding Planner để bắt đầu lên kế hoạch cho đám cưới trong mơ của bạn',
  };
}

export default function LetsConnectPage({ params }: Props) {
  const { lang } = params;

  if (!['en', 'vi'].includes(lang)) {
    return <div>Not Found</div>;
  }

  return (
    <div className="min-h-screen bg-background-1">
      <Header lang={lang} />

      {/* Hero Section */}
      <section className="py-20  ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            {lang === 'en' ? "Let's Connect" : 'Liên hệ với chúng tôi'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {lang === 'en' 
              ? "Ready to start planning your dream wedding? We'd love to hear from you and learn about your vision."
              : 'Sẵn sàng bắt đầu lên kế hoạch cho đám cưới trong mơ? Chúng tôi rất muốn nghe từ bạn và tìm hiểu về tầm nhìn của bạn.'
            }
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-6">
                {lang === 'en' ? 'Send us a message' : 'Gửi tin nhắn cho chúng tôi'}
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      {lang === 'en' ? 'First Name' : 'Tên'}
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      {lang === 'en' ? 'Last Name' : 'Họ'}
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {lang === 'en' ? 'Email Address' : 'Địa chỉ Email'}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    {lang === 'en' ? 'Phone Number' : 'Số điện thoại'}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="weddingDate" className="block text-sm font-medium text-gray-700 mb-2">
                    {lang === 'en' ? 'Wedding Date' : 'Ngày cưới'}
                  </label>
                  <input
                    type="date"
                    id="weddingDate"
                    name="weddingDate"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                    {lang === 'en' ? 'Estimated Budget' : 'Ngân sách dự kiến'}
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value="">{lang === 'en' ? 'Select a range' : 'Chọn mức'}</option>
                    <option value="under-50m">{lang === 'en' ? 'Under 50M VND' : 'Dưới 50 triệu VND'}</option>
                    <option value="50m-100m">{lang === 'en' ? '50M - 100M VND' : '50 - 100 triệu VND'}</option>
                    <option value="100m-200m">{lang === 'en' ? '100M - 200M VND' : '100 - 200 triệu VND'}</option>
                    <option value="200m-plus">{lang === 'en' ? '200M+ VND' : 'Trên 200 triệu VND'}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {lang === 'en' ? 'Tell us about your dream wedding' : 'Kể cho chúng tôi về đám cưới trong mơ của bạn'}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder={lang === 'en' 
                      ? 'Share your vision, style preferences, guest count, or any specific ideas you have in mind...'
                      : 'Chia sẻ tầm nhìn, sở thích phong cách, số lượng khách hoặc bất kỳ ý tưởng cụ thể nào bạn có...'
                    }
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors font-medium"
                >
                  {lang === 'en' ? 'Send Message' : 'Gửi tin nhắn'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-6">
                {lang === 'en' ? 'Get in touch' : 'Thông tin liên hệ'}
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {lang === 'en' ? 'Email Us' : 'Email'}
                  </h3>
                  <p className="text-gray-600">hello@meraki-wedding.com</p>
                  <p className="text-gray-600">info@meraki-wedding.com</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {lang === 'en' ? 'Call Us' : 'Điện thoại'}
                  </h3>
                  <p className="text-gray-600">+84 123 456 789</p>
                  <p className="text-gray-600">+84 987 654 321</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {lang === 'en' ? 'Office Hours' : 'Giờ làm việc'}
                  </h3>
                  <p className="text-gray-600">
                    {lang === 'en' ? 'Monday - Friday: 9:00 AM - 6:00 PM' : 'Thứ 2 - Thứ 6: 9:00 - 18:00'}
                  </p>
                  <p className="text-gray-600">
                    {lang === 'en' ? 'Saturday: 10:00 AM - 4:00 PM' : 'Thứ 7: 10:00 - 16:00'}
                  </p>
                  <p className="text-gray-600">
                    {lang === 'en' ? 'Sunday: By appointment only' : 'Chủ nhật: Chỉ theo lịch hẹn'}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {lang === 'en' ? 'Location' : 'Địa điểm'}
                  </h3>
                  <p className="text-gray-600">
                    {lang === 'en' 
                      ? 'Ho Chi Minh City, Vietnam'
                      : 'Thành phố Hồ Chí Minh, Việt Nam'
                    }
                  </p>
                  <p className="text-gray-600">
                    {lang === 'en' 
                      ? 'We serve couples throughout Vietnam'
                      : 'Chúng tôi phục vụ các cặp đôi trên toàn Việt Nam'
                    }
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">
                    {lang === 'en' ? 'Follow Us' : 'Theo dõi chúng tôi'}
                  </h3>
                  <div className="flex space-x-4">
                    <a href={`/${lang}/social-media`} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <span className="sr-only">Instagram</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348z"/>
                      </svg>
                    </a>
                    <a href={`/${lang}/social-media`} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <span className="sr-only">Facebook</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
