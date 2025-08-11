import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { Metadata } from 'next';

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = params;
  
  return {
    title: lang === 'en' ? 'Social Media - Meraki Wedding Planner' : 'Mạng xã hội - Meraki Wedding Planner',
    description: lang === 'en' 
      ? 'Follow Meraki Wedding Planner on social media for wedding inspiration and behind-the-scenes content'
      : 'Theo dõi Meraki Wedding Planner trên mạng xã hội để có cảm hứng cưới và nội dung hậu trường',
  };
}

export default function SocialMediaPage({ params }: Props) {
  const { lang } = params;

  if (!['en', 'vi'].includes(lang)) {
    return <div>Not Found</div>;
  }

  const socialPlatforms = [
    {
      name: 'Instagram',
      handle: '@meraki.wedding',
      description: {
        en: 'Follow us for daily wedding inspiration, behind-the-scenes moments, and beautiful real weddings.',
        vi: 'Theo dõi chúng tôi để có cảm hứng cưới hàng ngày, những khoảnh khắc hậu trường và những đám cưới thực tế đẹp.'
      },
      url: 'https://instagram.com/meraki.wedding',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      handle: 'Meraki Wedding Planner',
      description: {
        en: 'Connect with our community, see client testimonials, and get updates on our latest work.',
        vi: 'Kết nối với cộng đồng của chúng tôi, xem lời chứng thực của khách hàng và nhận thông tin cập nhật về công việc mới nhất.'
      },
      url: 'https://facebook.com/meraki.wedding',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'Pinterest',
      handle: 'Meraki Wedding Ideas',
      description: {
        en: 'Discover wedding inspiration boards, styling ideas, and curated collections for your special day.',
        vi: 'Khám phá bảng cảm hứng cưới, ý tưởng tạo kiểu và bộ sưu tập được tuyển chọn cho ngày đặc biệt của bạn.'
      },
      url: 'https://pinterest.com/merakiwedding',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C23.975 5.367 18.608.001 12.017.001zM12 6.457c1.537 0 2.344.672 2.344 1.537 0 .865-.681 1.248-1.344 1.248-.864 0-1.344-.576-1.344-1.248 0-.864.48-1.537 1.344-1.537zm0 8.64c-2.976 0-5.376-2.4-5.376-5.376s2.4-5.376 5.376-5.376 5.376 2.4 5.376 5.376-2.4 5.376-5.376 5.376z"/>
        </svg>
      )
    },
    {
      name: 'TikTok',
      handle: '@meraki_wedding',
      description: {
        en: 'Watch quick wedding tips, behind-the-scenes videos, and trending bridal content.',
        vi: 'Xem các mẹo cưới nhanh, video hậu trường và nội dung cô dâu thịnh hành.'
      },
      url: 'https://tiktok.com/@meraki_wedding',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header lang={lang} />

      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            {lang === 'en' ? 'Follow Our Journey' : 'Theo dõi hành trình của chúng tôi'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {lang === 'en' 
              ? 'Stay connected with us on social media for daily inspiration, behind-the-scenes moments, and the latest from our beautiful weddings.'
              : 'Kết nối với chúng tôi trên mạng xã hội để có cảm hứng hàng ngày, những khoảnh khắc hậu trường và những điều mới nhất từ những đám cưới đẹp của chúng tôi.'
            }
          </p>
        </div>
      </section>

      {/* Social Media Platforms */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {socialPlatforms.map((platform, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="text-gray-700 mr-4">
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">{platform.name}</h3>
                    <p className="text-gray-600">{platform.handle}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  {lang === 'en' ? platform.description.en : platform.description.vi}
                </p>
                <a 
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-gray-900 hover:text-gray-600 font-medium transition-colors"
                >
                  {lang === 'en' ? 'Follow Us' : 'Theo dõi'}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed Placeholder */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              {lang === 'en' ? 'Latest from Instagram' : 'Mới nhất từ Instagram'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {lang === 'en' 
                ? 'Get a glimpse of our recent work and daily inspiration'
                : 'Xem qua công việc gần đây và cảm hứng hàng ngày của chúng tôi'
              }
            </p>
          </div>
          
          {/* Instagram Grid Placeholder */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <a 
              href="https://instagram.com/meraki.wedding"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              {lang === 'en' ? 'View More on Instagram' : 'Xem thêm trên Instagram'}
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            {lang === 'en' ? 'Stay in the Loop' : 'Luôn cập nhật thông tin'}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {lang === 'en' 
              ? 'Subscribe to our newsletter for exclusive wedding tips and special offers.'
              : 'Đăng ký nhận bản tin để có những mẹo cưới độc quyền và ưu đãi đặc biệt.'
            }
          </p>
          
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder={lang === 'en' ? 'Enter your email' : 'Nhập email của bạn'}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              {lang === 'en' ? 'Subscribe' : 'Đăng ký'}
            </button>
          </form>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
