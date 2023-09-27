import QueryMaker from "@/libs/query/QueryMaker";
import SessionChecker from "@/libs/session/SessionChecker";
import Order from "@/models/order";
import ApiFeatures from "@/utils/apiFeatures";
import { checkRateLimit } from "@/utils/ratelimit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  // check for admin
  const isAdminAuthorized = await SessionChecker({ role: "admin" });

  if (isAdminAuthorized !== true) {
    return isAdminAuthorized;
  }

  // take query
  const query = await QueryMaker(req);

  // then do the rest simple work
  const features = new ApiFeatures(
    Order.find({
      userID: id,
    }).select(" -createdAt -updatedAt"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .search();
  const rpp = process.env.RPP as any;
  const orders = await features.query;
  const totalOrders: number = orders.length;
  const totalPages =
    totalOrders === 0 ? 0 : Math.ceil(totalOrders / (rpp || 8));
  const numOfResults = orders.length;
  // console.log(orders);
  return NextResponse.json(
    { success: true, orders, numOfResults, totalPages, totalOrders },
    { status: 200 }
  );
}
