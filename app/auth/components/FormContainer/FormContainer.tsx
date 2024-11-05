'use client';

import { useEffect, useState } from 'react';
import { useStage } from '../../contexts';
import SignInForm from '../SignInForm/SignInForm';
import SignUpForm from '../SignUpForm/SignUpForm';
import { auth } from '@/utils/services/firebase';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';

type User = {
  email: string | null;
};

export const FormContainer = () => {
  const { stage } = useStage();
  const navigate = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, currentUser => {
      console.log(currentUser);

      if (currentUser?.getIdToken()) {
        navigate.push('/');
      }
    });
  }, [auth.currentUser]);

  //  auth.createSessionCookie(idToken, { expiresIn })
  //  .then(
  //    sessionCookie => {
  //      const options = { maxAge: expiresIn, httpOnly: true, secure: true };
  //      res.cookie('session', sessionCookie, options);
  //      res.end(JSON.stringify({ status: 'success' }));
  //    },
  //    error => {
  //      res.status(401).send('UNAUTHORIZED REQUEST!');
  //    }
  //  );

  return (
    <>
      {stage === 'signIn' && <SignInForm />}
      {stage === 'signUp' && <SignUpForm />}
    </>
  );
};
