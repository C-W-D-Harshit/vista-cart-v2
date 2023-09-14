"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineClose, AiOutlinePlus, AiOutlineRight } from "react-icons/ai";
import useSWR from "swr";
import "@/styles/admin/products.scss";

const ID = ({ params: { id } }: { params: { id: string } }) => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    images: "",
    percentage: 0,
  });
  const [newData, setNewData] = useState([]);

  const api = axios.create({
    baseURL: ``,
  });
  const fetcher = (url: string) => api.get(url).then((res) => res.data);
  const { data, error, mutate, isLoading } = useSWR(
    `/api/v1/tax/${id}`,
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
  if (formData.name !== data.tax.name) {
    setFormData({
      name: data.tax.name || "",
      description: "",
      images: "",
      percentage: data.tax.percentage || 0,
    });
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const hyphenatedValue = value.replace(/ /g, "-");

    setFormData((prevFormData: any) => ({
      ...prevFormData,
      [name]: hyphenatedValue,
    }));
    setNewData((prevFormData) => ({
      ...prevFormData,
      [name]: hyphenatedValue,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // If file is not null, create an object URL for the image

    // Perform any further actions or API calls with the form data
    // console.log(formData);

    try {
      setLoading(true);
      const { data } = await axios.patch(`/api/v1/tax/${id}`, formData);
      console.log("done!");
      toast.success("Updated!");

      setFile(null);
      setLoading(false);
    } catch (err: any) {
      // console.error(err);
      setLoading(false);
      toast.error("Error");
    }
    setLoading(false);
  };
  return (
    <form onSubmit={handleSubmit} className="adminProducts">
      <div className="dl">
        <p>
          Dashboard / Taxes / <b>{id}</b>
        </p>
      </div>
      <p className="adminProducts_tit">Edit Tax</p>
      <>
        <div className="createCategory__">
          <p>General Information</p>
          <div>
            <div>
              <p>Tax Name</p>
              <input
                type="text"
                name="name"
                placeholder="Type Tax Name Here..."
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <p>Tax Percentage</p>
              <input
                type="number"
                name="percentage"
                placeholder="Type Tax Percentage Here..."
                value={formData.percentage}
                onChange={handleInputChange}
              />
              <input type="submit" hidden />
            </div>
          </div>
        </div>
      </>
    </form>
  );
};

export default ID;
