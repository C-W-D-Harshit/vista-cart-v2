import connectMongoDB from "@/libs/mongo/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import ApiFeatures from "@/utils/apiFeatures";
import Product from "@/models/product";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import SessionChecker from "@/libs/session/SessionChecker";
import QueryMaker from "@/libs/query/QueryMaker";
import { checkRateLimit } from "@/utils/ratelimit";

export async function POST(req: NextRequest) {
  // first take body
  const body = await req.json();
  return NextResponse.json(
    { message: "Registered Successfully!" },
    { status: 201 }
  );
}

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
  const features = new ApiFeatures(Product.find(), query)
    .filter()
    .sort()
    .paginate()
    .search();
  const rpp = process.env.RPP as any;
  const products = await features.query;
  const totalProduct = await Product.find();
  const totalProducts = totalProduct.length;
  const totalPages = Math.ceil(totalProducts / (rpp || 8));
  const numOfResults = products.length;
  // console.log(products);
  return NextResponse.json(
    { success: true, products, numOfResults, totalPages, totalProducts },
    { status: 200 }
  );
}
