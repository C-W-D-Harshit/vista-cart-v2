import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Loader from "@/components/essentials/Loader";
import Orders_top from "@/components/ui/user/account/Orders_top";
import connectMongoDB from "@/libs/mongo/dbConnect";
import Order from "@/models/order";
import Product from "@/models/product";
import { Button, Separator } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";

async function getOrderProduct({ id }: { id: string }) {
  // connect db
  await connectMongoDB();

  // find product
  const product = await Product.findById(id);

  if (!product) {
    return null;
  }
  return product;
}

async function getUserOrders({ status }: { status: string }) {
  // check session
  const session = await getServerSession(authOptions);
  const userID = session?.user.id;

  // connect db
  await connectMongoDB();

  let orders: any = await Order.find({
    userID,
    status,
  }).lean();

  // Use a new variable to store the updated orders
  const updatedOrders = await Promise.all(
    orders.map(async (order: any) => {
      const updatedProducts = await Promise.all(
        order.products.map(async (product: any) => {
          const productDetails = await getOrderProduct({
            id: product.productId,
          });
          return {
            ...product, // Spread the product object
            productDetails,
          };
        })
      );
      return {
        ...order, // Spread the order object
        products: updatedProducts, // Update the products array
      };
    })
  );

  return updatedOrders;
}

const Page = async ({
  searchParams: { status },
}: {
  searchParams: { status: string };
}) => {
  const orders = await getUserOrders({ status: status ?? "completed" });

  function formatDateToLongFormat(timestamp: number): string {
    const createdAt = new Date(timestamp); // No need to multiply by 1000 if it's in milliseconds

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

    const day = createdAt.getDate();
    const month = months[createdAt.getMonth()];
    const year = createdAt.getFullYear();

    return `${month} ${day}, ${year}`;
  }

  if (!orders) {
    return (
      <div
        style={{
          height: "70vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader />
      </div>
    );
  }
  return (
    <div className="account">
      <h2>Your Orders ({orders.length || 0})</h2>
      <p>
        Manage & view your <strong>Orders</strong>...
      </p>
      <Separator size={"4"} mb={"4"} mt={"4"} />
      <div className="account_orders">
        <Orders_top status={status ?? "completed"} />
        <div className="account_orders_content">
          {orders.length > 0 ? (
            orders.map((order: any) => {
              return (
                <div key={order._id} className="account_orders_content_item">
                  <div className="account_orders_content_item_top">
                    <div>
                      <div>
                        <p>Order Placed</p>
                        <p>{formatDateToLongFormat(order.createdAt)}</p>
                      </div>

                      <div>
                        <p>Total</p>
                        <p>₹{order.totalPrice}</p>
                      </div>
                      <div>
                        <p>Ship to</p>
                        <p>{order.address.name}</p>
                      </div>
                    </div>
                    <div>
                      <p>
                        <strong>Order ID:</strong> {order._id.toString()}
                      </p>
                      <div>
                        <Link href={`/account/orders/${order._id}`}>
                          <p>View order details</p>
                        </Link>
                        <Separator orientation="vertical" color="blue" />
                        <Link
                          href={`/account/orders/${order._id}/invoice`}
                          aria-disabled
                        >
                          <p>View invoice</p>
                        </Link>
                      </div>
                    </div>
                  </div>
                  {order.products.map((product: any, i: number) => {
                    return (
                      <>
                        <div
                          className="account_orders_content_item_product"
                          key={product._id}
                        >
                          <div>
                            <div>
                              <Image
                                src={
                                  product.productDetails.images[0].url ||
                                  "/de.png"
                                }
                                alt={product.productDetails.name}
                                width={200}
                                height={200}
                              />
                            </div>
                            <div>
                              <p>
                                {product.productDetails.name}
                                {product.quantity > 1 &&
                                  ` (x ${product.quantity})`}
                              </p>
                              <p>Return till ...</p>
                              <div>
                                <Link
                                  href={`/shop/${product.productDetails.slug}`}
                                >
                                  <Button>Buy it again</Button>
                                </Link>
                                <Button variant="outline" disabled>
                                  Track package
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {i !== order.products.length - 1 && (
                          <Separator style={{ padding: "0" }} size={"4"} />
                        )}
                      </>
                    );
                  })}
                </div>
              );
            })
          ) : (
            <h3>No Orders</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
