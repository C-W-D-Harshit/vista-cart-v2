import ProductCard from "@/components/ui/user/cards/ProductCard";
import "@/styles/user/shop.scss";

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
  return (
    <div className="shop">
      <div></div>
      <div className="shop__holder">
        {data.products.length > 0 ? (
          data.products.map((product: any) => {
            return <ProductCard key={product.id} product={product} />;
          })
        ) : (
          <h1>No Products Found</h1>
        )}
      </div>
    </div>
  );
};

export default Page;
