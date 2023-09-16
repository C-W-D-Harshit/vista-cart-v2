import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import User from "@/models/user";
import { ForgotPasswordEmailTemplate } from "@/components/templates/email/Forgot-Password";
import connectMongoDB from "@/libs/mongo/dbConnect";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  // take email from user
  const { email }: { email: any } = await req.json();

  // if no email then throw error
  if (!email) {
    return NextResponse.json({
      success: false,
      message: "Please provide email",
    });
  }

  //connect to db
  await connectMongoDB();

  // check if user exists in DB
  const user = await User.findOne({ email });

  // throw error if user not found
  if (!user || user.provider !== "credentials") {
    return NextResponse.json({ error: "User not found" });
  }

  // create a password reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save({
    validateBeforeSave: false,
  });

  console.log(resetToken);

  // creating necessary fields
  var nameParts = user.name.split(" ");
  var firstName = nameParts[0];

  // now send email to user
  try {
    const data = await resend.emails.send({
      from: "Store <vista-cart@cleverdevloper.in>",
      to: [user.email],
      subject: "Forgot Password",
      react: ForgotPasswordEmailTemplate({ firstName, email, resetToken }),
    });
    // const message = `Password reset url sent to the email: ${user.email}`;
    return NextResponse.json({
      success: true,
      message: "Password reset url sent to the email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({
      validateBeforeSave: false,
    });
    return NextResponse.json({ error });
  }
}
