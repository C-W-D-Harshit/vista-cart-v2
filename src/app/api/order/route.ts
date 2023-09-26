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
        }
      })
    );

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
