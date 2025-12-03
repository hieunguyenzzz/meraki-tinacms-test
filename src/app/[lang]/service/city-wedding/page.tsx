import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import type { Metadata } from 'next';
import Link from 'next/link';

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = params;
  
  return {
    title: lang === 'en' ? 'City Wedding Planning - Meraki Wedding Planner' : 'Tổ chức tiệc cưới thành phố - Meraki Wedding Planner',
    description: lang === 'en' 
      ? 'Elegant city wedding planning services for sophisticated urban celebrations'
      : 'Dịch vụ tổ chức tiệc cưới thành phố thanh lịch cho những lễ kỷ niệm đô thị tinh tế',
  };
}

export default function CityWeddingPage({ params }: Props) {
  const { lang } = params;

  if (!['en', 'vi'].includes(lang)) {
    return <div>Not Found</div>;
  }

  const cityVenues = [
    {
      type: { en: 'Historic Hotels', vi: 'Khách sạn lịch sử' },
      description: { 
        en: 'Elegant ballrooms and sophisticated settings in iconic city landmarks.',
        vi: 'Phòng khiêu vũ thanh lịch và không gian tinh tế tại những địa danh mang tính biểu tượng của thành phố.'
      },
      features: {
        en: ['Grand ballrooms', 'Historic architecture', 'Luxury amenities', 'Central locations'],
        vi: ['Phòng khiêu vũ lớn', 'Kiến trúc lịch sử', 'Tiện nghi cao cấp', 'Vị trí trung tâm']
      }
    },
    {
      type: { en: 'Modern Event Spaces', vi: 'Không gian sự kiện hiện đại' },
      description: { 
        en: 'Contemporary venues with sleek design and state-of-the-art facilities.',
        vi: 'Địa điểm đương đại với thiết kế thanh lịch và cơ sở vật chất hiện đại nhất.'
      },
      features: {
        en: ['Contemporary design', 'Advanced technology', 'Flexible layouts', 'Urban views'],
        vi: ['Thiết kế đương đại', 'Công nghệ tiên tiến', 'Bố trí linh hoạt', 'Tầm nhìn đô thị']
      }
    },
    {
      type: { en: 'Rooftop Venues', vi: 'Địa điểm trên tầng thượng' },
      description: { 
        en: 'Stunning skyline views and open-air celebrations high above the city.',
        vi: 'Tầm nhìn đường chân trời tuyệt đẹp và lễ kỷ niệm ngoài trời cao trên thành phố.'
      },
      features: {
        en: ['Panoramic views', 'Open-air setting', 'City skylines', 'Sunset ceremonies'],
        vi: ['Tầm nhìn toàn cảnh', 'Không gian ngoài trời', 'Đường chân trời thành phố', 'Lễ cưới hoàng hôn']
      }
    },
    {
      type: { en: 'Art Galleries & Museums', vi: 'Phòng trưng bày & Bảo tàng' },
      description: { 
        en: 'Unique cultural venues that provide an artistic backdrop for your celebration.',
        vi: 'Những địa điểm văn hóa độc đáo cung cấp bối cảnh nghệ thuật cho lễ kỷ niệm của bạn.'
      },
      features: {
        en: ['Artistic atmosphere', 'Unique backdrops', 'Cultural significance', 'Intimate settings'],
        vi: ['Không khí nghệ thuật', 'Bối cảnh độc đáo', 'Ý nghĩa văn hóa', 'Không gian thân mật']
      }
    }
  ];

  const cityAdvantages = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0v-4a2 2 0 012-2h2a2 2 0 012 2v4z" />
        </svg>
      ),
      title: { en: 'Accessibility', vi: 'Khả năng tiếp cận' },
      description: { 
        en: 'Easy transportation and accommodation options for all your guests.',
        vi: 'Các lựa chọn giao thông và chỗ ở thuận tiện cho tất cả khách mời của bạn.'
      }
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: { en: 'Convenience', vi: 'Tiện lợi' },
      description: { 
        en: 'All wedding services and vendors within close proximity.',
        vi: 'Tất cả dịch vụ cưới và nhà cung cấp đều ở gần.'
      }
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: { en: 'Reliability', vi: 'Độ tin cậy' },
      description: { 
        en: 'Established infrastructure and backup options for peace of mind.',
        vi: 'Cơ sở hạ tầng đã được thiết lập và các lựa chọn dự phòng để an tâm.'
      }
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: { en: 'Guest Experience', vi: 'Trải nghiệm khách mời' },
      description: { 
        en: 'Entertainment, dining, and activities to extend the celebration.',
        vi: 'Giải trí, ăn uống và các hoạt động để kéo dài lễ kỷ niệm.'
      }
    }
  ];

  const planningServices = [
    {
      title: { en: 'Venue Selection', vi: 'Chọn địa điểm' },
      description: { 
        en: 'Find the perfect urban venue that matches your style and vision.',
        vi: 'Tìm địa điểm đô thị hoàn hảo phù hợp với phong cách và tầm nhìn của bạn.'
      },
      details: {
        en: ['Site visits and tours', 'Venue comparison analysis', 'Contract negotiation', 'Backup venue options'],
        vi: ['Thăm quan và tham quan địa điểm', 'Phân tích so sánh địa điểm', 'Đàm phán hợp đồng', 'Các lựa chọn địa điểm dự phòng']
      }
    },
    {
      title: { en: 'Vendor Coordination', vi: 'Điều phối nhà cung cấp' },
      description: { 
        en: 'Connect with the best city vendors and manage all service providers.',
        vi: 'Kết nối với các nhà cung cấp tốt nhất trong thành phố và quản lý tất cả nhà cung cấp dịch vụ.'
      },
      details: {
        en: ['Vendor sourcing', 'Contract management', 'Timeline coordination', 'Quality assurance'],
        vi: ['Tìm nguồn nhà cung cấp', 'Quản lý hợp đồng', 'Điều phối thời gian', 'Đảm bảo chất lượng']
      }
    },
    {
      title: { en: 'Logistics Management', vi: 'Quản lý hậu cần' },
      description: { 
        en: 'Handle all the complex logistics of a city wedding seamlessly.',
        vi: 'Xử lý tất cả hậu cần phức tạp của tiệc cưới thành phố một cách liền mạch.'
      },
      details: {
        en: ['Transportation planning', 'Parking coordination', 'Load-in/load-out', 'Permit management'],
        vi: ['Lập kế hoạch giao thông', 'Điều phối bãi đậu xe', 'Vận chuyển vào/ra', 'Quản lý giấy phép']
      }
    },
    {
      title: { en: 'Guest Services', vi: 'Dịch vụ khách mời' },
      description: { 
        en: 'Ensure your guests have an exceptional experience in the city.',
        vi: 'Đảm bảo khách mời của bạn có trải nghiệm đặc biệt trong thành phố.'
      },
      details: {
        en: ['Accommodation assistance', 'Transportation arrangements', 'City tour coordination', 'Welcome packages'],
        vi: ['Hỗ trợ chỗ ở', 'Sắp xếp giao thông', 'Điều phối tour thành phố', 'Gói chào mừng']
      }
    }
  ];

  return (
    <div className="min-h-screen bg-background-1">
      <Header lang={lang} />

      {/* Breadcrumb */}
      <div className="  py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href={`/${lang}`} className="text-gray-500 hover:text-gray-700">
                  {lang === 'en' ? 'Home' : 'Trang chủ'}
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <Link href={`/${lang}/service`} className="text-gray-500 hover:text-gray-700">
                  {lang === 'en' ? 'Services' : 'Dịch vụ'}
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-gray-900">
                {lang === 'en' ? 'City Wedding' : 'Tiệc cưới thành phố'}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            {lang === 'en' ? 'City Wedding Planning' : 'Tổ chức tiệc cưới thành phố'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {lang === 'en' 
              ? 'Embrace the sophistication and energy of urban celebrations. We create elegant city weddings that capture the essence of metropolitan romance.'
              : 'Tận hưởng sự tinh tế và năng lượng của những lễ kỷ niệm đô thị. Chúng tôi tạo ra những đám cưới thành phố thanh lịch thể hiện bản chất của sự lãng mạn đô thị.'
            }
          </p>
        </div>
      </section>

      {/* City Venue Types */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              {lang === 'en' ? 'Urban Venue Options' : 'Lựa chọn địa điểm đô thị'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {lang === 'en' 
                ? 'Discover the perfect city venue that reflects your unique style'
                : 'Khám phá địa điểm thành phố hoàn hảo phản ánh phong cách độc đáo của bạn'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {cityVenues.map((venue, index) => (
              <div key={index} className="bg-background-1 rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-3">
                    {lang === 'en' ? venue.type.en : venue.type.vi}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {lang === 'en' ? venue.description.en : venue.description.vi}
                  </p>
                  <ul className="space-y-2">
                    {(lang === 'en' ? venue.features.en : venue.features.vi).map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* City Wedding Advantages */}
      <section className="py-16  ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              {lang === 'en' ? 'Why Choose a City Wedding?' : 'Tại sao chọn tiệc cưới thành phố?'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {lang === 'en' 
                ? 'City weddings offer unique advantages for modern couples'
                : 'Tiệc cưới thành phố mang lại những lợi thế độc đáo cho các cặp đôi hiện đại'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cityAdvantages.map((advantage, index) => (
              <div key={index} className="text-center">
                <div className="text-gray-700 mb-4 flex justify-center">
                  {advantage.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  {lang === 'en' ? advantage.title.en : advantage.title.vi}
                </h3>
                <p className="text-gray-600">
                  {lang === 'en' ? advantage.description.en : advantage.description.vi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planning Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              {lang === 'en' ? 'Our City Wedding Services' : 'Dịch vụ tiệc cưới thành phố'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {lang === 'en' 
                ? 'Comprehensive planning services tailored for urban celebrations'
                : 'Dịch vụ lập kế hoạch toàn diện được thiết kế riêng cho lễ kỷ niệm đô thị'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {planningServices.map((service, index) => (
              <div key={index} className="bg-background-1 p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  {lang === 'en' ? service.title.en : service.title.vi}
                </h3>
                <p className="text-gray-600 mb-4">
                  {lang === 'en' ? service.description.en : service.description.vi}
                </p>
                <ul className="space-y-2">
                  {(lang === 'en' ? service.details.en : service.details.vi).map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16  ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            {lang === 'en' ? 'Ready to Plan Your Urban Celebration?' : 'Sẵn sàng lập kế hoạch cho lễ kỷ niệm đô thị?'}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {lang === 'en' 
              ? 'Let us help you create a sophisticated city wedding that reflects your modern love story.'
              : 'Hãy để chúng tôi giúp bạn tạo ra một đám cưới thành phố tinh tế phản ánh câu chuyện tình yêu hiện đại của bạn.'
            }
          </p>
          <div className="space-x-4">
            <Link
              href={`/${lang}/lets-connect`}
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              {lang === 'en' ? 'Start Planning' : 'Bắt đầu lập kế hoạch'}
            </Link>
            <Link
              href={`/${lang}/journal`}
              className="inline-block border border-gray-900 text-gray-900 px-8 py-3 rounded-md hover:bg-gray-900 hover:text-white transition-colors"
            >
              {lang === 'en' ? 'View Portfolio' : 'Xem danh mục'}
            </Link>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
