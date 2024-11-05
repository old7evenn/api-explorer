import { Button } from 'antd';

export const Toggle: React.FC<ToggleProps> = ({ children, onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="toggle hover:bg-black hover:border-black hover:text-white"
    >
      {children}
    </Button>
  );
};
