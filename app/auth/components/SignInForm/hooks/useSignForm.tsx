import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { usePostSingInMutation } from '@/utils/api';

import { useStage } from '../../../contexts';
import { signInSchema } from '../constants';

interface SignInForm {
  email: string;
  password: string;
}

export const useSignInForm = () => {
  const router = useRouter();
  const { setStage } = useStage();

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const postSignInMutation = usePostSingInMutation();

  // const onSubmit = signInForm.handleSubmit(async values => {
  // 	const postSignInResponse = await postSignInMutation.mutateAsync(values)
  // })
};
