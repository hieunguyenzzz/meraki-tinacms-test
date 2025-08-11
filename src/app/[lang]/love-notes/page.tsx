/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from '../../../../tina/__generated__/client';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { Metadata } from 'next';

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = params;
  
  return {
    title: lang === 'en' ? 'Love Notes - Meraki Wedding Planner' : 'Lời cảm ơn - Meraki Wedding Planner',
    description: lang === 'en' 
      ? 'Kind words and testimonials from our beautiful couples'
      : 'Những lời cảm ơn và nhận xét từ các cặp đôi xinh đẹp của chúng tôi',
  };
}

export default async function LoveNotesPage({ params }: Props) {
  const { lang } = params;

  if (!['en', 'vi'].includes(lang)) {
    return <div>Not Found</div>;
  }

  let testimonials: any[] = [];
  try {
    const testimonialList = await client.queries.testimonialConnection({
      filter: {
        published: {
          eq: true
        }
      }
    });
    // Filter out null values and ensure we have valid nodes
    testimonials = (testimonialList.data.testimonialConnection.edges || [])
      .filter((edge): edge is NonNullable<typeof edge> => edge?.node != null)
      .map(edge => edge.node);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    // testimonials will remain empty array
  }

  return (
    <div className="min-h-screen bg-white">
      <Header lang={lang} />

      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            {lang === 'en' ? 'Love Notes' : 'Lời cảm ơn'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {lang === 'en' 
              ? 'Nothing brings us more joy than hearing from our couples about their special day. Here are some of their kind words.'
              : 'Không có gì khiến chúng tôi vui hơn việc nghe từ các cặp đôi về ngày đặc biệt của họ. Đây là một số lời cảm ơn chân thành.'
            }
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {testimonials.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-gray-600 mb-6 italic">
                    &ldquo;{lang === 'en' ? testimonial.content_en : testimonial.content_vi}&rdquo;
                  </blockquote>
                  <div className="flex items-center">
                    {testimonial.photo && (
                      <img 
                        src={testimonial.photo} 
                        alt={testimonial.couple_names}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{testimonial.couple_names}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(testimonial._sys.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'vi-VN')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {lang === 'en' ? 'No testimonials yet' : 'Chưa có lời cảm ơn nào'}
                </h3>
                <p className="text-gray-500">
                  {lang === 'en' 
                    ? 'Check back soon to read kind words from our couples!'
                    : 'Hãy quay lại sớm để đọc những lời cảm ơn từ các cặp đôi!'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            {lang === 'en' ? 'Ready to Create Your Own Love Story?' : 'Sẵn sàng tạo nên câu chuyện tình yêu của riêng bạn?'}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {lang === 'en' 
              ? "Let's work together to create a wedding day that you'll cherish forever."
              : 'Hãy cùng nhau tạo ra một ngày cưới mà bạn sẽ trân trọng mãi mãi.'
            }
          </p>
          <div className="space-x-4">
            <a 
              href={`/${lang}/lets-connect`}
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              {lang === 'en' ? 'Start Planning' : 'Bắt đầu lên kế hoạch'}
            </a>
            <a 
              href={`/${lang}/journal`}
              className="inline-block border border-gray-900 text-gray-900 px-8 py-3 rounded-md hover:bg-gray-900 hover:text-white transition-colors"
            >
              {lang === 'en' ? 'View Our Work' : 'Xem tác phẩm'}
            </a>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
