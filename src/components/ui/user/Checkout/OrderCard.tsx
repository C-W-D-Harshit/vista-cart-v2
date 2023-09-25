"use client";

import Image from "next/image";
import "@/styles/user/checkout.scss";

const OrderCard = ({ data }: { data: any }) => {
  return (
    <div className="orderCard">
      <div className="orderCard_img">
        <Image
          src={data.image ? data.image : data.images[0].url || "/de.png"}
          alt={data.name}
          width={100}
          height={100}
        />
      </div>
      <div className="orderCard_info">
        <div>
          <p>{data.name}</p>
          <p>₹{data.price}</p>
        </div>
        <p>x{data.quantity || 1}</p>
      </div>
    </div>
  );
};

export default OrderCard;
