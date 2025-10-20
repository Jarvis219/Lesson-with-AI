"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface InfiniteScrollProps {
  children: ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading?: boolean;
  loader?: ReactNode;
  endMessage?: ReactNode;
  className?: string;
}

export function InfiniteScroll({
  children,
  onLoadMore,
  hasMore,
  isLoading = false,
  loader,
  endMessage,
  className = "",
}: InfiniteScrollProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, []);

  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [isIntersecting, hasMore, isLoading, onLoadMore]);

  return (
    <div className={className}>
      {children}
      <div ref={observerTarget} className="py-4">
        {isLoading &&
          (loader || (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading more...</span>
            </div>
          ))}
        {!hasMore && !isLoading && endMessage && (
          <div className="text-center text-gray-500 py-4">{endMessage}</div>
        )}
      </div>
    </div>
  );
}
