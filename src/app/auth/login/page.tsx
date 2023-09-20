/* eslint-disable react/no-unescaped-entities */
"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import React, { Suspense } from "react";
import toast from "react-hot-toast";
import Lottie from "react-lottie";
import animationData from "@/animations/login-animation.json";
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
import SmallLoader from "@/components/essentials/SmallLoader";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password should have atleast 8 characters"),
});

type signUpSchema = z.infer<typeof signUpSchema>;

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<signUpSchema>({
    resolver: zodResolver(signUpSchema),
  });
  if (session) {
    router.push("/");
    return;
  }

  let err: string;

  if (session) {
    router.push("/");
    return;
  }

  const gg = async (email: string, password: string) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });
    const result: any = await signIn("credentials", {
      redirect: false, // Set to false to handle redirect manually
      email,
      password,
    });
    // Check if sign-in was successful
    if (result.error) {
      // Handle sign-in error (display error message, etc.)
      // console.log(result.error);
      // toast.error(result.error);
      throw new Error(result.error);
    } else {
      // Sign-in was successful, handle redirect or other actions
      // toast.success("Logged In!");
      router.push("/");
    }
    return result;
  };

  // const onSubmit = async (data: any) => {
  //   const { email, password } = data;

  //   // Trigger the sign-in process
  //   const fg: any = gg(email, password);
  //   toast.promise(
  //     fg
  //       .then((result: any) => {
  //         // Handle success
  //         return result; // Pass the result to the success callback
  //       })
  //       .catch((error: any) => {
  //         // Handle error and get the error message
  //         console.error(error.message);
  //         return Promise.reject(error); // Pass the error to the error callback
  //       }),
  //     {
  //       loading: "Logging you in...",
  //       error: (error) => {
  //         // Display the error message using toast.error
  //         // toast.error(error.message);
  //         return error.message; // Return the error message
  //       },
  //       success: "Logged In Successfully....",
  //     }
  //   );
  // };
  const onSubmit = async (data: any) => {
    const { email, password } = data;

    // Define a minimum delay of 0.8 seconds (2000 milliseconds)
    const minimumDelay = 800;

    // Delay the execution of gg function
    await new Promise((resolve) => {
      setTimeout(resolve, minimumDelay);
    });

    // Trigger the sign-in process
    const fg: any = gg(email, password);

    toast.promise(
      fg
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
        loading: "Logging you in...",
        error: (error) => {
          // Display the error message using toast.error
          // toast.error(error.message);
          return error.message; // Return the error message
        },
        success: "Logged In Successfully....",
      }
    );
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    setScale: 1.5,
  };

  const login = async (provider: string) => {
    try {
      const result = await signIn(provider, {
        callbackUrl: "http://localhost:3000/",
      });
      console.log(result);
      toast.loading("Logging in...!");
    } catch (error: any) {
      // Handle errors, possibly by displaying an error message using toast.error() or other means
      console.error("Login failed:", error);
      toast.error(`Error: ${error.message}`);
    }
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
              <p>Welcome back!</p>
              <p>Please enter your details</p>
            </div>
            <div className="auth_form_">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="group">
                  <input type="email" {...register("email")} id="k" />
                  <span className="bar"></span>
                  <label>Email</label>
                </div>
                <div className="group" style={{ marginBottom: "2rem" }}>
                  <input type="password" {...register("password")} id="k" />
                  <span className="bar"></span>
                  <label>Password</label>
                </div>
                <div className="auth_form_reme">
                  <div>
                    <Checkbox mr="1" defaultChecked size={"1"} />
                    <p>Remember Me</p>
                  </div>
                  <Link href="/auth/forgot-password">
                    <p>Forgot Password?</p>
                  </Link>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bc"
                  style={{ marginBottom: "1.5rem" }}
                >
                  {isSubmitting ? <SmallLoader /> : "Log In"}
                </button>
                <button
                  onClick={() => login("google")}
                  className="oath"
                  style={{ marginBottom: "1.5rem" }}
                  type="button"
                >
                  <FcGoogle />
                  Log in with Google
                </button>
                <button
                  onClick={() => login("github")}
                  className="oath"
                  style={{ marginBottom: "1.5rem" }}
                  type="button"
                >
                  <AiFillGithub />
                  Log in with Github
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
