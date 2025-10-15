import { getPaginationPages } from '@/common/utils/getPaginationPages'
import s from './Pagination.module.css'

type Props = {
  currentPage: number
  setCurrentPage: (page: number) => void
  size: number
  changePageSize: (size: number) => void
  pagesCount: number
}

export const Pagination = ({ currentPage, setCurrentPage, size, changePageSize, pagesCount }: Props) => {
  if (pagesCount <= 1) return null
  const pages = getPaginationPages(currentPage, pagesCount)

  return (
    <div className={s.container}>
      <div className={s.pagination}>
        {pages.map((page, idx) =>
          page === '...' ? (
            <span className={s.ellipsis} key={`ellipsis-${idx}`}>
              ...
            </span>
          ) : (
            <button
              key={page}
              className={page === currentPage ? `${s.pageButton} ${s.pageButtonActive}` : s.pageButton}
              onClick={() => page !== currentPage && setCurrentPage(Number(page))}
              disabled={page === currentPage}
              type="button"
            >
              {page}
            </button>
          ),
        )}
      </div>
        <label>
        Show
        <select value={size} onChange={e => changePageSize(Number(e.target.value))}>
          {[2, 4, 8, 16, 32].map(size => (
            <option value={size} key={size}>
              {size}
            </option>
          ))}
        </select>
        per page
      </label>
    </div>
  )
}
