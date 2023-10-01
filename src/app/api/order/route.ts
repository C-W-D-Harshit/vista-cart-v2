import { NextRequest, NextResponse } from "next/server";
import SessionChecker from "@/libs/session/SessionChecker";
import { checkRateLimit } from "@/utils/ratelimit";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { addressSchema } from "@/zod/schema";
import Order from "@/models/order";
import { resend } from "../user/register/route";
import User from "@/models/user";
import { OrderCompletedEmailTemplate } from "@/components/templates/email/Order-Completed";
import Product from "@/models/product";
import connectMongoDB from "@/libs/mongo/dbConnect";
import QueryMaker from "@/libs/query/QueryMaker";
import ApiFeatures from "@/utils/apiFeatures";

export async function POST(req: NextRequest) {
  // rate limit
  try {
    await checkRateLimit();
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Too many requests",
    });
  }
  // first check for session
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      success: false,
      message: "You are not authorized to perform this action!",
    });
  }

  try {
    const body: any = await req.json();
    const response: any = addressSchema.parse(body.address);
    const { userID } = body;

    // first connect DB
    await connectMongoDB();

    // find user
    const user = await User.findById(userID);

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    var nameParts = user.name.split(" ");
    var firstName = nameParts[0];
    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so we add 1
      const year = date.getFullYear().toString();

      return day + month + year;
    };
    const orderDate = formatDate(new Date());

    // now create order
    const order = await Order.create(body);

    // send email
    const data = await resend.emails.send({
      from: "Store <vista-cart@cleverdevloper.in>",
      to: [user.email],
      subject: "Order Completed",
      react: OrderCompletedEmailTemplate({
        firstName,
        email: user.email,
        transactionId: order.paymentID,
        orderId: order._id,
        paymentMethod: order.paymentMethod,
        totalPrice: order.totalPrice,
        orderDate,
      }),
    });

    await Promise.all(
      order.products.map(async (orderProduct: any) => {
        // Find the current product
        const currentProduct = await Product.findById(orderProduct.productId);

        // Update the stock based on the current product state
        if (currentProduct) {
          currentProduct.stock -= orderProduct.quantity;
          await currentProduct.save();
        } else {
          return NextResponse.json({
            success: false,
            message: "Product not found",
          });
        }
      })
    );

    user.phoneNumber = order.address.phoneNumber;
    user.address = order.address;

    await user.save();

    // execute the order
    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
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
  const features = new ApiFeatures(Order.find(), query)
    .filter()
    .sort()
    .paginate()
    .searchOrder();
  const rpp = process.env.RPP as any;
  const orders = await features.query;
  const totalOrder = await Order.find();
  const totalOrders = totalOrder.length;
  const totalPages = Math.ceil(totalOrders / (rpp || 8));
  const numOfResults = orders.length;
  // console.log(orders);
  return NextResponse.json(
    { success: true, orders, numOfResults, totalPages, totalOrders },
    { status: 200 }
  );
}
