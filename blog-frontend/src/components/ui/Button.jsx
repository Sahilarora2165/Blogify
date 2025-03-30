export const Button = ({ children, variant, className, ...props }) => {
    return (
      <button
        className={`px-4 py-2 rounded-lg ${variant === "outline" ? "border" : "bg-blue-600 text-white"} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  