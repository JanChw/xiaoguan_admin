export interface Pagination {
    total: number;
    pageSize: number;
    defaultPageSize: number,
    currentPage: number,
    defaultCurrentPage: number
}

export const initPagination = () => ({
  total: 0,
  pageSize: 15,
  defaultPageSize:15,
  currentPage:1,
  defaultCurrentPage:1
})