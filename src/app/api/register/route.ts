import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectMongoDB from "@/libs/mongo/dbConnect";
import { z } from "zod";
import { Resend } from "resend";
import { NewArrivalEmailTemplate } from "@/components/templates/email/New-Arrival";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password should have at least 8 characters"),
  name: z
    .string()
    .min(3, "Name should have at least 3 characters")
    .max(50, "Name should have at most 50 characters"),
});

type SignUpData = z.infer<typeof signUpSchema>;

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let name;
    let email;
    let password;

    try {
      const response = signUpSchema.parse(body);
      name = response.name;
      email = response.email;
      password = response.password;
    } catch (validationError: any) {
      return NextResponse.json(
        {
          message: "Validation error: " + validationError.message,
        },
        {
          status: 400,
        }
      );
    }

    await connectMongoDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already exists!",
        },
        {
          status: 400,
        }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user after all checks
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "credentials",
    });

    // creating necessary fields
    var nameParts = user.name.split(" ");
    const firstName: string = nameParts[0];

    try {
      const data = await resend.emails.send({
        from: "Store <vista-cart@cleverdevloper.in>",
        to: [user.email],
        subject: "Welcome to Vista Cart!",
        react: NewArrivalEmailTemplate({ firstName }),
      });
    } catch (error) {
      return NextResponse.json({ error });
    }

    return NextResponse.json(
      { message: "Registered Successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return NextResponse.json(
      {
        message: "An error occurred while registering the user!",
      },
      {
        status: 500,
      }
    );
  }
}
