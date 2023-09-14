"use client";

import { ChangeEvent, useRef, useState } from "react";
import "@/styles/admin/products.scss";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import { AiOutlinePlus } from "react-icons/ai";

const Page = ({ params: { id } }: { params: { id: string } }) => {
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [images, setImages] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [initialData, setInitialData] = useState<any>({
    name: "",
    description: "",
  });
  const fileInputRef: any = useRef(null);

  const handleDivClick = () => {
    fileInputRef.current.click();
  };
  const api = axios.create({
    baseURL: ``,
  });
  const fetcher = (url: string) => api.get(url).then((res) => res.data);
  const { data, error, mutate, isLoading } = useSWR(
    `/api/v1/product/${id}`,
    fetcher
  );
  if (error) return <div>Failed to load</div>;
  console.log(data);

  if (isLoading) {
    return (
      <>
        <h1>Loading Data...</h1>
      </>
    );
  }

  if (data.product.images !== images) {
    setImages(data.product.images);
  }

  const handleChange = (event: any) => {
    const selectedFiles = event.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles[0];
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === "string") {
          const resultString = reader.result;

          setImages((prevImagesArray: any) => [
            ...prevImagesArray,
            resultString,
          ]);
          setFormData((prevFormData: any) => ({
            ...prevFormData,
            images: [...prevFormData.images, resultString],
          }));
        }
      };
    } else {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        images: [],
      }));
    }
    console.log(images);
  };

  return (
    <div className="adminProducts">
      <div className="dl">
        <p>
          Dashboard / Products / <b>{id}</b>
        </p>
      </div>
      <p className="adminProducts_tit">Edit Product</p>
      <div className="adminProduct">
        <div>
          <p>Basic Information</p>
          <div>
            <input type="text" />
          </div>
        </div>
        <div>
          <div>
            <p>Product Image</p>
            <div>
              <Image
                src={data.product.images[imageIndex].url}
                alt={data.product.name}
                width={500}
                height={500}
              />
            </div>
            <div>
              {images?.map((img: any, i: number) => {
                return (
                  <div
                    className={
                      i === imageIndex
                        ? "img_ad_hold img_ad_hold_act"
                        : "img_ad_hold"
                    }
                    key={img._id}
                    onClick={() => setImageIndex(i)}
                  >
                    <Image
                      src={img.url}
                      alt={data.product.name}
                      width={100}
                      height={100}
                    />
                  </div>
                );
              })}
              <div className="addmore_admin" onClick={handleDivClick}>
                <AiOutlinePlus />
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
