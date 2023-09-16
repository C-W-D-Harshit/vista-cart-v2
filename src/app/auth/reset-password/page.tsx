/* eslint-disable react/no-unescaped-entities */
"use client";

import { signIn } from "next-auth/react";
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
import axios from "axios";

const signUpSchema = z
  .object({
    password: z.string().min(8, "Password should have atleast 8 characters"),
    resetToken: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type signUpSchema = z.infer<typeof signUpSchema>;

const Page = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<signUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (formData: any) => {
    // Perform client-side validation (e.g., check for empty fields)
    toast.loading("Resetting password...", { duration: 2000 });

    // Trigger the sign-in process
    try {
      const { data } = await axios.post("/api/user/reset-password", formData);
      if (data.success === false) {
        toast.error(data.message);
      }
      toast.success(data.message);
      reset();
      router.push("/auth/login");
    } catch (error) {}
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
              <p>Now you can reset password!</p>
              <p>Please enter your email</p>
            </div>
            <div className="auth_form_">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="group">
                  <input type="text" {...register("resetToken")} id="k" />
                  <span className="bar"></span>
                  <label style={{ color: errors.resetToken ? "red" : "" }}>
                    {errors.resetToken
                      ? errors.resetToken.message
                      : "Reset Token"}
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bc"
                  style={{ marginBottom: "1.5rem" }}
                >
                  Submit
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
