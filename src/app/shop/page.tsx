import React from "react";
import toast from "react-hot-toast";

async function getData(searchQuery: string) {
  const res = await fetch(
    `${process.env.URL}/api/products?keyword=${searchQuery}`,
    {
      next: { revalidate: 60 },
    }
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

const Page = async ({
  searchParams: { query },
}: {
  searchParams: { query: string };
}) => {
  const data = await getData(query);
  console.log(data);
  return (
    <div>
      <h1>Hi Boss</h1>
      <h1>{data.success ? "Success" : "Fail"}</h1>
    </div>
  );
};

export default Page;
