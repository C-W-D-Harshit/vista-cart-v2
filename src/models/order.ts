import mongoose, { models } from "mongoose";
const crypto = require("crypto");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    address: {
      name: String,
      email: String,
      phoneNumber: Number,
      address: String,
      city: String,
      state: String,
      postalCode: Number,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "completed", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    paymentID: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate a unique payment ID
orderSchema.pre("save", function (next) {
  // Generate a unique payment ID (e.g., using a random string or hashing)
  const uniquePaymentID = crypto.randomBytes(16).toString("hex"); // You can customize this as needed

  // Set the generated payment ID to the document's paymentID field
  this.paymentID = uniquePaymentID;

  next();
});

// Create and export the Product model
const Order = models.Order || mongoose.model("Order", orderSchema);

export default Order;
