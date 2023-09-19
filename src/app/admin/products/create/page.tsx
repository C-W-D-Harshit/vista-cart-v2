"use client";
import "@/styles/admin/createproducts.scss";
import { productSchema } from "@/zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge, Select } from "@radix-ui/themes";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { z } from "zod";

const Pages = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<productSchema>({
    resolver: zodResolver(productSchema),
  });
  const [images, setImages] = useState<any>([]);
  const [mimg, setMimg] = useState(0);
  const [status, setStatus] = useState<any>("draft");
  const [featured, setFeatured] = useState(false);
  const fileInputRef = useRef<any>(null);

  // handle add img
  const handleButtonClick = () => {
    // Trigger a click event on the file input using the ref
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // handle remove img
  const handleRemoveImage = (index: number) => {
    setImages((prevImages: any) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  // handeling images
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = () => {
          if (reader.result && typeof reader.result === "string") {
            const resultString = reader.result;
            setImages((prevImagesArray: any) => [
              ...prevImagesArray,
              resultString,
            ]);
          }
        };
      }
    }
    // Optionally, you can clear the file input to allow selecting more files
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: any) => {
    const formData = {
      ...data,
      images,
      status,
      featured,
    };

    try {
      const { data } = await axios.post("/api/products/create", formData);
      if (data.success) {
        toast.success("Product created successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form className="adminCreateProducts" onSubmit={handleSubmit(onSubmit)}>
      <div className="adminCreateProducts__header">
        <Link href="/admin/products">
          <button type="button">
            <AiOutlineClose />
            <p>Cancle</p>
          </button>
        </Link>
        <button type="submit">
          <AiOutlinePlus />
          <p>Add Product</p>
        </button>
      </div>
      <div>
        <div>
          <div className="adminCreateProducts_">
            <p>General Information</p>
            <div className="adminCreateProducts__input">
              <p>Product Name</p>
              <input
                type="text"
                placeholder="Type product name here..."
                {...register("name")}
                style={{ textTransform: "capitalize" }}
              />
              {errors.name ? <p>{errors.name.message}</p> : <p></p>}
            </div>
            <div className="adminCreateProducts__input">
              <p>Product Short Description</p>
              <input
                type="text"
                placeholder="Type product short description here..."
                {...register("shortDescription")}
              />
              {errors.shortDescription ? (
                <p>{errors.shortDescription.message}</p>
              ) : (
                <p></p>
              )}
            </div>
            <div className="adminCreateProducts__input">
              <p>Product Description</p>
              <textarea
                placeholder="Type product name here..."
                {...register("description")}
              />
              {errors.description ? (
                <p>{errors.description.message}</p>
              ) : (
                <p></p>
              )}
            </div>
          </div>
          <div className="adminCreateProducts_">
            <p>Stock & Pricing</p>
            <div className="adminCreatedProducts_2">
              <div>
                <div className="adminCreateProducts__input">
                  <p>Product Price</p>
                  <input
                    type="number"
                    placeholder="Type product price here..."
                    {...register("price", { valueAsNumber: true })}
                  />
                  {errors.price ? <p>{errors.price.message}</p> : <p></p>}
                </div>
                <div className="adminCreateProducts__input">
                  <p>Product Sale Price</p>
                  <input
                    type="number"
                    placeholder="Type product sale price here..."
                    {...register("salePrice", { valueAsNumber: true })}
                  />
                  {errors.salePrice ? (
                    <p>{errors.salePrice.message}</p>
                  ) : (
                    <p></p>
                  )}
                </div>
              </div>
              <div>
                <div className="adminCreateProducts__input">
                  <p>Product Stock</p>
                  <input
                    type="number"
                    placeholder="Type product stock here..."
                    {...register("stock", { valueAsNumber: true })}
                  />
                  {errors.stock ? <p>{errors.stock.message}</p> : <p></p>}
                </div>

                <div className="adminCreateProducts__input">
                  <p>Product Tax</p>
                  <input
                    type="text"
                    placeholder="Type product tax here..."
                    {...register("tax", { valueAsNumber: true })}
                  />
                  {errors.tax ? <p>{errors.tax.message}</p> : <p></p>}
                </div>
              </div>
              <div>
                <div className="adminCreateProducts__input">
                  <p>Product SKU</p>
                  <input
                    type="text"
                    placeholder="Type product sku here..."
                    {...register("sku")}
                  />
                  {errors.sku ? <p>{errors.sku.message}</p> : <p></p>}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="adminCreateProducts_">
          <p>Variations</p>
          <div className="adminCreatedProducts_2">
            <div>
              <div className="adminCreateProducts__input">
                <p>Product Price</p>
                <input type="number" placeholder="Type product price here..." />
                <p></p>
              </div>
              <div className="adminCreateProducts__input">
                <p>Product Sale Price</p>
                <input
                  type="number"
                  placeholder="Type product sale price here..."
                />
                <p></p>
              </div>
            </div>
            <div>
              <div className="adminCreateProducts__input">
                <p>Product Stock</p>
                <input type="number" placeholder="Type product stock here..." />
                <p></p>
              </div>

              <div className="adminCreateProducts__input">
                <p>Product SKU</p>
                <input type="text" placeholder="Type product sku here..." />
                <p></p>
              </div>
            </div>
          </div>
        </div> */}
        </div>
        <div>
          <div className="adminCreateProducts_">
            <p>Product Image</p>
            <div className="adminCreateProducts__mimg">
              {images?.length > 0 ? (
                <Image
                  src={images[mimg]}
                  alt="product"
                  width={300}
                  height={300}
                />
              ) : (
                <Image
                  src="/defaultproduct.png"
                  alt="product"
                  width={300}
                  height={300}
                />
              )}
            </div>
            <div className="adminCreateProducts__simg">
              {images?.map((image: any, i: number) => {
                if (i === 0) {
                  return (
                    <div className="adminCreateProducts__simg_" key={i}>
                      <Image
                        src={image}
                        alt="product"
                        width={100}
                        height={100}
                        onClick={() => setMimg(i)}
                      />
                      <div
                        onClick={() => {
                          if (images.length > 1) {
                            console.log("f");
                            setMimg(0);
                            handleRemoveImage(i);
                          } else {
                            setImages([]);
                          }
                        }}
                      >
                        <AiOutlineClose />
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="adminCreateProducts__simg_" key={i}>
                    <Image
                      src={image}
                      alt="product"
                      width={100}
                      height={100}
                      onClick={() => setMimg(i)}
                    />
                    <div
                      onClick={() => {
                        setMimg(i - 1);
                        handleRemoveImage(i);
                      }}
                    >
                      <AiOutlineClose />
                    </div>
                  </div>
                );
              })}
              <button type="button" onClick={handleButtonClick}>
                <AiOutlinePlus />
              </button>
              <input
                type="file"
                name="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
                ref={fileInputRef}
                multiple
              />
            </div>
          </div>
          <div className="adminCreateProducts__">
            <div>
              <p>Status</p>
              <Badge
                // color={
                //   product.status === "published"
                //     ? "green"
                //     : product.status === "draft"
                //     ? "orange"
                //     : "red"
                // }
                color="orange"
                size={"2"}
              >
                {/* <p>{product.status}</p> */}
                <p>Draft</p>
              </Badge>
            </div>
            <div style={{ marginBottom: "3rem" }}>
              <Select.Root size={"3"}>
                <Select.Trigger placeholder="Select a Status for Product…" />
                <Select.Content position="popper">
                  <Select.Item
                    value="draft"
                    onChange={() => setStatus("draft")}
                  >
                    <Badge color="orange" size={"2"}>
                      <p>Draft</p>
                    </Badge>
                  </Select.Item>
                  <Select.Item
                    value="published"
                    onChange={() => setStatus("published")}
                  >
                    <Badge color="green" size={"2"}>
                      <p>Publish</p>
                    </Badge>
                  </Select.Item>
                  <Select.Item
                    value="archived"
                    onChange={() => setStatus("archived")}
                  >
                    <Badge color="red" size={"2"}>
                      <p>Archive</p>
                    </Badge>
                  </Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
            <Select.Root size={"3"}>
              <Select.Trigger placeholder="Featured Product?" />
              <Select.Content position="popper">
                <Select.Item value="yes" onChange={() => setFeatured(true)}>
                  <Badge color="green" size={"2"}>
                    <p>Yes</p>
                  </Badge>
                </Select.Item>
                <Select.Item value="no" onChange={() => setFeatured(false)}>
                  <Badge color="red" size={"2"}>
                    <p>No</p>
                  </Badge>
                </Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
          <div className="adminCreateProducts_">
            <p>Categories</p>
            <div className="adminCreateProducts__input">
              <p>Product Category</p>
              <input
                type="text"
                placeholder="Type product category here..."
                {...register("category")}
                style={{ textTransform: "capitalize" }}
              />
              {errors.category ? <p>{errors.category.message}</p> : <p></p>}
            </div>
            <div className="adminCreateProducts__input">
              <p>Product Brand</p>
              <input
                type="text"
                placeholder="Type product brand here..."
                {...register("brand")}
                style={{ textTransform: "capitalize" }}
              />
              {errors.brand ? <p>{errors.brand.message}</p> : <p></p>}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Pages;
