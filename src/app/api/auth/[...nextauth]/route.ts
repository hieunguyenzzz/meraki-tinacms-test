import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

// Auth.js configuration for TinaCMS backend
export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'repo user:email',
        },
      },
    }),
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      // Optional: Restrict access to specific GitHub users
      const allowedUsers = process.env.ALLOWED_GITHUB_USERS?.split(',') || [];
      
      if (allowedUsers.length > 0) {
        const githubUsername = (profile as any)?.login;
        if (!githubUsername || !allowedUsers.includes(githubUsername)) {
          console.warn(`Access denied for user: ${githubUsername}`);
          return false;
        }
      }
      
      return true;
    },
    
    async jwt({ token, account, profile }) {
      // Persist GitHub access token for Git operations
      if (account) {
        token.accessToken = account.access_token;
        token.githubUsername = (profile as any)?.login;
      }
      return token;
    },
    
    async session({ session, token }) {
      // Make GitHub token and username available in session
      (session as any).accessToken = token.accessToken;
      (session as any).githubUsername = token.githubUsername;
      return session;
    },
  },
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
