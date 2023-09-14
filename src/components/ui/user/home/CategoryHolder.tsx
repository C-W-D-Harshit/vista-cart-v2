import "@/styles/user/cat.scss";
import Image from "next/image";

const CategoryHolder = () => {
  const cat = [
    {
      name: "Shoes",
      img: "/shoes.png",
    },
    {
      name: "Watch",
      img: "/watch.png",
    },
    {
      name: "Shirt",
      img: "/shirt.png",
    },
    {
      name: "Jeans",
      img: "/jeans.png",
    },
    {
      name: "Jacket",
      img: "/jacket.png",
    },
  ];
  return (
    <div className="categoryHolder">
      <p>Top Categories</p>
      <div className="category_hold">
        {cat?.map((ct, i) => (
          <div key={i}>
            <Image src={ct.img} alt={ct.name} width={200} height={200} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryHolder;
