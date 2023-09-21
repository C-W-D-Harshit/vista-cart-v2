"use client";

import Loader from "@/components/essentials/Loader";
import "@/styles/admin/products.scss";
import { Badge, Checkbox } from "@radix-ui/themes";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineLeft,
  AiOutlinePlus,
  AiOutlineRight,
  AiOutlineSearch,
} from "react-icons/ai";
import { BiFirstPage, BiLastPage } from "react-icons/bi";
import useSWR from "swr";

const Page = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState<number>(1);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // get search data
  const api = axios.create({
    baseURL: ``,
  });

  // const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const fetcher = (url: string) => api.get(url).then((res) => res.data);
  const { data, error, mutate } = useSWR(
    `/api/user?keyword=${search}`,
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  // if (!data) return <div>Loading...</div>;
  console.log(data);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const searchQuery = event.currentTarget.searchQuery.value;
    setSearch(searchQuery);
  }

  const postData = async (nn: any) => {
    const { data } = await axios.delete(`/api/users/admin/delete/${nn}`);

    if (data.success === false) {
      throw new Error(data.message);
    } else {
      mutate();
      return data;
    }
  };
  const del = async (nn: number) => {
    try {
      const callFunction = postData(nn);
      // toast.promise(callFunction, {
      //   loading: "Validating...",
      //   error: "OTP did'nt match! or is expired!",
      //   success: "Verified Successfully....",
      // });
      toast.promise(
        callFunction
          .then((result: any) => {
            // Handle success
            return result; // Pass the result to the success callback
          })
          .catch((error: any) => {
            // Handle error and get the error message
            console.error(error.message);
            return Promise.reject(error); // Pass the error to the error callback
          }),
        {
          loading: "Deleting...",
          error: (error) => {
            // Display the error message using toast.error
            // toast.error(error.message);
            return error.message; // Return the error message
          },
          success: "User Deleted Successfully...",
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="adminProducts">
      <div className="adminProducts__top">
        <form className="adminProducts__search" onSubmit={handleSubmit}>
          <AiOutlineSearch />
          <input type="text" name="searchQuery" placeholder="Search" />
          <input type="submit" hidden />
        </form>
        <Link href="/admin/products/create"></Link>
      </div>
      <div className="adminProducts__table">
        <div className="adminProducts__table_top">
          <div className="adminProducts__table_check">
            <Checkbox />
          </div>
          <div>
            <p>Name</p>
          </div>
          <div>
            <p>Email</p>
          </div>
          <div>
            <p>Provider</p>
          </div>
          <div>
            <p>Role</p>
          </div>
          <div>
            <p>Status</p>
          </div>
          <div>
            <p>Actions</p>
          </div>
        </div>
        {data ? (
          data.users?.map((product: any, index: number) => {
            return (
              <div key={product._id}>
                <div className="adminProducts__table_check">
                  <Checkbox
                  // checked={selectedProducts.includes(product._id)}
                  // onChange={() => toggleCheckbox(product._id)}
                  />
                </div>
                <div className="adminProducts__table_prod">
                  <div>
                    <Image
                      // src={product.images[0].url}
                      src="/profil.png"
                      alt={product.name}
                      width={250}
                      height={250}
                    />
                  </div>
                  <p>{product.name}</p>
                </div>
                <div>
                  <p style={{ textTransform: "lowercase" }}>{product.email}</p>
                </div>
                <div>
                  <Badge
                    color={
                      product.provider === "google"
                        ? "blue"
                        : product.provider === "github"
                        ? "green"
                        : "gray"
                    }
                    size={"2"}
                  >
                    <p>{product.provider}</p>
                  </Badge>
                </div>
                <div>
                  <p>
                    <Badge
                      color={
                        product.role === "admin"
                          ? "amber"
                          : product.role === "seller"
                          ? "green"
                          : "gray"
                      }
                      size={"2"}
                    >
                      <p>{product.role}</p>
                    </Badge>
                  </p>
                </div>
                <div>
                  <Badge
                    color={
                      product.verified === false
                        ? "brown"
                        : product.status === "active"
                        ? "green"
                        : "red"
                    }
                    size={"2"}
                  >
                    <p>
                      {product.verified === false
                        ? "Not Verified"
                        : product.status}
                    </p>
                  </Badge>
                </div>
                <div>
                  <Link href={`/admin/customers/${product._id}`}>
                    <button>
                      <AiOutlineEdit />
                    </button>
                  </Link>
                  <button
                    onClick={() => del(product._id)}
                    style={{ color: "red" }}
                  >
                    <AiOutlineDelete />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
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
        )}
        {data?.users?.length === 0 && <h1>User Not Found!</h1>}
        {data?.totalPages > 1 && (
          <div className="adminPagination">
            <div>
              <p>
                Showing 1-{data.numOfResults} from {data.totalCategories}
              </p>
            </div>
            <div>
              <button onClick={() => setPage(1)} disabled={page === 1}>
                <BiFirstPage />
              </button>
              <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                <AiOutlineLeft />
              </button>

              <p>{page}</p>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === data.totalPages}
              >
                <AiOutlineRight />
              </button>
              <button
                onClick={() => setPage(data.totalPages)}
                disabled={page === data.totalPages}
              >
                <BiLastPage />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
