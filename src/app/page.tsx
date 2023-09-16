import Loader from "@/components/essentials/Loader";
import CategoryHolder from "@/components/ui/user/home/CategoryHolder";
import Image from "next/image";
import React from "react";
import { BsLightningCharge } from "react-icons/bs";
import "@/styles/user/home.scss";

export default function Home() {
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
    </main>
  );
}
