export const Input = ({ className, ...props }) => {
    return (
      <input
        className={`w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
        {...props}
      />
    );
  };
  