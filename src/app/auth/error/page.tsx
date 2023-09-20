import { Button } from "@radix-ui/themes";
import Link from "next/link";

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <h1>{searchParams.error}</h1>
      <Link href="/auth/login" passHref>
        <Button>Go Back</Button>
      </Link>
    </div>
  );
}
