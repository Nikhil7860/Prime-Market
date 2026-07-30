import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import { initializeConnections } from "@/components/common/initializeConnections";
import { VerifyToken } from "@/services/auth.service";

export async function GET(request: NextRequest) {
    try {

        await initializeConnections();

        const count = await Product.countDocuments();

        if (count === 0) {

            const categoryId = new mongoose.Types.ObjectId("66b111111111111111111111");
            const userId = new mongoose.Types.ObjectId("66b222222222222222222222");

            await Product.insertMany([
                {
                    name: "Apple iPhone 16 Pro",
                    slug: "apple-iphone-16-pro",
                    description: "Latest Apple flagship smartphone with A18 Pro chip and titanium body.",
                    categoryName: "Mobiles",
                    category: categoryId,
                    brand: "Apple",
                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Front View"
                        },
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Back View"
                        }
                    ],
                    price: 129999,
                    discountPercentage: 8,
                    stock: 35,
                    rating: 4.9,
                    reviews: 452,
                    highlights: [
                        "A18 Pro Chip",
                        "48MP Camera",
                        "Titanium Design",
                        "5G Support"
                    ],
                    specifications: {
                        Display: "6.3-inch OLED",
                        Storage: "256GB",
                        RAM: "8GB",
                        Battery: "3582mAh",
                        OS: "iOS 26"
                    },
                    isFeatured: true,
                    isActive: true,
                    addedBy: userId
                },

                {
                    name: "Samsung Galaxy S25 Ultra",
                    slug: "samsung-galaxy-s25-ultra",
                    description: "Premium Android flagship with AI features.",
                    categoryName: "Mobiles",
                    category: categoryId,
                    brand: "Samsung",
                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Front"
                        },
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Side"
                        }
                    ],
                    price: 119999,
                    discountPercentage: 10,
                    stock: 50,
                    rating: 4.8,
                    reviews: 390,
                    highlights: [
                        "Snapdragon Elite",
                        "200MP Camera",
                        "S Pen",
                        "5000mAh Battery"
                    ],
                    specifications: {
                        Display: "6.9-inch AMOLED",
                        Storage: "512GB",
                        RAM: "12GB",
                        Battery: "5000mAh"
                    },
                    isFeatured: true,
                    isActive: true,
                    addedBy: userId
                },

                {
                    name: "Sony WH-1000XM6",
                    slug: "sony-wh1000xm6",
                    description: "Industry leading wireless noise cancelling headphones.",
                    categoryName: "Headphones",
                    category: categoryId,
                    brand: "Sony",
                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Front"
                        }
                    ],
                    price: 34999,
                    discountPercentage: 15,
                    stock: 120,
                    rating: 4.8,
                    reviews: 210,
                    highlights: [
                        "Noise Cancellation",
                        "Bluetooth 5.4",
                        "40 Hours Battery"
                    ],
                    specifications: {
                        Connectivity: "Bluetooth",
                        Weight: "250g",
                        Battery: "40 Hours"
                    },
                    isFeatured: false,
                    isActive: true,
                    addedBy: userId
                },

                {
                    name: "Dell XPS 15",
                    slug: "dell-xps-15",
                    description: "High performance premium laptop for professionals.",
                    categoryName: "Laptops",
                    category: categoryId,
                    brand: "Dell",
                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Laptop"
                        }
                    ],
                    price: 179999,
                    discountPercentage: 12,
                    stock: 18,
                    rating: 4.7,
                    reviews: 120,
                    highlights: [
                        "Intel Core Ultra 9",
                        "32GB RAM",
                        "1TB SSD",
                        "OLED Display"
                    ],
                    specifications: {
                        Processor: "Intel Core Ultra 9",
                        RAM: "32GB",
                        Storage: "1TB SSD",
                        Display: "15.6 OLED"
                    },
                    addedBy: userId
                },

                {
                    name: "Apple MacBook Air M4",
                    slug: "apple-macbook-air-m4",
                    description: "Ultra lightweight laptop powered by Apple M4 chip.",
                    categoryName: "Laptops",
                    category: categoryId,
                    brand: "Apple",
                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Front"
                        }
                    ],
                    price: 124999,
                    discountPercentage: 5,
                    stock: 30,
                    rating: 4.9,
                    reviews: 330,
                    highlights: [
                        "Apple M4",
                        "18 Hours Battery",
                        "Liquid Retina Display"
                    ],
                    specifications: {
                        Processor: "Apple M4",
                        RAM: "16GB",
                        Storage: "512GB SSD"
                    },
                    isFeatured: true,
                    addedBy: userId
                },

                {
                    name: "LG OLED Evo C5 55-inch TV",
                    slug: "lg-oled-evo-c5-55",
                    description: "Premium OLED Smart TV with Dolby Vision.",
                    categoryName: "Television",
                    category: categoryId,
                    brand: "LG",
                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Front"
                        }
                    ],
                    price: 139999,
                    discountPercentage: 18,
                    stock: 22,
                    rating: 4.8,
                    reviews: 89,
                    highlights: [
                        "4K OLED",
                        "Dolby Vision",
                        "120Hz Refresh Rate"
                    ],
                    specifications: {
                        Resolution: "4K",
                        Size: "55 inch",
                        HDR: "Dolby Vision"
                    },
                    addedBy: userId
                },

                {
                    name: "Canon EOS R8 Camera",
                    slug: "canon-eos-r8",
                    description: "Professional mirrorless camera with 24MP sensor.",
                    categoryName: "Camera",
                    category: categoryId,
                    brand: "Canon",
                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Camera"
                        }
                    ],
                    price: 159999,
                    discountPercentage: 7,
                    stock: 14,
                    rating: 4.8,
                    reviews: 74,
                    highlights: [
                        "24MP Full Frame",
                        "4K Video",
                        "WiFi"
                    ],
                    specifications: {
                        Sensor: "24MP",
                        Video: "4K",
                        Lens: "RF Mount"
                    },
                    addedBy: userId
                },

                {
                    name: "Apple Watch Ultra 3",
                    slug: "apple-watch-ultra-3",
                    description: "Rugged smartwatch built for adventure.",
                    categoryName: "Smart Watches",
                    category: categoryId,
                    brand: "Apple",
                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Watch"
                        }
                    ],
                    price: 89999,
                    discountPercentage: 6,
                    stock: 42,
                    rating: 4.9,
                    reviews: 220,
                    highlights: [
                        "GPS",
                        "ECG",
                        "Titanium Body"
                    ],
                    specifications: {
                        Display: "49mm",
                        Battery: "72 Hours",
                        Connectivity: "GPS + Cellular"
                    },
                    addedBy: userId
                },

                {
                    name: "PlayStation 5 Pro",
                    slug: "playstation-5-pro",
                    description: "Next-generation gaming console with ray tracing.",
                    categoryName: "Gaming",
                    category: categoryId,
                    brand: "Sony",
                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Console"
                        }
                    ],
                    price: 69999,
                    discountPercentage: 3,
                    stock: 60,
                    rating: 4.9,
                    reviews: 510,
                    highlights: [
                        "8K Gaming",
                        "Ray Tracing",
                        "2TB SSD"
                    ],
                    specifications: {
                        Storage: "2TB SSD",
                        GPU: "RDNA",
                        Resolution: "8K"
                    },
                    addedBy: userId
                },

                {
                    name: "Dyson V15 Detect Vacuum Cleaner",
                    slug: "dyson-v15-detect",
                    description: "Cordless vacuum cleaner with laser dust detection.",
                    categoryName: "Home Appliances",
                    category: categoryId,
                    brand: "Dyson",
                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Vacuum"
                        }
                    ],
                    price: 58999,
                    discountPercentage: 20,
                    stock: 28,
                    rating: 4.7,
                    reviews: 142,
                    highlights: [
                        "Laser Detection",
                        "60 Minutes Runtime",
                        "HEPA Filter"
                    ],
                    specifications: {
                        Runtime: "60 Minutes",
                        Weight: "3kg",
                        Filter: "HEPA"
                    },
                    addedBy: userId
                }
            ]);
        }

        const products = await Product.find();

        return NextResponse.json(products, { status: 200 });

    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 400 });
    }
}