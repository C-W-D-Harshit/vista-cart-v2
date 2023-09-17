"use client";
// import "@/styles/admin/products.scss";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  AiFillCheckCircle,
  AiOutlineDownload,
  AiOutlineLeft,
  AiOutlinePlus,
  AiOutlineRight,
  AiOutlineSearch,
} from "react-icons/ai";
import { BiFirstPage, BiLastPage } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import useSWR from "swr";
import Link from "next/link";
import { GrEdit } from "react-icons/gr";
import { useRouter } from "next/navigation";
import { BsSearch } from "react-icons/bs";

const Page = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState<number>(1);

  const api = axios.create({
    baseURL: ``,
  });

  // const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const fetcher = (url: string) => api.get(url).then((res) => res.data);
  const { data, error, mutate, isLoading } = useSWR(
    `/api/v1/taxes?keyword=${search}&page=${page}`,
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  // if (!data) return <div>Loading...</div>;
  // console.log(data);
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const searchQuery = event.currentTarget.searchQuery.value;
    setSearch(searchQuery);

    // Perform your search logic here using the searchQuery value
  }
  function getFormattedDate(inputDate: Date) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dateObj = new Date(inputDate);
    const day = dateObj.getDate();
    const month = dateObj.getMonth();
    const formattedDate = `${day} ${months[month]}`;
    return formattedDate;
  }

  // 31 july

  const del = async (nn: number) => {
    try {
      await axios.delete(`/api/v1/tax/${nn}`);
      toast.success("Deleted");
      mutate();
    } catch (err) {
      console.error(err);
    }
  };
  console.log(data);
  return (
    <div className="adminProducts">
      <div className="dl">
        <p>
          Dashboard / <b>Taxes</b>
        </p>
      </div>
      <p className="adminProducts_tit">Taxes</p>

      <div className="adminProducts_table">
        <div className="adminProducts_table_top">
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="adminProducts_table_search"
          >
            <AiOutlineSearch />
            <input
              type="text"
              name="searchQuery"
              placeholder="Search for Taxes..."
            />
            <input type="submit" hidden />
          </form>
          <button onClick={() => router.push("/admin/taxes/create")}>
            Add Taxes
          </button>
        </div>
        <div className="adminCustomer_holder">
          <div>
            <p>s.no</p>
            <p>Tax Class</p>
            <p></p>
            <p></p>
            <p>Percentage</p>
            <p>created</p>
            <p>action</p>
          </div>
          {data?.taxes?.map((product: any, index: number) => {
            const formattedDate = getFormattedDate(product.createdAt);
            return (
              <div key={product._id}>
                <p>{index + 1}</p>
                <div className="adminCategory_name">
                  <div>
                    <Image src={"/tax.png"} alt="Img" width={80} height={80} />
                  </div>
                  <div>
                    <p>{product.name}</p>
                    <p style={{ textTransform: "lowercase" }}>
                      {product.percentage}
                    </p>
                  </div>
                </div>
                <p>{product.sd}</p>
                <p>{product.orders?.length}</p>
                <p>{product.percentage}%</p>
                <p>{formattedDate}</p>
                <div>
                  <GrEdit
                    onClick={() => router.push(`/admin/taxes/${product._id}`)}
                  />
                  <MdDeleteOutline onClick={() => del(product._id)} />
                </div>
              </div>
            );
          })}
          {isLoading && (
            <>
              <h1>Loading Data...</h1>
            </>
          )}
          {data?.taxes?.length === 0 && (
            <h1 style={{ textAlign: "center" }}>Tax Class Not Found!</h1>
          )}
          {data?.totalPages > 1 && (
            <div className="adminPagination">
              <div>
                <p>
                  Showing 1-{data.numOfResults} from {data.totalVendors}
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
    </div>
  );
};

export default Page;
