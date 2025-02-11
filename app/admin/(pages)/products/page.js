import Link from "next/link";

import styles from "./page.module.css";
import ProductTable from "./table";
import dbConnect from "@/helpers/dbConnect";
import Product from "@/models/Product";
import { deepCopy } from "@/helpers/utils";
import { revalidatePath } from "next/cache";
import { deleteFile } from "@/helpers/crud";

export const metadata = {
  title: "Products",
  description: "Products page",
};

// function to fetch all products from the database
async function fetchProducts(skip, limit) {
  try {
    await dbConnect();
    const [products, productsCount] = await Promise.all([
      Product.find().skip(skip).limit(limit).lean(),
      Product.countDocuments(),
    ]);
    return { products, productsCount };
  } catch (error) {
    return null;
  }
}
// function to delete products
async function deleteProducts(productIDs) {
  "use server";
  try {
    await dbConnect();
    const products = await Product.find({ _id: { $in: productIDs } }).select(
      "images"
    );
    const deletePromises = [];
    products.map((product) => {
      return product.images.map((image) =>
        deletePromises.push(deleteFile(image))
      );
    });
    try {
      await Promise.all(deletePromises);
    } catch (error) {
      throw new Error("Error deleting images");
    }
    await Product.deleteMany({ _id: { $in: productIDs } });
    revalidatePath("/admin/products");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// function to disable products
async function disableProducts(products) {
  "use server";
  try {
    await dbConnect();
    await Product.updateMany(
      { _id: { $in: products } },
      { $set: { status: "disabled" } }
    );
    revalidatePath("/admin/products");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export default async function ProductsPage({
  searchParams: { page = 1, perPage = 10 },
}) {
  const skip = (page - 1) * perPage;
  const limit = perPage;
  const { products, productsCount } = await fetchProducts(skip, limit);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Products</h1>
        <Link className={styles.newProductLink} href="/admin/new-product">
          New Product
        </Link>
      </div>
      <ProductTable
        products={deepCopy(products)}
        deleteProducts={deleteProducts}
        disableProducts={disableProducts}
        productsCount={productsCount}
      />
    </div>
  );
}
