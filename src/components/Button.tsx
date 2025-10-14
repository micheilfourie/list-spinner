type ButtonProps = {
  children: React.ReactNode;
  action?: () => void;
  icon?: React.ReactNode;
  isFullWidth?: boolean;
};

const Button = ({ children, action, icon, isFullWidth }: ButtonProps) => {
  return (
    <button
      onClick={action}
      className={`cursor-pointer ${isFullWidth && "w-full"} text-dark rounded-lg bg-white px-3 py-2 text-sm font-semibold tracking-wider`}
    >
      {icon} {children}
    </button>
  );
};

export default Button;
