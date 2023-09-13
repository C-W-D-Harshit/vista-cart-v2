import connectMongoDB from "@/libs/mongo/dbConnect";
import User from "@/models/user";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

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
      async authorize(credentials: any, req) {
        const { email, password } = credentials;
        // Connect to the MongoDB database
        await connectMongoDB();

        console.log(email);

        // Find the user by email in your database
        const user = await User.findOne({ email });

        if (
          user &&
          user.provider === "credentials" &&
          bcrypt.compareSync(password, user.password)
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
  },
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      await connectMongoDB();

      const email = user.email;

      const provider = account.provider;

      // check if already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        // User already exists, check if the provider is the same
        if (existingUser.provider !== provider) {
          throw new Error(
            "User is already registered with a different provider"
          );
        }
      } else {
        // User does not exist, create a new user
        await User.create({
          name: user.name,
          email: user.email,
          password: "randomString",
          provider,
        });
      }

      return user;
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
