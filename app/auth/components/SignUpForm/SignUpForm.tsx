import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Label,
  PasswordInput,
} from '@/components/ui';

import { useStage } from '../../contexts';
import { AuthButtonsContainer } from '../AuthButtonsContainer/AuthButtonsContainer';
import { useAuth } from '../AuthProvider/AuthProvider';

import { signUpSchema } from './constants';

export interface SignUpFormProps {
  email: string;
  password: string;
  name: string;
}

export default function SignInForm() {
  const [state, setState] = useState({ loading: false });
  const [error, setError] = useState('');
  const auth = useAuth();
  const stage = useStage();

  const signUpForm = useForm<SignUpFormProps>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const onSubmit = async (data: SignUpFormProps) => {
    setState(state => ({ ...state, loading: true }));
    auth
      ?.registerWithEmailAndPasswor(data)
      .then(() => {
        setState(state => ({ ...state, loading: false }));
      })
      .catch(error => {
        console.error('Error sig up:', error);
        setState(state => ({ ...state, loading: false }));
        setError('email already in use');
        setTimeout(() => {
          setError('');
        }, 3000);
      });
  };

  return (
    <FormProvider {...signUpForm}>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email, password, and name
          </p>
        </div>
        <div className="grid gap-2">
          <Form {...signUpForm}>
            <form
              onSubmit={signUpForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={signUpForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label className="sr-only" htmlFor="email">
                      Email
                    </Label>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="email@example.com"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={state.loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label className="sr-only" htmlFor="password">
                      Password
                    </Label>
                    <FormControl>
                      <PasswordInput
                        id="password"
                        placeholder="your very secret password"
                        autoCapitalize="none"
                        autoComplete="password"
                        autoCorrect="off"
                        disabled={state.loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label className="sr-only" htmlFor="name">
                      Name
                    </Label>
                    <FormControl>
                      <Input
                        id="name"
                        placeholder="enter your name"
                        autoCorrect="off"
                        disabled={state.loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <div className="text-red-500 text-center text-xs">{error}</div>
              )}
              <Button type="submit" disabled={state.loading} className="w-full">
                Sign up
              </Button>
            </form>
          </Form>

          <div className="flex justify-center">
            <Button
              disabled={state.loading}
              variant="link"
              onClick={() => stage.setStage('signIn')}
            >
              <span className="bg-background px-2 text-muted-foreground">
                have account already
              </span>
            </Button>
          </div>
          <AuthButtonsContainer loading={state.loading} />
        </div>
      </div>
    </FormProvider>
  );
}
