import { Button, Separator } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/options";
import connectMongoDB from "@/libs/mongo/dbConnect";
import User from "@/models/user";
import { revalidatePath } from "next/cache";
import toast from "react-hot-toast";
import SubmitButton from "@/components/ui/user/account/Button";

async function getData() {
  //get user id from session
  const session = await getServerSession(authOptions);
  const userID = session?.user.id;

  console.log("userID", userID);

  // connect db
  await connectMongoDB();

  // find user
  const user = await User.findById(userID);

  if (!user) throw new Error("User not found!");

  return user;
}

const Page = async () => {
  const data = await getData();
  const handleSubmit = async (e: FormData) => {
    "use server";

    const name = e.get("name")?.toString();
    const phoneNumberString: any = e.get("phoneNumber")?.toString();
    const email = e.get("email")?.toString();
    const phoneNumber = parseFloat(phoneNumberString);
    const id = e.get("id")?.toString();

    const formData = {
      name,
      email,
      phoneNumber,
    };

    // connect db
    await connectMongoDB();

    // find user
    const user = await User.findById(id);

    if (!user) throw new Error("User not found!");

    // update user
    await User.findByIdAndUpdate(id, formData);
    revalidatePath("/account");
  };
  return (
    <form action={handleSubmit} className="account">
      <h2>Account Details</h2>
      <p>
        Manage your <strong>Vista Cart</strong> profile here...
      </p>
      <Separator size={"4"} mb={"4"} mt={"4"} />
      <div className="account_">
        <div className="accountDetails_inp">
          <p>Full name</p>
          <input
            type="text"
            placeholder="Enter your full name..."
            defaultValue={data?.name}
            name="name"
          />
        </div>
        <div className="accountDetails_inp">
          <p>Phone Number</p>
          <input
            type="number"
            placeholder="Enter your phone number..."
            defaultValue={data?.phoneNumber ?? "XXXXXXXXXX"}
            name="phoneNumber"
          />
        </div>
      </div>
      <div className="accountDetails_inp">
        <p>Email</p>
        <input
          type="email"
          placeholder="Enter your email..."
          defaultValue={data?.email}
          name="email"
        />
      </div>
      <input type="text" hidden defaultValue={data?._id.toString()} name="id" />
      <SubmitButton text="Update" />
    </form>
  );
};

export default Page;
