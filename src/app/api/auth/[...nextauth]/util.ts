import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import UserModel, { User } from '@/lib/mongo/models/UserModel';
import _ from 'lodash';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // if (account) {
      //   token.accessToken = account.access_token;
      //   token.id = profile?.sub;
      // }
      // return token;

      if (account) {
        token.accessToken = account.access_token;
        token.user = user;
      }
      return token;
    },
    async session({ session }) {
      try {
        // if (!session?.user?.email) {
        //   return session;
        // }
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Database operation timed out')), 10000);
        });
        const dbOperation = async () => {
          let user: User | null = await UserModel.findOne({
            email: session.user.email,
          }).lean();
          if (!user) {
            user = await UserModel.create({
              email: session.user.email,
              name: session.user.name,
              image: session.user.image,
            });
          }
          return {
            ...session.user,
            ..._.pick(user, ['_id', 'name', 'email', 'image']),
            id: user._id.toString(),
            lol: '123',
          };
        };

        try {
          session.user = (await Promise.race([dbOperation(), timeoutPromise])) as any;
        } catch (dbError) {
          console.error('Database operation failed or timed out:', dbError);
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        // Return session without additional user data from database
        return session;
      }
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};
