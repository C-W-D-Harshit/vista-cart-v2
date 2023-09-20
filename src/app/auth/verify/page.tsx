/* eslint-disable react/no-unescaped-entities */
"use client";

import { getSession, signIn, useSession } from "next-auth/react";
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

const signUpSchema = z.object({
  email: z.string().email(),
});

type signUpSchema = z.infer<typeof signUpSchema>;

const Pagse = () => {
  const { data: session }: { data: any } = useSession();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<signUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  // if (session.user.verified !== false) {
  //   router.push("/");
  //   return;
  // }

  const onSubmit = async (formData: any) => {
    // Perform client-side validation (e.g., check for empty fields)
    toast.loading("Sending email...", { duration: 1000 });

    // Trigger the sign-in process
    try {
      const { data } = await axios.post("/api/user/forgot-password", formData);
      if (data.success === false) {
        toast.error(data.message);
      }
      toast.success(data.message);
      reset();
      router.push("/auth/reset-password");
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
              <p>Forgot Password!</p>
              <p>Please enter your email</p>
            </div>
            <div className="auth_form_">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="group">
                  <input type="email" {...register("email")} id="k" />
                  <span className="bar"></span>
                  <label>Email</label>
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

export default Pagse;
