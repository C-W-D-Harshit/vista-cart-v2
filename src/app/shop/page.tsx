import ProductCard from "@/components/ui/user/cards/ProductCard";
import getData from "@/components/ui/user/shop/GetData";
import { LoadMore } from "@/components/ui/user/shop/LoadMore";
import Shopheader from "@/components/ui/user/shop/Shopheader";
import "@/styles/user/shop.scss";

const Page = async ({
  searchParams: { query, sort, page },
}: {
  searchParams: { query: string; sort: string; page: number };
}) => {
  const data = await getData({
    searchQuery: query ?? "",
    sort: sort ?? "",
    page: page ?? 1,
  });
  return (
    <div className="shop">
      <Shopheader query={query} />
      <div className="shop__holder">
        {data.products.length > 0 ? (
          data.products.map((product: any) => {
            return <ProductCard key={product.id} product={product} />;
          })
        ) : (
          <h1>Product Not Found</h1>
        )}
        {/* <LoadMore query={query} sort={sort} />   */}
      </div>
    </div>
  );
};

export default Page;
