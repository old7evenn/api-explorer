import { useRouter } from 'next/navigation';
import { useStage } from '../../../contexts';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '../constants';
import { useForm } from 'react-hook-form';
import { usePostSingInMutation } from '@/utils/api';

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
