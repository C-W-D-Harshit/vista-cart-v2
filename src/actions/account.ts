"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import connectMongoDB from "@/libs/mongo/dbConnect";
import User from "@/models/user";
import { getServerSession } from "next-auth";

export async function getUserData() {
  //get user id from session
  const session = await getServerSession(authOptions);
  const userID = session?.user.id;

  // connect db
  await connectMongoDB();

  // find user
  let user = await User.findById(userID);

  if (!user) throw new Error("User not found!");

  return user;
}
