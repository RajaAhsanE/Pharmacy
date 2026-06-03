export default function CellList({ items }) {
  if (!items || !items.length) {
    return <span className="cell-empty">—</span>;
  }

  const truncate = (text, max = 90) =>
    text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;

  return (
    <ul className="cell-list">
      {items.slice(0, 2).map((item, i) => (
        <li key={i}>{truncate(item)}</li>
      ))}
      {items.length > 2 && (
        <li className="cell-more">+{items.length - 2} de plus</li>
      )}
    </ul>
  );
}
