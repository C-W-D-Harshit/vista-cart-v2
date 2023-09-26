import * as React from "react";

export const OrderCompletedEmailTemplate = ({
  firstName,
  email,
  orderId,
  transactionId,
  totalPrice,
  paymentMethod,
  orderDate,
}: {
  firstName: string;
  email: string;
  orderId: string;
  transactionId: string;
  totalPrice: number;
  paymentMethod: string;
  orderDate: string;
}) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f2f2f2",
      padding: "20px",
    }}
  >
    <table
      style={{
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        padding: "20px",
      }}
    >
      <tr>
        <td>
          <h1>Your Order is Complete</h1>
          <p>Dear {firstName},</p>
          <p>
            Thank you for choosing Vista Cart. Your order has been successfully
            completed. Below are the details:
          </p>

          <h2>Order Details</h2>
          <p>
            <strong>Order Number:</strong> {orderId.toString()}
          </p>
          <p>
            <strong>Order Date:</strong> {orderDate}
          </p>

          <p>
            <strong>Total Amount:</strong> {totalPrice}
          </p>

          <h2>Billing Information</h2>
          <p>
            <strong>Payment Method:</strong> {paymentMethod}
          </p>

          <p>
            For any questions or concerns regarding your order, please feel free
            to contact our customer support team at{" "}
            vista-cart@cleverdevloper.in.
          </p>

          <p>
            Thank you again for choosing Vista Cart. We appreciate your
            business!
          </p>

          <p>
            Best Regards,
            <br />
            Vista Cart
            <br />
            Harshit Sharma
          </p>
        </td>
      </tr>
    </table>
  </div>
);
