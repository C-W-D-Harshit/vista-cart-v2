"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Loader from "@/components/essentials/Loader";
import getData from "./GetData";
import ProductCard from "../cards/ProductCard";

export function LoadMore({ query, sort }: { query: string; sort: string }) {
  const [beers, setBeers] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any>(null);
  const [lent, setLent] = useState(1);

  const { ref, inView } = useInView();

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const loadMoreBeers = async () => {
    await delay(100);

    const newProducts = await getData({
      page: page,
      searchQuery: query ?? "",
      sort: sort ?? "",
    });

    if (newProducts && newProducts.products.length > 0) {
      setBeers((prevProducts: any) => [
        ...prevProducts,
        ...newProducts.products,
      ]);
      setPage(page + 1);
      setData(newProducts);
      setLent(newProducts.products.length);
    }
  };

  //   const lent = data ? data.products?.length : 0;

  useEffect(() => {
    if (inView) {
      if (lent !== 0) loadMoreBeers();
    }
  }, [inView]);

  return (
    <>
      {/* <Beers beers={beers} /> */}
      {beers?.map((product: any, i: number) => {
        return <ProductCard key={i} product={product} />;
      })}
      <div
        ref={ref}
        style={{
          display:
            data?.products?.length === 0 || data?.totalpages === 0
              ? "none"
              : "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem",
        }}
      >
        <Loader />
      </div>
    </>
  );
}
