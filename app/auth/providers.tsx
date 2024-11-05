'use client';

import { StageProvider, StageProviderProps } from './contexts';

interface ProviterProps {
  children: React.ReactNode;
  stage: Omit<StageProviderProps, 'children'>;
}

const Providers: React.FC<ProviterProps> = ({ children, stage }) => {
  return <StageProvider {...stage}>{children}</StageProvider>;
};

export default Providers;
