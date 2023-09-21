import React from "react";

async function getData(slug: string) {
  const res = await fetch(`${process.env.URL}/api/products/${slug}`, {
    next: { revalidate: 60 },
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

const Page = async ({ params: { slug } }: { params: { slug: string } }) => {
  const data = await getData(slug);
  console.log(data);
  return (
    <div>
      <h1>{data.product.name}</h1>
    </div>
  );
};

export default Page;
