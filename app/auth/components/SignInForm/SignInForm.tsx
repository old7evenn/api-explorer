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

import { signInSchema } from './constants';

export interface SignInFormProps {
  email: string;
  password: string;
}

export default function SignInForm() {
  const [state, setState] = useState({ loading: false });
  const [error, setError] = useState('');
  const stage = useStage();
  const auth = useAuth();

  const signInForm = useForm<SignInFormProps>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormProps) => {
    setState(state => ({ ...state, loading: true }));
    auth
      ?.loginEmailAndPassword(data)
      .then(() => {
        setState(state => ({ ...state, loading: false }));
      })
      .catch(error => {
        console.error('Error logging in:', error);
        setState(state => ({ ...state, loading: false }));
        setError('invalid email or password');
        setTimeout(() => {
          setError('');
        }, 3000);
      });
  };

  return (
    <FormProvider {...signInForm}>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] ">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Login to your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password
          </p>
        </div>
        <div className="grid gap-2">
          <Form {...signInForm}>
            <form
              onSubmit={event => {
                event.preventDefault();
                signInForm.handleSubmit(onSubmit)();
              }}
              className="space-y-4"
            >
              <FormField
                control={signInForm.control}
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
                control={signInForm.control}
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
              <div>
                {error && (
                  <p className="text-red-500 text-center text-xs">{error}</p>
                )}
              </div>
              <Button type="submit" disabled={state.loading} className="w-full">
                Sign in
              </Button>
            </form>
          </Form>

          <div className="flex justify-center ">
            <Button
              disabled={state.loading}
              variant="link"
              onClick={() => stage.setStage('signUp')}
            >
              <span className="bg-background px-2 text-muted-foreground">
                create new account
              </span>
            </Button>
          </div>
          <AuthButtonsContainer loading={state.loading} />
        </div>
      </div>
    </FormProvider>
  );
}
