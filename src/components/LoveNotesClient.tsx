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

            <section className='py-16 md:py-24'>
                <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='space-y-20 md:space-y-24'>
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
                            const isOddVisualRow = (index + 1) % 2 === 1;

                            return (
                                <article
                                    key={`${coupleNames || 'note'}-${index}`}
                                    className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start'>
                                    <div
                                        className={
                                            isOddVisualRow
                                                ? 'lg:col-span-5 lg:col-start-1'
                                                : 'lg:col-span-5 lg:col-start-8'
                                        }
                                        data-tina-field={tinaField(
                                            note,
                                            lang === 'en' ? 'couple_names_en' : 'couple_names_vi',
                                        )}>
                                        <div className='max-w-[520px]'>
                                            <h2 className='flex items-center justify-between gap-4 md:gap-5 text-h2 md:text-display font-vocago uppercase tracking-wide text-text-primary'>
                                                <span>{leftName}</span>

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
                                                    className='shrink-0 transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary/40 rounded-sm'>
                                                    <img
                                                        src={
                                                            isOpen
                                                                ? '/images/icons/envelope-open.png'
                                                                : '/images/icons/envelope-closed.png'
                                                        }
                                                        alt='Envelope toggle'
                                                        width={64}
                                                        height={48}
                                                        className='w-14 md:w-16 h-auto'
                                                    />
                                                </button>

                                                <span className='text-right'>
                                                    {hasRightName ? rightName : ''}
                                                </span>
                                            </h2>

                                            <p
                                                className='text-body-sm uppercase tracking-[0.16em] text-text-secondary mt-6 mb-6'
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
                                                    className='text-body-md text-text-primary leading-relaxed'
                                                    data-tina-field={tinaField(
                                                        note,
                                                        lang === 'en' ? 'excerpt_en' : 'excerpt_vi',
                                                    )}>
                                                    {excerpt}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {isOpen && (
                                        <div
                                            id={notePanelId}
                                            className={
                                                isOddVisualRow
                                                    ? 'lg:col-span-7 lg:col-start-6'
                                                    : 'lg:col-span-7 lg:col-start-1'
                                            }>
                                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 lg:gap-8'>
                                                <div data-tina-field={tinaField(note, 'image')}>
                                                    <div className='relative overflow-hidden'>
                                                        <MerakiImage
                                                            src={
                                                                note?.image ||
                                                                '/images/bg/love-notes-featured.jpg'
                                                            }
                                                            alt={
                                                                coupleNames ||
                                                                'Couple note image'
                                                            }
                                                            width={720}
                                                            height={900}
                                                            className='w-full h-auto object-cover'
                                                        />
                                                    </div>
                                                </div>

                                                {fullNote && (
                                                    <p
                                                        className='text-body-md text-text-secondary leading-relaxed bg-background-1 bg-paper p-6 md:p-8'
                                                        data-tina-field={tinaField(
                                                            note,
                                                            lang === 'en'
                                                                ? 'note_en'
                                                                : 'note_vi',
                                                        )}>
                                                        {fullNote}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
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
