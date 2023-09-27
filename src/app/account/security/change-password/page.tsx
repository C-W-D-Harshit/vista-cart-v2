"use client";

import { Button, Separator } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import React from "react";
import connectMongoDB from "@/libs/mongo/dbConnect";
import User from "@/models/user";
import { revalidatePath } from "next/cache";
import toast from "react-hot-toast";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { changePasswordSchema } from "../../../../zod/schema";

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<changePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (formData: any) => {
    try {
      const { data } = await axios.post("/api/user/change-password", formData);
      if (data.success) {
        toast.success(data.message);
        // reset()
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="account">
      <h2>Change Password</h2>
      <p>
        Manage your <strong>Password</strong>
      </p>
      <Separator size={"4"} mb={"4"} mt={"4"} />
      <div className="accountDetails_inp">
        {errors.currentPassword ? (
          <p style={{ color: "red" }}>{errors.currentPassword.message}</p>
        ) : (
          <p>Current Password</p>
        )}
        <input
          type="password"
          placeholder="Enter your current password..."
          {...register("currentPassword")}
        />
      </div>
      <div className="account_">
        <div className="accountDetails_inp">
          {errors.newPassword ? (
            <p style={{ color: "red" }}>{errors.newPassword.message}</p>
          ) : (
            <p>New Password</p>
          )}

          <input
            type="password"
            placeholder="Enter your password..."
            {...register("newPassword")}
          />
        </div>
        <div className="accountDetails_inp">
          {errors.confirmPassword ? (
            <p style={{ color: "red" }}>{errors.confirmPassword.message}</p>
          ) : (
            <p>Confirm Password</p>
          )}

          <input
            type="password"
            placeholder="Enter your confirm password..."
            {...register("confirmPassword")}
          />
        </div>
      </div>
      <Button size={"3"}>{isSubmitting ? "Loading..." : "Submit"}</Button>
    </form>
  );
};

export default Page;
