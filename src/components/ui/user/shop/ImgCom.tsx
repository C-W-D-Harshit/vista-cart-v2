"use client";

import "@/styles/user/productdetails.scss";
import Image from "next/image";
import { useState } from "react";

const ImgCom = ({ data }: { data: any }) => {
  const [imgIndex, setImgIndex] = useState(0);
  return (
    <div className="productDetails_img">
      <div className="productDetails_mimg">
        <Image
          src={data?.product.images[imgIndex].url || "/de.png"}
          alt={data.product.name}
          width={800}
          height={800}
        />
      </div>
      <div className="productDetails_simg">
        {data.product.images.length > 1 &&
          data.product.images.map((image: any, i: number) => {
            return (
              <div
                key={image.id}
                onClick={() => setImgIndex(i)}
                style={{
                  boxShadow:
                    imgIndex === i
                      ? "none"
                      : "inset 0 0 0.5px 1px hsla(0, 0%, 100%, 0.075),0 0 0 1px hsla(0, 0%, 0%, 0.05), 0 0.3px 0.4px hsla(0, 0%, 0%, 0.02),0 0.9px 1.5px hsla(0, 0%, 0%, 0.045), 0 3.5px 6px hsla(0, 0%, 0%, 0.09)",
                }}
              >
                <Image
                  src={image.url}
                  alt={data.product.name}
                  width={100}
                  height={100}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ImgCom;
