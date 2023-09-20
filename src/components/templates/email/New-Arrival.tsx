import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  email: string;
  resetToken: string;
}

export const NewArrivalEmailTemplate = ({
  firstName,
  otp,
}: {
  firstName: string;
  otp: number;
}) => (
  <div>
    <h1>Hey, {firstName}!</h1>
    <p>Welcome to Vista Cart!</p>
    <p>Your OTP is {otp}</p>
  </div>
);
