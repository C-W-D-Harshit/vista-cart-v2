import { Button } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div>
      <Link href="/account/security/change-password">
        <Button>Change Password</Button>
      </Link>
    </div>
  );
};

export default Page;
