import ImgCom from "@/components/ui/user/shop/ImgCom";
import "@/styles/user/productdetails.scss";
import InfoComp from "../../../components/ui/user/shop/InfoComp";
import { Metadata } from "next";

async function getData(slug: string) {
  const res = await fetch(`${process.env.URL}/api/products/${slug}`, {
    next: { revalidate: 60 },
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

const Page = async ({ params: { slug } }: { params: { slug: string } }) => {
  const data = await getData(slug);
  return (
    <div className="productDetails">
      <div className="productDetails_1">
        <ImgCom data={data} />
        <InfoComp data={data} />
      </div>
    </div>
  );
};

export const generateMetadata = async ({
  params: { slug },
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const data = await getData(slug);
  return {
    title: data?.product?.name,
    description: data?.product?.description,
    openGraph: {
      title: data?.product?.name,
      images: [
        {
          url: data?.product?.images[0]?.url,
        },
      ],
      description: data?.product?.description,
    },
  };
};

export default Page;
