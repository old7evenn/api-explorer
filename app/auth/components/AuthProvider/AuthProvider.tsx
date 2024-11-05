'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';
import { auth, db } from '@/utils/services/firebase';
import { SignUpFormProps } from '../SignUpForm/SignUpForm';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { toast } from 'sonner';

export interface User {
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
  uid: string;
}

type AuthContextType = {
  user: User | null;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loginEmailAndPassword: (data: SignInFormProps) => Promise<void>;
  registerWithEmailAndPasswor: (data: SignUpFormProps) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!auth) return;

    return auth.onAuthStateChanged(async user => {
      if (!user) {
        await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: null }),
        });
        setUser(null);
        return;
      }

      await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });

      setUser(user);
    });
  }, []);

  const loginGoogle = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!auth || !db) {
        reject(new Error('Firebase auth or database not initialized'));
        return;
      }
      
      signInWithPopup(auth, new GoogleAuthProvider())
      .then(async (res: UserCredential) => {
        const user = res.user;
        
        const userQuery = query(
          collection(db, 'users'),
          where('uid', '==', user.uid)
        );
        const querySnapshot = await getDocs(userQuery);
        
        toast('Successfully logged in');
        if (querySnapshot.empty) {
          await addDoc(collection(db, 'users'), {
            uid: user.uid,
            name: user.displayName,
            authProvider: 'google',
            email: user.email,
            createAt: new Date().toISOString(),
          });
        } else {
          console.log('User already exists in Firestore.');
        }
        
        resolve();
      })
        .catch(error => {
          console.error('Error logging in:', error);
          reject(error);
        });
    });
  };

  const loginEmailAndPassword = async (
    data: SignInFormProps
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!auth) {
        reject();
        return;
      }

      signInWithEmailAndPassword(auth, data.email, data.password)
        .then(() => {
          toast('Successfully logged in.');
          resolve();
        })
        .catch(error => {
          console.error('Error logging in:', error);
          reject(error);
        });
    });
  };

  const registerWithEmailAndPasswor = async (
    data: SignUpFormProps
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!auth) {
        reject();
        return;
      }

      createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async (res: UserCredential) => {
          const user = res.user;

          try {
            await addDoc(collection(db, 'users'), {
              uid: user.uid,
              name: data.name,
              email: data.email,
              authProvider: 'local',
              createdAt: new Date().toISOString(),
            });
            toast('Successfully signed up.');
            resolve();
          } catch (error) {
            console.error('Error saving user to Firestore:', error);
            reject(error);
          }
        })
        .catch(error => {
          console.error(':', error);
          reject(error);
        });
    });
  };

  const logout = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!auth) {
        reject();
        return;
      }

      auth
        .signOut()
        .then(() => {
          toast('Logged out successfully.');
          resolve();
        })
        .catch(error => {
          console.error('error logging out:', error);
          reject();
        });
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginGoogle,
        logout,
        loginEmailAndPassword,
        registerWithEmailAndPasswor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
