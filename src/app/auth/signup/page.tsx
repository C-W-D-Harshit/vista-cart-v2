/* eslint-disable react/no-unescaped-entities */
"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import React from "react";
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
import axios from "axios";
import { signUpSchema } from "@/zod/schema";

// const signUpSchema = z
//   .object({
//     email: z.string().email(),
//     password: z.string().min(8, "Password should have atleast 8 characters"),
//     name: z
//       .string()
//       .min(3, "Name should have atleast 3 characters")
//       .max(50, "Name should have atmost 50 character"),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords must match",
//     path: ["confirmPassword"],
//   });

// type signUpSchema = z.infer<typeof signUpSchema>;

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<signUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (formData_: any) => {
    const { name, email, password } = formData_;

    const formData = {
      name,
      email,
      password,
    };

    try {
      // Trigger the sign-in process
      const { data } = await axios.post("/api/register", formData);
      toast.success("Registered Successfully!");
      toast.success("Please Login to Continue!");
      router.push("/auth/login");
    } catch (error: any) {
      toast.error(error.response.data.message || "Their is some Error");
    }
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
  const router = useRouter();
  const login = async (provider: string) => {
    try {
      const lgin = await signIn(provider, {
        callbackUrl: "http://localhost:3000/",
      });
    } catch (error: any) {
      // Handle errors, possibly by displaying an error message using toast.error() or other means
      console.error("Login failed:", error);
      toast.error(`Error: ${error.message}`);
    }
  };
  return (
    <div className="auth">
      <div>
        <Lottie
          options={defaultOptions}
          height={400}
          width={400}
          style={{ scale: "1.5" }}
        />
      </div>

      <div>
        <div>
          <Link href="/">
            <TbBrandOauth />
          </Link>
          <div className="auth_form">
            <div className="auth_form_head">
              <p>Hello their!</p>
              <p>Please enter your details</p>
            </div>
            <div className="auth_form_">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="group">
                  <input type="text" {...register("name")} id="k" />
                  <span className="bar"></span>
                  <label style={{ color: errors.name ? "red" : "" }}>
                    {errors.name ? errors.name.message : "Name"}
                  </label>
                </div>
                <div className="group">
                  <input type="email" {...register("email")} id="k" />
                  <span className="bar"></span>
                  <label style={{ color: errors.email ? "red" : "" }}>
                    {errors.email ? errors.email.message : "Email"}
                  </label>
                </div>
                <div className="group">
                  <input type="password" {...register("password")} id="k" />
                  <span className="bar"></span>
                  <label style={{ color: errors.password ? "red" : "" }}>
                    {errors.password ? errors.password.message : "Password"}
                  </label>
                </div>
                <div className="group" style={{ marginBottom: "2rem" }}>
                  <input
                    type="password"
                    {...register("confirmPassword")}
                    id="k"
                  />
                  <span className="bar"></span>
                  <label style={{ color: errors.confirmPassword ? "red" : "" }}>
                    {errors.confirmPassword
                      ? errors.confirmPassword.message
                      : "Confirm Password"}
                  </label>
                </div>
                <div className="auth_form_reme">
                  <div>
                    <Checkbox mr="1" defaultChecked size={"1"} />
                    <p>Remember Me</p>
                  </div>
                  <Link href="/auth/forgot-password">
                    <p></p>
                  </Link>
                </div>
                <button className="bc" style={{ marginBottom: "1.5rem" }}>
                  Sign Up
                </button>
                <button
                  onClick={() => login("google")}
                  className="oath"
                  style={{ marginBottom: "1.5rem" }}
                >
                  <FcGoogle />
                  Sign up with Google
                </button>
                <button
                  onClick={() => login("github")}
                  className="oath"
                  style={{ marginBottom: "1.5rem" }}
                >
                  <AiFillGithub />
                  Sign up with Github
                </button>
              </form>
            </div>
          </div>
          <p>
            Don't have an account?{" "}
            <Link href="/auth/login">
              <span>Log In</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
