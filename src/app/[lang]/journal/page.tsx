/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../../../../tina/__generated__/client";
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

interface Props {
  params: { lang: string };
}

export default async function JournalPage({ params }: Props) {
  const { lang } = params;

  if (!['en', 'vi'].includes(lang)) {
    return <div>Not Found</div>;
  }

  let journals: any[] = [];
  try {
    const journalList = await client.queries.journalConnection({
      filter: {
        published: {
          eq: true,
        },
      },
    });
    // Filter out null values and ensure we have valid nodes
    journals = (journalList.data.journalConnection.edges || [])
      .filter((edge): edge is NonNullable<typeof edge> => edge?.node != null)
      .map((edge) => edge);
  } catch (error) {
    console.error('Error fetching journals:', error);
    // journals will remain empty array
  }

  return (
    <div className='min-h-screen bg-white'>
      <Header lang={lang} />

      {/* Page Header */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl font-light text-gray-900 mb-4'>
            {lang === 'en' ? 'Wedding Journal' : 'Nhật ký cưới'}
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            {lang === 'en'
              ? 'Explore our collection of beautiful weddings and love stories'
              : 'Khám phá bộ sưu tập những đám cưới đẹp và câu chuyện tình yêu'}
          </p>
        </div>
      </section>

      {/* Journal Grid */}
      <section className='py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {journals.length > 0 ? (
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {journals.map((journal: any, index: number) => (
                <div key={index} className='group cursor-pointer'>
                  <a href={`/${lang}/journal/${journal.node.slug}`}>
                    <div className='aspect-w-4 aspect-h-3 mb-4 overflow-hidden rounded-lg'>
                      {journal.node.featured_image && (
                        <img
                          src={journal.node.featured_image}
                          alt={
                            lang === 'en'
                              ? journal.node.subtitle_en
                              : journal.node.subtitle_vi
                          }
                          className='w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300'
                        />
                      )}
                    </div>
                    <div className='text-center'>
                      <h3 className='text-xl font-medium text-gray-900 mb-2'>
                        {lang === 'en'
                          ? journal.node.subtitle_en
                          : journal.node.subtitle_vi}
                      </h3>
                      <p className='text-gray-600'>
                        {journal.node.couple_names}
                      </p>
                      {journal.node.wedding_details?.wedding_date && (
                        <p className='text-sm text-gray-500 mt-1'>
                          {new Date(
                            journal.node.wedding_details.wedding_date
                          ).toLocaleDateString(
                            lang === 'en' ? 'en-US' : 'vi-VN'
                          )}
                        </p>
                      )}
                    </div>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-16'>
              <p className='text-gray-600 text-lg'>
                {lang === 'en'
                  ? 'No wedding journals available yet. Check back soon!'
                  : 'Chưa có nhật ký cưới nào. Hãy quay lại sau!'}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
