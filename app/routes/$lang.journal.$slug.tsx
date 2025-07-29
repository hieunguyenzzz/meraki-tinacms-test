import { useLoaderData } from "@remix-run/react";
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { client } from "../../tina/__generated__/client";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useState } from "react";
import { tinaField, useTina } from "tinacms/dist/react";
import Lightbox from "../components/Lightbox";

export const meta: MetaFunction = ({ data }: { data: any }) => {
  const { journal, lang } = data || {};
  const seo = lang === "en" ? journal?.seo_en : journal?.seo_vi;
  
  return [
    { title: seo?.title || `${journal?.couple_names} - ${journal?.subtitle_en || journal?.subtitle_vi}` },
    { name: "description", content: seo?.description || "" },
    { property: "og:title", content: seo?.title || `${journal?.couple_names} - ${journal?.subtitle_en || journal?.subtitle_vi}` },
    { property: "og:description", content: seo?.description || "" },
    { property: "og:type", content: "article" },
    { name: "robots", content: "index, follow" },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const lang = params.lang || "en";
  const slug = params.slug;
  
  if (!["en", "vi"].includes(lang) || !slug) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    const response = await client.queries.journal({ 
      relativePath: `${slug}.mdx` 
    });
    return { 
      ...response,
      lang 
    };
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }
};

export default function JournalDetail() {
  const { data, query, variables } = useTina(useLoaderData<typeof loader>());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { lang } = useLoaderData<typeof loader>();
  const journal = data.journal;

  const subtitle = lang === "en" ? journal.subtitle_en : journal.subtitle_vi;

  const openLightbox = (images: any[], index: number) => {
    setCurrentImages(images);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === currentImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? currentImages.length - 1 : prev - 1
    );
  };

  const renderContentBlock = (block: any, index: number) => {
    const blockField = tinaField(journal, `content_blocks.${index}`);
    
    switch (block._template) {
      case "text_image_block":
        const heading = lang === "en" ? block.heading_en : block.heading_vi;
        const content = lang === "en" ? block.content_en : block.content_vi;
        const imageAlt = lang === "en" ? block.image_alt_en : block.image_alt_vi;
        
        return (
          <section 
            key={index} 
            className={`py-16 ${block.background_color === "gray-50" ? "bg-gray-50" : block.background_color === "gray-100" ? "bg-gray-100" : "bg-white"}`}
            data-tina-field={blockField}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`grid md:grid-cols-2 gap-12 items-start ${block.layout === "image-right" ? "md:grid-flow-col-dense" : ""}`}>
                <div className={block.layout === "image-right" ? "md:col-start-2" : ""}>
                  {heading && (
                    <h2 
                      className="text-3xl font-light text-gray-900 text-center mb-8"
                      data-tina-field={tinaField(block, lang === "en" ? "heading_en" : "heading_vi")}
                    >
                      {heading}
                    </h2>
                  )}
                  {content && (
                    <div 
                      className="space-y-4 text-gray-700 leading-relaxed"
                      data-tina-field={tinaField(block, lang === "en" ? "content_en" : "content_vi")}
                    >
                      <TinaMarkdown content={content} />
                    </div>
                  )}
                </div>
                
                {block.image && (
                  <div className={`aspect-w-4 aspect-h-5 ${block.layout === "image-right" ? "md:col-start-1" : ""}`}>
                    <img 
                      src={block.image} 
                      alt={imageAlt || heading}
                      className="w-full h-96 object-cover rounded-lg shadow-lg"
                      data-tina-field={tinaField(block, "image")}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case "large_image_block":
        const caption = lang === "en" ? block.caption_en : block.caption_vi;
        const altText = lang === "en" ? block.alt_en : block.alt_vi;
        
        return (
          <section key={index} className="py-8" data-tina-field={blockField}>
            <div className={block.size === "full-width" ? "w-full" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
              <img 
                src={block.image} 
                alt={altText}
                className={`w-full object-cover ${block.size === "full-width" ? "h-96 md:h-screen" : "h-96 rounded-lg"} shadow-lg cursor-pointer`}
                onClick={() => openLightbox([{image: block.image, alt_en: block.alt_en, alt_vi: block.alt_vi}], 0)}
                data-tina-field={tinaField(block, "image")}
              />
              {caption && (
                <p 
                  className="text-center text-gray-600 mt-4 italic"
                  data-tina-field={tinaField(block, lang === "en" ? "caption_en" : "caption_vi")}
                >
                  {caption}
                </p>
              )}
            </div>
          </section>
        );

      case "gallery_block":
        const galleryHeading = lang === "en" ? block.heading_en : block.heading_vi;
        
        return (
          <section 
            key={index} 
            className={`py-16 ${block.background_color === "gray-50" ? "bg-gray-50" : block.background_color === "gray-100" ? "bg-gray-100" : "bg-white"}`}
            data-tina-field={blockField}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {galleryHeading && (
                <h2 
                  className="text-3xl font-light text-gray-900 text-center mb-12"
                  data-tina-field={tinaField(block, lang === "en" ? "heading_en" : "heading_vi")}
                >
                  {galleryHeading}
                </h2>
              )}
              <div className={`grid gap-4 ${
                block.gallery_style === "grid-2" ? "md:grid-cols-2" :
                block.gallery_style === "grid-4" ? "md:grid-cols-2 lg:grid-cols-4" :
                "md:grid-cols-2 lg:grid-cols-3"
              }`}>
                {block.images?.map((item: any, imgIndex: number) => {
                  const imgAlt = lang === "en" ? item.alt_en : item.alt_vi;
                  return (
                    <div key={imgIndex} className="aspect-w-4 aspect-h-3">
                      <img 
                        src={item.image} 
                        alt={imgAlt}
                        className="w-full h-64 object-cover rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => openLightbox(block.images, imgIndex)}
                        data-tina-field={tinaField(block, `images.${imgIndex}.image`)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      case "text_block":
        const textHeading = lang === "en" ? block.heading_en : block.heading_vi;
        const textContent = lang === "en" ? block.content_en : block.content_vi;
        
        return (
          <section 
            key={index} 
            className={`py-16 ${block.background_color === "gray-50" ? "bg-gray-50" : block.background_color === "gray-100" ? "bg-gray-100" : "bg-white"}`}
            data-tina-field={blockField}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`text-${block.text_align || "center"}`}>
                {textHeading && (
                  <h2 
                    className="text-3xl font-light text-gray-900 mb-8"
                    data-tina-field={tinaField(block, lang === "en" ? "heading_en" : "heading_vi")}
                  >
                    {textHeading}
                  </h2>
                )}
                {textContent && (
                  <div 
                    className="space-y-4 text-gray-700 leading-relaxed"
                    data-tina-field={tinaField(block, lang === "en" ? "content_en" : "content_vi")}
                  >
                    <TinaMarkdown content={textContent} />
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case "location_block":
        const locationHeading = lang === "en" ? block.heading_en : block.heading_vi;
        const locationName = lang === "en" ? block.location_name_en : block.location_name_vi;
        const locationDescription = lang === "en" ? block.description_en : block.description_vi;
        
        return (
          <section key={index} className="py-16" data-tina-field={blockField}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 
                  className="text-3xl font-light text-gray-900 mb-4"
                  data-tina-field={tinaField(block, lang === "en" ? "heading_en" : "heading_vi")}
                >
                  {locationHeading}
                </h2>
                <h3 
                  className="text-xl font-light text-gray-700 italic mb-8"
                  data-tina-field={tinaField(block, lang === "en" ? "location_name_en" : "location_name_vi")}
                >
                  {locationName}
                </h3>
              </div>
              
              <div className="max-w-4xl mx-auto space-y-6 text-gray-700 leading-relaxed mb-12">
                <div data-tina-field={tinaField(block, lang === "en" ? "description_en" : "description_vi")}>
                  <TinaMarkdown content={locationDescription} />
                </div>
              </div>

              {block.images && block.images.length > 0 && (
                <div className="grid md:grid-cols-2 gap-8">
                  {block.images.map((item: any, imgIndex: number) => {
                    const imgAlt = lang === "en" ? item.alt_en : item.alt_vi;
                    return (
                      <img 
                        key={imgIndex}
                        src={item.image} 
                        alt={imgAlt}
                        className="w-full h-64 object-cover rounded-lg shadow-lg cursor-pointer"
                        onClick={() => openLightbox(block.images, imgIndex)}
                        data-tina-field={tinaField(block, `images.${imgIndex}.image`)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        );

      case "quote_block":
        const quote = lang === "en" ? block.quote_en : block.quote_vi;
        
        return (
          <section 
            key={index} 
            className={`py-16 ${block.background_color === "gray-50" ? "bg-gray-50" : block.background_color === "gray-100" ? "bg-gray-100" : "bg-white"}`}
            data-tina-field={blockField}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <blockquote className="text-2xl font-light text-gray-900 italic mb-4">
                <span 
                  data-tina-field={tinaField(block, lang === "en" ? "quote_en" : "quote_vi")}
                >
                  "{quote}"
                </span>
              </blockquote>
              {block.author && (
                <cite 
                  className="text-gray-600"
                  data-tina-field={tinaField(block, "author")}
                >
                  — {block.author}
                </cite>
              )}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

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
                <a href={`/${lang}/about`} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  {lang === "en" ? "About" : "Giới thiệu"}
                </a>
                <a href={`/${lang}/journal`} className="text-gray-900 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
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
              <a href={`/en/journal/${journal.slug}`} className={`px-2 py-1 text-sm rounded ${lang === "en" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}`}>
                EN
              </a>
              <a href={`/vi/journal/${journal.slug}`} className={`px-2 py-1 text-sm rounded ${lang === "vi" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}`}>
                VI
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Image */}
      {journal.hero?.image && (
        <section className="relative h-screen">
          <img 
            src={journal.hero.image} 
            alt={lang === "en" ? journal.hero.alt_en : journal.hero.alt_vi}
            className="w-full h-full object-cover"
            data-tina-field={tinaField(journal, "hero.image")}
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </section>
      )}

      {/* Wedding Details */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Column - Title */}
            <div>
              <h1 
                className="text-4xl md:text-5xl font-light text-gray-900 mb-4"
                data-tina-field={tinaField(journal, "couple_names")}
              >
                {journal.couple_names}
              </h1>
              <h2 
                className="text-2xl md:text-3xl font-light text-gray-700 mb-8 tracking-wider"
                data-tina-field={tinaField(journal, lang === "en" ? "subtitle_en" : "subtitle_vi")}
              >
                {subtitle}
              </h2>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {journal.wedding_details?.nationality && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                    {lang === "en" ? "Nationality:" : "Quốc tịch:"}
                  </h3>
                  <p 
                    className="text-gray-900"
                    data-tina-field={tinaField(journal, "wedding_details.nationality")}
                  >
                    {journal.wedding_details.nationality}
                  </p>
                </div>
              )}

              {journal.wedding_details?.guest_count && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                    {lang === "en" ? "Guest Count:" : "Số khách:"}
                  </h3>
                  <p 
                    className="text-gray-900"
                    data-tina-field={tinaField(journal, "wedding_details.guest_count")}
                  >
                    {journal.wedding_details.guest_count}
                  </p>
                </div>
              )}

              {journal.wedding_details && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                    {lang === "en" ? "Type of Wedding:" : "Loại tiệc cưới:"}
                  </h3>
                  <p 
                    className="text-gray-900"
                    data-tina-field={tinaField(journal, lang === "en" ? "wedding_details.wedding_type_en" : "wedding_details.wedding_type_vi")}
                  >
                    {lang === "en" ? journal.wedding_details.wedding_type_en : journal.wedding_details.wedding_type_vi}
                  </p>
                </div>
              )}

              {journal.wedding_details?.venue && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                    {lang === "en" ? "Venue:" : "Địa điểm:"}
                  </h3>
                  <p 
                    className="text-gray-900"
                    data-tina-field={tinaField(journal, "wedding_details.venue")}
                  >
                    {journal.wedding_details.venue}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Blocks */}
      {journal.content_blocks?.map((block: any, index: number) => 
        renderContentBlock(block, index)
      )}

      {/* Social Sharing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${journal.couple_names} - ${subtitle}`,
                    url: window.location.href,
                  });
                }
              }}
              className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              {lang === "en" ? "Share" : "Chia sẻ"}
            </button>
            <a 
              href={`/${lang}/journal`}
              className="border border-gray-900 text-gray-900 px-8 py-3 rounded-md hover:bg-gray-900 hover:text-white transition-colors"
            >
              {lang === "en" ? "Back to Journal" : "Quay lại Nhật ký"}
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        images={currentImages}
        isOpen={lightboxOpen}
        currentIndex={currentImageIndex}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
        lang={lang}
      />

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