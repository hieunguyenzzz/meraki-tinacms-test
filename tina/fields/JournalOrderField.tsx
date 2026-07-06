/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import type { InputFieldType } from 'tinacms';
import { wrapFieldsWithMeta } from 'tinacms';
import { client } from '../__generated__/client';
import { JOURNAL_LOCATIONS } from '../constants';
import { getThumborUrl } from '../media/S3MediaStore';

export interface LocationOrder {
  location: string;
  order: string[];
}

export interface JournalOrderingValue {
  order_all?: string[];
  location_orders?: LocationOrder[];
}

interface JournalItem {
  slug: string;
  couple_names: string;
  location: string;
  featured_image: string;
  relativePath: string;
}

type JournalOrderFieldProps = InputFieldType<object, object>;

const JournalOrderFieldComponent = wrapFieldsWithMeta<object, object>(
  ({ input }) => {
    const [journals, setJournals] = useState<JournalItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<string>('All');
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    // Current stored value
    const currentValue: JournalOrderingValue = useMemo(() => {
      if (input.value && typeof input.value === 'object') {
        return input.value as JournalOrderingValue;
      }
      return { order_all: [], location_orders: [] };
    }, [input.value]);

    // Fetch published journals on mount
    useEffect(() => {
      let isMounted = true;
      async function loadJournals() {
        try {
          const res = await client.queries.journalConnection({
            filter: { published: { eq: true } },
          });

          if (!isMounted) return;

          const edges = res?.data?.journalConnection?.edges || [];
          const items: JournalItem[] = edges
            .filter((e): e is NonNullable<typeof e> => e?.node != null)
            .map((e) => {
              const node = e.node as any;
              return {
                slug: node.slug || node._sys?.filename || '',
                couple_names: node.couple_names || 'Untitled Journal',
                location: node.location || 'Unknown',
                featured_image: node.featured_image || '',
                relativePath: node._sys?.relativePath || '',
              };
            });

          setJournals(items);
        } catch (err) {
          console.error('Failed to load journals for reordering field:', err);
        } finally {
          if (isMounted) setLoading(false);
        }
      }

      loadJournals();
      return () => {
        isMounted = false;
      };
    }, []);

    // Filter locations present in journals + default constant locations
    const availableLocations = useMemo(() => {
      const locationsInJournals = Array.from(
        new Set(journals.map((j) => j.location).filter(Boolean))
      );
      const combined = Array.from(
        new Set([...JOURNAL_LOCATIONS, ...locationsInJournals])
      ).sort();
      return ['All', ...combined];
    }, [journals]);

    // Filter journals for active tab
    const tabPool = useMemo(() => {
      if (activeTab === 'All') return journals;
      return journals.filter((j) => j.location === activeTab);
    }, [journals, activeTab]);

    // Saved custom order array for active tab
    const savedOrderSlugs = useMemo(() => {
      if (activeTab === 'All') {
        return currentValue.order_all || [];
      }
      const locObj = (currentValue.location_orders || []).find(
        (l) => l.location === activeTab
      );
      return locObj?.order || [];
    }, [currentValue, activeTab]);

    // Ordered list of journals for current tab (Saved items first, then unlisted items at bottom)
    const displayedItems = useMemo(() => {
      const slugMap = new Map<string, JournalItem>();
      tabPool.forEach((j) => {
        slugMap.set(j.slug, j);
        if (j.relativePath) slugMap.set(j.relativePath, j);
      });

      const ordered: JournalItem[] = [];
      const usedSlugs = new Set<string>();

      // 1. Add explicitly ordered items first
      savedOrderSlugs.forEach((slug) => {
        const item = slugMap.get(slug);
        if (item && !usedSlugs.has(item.slug)) {
          ordered.push(item);
          usedSlugs.add(item.slug);
        }
      });

      // 2. Add remaining unlisted items at bottom
      tabPool.forEach((item) => {
        if (!usedSlugs.has(item.slug)) {
          ordered.push(item);
          usedSlugs.add(item.slug);
        }
      });

      return ordered;
    }, [tabPool, savedOrderSlugs]);

    // Helper to update field value
    const updateOrder = (newItems: JournalItem[]) => {
      const newSlugs = newItems.map((item) => item.slug);

      if (activeTab === 'All') {
        input.onChange({
          ...currentValue,
          order_all: newSlugs,
        });
      } else {
        const existingLocs = currentValue.location_orders || [];
        const existingIndex = existingLocs.findIndex(
          (l) => l.location === activeTab
        );
        let updatedLocs: LocationOrder[];

        if (existingIndex >= 0) {
          updatedLocs = [...existingLocs];
          updatedLocs[existingIndex] = {
            location: activeTab,
            order: newSlugs,
          };
        } else {
          updatedLocs = [
            ...existingLocs,
            { location: activeTab, order: newSlugs },
          ];
        }

        input.onChange({
          ...currentValue,
          location_orders: updatedLocs,
        });
      }
    };

    // Move item position
    const moveItem = (
      index: number,
      direction: 'up' | 'down' | 'top' | 'bottom'
    ) => {
      const copy = [...displayedItems];
      if (index < 0 || index >= copy.length) return;

      const item = copy.splice(index, 1)[0];

      if (direction === 'top') {
        copy.unshift(item);
      } else if (direction === 'bottom') {
        copy.push(item);
      } else if (direction === 'up') {
        const targetIndex = Math.max(0, index - 1);
        copy.splice(targetIndex, 0, item);
      } else if (direction === 'down') {
        const targetIndex = Math.min(copy.length, index + 1);
        copy.splice(targetIndex, 0, item);
      }

      updateOrder(copy);
    };

    // Reset current tab order
    const resetTabOrder = () => {
      if (activeTab === 'All') {
        input.onChange({
          ...currentValue,
          order_all: [],
        });
      } else {
        const existingLocs = currentValue.location_orders || [];
        const filteredLocs = existingLocs.filter(
          (l) => l.location !== activeTab
        );
        input.onChange({
          ...currentValue,
          location_orders: filteredLocs,
        });
      }
    };

    // Drag and Drop handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
      e.dataTransfer.effectAllowed = 'move';
      setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedIndex !== null && draggedIndex !== index) {
        setDragOverIndex(index);
      }
    };

    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === targetIndex) {
        setDraggedIndex(null);
        setDragOverIndex(null);
        return;
      }

      const copy = [...displayedItems];
      const draggedItem = copy.splice(draggedIndex, 1)[0];
      copy.splice(targetIndex, 0, draggedItem);

      setDraggedIndex(null);
      setDragOverIndex(null);
      updateOrder(copy);
    };

    if (loading) {
      return (
        <div className='p-4 bg-gray-50 rounded border border-gray-200 text-center text-sm text-gray-500'>
          Loading journals for reordering...
        </div>
      );
    }

    return (
      <div className='w-full font-sans border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm my-2'>
        {/* Header & Tabs */}
        <div className='p-3 bg-gray-50 border-b border-gray-200'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-xs font-bold uppercase tracking-wider text-gray-700'>
              Arrange Journal Order ({activeTab} Tab)
            </span>
            {savedOrderSlugs.length > 0 && (
              <button
                type='button'
                onClick={resetTabOrder}
                className='text-xs text-red-600 hover:text-red-800 font-medium cursor-pointer underline'>
                Reset to default order
              </button>
            )}
          </div>

          {/* Location Tabs */}
          <div className='flex gap-1 overflow-x-auto pb-1 text-xs no-scrollbar'>
            {availableLocations.map((loc) => {
              const isActive = activeTab === loc;
              const isCustomized =
                loc === 'All'
                  ? (currentValue.order_all || []).length > 0
                  : (currentValue.location_orders || []).some(
                    (l) => l.location === loc && (l.order || []).length > 0
                  );

              return (
                <button
                  key={loc}
                  type='button'
                  onClick={() => {
                    setActiveTab(loc);
                    setDraggedIndex(null);
                    setDragOverIndex(null);
                  }}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer flex items-center gap-1.5 ${isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}>
                  <span>{loc}</span>
                  {isCustomized && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-blue-500'
                        }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Journal Cards List */}
        <div className='p-3 max-h-[500px] overflow-y-auto space-y-2 bg-gray-50/50'>
          {displayedItems.length === 0 ? (
            <div className='p-6 text-center text-sm text-gray-500'>
              No journals found for location &quot;{activeTab}&quot;.
            </div>
          ) : (
            displayedItems.map((journal, index) => {
              const isExplicitlyOrdered = savedOrderSlugs.includes(
                journal.slug
              );
              const isDragging = draggedIndex === index;
              const isOver = dragOverIndex === index;

              const thumbUrl = journal.featured_image
                ? getThumborUrl('150x150', journal.featured_image)
                : '';

              return (
                <div
                  key={journal.slug || index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={() => setDragOverIndex(null)}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`flex items-center justify-between p-2 rounded-md border transition-all bg-white ${isDragging
                    ? 'opacity-40 border-dashed border-blue-500'
                    : isOver
                      ? 'border-2 border-blue-500 shadow-md transform scale-[1.01]'
                      : 'border-gray-200 hover:border-gray-300 shadow-2xs'
                    }`}>
                  {/* Left: Drag Handle, Position Badge, Thumbnail & Titles */}
                  <div className='flex items-center gap-2.5 min-w-0 flex-1'>
                    {/* Drag Handle */}
                    <div
                      className='cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 px-1 select-none text-base'
                      title='Drag to reorder'>
                      ⋮⋮
                    </div>

                    {/* Order Number Badge */}
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${isExplicitlyOrdered
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-500'
                        }`}>
                      #{index + 1}
                    </span>

                    {/* Thumbnail Image */}
                    <div className='w-10 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200 relative'>
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={journal.couple_names}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-[10px] text-gray-400'>
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Titles */}
                    <div className='min-w-0 flex-1 pr-2'>
                      <div className='text-xs font-semibold text-gray-800 truncate'>
                        {journal.couple_names}
                      </div>
                      <div className='flex items-center gap-1.5 mt-0.5'>
                        <span className='text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded font-medium'>
                          {journal.location}
                        </span>
                        {!isExplicitlyOrdered && (
                          <span className='text-[10px] text-amber-600 font-medium italic'>
                            (Unlisted - bottom)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick Action Buttons */}
                  <div className='flex items-center gap-1 flex-shrink-0'>
                    <button
                      type='button'
                      onClick={() => moveItem(index, 'top')}
                      disabled={index === 0}
                      className='p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-xs font-semibold'
                      title='Move to top'>
                      ⏫
                    </button>
                    <button
                      type='button'
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className='p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-xs font-semibold'
                      title='Move up'>
                      🔼
                    </button>
                    <button
                      type='button'
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === displayedItems.length - 1}
                      className='p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-xs font-semibold'
                      title='Move down'>
                      🔽
                    </button>
                    <button
                      type='button'
                      onClick={() => moveItem(index, 'bottom')}
                      disabled={index === displayedItems.length - 1}
                      className='p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-xs font-semibold'
                      title='Move to bottom'>
                      ⏬
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }
);

export const JournalOrderField = JournalOrderFieldComponent as unknown as (
  props: JournalOrderFieldProps
) => React.ReactNode;
