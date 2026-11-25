
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        image: {
            type: String,
            default: ""
        },

        sellerName: {
            type: String,
            required: true,
            trim: true
        },

        contactEmail: {
            type: String,
            required: true,
            trim: true
        },

        contactPhone: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: ["sale", "swap", "both"],
            required: true
        },

        condition: {
            type: String,
            default: "Used"
        },

        status: {
            type: String,
            enum: ["Available", "Sold"],
            default: "Available"
        },

        views: {
            type: Number,
            default: 0,
            min: 0
        },

        userId: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);
