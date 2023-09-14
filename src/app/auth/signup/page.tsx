"use client";
/* eslint-disable react/no-unescaped-entities */

import "@/styles/auth/login.scss";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const Page = () => {
  const [activepass, setActivePass] = useState(false);
  const [activeEmail, setActiveEmail] = useState(false);
  const [activeCPass, setActiveCPass] = useState(false);
  const [activeName, setActiveName] = useState(false);
  const [activePhone, setActivePhone] = useState(false);
  const emailRef = useRef<any>(null);
  const passRef = useRef<any>(null);
  const cpassRef = useRef<any>(null);
  const nameRef = useRef<any>(null);
  const phoneRef = useRef<any>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // validations
    if (
      email.length === 0 ||
      password.length === 0 ||
      name.length === 0 ||
      confirmPassword.length === 0 ||
      phoneNumber.length === 0
    ) {
      toast.error("Please enter email and password!");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    const validNumber = phoneRegex.test(phoneNumber);

    if (!validNumber) {
      toast.error("Not a valid Phone Number!");
      return;
    }
    if (password.length < 8) {
      toast.error("Password should have more than 8 character!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password did'nt match!");
      return;
    }

    const formData = {
      name,
      email,
      password,
      confirmPassword,
      phoneNumber,
    };

    try {
      const { data } = await axios.post("/api/v1/user/signup", formData, {});
      toast.success(data.message);
      router.push("/");
    } catch (err: any) {
      toast.error(err.response.data.message || "Error while signing you in!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="login"
      style={{ flexDirection: "row-reverse" }}
    >
      <div className="login_form">
        <p>
          <Link href="/">VISTACART</Link>
        </p>
        <div>
          <p>Welcome Back</p>
          <div
            className={activeName ? "login_input log_act" : "login_input"}
            onClick={() => {
              setActiveName(!false);
              nameRef.current.select();
            }}
          >
            <input
              type="text"
              disabled={!activeName}
              ref={nameRef}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="name">Name</label>
          </div>
          <div
            className={activeEmail ? "login_input log_act" : "login_input"}
            onClick={() => {
              setActiveEmail(!false);
              emailRef.current.select();
            }}
          >
            <input
              type="email"
              disabled={!activeEmail}
              ref={emailRef}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Email</label>
          </div>
          <div
            className={activePhone ? "login_input log_act" : "login_input"}
            onClick={() => {
              setActivePhone(!false);
              phoneRef.current.select();
            }}
          >
            <input
              type="number"
              disabled={!activePhone}
              ref={phoneRef}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <label htmlFor="phoneNumber">Phone Number</label>
          </div>
          <div
            className={activepass ? "login_input log_act" : "login_input"}
            onClick={() => {
              setActivePass(!false);
              passRef.current.select();
            }}
          >
            <input
              type="password"
              disabled={!activepass}
              ref={passRef}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Password</label>
          </div>
          <div
            className={activeCPass ? "login_input log_act" : "login_input"}
            onClick={() => {
              setActiveCPass(!false);
              cpassRef.current.select();
            }}
          >
            <input
              type="password"
              disabled={!activeCPass}
              ref={cpassRef}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label htmlFor="password">Confirm Password</label>
          </div>
          <button className="login_sub" type="submit">
            Sign Up
          </button>
          <input type="submit" hidden />
          <p>
            Already have an Account?{" "}
            <span>
              <Link href="/auth/login">Login</Link>
            </span>
          </p>
        </div>
      </div>
      <div className="login_img">
        <Image src="/login.png" width={900} height={900} alt="image" />
      </div>
    </form>
  );
};

export default Page;
