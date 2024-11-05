import { GoogleOutlined, LoadingOutlined } from '@ant-design/icons';

import { Button } from '@/components/ui';

import { useAuth } from '../AuthProvider/AuthProvider';
interface AuthButtonsContainerProps {
  loading: boolean;
}

export const AuthButtonsContainer: React.FC<AuthButtonsContainerProps> = ({
  loading,
}) => {
  const auth = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          type="button"
          disabled={loading}
          onClick={auth?.loginGoogle}
        >
          {loading ? (
            <LoadingOutlined className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GoogleOutlined className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>
      </div>
    </div>
  );
};
