async function getData({
  searchQuery,
  sort,
  page,
}: {
  searchQuery: string;
  sort: string;
  page: number;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/products?keyword=${searchQuery}&sort=${sort}&page=${page}&limit=16`,
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

export default getData;
