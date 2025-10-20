import { IPagination } from "@/types/pagination";

export const PAGINATION_DEFAULT: IPagination = {
  hasNextPage: false,
  hasPreviousPage: false,
  limit: 10,
  page: 1,
  total: 0,
  totalPage: 0,
};
