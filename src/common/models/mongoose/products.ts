import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
});
export const ProductsModel = mongoose.model("product", productSchema);
