"use client";
import Loader from "@/components/essentials/Loader";
import SmallLoader from "@/components/essentials/SmallLoader";
import "@/styles/admin/createproducts.scss";
import { productSchema } from "@/zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge, Select } from "@radix-ui/themes";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineClose, AiOutlinePlus, AiOutlineSave } from "react-icons/ai";
import useSWR from "swr";
import { z } from "zod";

const Page = ({ params: { id } }: { params: { id: string } }) => {
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
  const [newImages, setNewImages] = useState<any>([]);
  const [iload, setIload] = useState(false);
  const [dload, setDload] = useState(false);
  const fileInputRef = useRef<any>(null);

  // get data
  const api = axios.create({
    baseURL: ``,
  });

  // const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const fetcher = (url: string) => api.get(url).then((res) => res.data);
  const { data, error, mutate, isLoading } = useSWR(
    `/api/products/admin/${id}`,
    fetcher
  );
  useMemo(() => {
    if (!data) return null;
    setImages(data.product.images);
    setStatus(data.product.status);
    setFeatured(data.product.featured);

    reset(data.product);
  }, [data, reset]);

  if (!data) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader />
      </div>
    );
  }

  // handle add img
  const handleButtonClick = () => {
    // Trigger a click event on the file input using the ref
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const delImage = async (formData: any) => {
    setDload(true);
    const { data } = await axios.post(`/api/products/delete/${id}`, formData);
    if (data.success === true) {
      mutate();
      setDload(false);
    } else {
      setDload(false);
    }
    return data;
  };

  // handle remove img
  const handleRemoveImage = (index: number) => {
    const formData = {
      index,
    };
    try {
      const callFunction: any = delImage(formData);
      toast.promise(callFunction, {
        loading: "Deleting...",
        error: "Some Error Occured!",
        success: "Image Deleted!",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // postImages
  const postImages = async (formData: any) => {
    setIload(true);
    const { data } = await axios.patch(`/api/products/update/${id}`, formData);
    if (data.success === true) {
      mutate();
      setIload(false);
    } else {
      setIload(false);
    }
    return data;
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
            setNewImages((prevImagesArray: any) => [
              ...prevImagesArray,
              resultString,
            ]);
          }
        };
      }
      const formData = {
        images: newImages,
      };
      const successMsg =
        newImages.length > 1
          ? "Images Uploaded Successfully...."
          : "Image Uploaded Successfully....";
      try {
        const callFunction: any = postImages(formData);
        toast.promise(callFunction, {
          loading: "Uploading...",
          error: "Some Error Occured!",
          success: successMsg,
        });
      } catch (error) {
        console.log(error);
      }
    }
    // Optionally, you can clear the file input to allow selecting more files
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const postData = async (formData: any) => {
    const { data } = await axios.patch(`/api/products/update/${id}`, formData);
    return data;
  };

  const onSubmit = async (data: any) => {
    const formData = {
      ...data,
      status,
      featured,
    };
    try {
      const callFunction = postData(formData);
      toast.promise(callFunction, {
        loading: "Updating...",
        error: "Some Error Occured!",
        success: "Product Updated Successfully....",
      });
      setIload(false);
      mutate();
    } catch (error) {
      setIload(false);
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
        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <SmallLoader />
          ) : (
            <>
              <AiOutlineSave />
              <p>Update Product</p>
            </>
          )}
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
                  src={images[mimg].url}
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
                        src={image.url}
                        alt="product"
                        width={100}
                        height={100}
                        onClick={() => setMimg(i)}
                      />
                      <div
                        onClick={() => {
                          if (dload === false) {
                            handleRemoveImage(i);
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
                      src={image.url}
                      alt="product"
                      width={100}
                      height={100}
                      onClick={() => setMimg(i)}
                    />
                    <div
                      onClick={() => {
                        if (dload === false) {
                          setMimg(i - 1);
                          handleRemoveImage(i);
                        }
                      }}
                    >
                      <AiOutlineClose />
                    </div>
                  </div>
                );
              })}
              <button
                type="button"
                disabled={iload}
                onClick={handleButtonClick}
              >
                {iload ? <SmallLoader /> : <AiOutlinePlus />}
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
              <p>Status & Featured</p>
              {data ? (
                <Badge
                  color={
                    data.product.status === "published"
                      ? "green"
                      : data.product.status === "draft"
                      ? "orange"
                      : "red"
                  }
                  size={"2"}
                >
                  <p style={{ textTransform: "capitalize" }}>
                    {data.product.status}
                  </p>
                  {/* <p>Draft</p> */}
                </Badge>
              ) : (
                <Badge color="orange" size={"2"}>
                  {/* <p>{product.status}</p> */}
                  <p>Draft</p>
                </Badge>
              )}
            </div>
            <div style={{ marginBottom: "3rem" }}>
              <p>Status</p>
              <Select.Root
                size={"3"}
                onValueChange={(value) => setStatus(value)}
                defaultValue={status}
                defaultOpen={false}
                required
              >
                <Select.Trigger placeholder="Select a Status for Product…" />
                <Select.Content position="popper">
                  <Select.Item value="draft">
                    <Badge color="orange" size={"2"}>
                      <p>Draft</p>
                    </Badge>
                  </Select.Item>
                  <Select.Item value="published">
                    <Badge color="green" size={"2"}>
                      <p>Published</p>
                    </Badge>
                  </Select.Item>
                  <Select.Item value="archived">
                    <Badge color="red" size={"2"}>
                      <p>Archive</p>
                    </Badge>
                  </Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
            <div>
              <p>Featured</p>
              <Select.Root
                size={"3"}
                onValueChange={(value) => {
                  if (value === "yes") {
                    setFeatured(true);
                  } else {
                    setFeatured(false);
                  }
                }}
                defaultValue={featured ? "yes" : "no"}
                defaultOpen={false}
              >
                <Select.Trigger placeholder="Featured Product?" />
                <Select.Content position="popper">
                  <Select.Item value="yes">
                    <Badge color="green" size={"2"}>
                      <p>Yes</p>
                    </Badge>
                  </Select.Item>
                  <Select.Item value="no">
                    <Badge color="red" size={"2"}>
                      <p>No</p>
                    </Badge>
                  </Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
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

export default Page;
