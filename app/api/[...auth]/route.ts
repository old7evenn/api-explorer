import { cookies } from 'next/headers';
import { User } from '../../auth/components/AuthProvider/AuthProvider';
import { NextResponse } from 'next/server';

interface RequestBody {
  user: User;
}

export async function POST(req: Request) {
  const { user }: RequestBody = await req.json();
  const cookie = cookies();

  if (!user) {
    cookie.set('uid', '', { httpOnly: true, secure: true, path: '/' });
    return NextResponse.json({ message: 'Token removed' });
  }

  cookie.set('uid', user.uid, { httpOnly: true, secure: true, path: '/' });
  return NextResponse.json({ message: 'Token set', token: user.uid });
}

export async function GET(req: Request) {
  const token = cookies().get('uid')?.value;

  if (token) {
    return NextResponse.json({ message: 'Token found', token });
  } else {
    return NextResponse.json({ message: 'No token found' });
  }
}
