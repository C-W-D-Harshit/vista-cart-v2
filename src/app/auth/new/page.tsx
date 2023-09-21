/* eslint-disable react/no-unescaped-entities */
"use client";

import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import React, { Suspense } from "react";
import toast from "react-hot-toast";
import Lottie from "react-lottie";
import animationData from "@/animations/verify.json";
import "@/styles/auth/login.scss";
import { GiNinjaStar } from "react-icons/gi";
import Link from "next/link";
import { TbBrandOauth } from "react-icons/tb";
import { Checkbox, Flex, Text } from "@radix-ui/themes";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { FieldValue, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "../../loading";
import axios from "axios";
import SmallLoader from "@/components/essentials/SmallLoader";
import { BiReset } from "react-icons/bi";

const signUpSchema = z.object({
  otp: z
    .number()
    .refine(
      (value) => Number.isInteger(value) && value >= 100000 && value <= 999999,
      {
        message: "OTP should be a 6-digit number",
      }
    ),
});

type signUpSchema = z.infer<typeof signUpSchema>;

const Page = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const {
    data: session,
    status,
    update,
  }: { data: any; status: any; update: any } = useSession();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<signUpSchema>({
    resolver: zodResolver(signUpSchema),
  });
  const [send, setSend] = React.useState(false);

  if (session?.user.verified) {
    router.push("/");
    return;
  }

  const postData = async (formData: any) => {
    const { data } = await axios.post("/api/user/verify", formData);
    // console.log(data);
    if (data.success === false) {
      throw new Error(data.message);
    } else {
      update({
        verified: true,
      });
      router.push("/auth/login");
      return data;
    }
  };

  const { email } = searchParams;
  const onSubmit = async (formData: any) => {
    // Perform client-side validation (e.g., check for empty fields)
    const { otp } = formData;

    // Define a minimum delay of 0.8 seconds (2000 milliseconds)
    const minimumDelay = 800;

    // Delay the execution of gg function
    await new Promise((resolve) => {
      setTimeout(resolve, minimumDelay);
    });

    // Trigger the sign-in process
    const data = {
      email,
      otp,
    };
    try {
      const callFunction = postData(data);
      // toast.promise(callFunction, {
      //   loading: "Validating...",
      //   error: "OTP did'nt match! or is expired!",
      //   success: "Verified Successfully....",
      // });
      toast.promise(
        callFunction
          .then((result: any) => {
            // Handle success
            return result; // Pass the result to the success callback
          })
          .catch((error: any) => {
            // Handle error and get the error message
            console.error(error.message);
            return Promise.reject(error); // Pass the error to the error callback
          }),
        {
          loading: "Validating...",
          error: (error) => {
            // Display the error message using toast.error
            // toast.error(error.message);
            return error.message; // Return the error message
          },
          success: "Verified Successfully....",
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    setScale: 1,
  };
  const post = async (formData: any) => {
    const { data } = await axios.post("/api/user/resend", formData);
    if (data.success === false) {
      throw new Error(data.message);
    } else {
      return data;
    }
  };
  const resend = async () => {
    // Define a minimum delay of 0.8 seconds (2000 milliseconds)
    setSend(true);
    const minimumDelay = 800;

    // Delay the execution of gg function
    await new Promise((resolve) => {
      setTimeout(resolve, minimumDelay);
    });
    // Trigger the sign-in process
    const data = {
      email,
    };
    try {
      const callFunction = post(data);
      // toast.promise(callFunction, {
      //   loading: "Sending...",
      //   error: "Something Went Wrong!",
      //   success: "OTP Sent Successfully....",
      // });
      toast.promise(
        callFunction
          .then((result: any) => {
            // Handle success
            return result; // Pass the result to the success callback
          })
          .catch((error: any) => {
            // Handle error and get the error message
            console.error(error.message);
            return Promise.reject(error); // Pass the error to the error callback
          }),
        {
          loading: "Sending OTP to your email...",
          error: (error) => {
            // Display the error message using toast.error
            // toast.error(error.message);
            return error.message; // Return the error message
          },
          success: "OTP Sent Successfully...",
        }
      );
    } catch (error) {
      console.log(error);
    }
    setSend(false);
  };

  return (
    <div className="auth">
      <div>
        <Suspense fallback={<p>Loading Animations...</p>}>
          <Lottie
            options={defaultOptions}
            height={400}
            width={400}
            style={{ scale: "1.5" }}
          />
        </Suspense>
      </div>

      <div>
        <div>
          <Link href="/">
            <TbBrandOauth />
          </Link>
          <div className="auth_form">
            <div className="auth_form_head">
              <p>Verify Email!</p>
              <p>Please enter OTP set on your Email!</p>
            </div>
            <div className="auth_form_">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="group">
                  <input
                    type="number"
                    {...register("otp", { valueAsNumber: true })}
                    id="k"
                  />
                  <span className="bar"></span>
                  <label style={{ color: errors.otp ? "red" : "" }}>
                    {errors.otp ? errors.otp.message : "OTP"}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bc"
                  style={{ marginBottom: "1.5rem" }}
                >
                  {isSubmitting ? <SmallLoader /> : "Submit"}
                </button>
                <button
                  className={send ? "bc" : "oath"}
                  style={{ marginBottom: "1.5rem" }}
                  type="button"
                  onClick={resend}
                >
                  {send ? (
                    <SmallLoader />
                  ) : (
                    <>
                      <BiReset />
                      Request OTP
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          <p>
            Don't have an account?{" "}
            <Link href="/auth/signup">
              <span>Sign Up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
