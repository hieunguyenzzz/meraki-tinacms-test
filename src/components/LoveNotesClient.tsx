'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { tinaField, useTina } from 'tinacms/dist/react';
import Footer from './Footer';
import Header from './Header';
import MerakiImage from './ui/MerakiImage';

interface Props {
    data: any;
    query: string;
    variables: { relativePath: string };
    lang: string;
}

const t = (text: { en?: string | null; vi?: string | null }, lang: string) =>
    lang === 'en' ? text.en : text.vi;

const splitCoupleNames = (names?: string | null): [string, string] => {
    if (!names) return ['', ''];

    const [left, ...rightParts] = names.split(',');
    const right = rightParts.join(',').trim();

    return [left.trim(), right];
};

export default function LoveNotesClient({
    data,
    query,
    variables,
    lang,
}: Props) {
    const [openNotes, setOpenNotes] = useState<Record<number, boolean>>({});
    const { data: tinaData } = useTina({ data, query, variables });
    const listing = tinaData.loveNotesListing;

    const title = t(
        { en: listing?.title_en, vi: listing?.title_vi },
        lang,
    ) || (lang === 'en' ? 'Love Notes' : 'Tri an');

    const heroDescription = t(
        {
            en: listing?.hero?.description_en,
            vi: listing?.hero?.description_vi,
        },
        lang,
    );

    const notes = listing?.love_notes || [];
    const galleryImages = listing?.friendship_gallery?.images || [];
    const galleryTitle = t(
        {
            en: listing?.friendship_gallery?.title_en,
            vi: listing?.friendship_gallery?.title_vi,
        },
        lang,
    );

    const toggleNote = (index: number) => {
        setOpenNotes((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (
        <div className='bg-background-base'>
            <Header lang={lang} />

            <section className='relative'>
                <div className='grid grid-cols-1 lg:grid-cols-2 items-stretch'>
                    <div
                        className='relative min-h-[420px] md:min-h-[620px] overflow-hidden'
                        data-tina-field={tinaField(listing.hero, 'background_image')}>
                        <MerakiImage
                            src={listing?.hero?.background_image || '/images/bg/love-notes-hero.jpg'}
                            alt='Love Notes hero background'
                            fill
                            className='object-cover object-center'
                            priority
                        />
                    </div>

                    <div className='bg-background-1 bg-paper px-8 py-12 md:px-16 md:py-20 lg:px-20 lg:py-24 flex flex-col items-center justify-between text-center gap-10'>
                        <h1
                            className='text-display font-vocago uppercase tracking-wider'
                            data-tina-field={tinaField(listing, lang === 'en' ? 'title_en' : 'title_vi')}>
                            {title}
                        </h1>

                        <div
                            className='w-[180px] md:w-[220px] lg:w-[260px]'
                            data-tina-field={tinaField(listing.hero, 'featured_image')}>
                            <MerakiImage
                                src={listing?.hero?.featured_image || '/images/bg/love-notes-featured.jpg'}
                                alt='Love Notes featured'
                                width={260}
                                height={340}
                                className='w-full h-auto object-cover'
                            />
                        </div>

                        {heroDescription && (
                            <p
                                className='text-body-md text-text-secondary max-w-[520px] leading-relaxed'
                                data-tina-field={tinaField(
                                    listing.hero,
                                    lang === 'en' ? 'description_en' : 'description_vi',
                                )}>
                                {heroDescription}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <section className=''>
                <div className='mx-auto max-w-[1728px] px-6 md:px-10'>
                    <div className='-space-y-10'>
                        {notes.map((note: any, index: number) => {
                            const coupleNames = t(
                                {
                                    en: note?.couple_names_en,
                                    vi: note?.couple_names_vi,
                                },
                                lang,
                            );

                            const location = t(
                                {
                                    en: note?.wedding_location_en,
                                    vi: note?.wedding_location_vi,
                                },
                                lang,
                            );

                            const excerpt = t(
                                {
                                    en: note?.excerpt_en,
                                    vi: note?.excerpt_vi,
                                },
                                lang,
                            );

                            const fullNote = t(
                                {
                                    en: note?.note_en,
                                    vi: note?.note_vi,
                                },
                                lang,
                            );
                            const [leftName, rightName] = splitCoupleNames(coupleNames);
                            const hasRightName = Boolean(rightName);
                            const isOpen = Boolean(openNotes[index]);
                            const notePanelId = `love-note-panel-${index}`;
                            const isRightAligned = index % 2 === 1;

                            return (
                                <article
                                    key={`${coupleNames || 'note'}-${index}`}
                                    className={`flex items-center ${isRightAligned ? 'flex-row-reverse' : ''}`}>
                                    <div
                                        className={`w-full ${isRightAligned ? 'lg:max-w-[1000px]' : 'lg:max-w-[980px]'}`}
                                        data-tina-field={tinaField(
                                            note,
                                            lang === 'en' ? 'couple_names_en' : 'couple_names_vi',
                                        )}>
                                        <div className={isRightAligned ? 'lg:text-right' : undefined}>
                                            <h2 className={`flex flex-wrap items-center gap-x-5 gap-y-3 font-vocago text-h2 md:text-display ${isRightAligned ? 'lg:justify-end' : 'lg:justify-start'}`}>
                                                <span className='uppercase'>{leftName}</span>

                                                <button
                                                    type='button'
                                                    onClick={() => toggleNote(index)}
                                                    aria-expanded={isOpen}
                                                    aria-controls={notePanelId}
                                                    aria-label={
                                                        isOpen
                                                            ? lang === 'en'
                                                                ? 'Hide love note details'
                                                                : 'An chi tiet thu tinh'
                                                            : lang === 'en'
                                                                ? 'Show love note details'
                                                                : 'Hien chi tiet thu tinh'
                                                    }
                                                    className='flex h-[38px] w-[58px] shrink-0 items-end justify-center rounded-sm transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary/40 md:h-[54px] md:w-[82px] lg:h-[62px] lg:w-[94px]'>
                                                    <img
                                                        src={
                                                            isOpen
                                                                ? '/images/icons/envelope-open.png'
                                                                : '/images/icons/envelope-closed.png'
                                                        }
                                                        alt='Envelope toggle'
                                                        width={isOpen ? 80 : 94}
                                                        height={62}
                                                        loading='lazy'
                                                        className={`w-[${isOpen ? 80 : 94}px] h-auto`}
                                                    />
                                                </button>

                                                <span className='uppercase'>
                                                    {hasRightName ? rightName : ''}
                                                </span>
                                            </h2>

                                            <div className='mt-8 grid grid-cols-1 gap-5 md:mt-10 lg:grid-cols-12 lg:gap-8 items-baseline'>
                                                <p
                                                    className={`text-body-lg uppercase text-text-secondary ${isRightAligned ? 'lg:order-2 lg:col-span-3 lg:col-start-10 lg:text-right' : 'lg:col-span-2 lg:col-start-1'}`}
                                                    data-tina-field={tinaField(
                                                        note,
                                                        lang === 'en'
                                                            ? 'wedding_location_en'
                                                            : 'wedding_location_vi',
                                                    )}>
                                                    {lang === 'en' ? 'Wedding in ' : 'To chuc tai '} {location}
                                                </p>

                                                {excerpt && (
                                                    <p
                                                        className={`max-w-[620px] text-body-lg leading-relaxed text-text-secondary ${isRightAligned ? 'lg:order-1 lg:col-span-9 lg:col-start-1 lg:max-w-[650px] lg:text-right' : 'lg:col-span-8 lg:col-start-4'}`}
                                                        data-tina-field={tinaField(
                                                            note,
                                                            lang === 'en' ? 'excerpt_en' : 'excerpt_vi',
                                                        )}>
                                                        {excerpt}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        id={notePanelId}
                                        className={`my-10 ${isRightAligned ? 'translate-x-1/3' : '-translate-x-1/3'} ${isOpen ? 'visible' : 'invisible opacity-0'}`}>
                                        <div className='relative'>
                                            {/* Image base layer */}
                                            <div data-tina-field={tinaField(note, 'image')}>
                                                <div className={`relative overflow-visible animate__animated animate__faster ${isOpen ? isRightAligned ? 'animate__fadeInRight' : 'animate__fadeInLeft' : ''}`}>
                                                    <MerakiImage
                                                        src={
                                                            note?.image ||
                                                            '/images/bg/love-notes-featured.jpg'
                                                        }
                                                        alt={
                                                            coupleNames ||
                                                            'Couple note image'
                                                        }
                                                        width={558}
                                                        height={592}
                                                        className='h-auto object-cover'
                                                    />
                                                </div>
                                            </div>

                                            {/* Note card overlay */}
                                            {fullNote && (
                                                <div
                                                    className={`absolute animate__animated animate__faster ${isOpen ? isRightAligned ? 'animate__fadeInLeft' : 'animate__fadeInRight' : ''} z-10 w-[446px] max-w-[calc(100vw-2rem)] bg-background-1 bg-paper p-6 text-center md:p-8 ${!isRightAligned
                                                        ? 'top-[50%] left-[50%]'
                                                        : 'top-[50%] right-[50%]'
                                                        }`}>
                                                    {/* Couple Names */}
                                                    <h3
                                                        className='text-h3 uppercase tracking-wide text-text-primary mb-2'
                                                        data-tina-field={tinaField(
                                                            note,
                                                            lang === 'en' ? 'couple_names_en' : 'couple_names_vi',
                                                        )}>
                                                        <span>{leftName}</span>
                                                        <span className='lowercase text-body-lg'> & </span>
                                                        <span>{rightName}</span>
                                                    </h3>

                                                    {/* Excerpt in handwriting font */}
                                                    {excerpt && (
                                                        <p
                                                            className='text-handwriting italic text-text-primary mb-4 leading-relaxed'
                                                            data-tina-field={tinaField(
                                                                note,
                                                                lang === 'en' ? 'excerpt_en' : 'excerpt_vi',
                                                            )}>
                                                            {excerpt}
                                                        </p>
                                                    )}

                                                    {/* Full Note Content */}
                                                    <p
                                                        className='text-body-sm text-text-secondary leading-relaxed'
                                                        data-tina-field={tinaField(
                                                            note,
                                                            lang === 'en'
                                                                ? 'note_en'
                                                                : 'note_vi',
                                                        )}>
                                                        {fullNote}
                                                    </p>

                                                    {/* Wedding Location */}
                                                    {location && (
                                                        <p
                                                            className='text-body-md uppercase tracking-[0.16em] text-text-secondary mt-8 mb-4'
                                                            data-tina-field={tinaField(
                                                                note,
                                                                lang === 'en'
                                                                    ? 'wedding_location_en'
                                                                    : 'wedding_location_vi',
                                                            )}>
                                                            {lang === 'en' ? 'Wedding in ' : 'To chuc tai '} {location}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {galleryImages.length > 0 && (
                <section className='py-14 md:py-20 bg-background-1'>
                    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                        {galleryTitle && (
                            <h2
                                className='text-h2 md:text-display font-vocago text-center mb-10 md:mb-14'
                                data-tina-field={tinaField(
                                    listing.friendship_gallery,
                                    lang === 'en' ? 'title_en' : 'title_vi',
                                )}>
                                {galleryTitle}
                            </h2>
                        )}

                        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4'>
                            {galleryImages.map((image: string, index: number) => (
                                <div
                                    key={`${image}-${index}`}
                                    className='relative overflow-hidden aspect-[4/5]'
                                    data-tina-field={tinaField(listing.friendship_gallery, 'images')}>
                                    <MerakiImage
                                        src={image}
                                        alt={`Friendship memory ${index + 1}`}
                                        fill
                                        className='object-cover'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer lang={lang} />
        </div>
    );
}
