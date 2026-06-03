import Icon from "./Icon";

export default function Button({
  variant = "primary",
  icon,
  children,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button type={type} className={`btn btn-${variant} ${className}`.trim()} {...props}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
}
