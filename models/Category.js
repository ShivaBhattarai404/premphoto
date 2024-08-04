import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Category",
    },
    description: {
      type: String,
      required: false,
    },
    banner: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "enabled",
    },
    visibility: {
      type: String,
      default: "yes",
    },
    url_key: {
      type: String,
      required: true,
    },
    meta_title: {
      type: String,
      required: true,
    },
    meta_description: {
      type: String,
      required: true,
    },
    meta_keywords: {
      type: String,
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
