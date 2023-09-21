import "@/styles/components/productholder.scss";
import Link from "next/link";
import ProductCard from "../cards/ProductCard";

const ProductHolder = ({
  products,
  title,
  link,
}: {
  products: any;
  title: string;
  link: string;
}) => {
  //   console.log(products);
  return (
    <div className="productHolder">
      <div>
        <p>{title}</p>
        <Link href={link}>
          <p>See More</p>
        </Link>
      </div>
      <div>
        {products.map((product: any) => {
          return <ProductCard key={product.id} product={product} />;
        })}
        {/* <ProductCard key={products[0].id} product={products[0]} />
        <ProductCard key={products[0].id} product={products[0]} />
        <ProductCard key={products[0].id} product={products[0]} />
        <ProductCard key={products[0].id} product={products[0]} />
        <ProductCard key={products[0].id} product={products[0]} />
        <ProductCard key={products[0].id} product={products[0]} />
        <ProductCard key={products[0].id} product={products[0]} />
        <ProductCard key={products[0].id} product={products[0]} /> */}
      </div>
    </div>
  );
};

export default ProductHolder;
