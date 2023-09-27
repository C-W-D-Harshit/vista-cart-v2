import connectMongoDB from "@/libs/mongo/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import ApiFeatures from "@/utils/apiFeatures";
import QueryMaker from "@/libs/query/QueryMaker";
import User from "@/models/user";
import SessionChecker from "@/libs/session/SessionChecker";
import { checkRateLimit } from "@/utils/ratelimit";

export async function GET(req: NextRequest) {
  // check for admin
  const isAdminAuthorized = await SessionChecker({ role: "admin" });

  if (isAdminAuthorized !== true) {
    return isAdminAuthorized;
  }
  // first connect DB
  await connectMongoDB();

  // take query
  const query = await QueryMaker(req);

  // then do the rest simple work
  const features = new ApiFeatures(
    User.find().select(" -createdAt -updatedAt -passwordChangedAt"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .search();
  const rpp = process.env.RPP as any;
  const users = await features.query;
  const totalUsers: number = users.length;
  const totalPages = totalUsers === 0 ? 0 : Math.ceil(totalUsers / (rpp || 8));
  const numOfResults = users.length;
  // console.log(users);
  return NextResponse.json(
    { success: true, users, numOfResults, totalPages, totalUsers },
    { status: 200 }
  );
}
