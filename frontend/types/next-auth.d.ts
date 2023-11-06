// types/next-auth.d.ts
import { Session } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      picture: string;
      provider: string;
    };
  }
}
