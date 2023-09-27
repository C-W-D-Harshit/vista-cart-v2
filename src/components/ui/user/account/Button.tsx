"use client";

import React from "react";
import { Button, Separator } from "@radix-ui/themes";
import { experimental_useFormStatus } from "react-dom";
import SmallLoader from "@/components/essentials/SmallLoader";

const SubmitButton = ({ text }: { text: string }) => {
  const { pending } = experimental_useFormStatus();
  return (
    <Button type="submit" disabled={pending} size={"3"}>
      {pending ? "Submitting..." : text}
    </Button>
  );
};

export default SubmitButton;
