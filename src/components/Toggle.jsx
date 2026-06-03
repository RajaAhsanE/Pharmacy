import { useState } from "react";

export default function Toggle({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <span
      className={`switch${on ? " on" : ""}`}
      onClick={() => setOn((v) => !v)}
      role="switch"
      aria-checked={on}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOn((v) => !v);
        }
      }}
    >
      <span className="knob" />
    </span>
  );
}
