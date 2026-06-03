const PAGE_SIZE = 10;

export { PAGE_SIZE };

export default function Pagination({ total, page, onChange, perPage = PAGE_SIZE }) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * perPage;

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <span className="pag-info">
        Showing {offset + 1}–{Math.min(offset + perPage, total)} of {total}
      </span>
      <div className="pag-controls">
        <button
          type="button"
          className="pag-btn"
          disabled={currentPage <= 1}
          onClick={() => onChange(currentPage - 1)}
        >
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            className={`pag-btn${n === currentPage ? " pag-active" : ""}`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          className="pag-btn"
          disabled={currentPage >= totalPages}
          onClick={() => onChange(currentPage + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
}
