import connectMongoDB from "@/libs/mongo/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import ApiFeatures from "@/utils/apiFeatures";
import Product from "@/models/product";
import QueryMaker from "@/libs/query/QueryMaker";
import requestIp from "request-ip";
import ip from "ip";

export async function GET(req: NextRequest) {
  // rate limit
  const ipp = ip.address();
  // first connect DB
  await connectMongoDB();

  // take query
  const query = await QueryMaker(req);

  // then do the rest simple work
  const features = new ApiFeatures(
    Product.find({
      status: "published",
    }).select(" -featuredExpiry -createdAt -updatedAt -description"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .search();
  const rpp = process.env.RPP as any;
  const products = await features.query;
  const totalProducts: number = products.length;
  const totalPages =
    totalProducts === 0 ? 0 : Math.ceil(totalProducts / (rpp || 8));
  const numOfResults = products.length;
  // console.log(products);
  return NextResponse.json(
    { success: true, products, numOfResults, totalPages, totalProducts },
    { status: 200 }
  );
}
