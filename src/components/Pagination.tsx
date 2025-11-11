interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <section className='py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-center gap-2'>
          {/* Previous button */}
          {currentPage > 1 && (
            <button
              onClick={() => onPageChange(currentPage - 1)}
              className='w-8 h-8 flex items-center justify-center hover:bg-background-1 text-text-secondary text-body-sm transition-colors'
              aria-label='Previous page'>
              ‹
            </button>
          )}

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 flex items-center justify-center text-body-sm transition-colors ${
                currentPage === pageNum
                  ? 'bg-background-2 text-text-primary'
                  : 'hover:bg-background-1 text-text-secondary'
              }`}>
              {pageNum}
            </button>
          ))}

          {/* Next button */}
          {currentPage < totalPages && (
            <button
              onClick={() => onPageChange(currentPage + 1)}
              className='w-8 h-8 flex items-center justify-center hover:bg-background-1 text-text-secondary text-body-sm transition-colors'
              aria-label='Next page'>
              ›
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
