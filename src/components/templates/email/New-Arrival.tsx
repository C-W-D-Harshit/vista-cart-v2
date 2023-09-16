import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  email: string;
  resetToken: string;
}

export const NewArrivalEmailTemplate = ({
  firstName,
}: {
  firstName: string;
}) => (
  <div>
    <h1>Hey, {firstName}!</h1>
    <p>Welcome to Vista Cart!</p>
  </div>
);
