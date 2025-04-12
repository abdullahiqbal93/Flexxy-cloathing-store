import pkg from "mongoose";
const { Schema, model, models } = pkg;

export const WishlistSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export const Wishlist = models?.Wishlist || model("Wishlist", WishlistSchema);