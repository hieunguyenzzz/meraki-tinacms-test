import type { MouseEvent } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /**
   * When provided, the controls render as real anchors so crawlers (and
   * middle/cmd-click) can reach every page. Plain clicks are still handled
   * in-page via onPageChange.
   */
  buildHref?: (page: number) => string;
}

const isModifiedClick = (event: MouseEvent<HTMLAnchorElement>) =>
  event.metaKey ||
  event.ctrlKey ||
  event.shiftKey ||
  event.altKey ||
  event.button !== 0;

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  buildHref,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const control = (
    page: number,
    label: string,
    className: string,
    ariaLabel?: string
  ) =>
    buildHref ? (
      <a
        key={label}
        href={buildHref(page)}
        onClick={(event) => {
          if (isModifiedClick(event)) return;
          event.preventDefault();
          onPageChange(page);
        }}
        className={className}
        aria-label={ariaLabel}>
        {label}
      </a>
    ) : (
      <button
        key={label}
        onClick={() => onPageChange(page)}
        className={className}
        aria-label={ariaLabel}>
        {label}
      </button>
    );

  return (
    <section className='py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-center gap-2'>
          {/* Previous button */}
          {currentPage > 1 &&
            control(
              currentPage - 1,
              '‹',
              'w-8 h-8 flex items-center justify-center hover:bg-background-1 text-text-secondary text-body-sm transition-colors',
              'Previous page'
            )}

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) =>
            control(
              pageNum,
              String(pageNum),
              `w-8 h-8 flex items-center justify-center text-body-sm transition-colors ${
                currentPage === pageNum
                  ? 'bg-background-2 text-text-primary'
                  : 'hover:bg-background-1 text-text-secondary'
              }`
            )
          )}

          {/* Next button */}
          {currentPage < totalPages &&
            control(
              currentPage + 1,
              '›',
              'w-8 h-8 flex items-center justify-center hover:bg-background-1 text-text-secondary text-body-sm transition-colors',
              'Next page'
            )}
        </div>
      </div>
    </section>
  );
}
