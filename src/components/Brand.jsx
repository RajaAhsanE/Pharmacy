import Icon from "./Icon";

export default function Brand({ onClick, markSize = 22 }) {
  const inner = (
    <>
      <div className="brand-mark">
        <Icon name="capsule" size={markSize} />
      </div>
      <div className="brand-text">
        <div className="brand-name">Pharmacy</div>
        <div className="brand-sub">Audio Analyzer</div>
      </div>
    </>
  );

  if (onClick) {
    return (
      <div
        className="brand"
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        {inner}
      </div>
    );
  }

  return <div className="brand">{inner}</div>;
}
