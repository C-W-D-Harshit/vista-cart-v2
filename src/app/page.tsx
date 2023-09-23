import CategoryHolder from "@/components/ui/user/home/CategoryHolder";
import Image from "next/image";
import React from "react";
import { BsLightningCharge } from "react-icons/bs";
import "@/styles/user/home.scss";
import ProductHolder from "@/components/ui/user/holder/ProductHolder";

export default async function Home() {
  async function getData(feature: string) {
    const res = await fetch(
      `${process.env.URL}/api/products?${feature}=true&limit=4`,
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
  const featuredProducts = await getData("featured");
  const newArrival = await getData("newArrival");
  return (
    <main className="home">
      <section className="home1">
        <div>
          <BsLightningCharge style={{ color: "#FBE385" }} />
          <p>New In</p>
        </div>
        <div>{/* <ToggleM /> */}</div>
      </section>
      <div className="cards">
        <div className="card">
          <p>get upto 50% off</p>
        </div>
        <div className="card">
          <div>
            <p>Winter Weekends</p>
            <p>Keep it casual</p>
          </div>
          <div>
            <Image src="/de.png" alt="ad" width={200} height={200}></Image>
          </div>
        </div>
        <div className="card">THREe</div>
        <div className="card">FOUR</div>
        <div className="card">FIVE</div>
        <div className="card">SIX</div>
        <div className="card">
          <div>
            <p>New-In Knitwear</p>
            <p>Layers On Layers</p>
          </div>
          <div>
            <Image src="/dee.png" alt="ad" width={200} height={200}></Image>
          </div>
        </div>
        <div className="card">
          <div>
            <p>New-Season Texture</p>
            <p>Hot Stuff</p>
          </div>
          <div>
            <Image src="/dee1.png" alt="ad" width={200} height={200}></Image>
          </div>
        </div>
      </div>
      <CategoryHolder />
      {featuredProducts?.products?.length > 0 && (
        <ProductHolder
          products={featuredProducts.products}
          title="Featured Products"
          link="/shop/featured"
        />
      )}
      {newArrival?.products?.length > 0 && (
        <ProductHolder
          products={newArrival.products}
          title="New Arrival"
          link="/shop/new"
        />
      )}
    </main>
  );
}
