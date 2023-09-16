import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const data = await resend.emails.send({
      from: "Harshit <vista-cart@cleverdevloper.in>",
      to: ["dynamitegamer1405@gmail.com"],
      subject: "Hello world",
      react: EmailTemplate({ firstName: "John" }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
