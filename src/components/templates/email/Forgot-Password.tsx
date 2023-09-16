import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  email: string;
  resetToken: string;
}

export const ForgotPasswordEmailTemplate = ({
  firstName,
  email,
  resetToken,
}: {
  firstName: string;
  email: string;
  resetToken: string;
}) => (
  <div>
    <h1>Hey, {firstName}!</h1>
    <p>
      The password reset token for the email address {email} is : {resetToken}
    </p>
  </div>
);
