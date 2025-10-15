"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminLessons } from "@/context/admin-lessons-context";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminLessonsPagination() {
  const {
    pagination,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
  } = useAdminLessons();

  if (!pagination) {
    return null;
  }

  const { totalPages, totalItems, hasNextPage, hasPrevPage } = pagination;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: string) => {
    setItemsPerPage(parseInt(items));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-3 sm:p-4 mt-4 sm:mt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
              Items per page:
            </span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-16 sm:w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="text-xs sm:text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
            lessons
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className="h-8 w-8 sm:h-9 sm:w-9 p-0">
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>

          <div className="flex items-center gap-1 sm:gap-2">
            {getVisiblePages().map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <span className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-500">
                    ...
                  </span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page as number)}
                    className="w-8 sm:w-10 h-8 sm:h-9 text-xs sm:text-sm">
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="h-8 w-8 sm:h-9 sm:w-9 p-0">
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
