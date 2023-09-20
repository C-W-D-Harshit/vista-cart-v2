import { NextRequestWithAuth } from "next-auth/middleware";
import connectMongoDB from "@/libs/mongo/dbConnect";
import User from "@/models/user";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import requestIp from "request-ip";
import ip from "ip";
import { checkRateLimit, rateLimiter } from "@/utils/ratelimit";
import { NextResponse } from "next/server";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req: any) {
        const { email, password } = credentials;

        // rate limit
        await checkRateLimit();

        // Connect to the MongoDB database
        await connectMongoDB();

        // Find the user by email in your database
        const user = await User.findOne({
          email,
          active: true,
        });

        if (!user) {
          throw new Error("User not found!");
        }
        // if (!user.verified) throw new Error("Please verify your email first!");

        if (user.status === "blocked") {
          throw new Error("Your account is blocked!");
        }
        if (user.provider !== "credentials") {
          throw new Error(
            "Your email is already registered with a different provider"
          );
        }

        // If the user exists, compare the passwords

        const matchPass = bcrypt.compareSync(password, user.password);
        if (!matchPass) throw new Error("Email or Password did'nt match!");

        if (
          user &&
          user.status !== "blocked" &&
          user.provider === "credentials" &&
          matchPass
        ) {
          // Passwords match, return the user object
          return user;
        } else {
          // If credentials are invalid, return null
          return null;
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
    // newUser: "/auth/new",
  },
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      await connectMongoDB();

      const email = user.email;

      const provider = account.provider;

      // check if already exists
      const existingUser = await User.findOne({ email, active: true });

      if (existingUser) {
        // User already exists, check if the provider is the same
        if (existingUser.provider !== provider) {
          throw new Error(
            "Your email is already registered with a different provider"
          );
        }
        if (existingUser.status === "blocked") {
          throw new Error("Your account is blocked!");
        }
      } else {
        // User does not exist, create a new user
        await User.create({
          name: user.name,
          email: user.email,
          password: "randomString",
          provider,
          verified: true,
        });
      }

      return user;
    },
    async jwt({
      token,
      user,
      session,
      trigger,
    }: {
      token: any;
      user: any;
      session: any;
      trigger: any;
    }) {
      if (trigger === "update" && session?.verified) {
        token.verified = session.verified;
      }
      if (user) {
        // first connect db
        await connectMongoDB();

        // find user through email
        const email = user.email;
        const user_ = await User.findOne({ email });

        // assining role
        // token.role = user_.role;
        return {
          ...token,
          id: user_._id,
          role: user_.role,
          verified: user_.verified,
        };
      }

      return token;
    },
    async session({
      token,
      user,
      session,
    }: {
      token: any;
      user: any;
      session: any;
    }) {
      // console.log("session callback", { session, token, user });

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          verified: token.verified,
        },
      };
    },
  },
  // callbacks: {
  //   async signIn({ user, account }: { user: any; account: any }) {
  //     // gaining info
  //     const { email, password } = user;
  //     // connect db
  //     await connectMongoDB();

  //     // check if user exists
  //     const isUserExists = await User.findOne({ email });

  //     if (isUserExists) {
  //       console.log("User Exists");
  //     }
  //   },
  // },
};
