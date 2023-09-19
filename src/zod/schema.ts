import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "Password should have atleast 8 characters"),
    name: z
      .string()
      .min(3, "Name should have atleast 3 characters")
      .max(50, "Name should have atmost 50 character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type signUpSchema = z.infer<typeof signUpSchema>;

export const productSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name should have atleast 3 characters")
      .max(50, "Name should have atmost 50 character"),
    shortDescription: z
      .string()
      .min(15, "Short Description should have atleast 15 characters")
      .max(100, "Short Description should have atmost 50 character"),
    description: z
      .string()
      .min(30, "Description should have atleast 30 characters")
      .max(500, "Description should have atmost 500 character"),
    price: z
      .number()
      .positive("Product price should be positive")
      .min(1, "Product price should be atleast 1")
      .max(99999, "Product price should be atmost 99999"),
    salePrice: z
      .number()
      .positive("Product sale price should be positive")
      .min(1, "Product sale price should be atleast 1")
      .max(99999, "Product sale price should be atmost 99999"),
    // isOnSale: z.boolean(),
    stock: z
      .number()
      .positive("Product stock should be positive")
      .min(1, "Product stock should be atleast 1")
      .max(1000, "Product stock should be atmost 1000"),
    sku: z
      .string()
      .min(3, "SKU should have atleast 3 characters")
      .max(50, "SKU should have atmost 50 character"),
    category: z
      .string()
      .min(3, "Category should have atleast 3 characters")
      .max(50, "Category should have atmost 50 character"),
    brand: z
      .string()
      .min(3, "Brand should have atleast 3 characters")
      .max(30, "Brand should have atmost 30 characters"),
    tax: z
      .number()
      .positive("Tax should be positive")
      .max(28, "Tax should be atmost 28%"),
  })
  .refine((data) => data.salePrice < data.price, {
    message: "Sale price cannot be more than regular price",
    path: ["salePrice"],
  });

export type productSchema = z.infer<typeof productSchema>;
