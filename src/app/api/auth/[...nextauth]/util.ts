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
    // async jwt({ token, account, profile }) {
    //   if (account) {
    //     token.accessToken = account.access_token;
    //     token.id = profile?.sub;
    //   }
    //   return token;
    // },
    async session({ session }) {
      try {
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
            ..._.pick(user, ['name', 'email', 'image']),
            id: user._id.toString(),
            lol: '123',
          };
        };
        // Race between timeout and database operation
        try {
          session.user = await dbOperation();
        } catch (dbError) {
          console.error('Database operation failed or timed out:', dbError);
          // Return session with original user data if DB operation fails
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
