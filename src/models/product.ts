// product.model.js
import slugify from "slugify";
import mongoose, { models } from "mongoose";

// Define the product schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required."],
      trim: true,
      unique: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Product short description is required."],
    },
    description: {
      type: String,
      required: [true, "Product description is required."],
    },
    price: {
      type: Number,
      required: [true, "Product price is required."],
      min: [0, "Price cannot be negative."],
      validate: {
        validator: function (val: number) {
          return Number.isInteger(val);
        },
        message: "Price must be an integer.",
      },
    },
    salePrice: {
      type: Number,
      min: [0, "Sale price cannot be negative."],
      validate: {
        validator: function (val: number) {
          return Number.isInteger(val);
        },
        message: "Sale price must be an integer.",
      },
      required: [true, "Product sale price is required."],
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required."],
      min: [0, "Stock cannot be negative."],
      default: 0,
    },
    category: {
      type: String,
      required: [true, "Product category is required."],
    },
    tax: {
      type: Number,
      required: [true, "Product tax is required."],
    },
    brand: {
      type: String,
      required: [true, "Product brand is required."],
    },
    images: [
      {
        public_id: {
          type: String,
          required: [true, "Image public_id is required."],
        },
        url: {
          type: String,
          required: [true, "Image URL is required."],
        },
      },
    ],
    slug: {
      type: String,
      unique: true,
    },
    reviews: [
      {
        review: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Review",
        },
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    featuredExpiry: {
      type: Date,
    },
    dod: {
      type: Boolean,
      default: false,
    },
    // vendor: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
    newArrival: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      required: [true, "Product status is required."],
      default: "draft",
      enum: ["draft", "published", "archived"],
    },
    // variation: {
    //   type: Boolean,
    //   default: false,
    // },
    // variations: [
    //   {
    //     variationType: {
    //       type: String,
    //       required: true,
    //       enum: ["color", "size", "other"],
    //     },
    //     variationValue: {
    //       type: String,
    //       required: true,
    //     },
    //     variationPrice: {
    //       type: Number,
    //       required: true,
    //     },
    //     variationStock: {
    //       type: Number,
    //       required: true,
    //     },
    //     variationSalePrice: {
    //       type: Number,
    //     },
    //     VariationIsOnSale: {
    //       type: Boolean,
    //       required: true,
    //     },
    //   },
    // ],
  },
  {
    timestamps: true, // Use timestamps for createdAt and updatedAt fields
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// // get number of reviews
// productSchema.virtual("numOfReviews").get(function () {
//   return this.reviews.length;
// });

// Define a Mongoose pre-save middleware
productSchema.pre("save", function (next) {
  const discountPercentage = ((this.price - this.salePrice) / this.price) * 100;

  if (discountPercentage >= 50) {
    // Set a threshold discount level of 50%
    this.dod = true; // Set the dod flag to true
  }

  next(); // Call the next middleware function
});

// for new arrival
productSchema.pre("save", function (next) {
  const currentDate = new Date();
  const thresholdDate = new Date();
  thresholdDate.setDate(currentDate.getDate() - 5); // Set the threshold date to 5 days ago

  if (this.createdAt <= thresholdDate) {
    // Check if the product was created more than 5 days ago
    this.newArrival = false; // Turn off the newArrival flag
  }

  next(); // Call the next middleware function
});

// for slug
productSchema.pre("save", function (next) {
  const slugOptions = {
    lower: true, // Convert the slug to lowercase
    strict: true, // Remove any character that isn't a letter, number, or hyphen
  };

  this.slug = slugify(this.name, slugOptions);
  next();
});

// for featured function
productSchema.pre("save", function (next) {
  const currentDate = new Date();

  // Check if the featuredExpiry date has passed
  if (this.featuredExpiry && this.featuredExpiry <= currentDate) {
    this.featured = false; // Set featured to false if the expiry date has passed
  }

  next();
});

//for avg ratings and popular
productSchema.pre("save", function (next) {
  const MIN_NUM_REVIEWS = 5;
  const MIN_AVG_RATING = 4.5;
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000; // One day in milliseconds

  this.numOfReviews = this.reviews.length;

  // const numOfReviews = this.reviews.length;
  // const averageRating =
  //   this.reviews.reduce((sum, review) => sum + review.rating, 0) / numOfReviews;
  // this.ratings = averageRating;

  // const currentDate = new Date();
  // const isPopular =
  //   numOfReviews >= MIN_NUM_REVIEWS && averageRating >= MIN_AVG_RATING;

  // // Check if the product was popular before and if it has been one day since it was made popular
  // if (this.isPopular && currentDate - this.updatedAt >= ONE_DAY_IN_MS) {
  //   this.isPopular = false; // Set popularity to false after one day
  // } else if (!this.isPopular && isPopular) {
  //   this.isPopular = true; // Set popularity to true if it meets the criteria
  // }

  next();
});

// Create and export the Product model
const Product = models.Product || mongoose.model("Product", productSchema);

export default Product;
