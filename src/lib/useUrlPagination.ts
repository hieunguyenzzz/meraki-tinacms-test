'use client';

import { useCallback, useEffect, useState } from 'react';

const readPageFromUrl = () => {
  const value = Number(new URL(window.location.href).searchParams.get('page'));
  return Number.isInteger(value) && value > 0 ? value : 1;
};

const writePageToUrl = (page: number, mode: 'push' | 'replace') => {
  const url = new URL(window.location.href);

  if (page <= 1) {
    url.searchParams.delete('page');
  } else {
    url.searchParams.set('page', String(page));
  }

  window.history[`${mode}State`](
    null,
    '',
    `${url.pathname}${url.search}${url.hash}`
  );
};

export function useUrlPagination(totalPages: number, initialPage = 1) {
  const [requestedPage, setRequestedPage] = useState(initialPage);
  const lastPage = Math.max(totalPages, 1);
  const currentPage = Math.min(requestedPage, lastPage);

  useEffect(() => {
    const syncPageFromUrl = () => setRequestedPage(readPageFromUrl());

    syncPageFromUrl();
    window.addEventListener('popstate', syncPageFromUrl);

    return () => window.removeEventListener('popstate', syncPageFromUrl);
  }, []);

  useEffect(() => {
    if (requestedPage !== currentPage) {
      writePageToUrl(currentPage, 'replace');
      setRequestedPage(currentPage);
    }
  }, [currentPage, requestedPage]);

  const setPage = useCallback(
    (page: number) => {
      const nextPage = Math.min(Math.max(Math.trunc(page), 1), lastPage);
      if (nextPage === currentPage) return;

      writePageToUrl(nextPage, 'push');
      setRequestedPage(nextPage);
    },
    [currentPage, lastPage]
  );

  const resetPage = useCallback(() => {
    writePageToUrl(1, 'replace');
    setRequestedPage(1);
  }, []);

  return { currentPage, setPage, resetPage };
}
