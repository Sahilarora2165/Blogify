export const Textarea = ({ className, ...props }) => {
    return (
      <textarea
        className={`w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 resize-none ${className}`}
        {...props}
      />
    );
  };

  