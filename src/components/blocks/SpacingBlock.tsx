'use client';

interface SpacingBlockData {
  size?: string;
}

interface SpacingBlockProps {
  data: SpacingBlockData;
}

export default function SpacingBlock({ data }: SpacingBlockProps) {
  const size = data.size || 'md';
  const heightClass =
    size === 'sm'
      ? 'h-6'
      : size === 'lg'
      ? 'h-18'
      : size === 'xl'
      ? 'h-24'
      : 'h-12';

  return <div className={heightClass} aria-hidden='true' />;
}
