import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import { initializeConnections } from "@/components/common/initializeConnections";
import Module from "@/models/module";
import Role from "@/models/role";
import User from "@/models/User";
import Category from "@/models/category";
import Coupon from "@/models/coupon";

export async function GET(request: NextRequest) {
    try {

        await initializeConnections();

        const count = await Product.countDocuments();

        if (count === 0) {

            const userId = new mongoose.Types.ObjectId("6a88551a275853e691552ee3");

            // =====================================================
            // 1. CREATE 10 CATEGORIES
            // =====================================================

            const categories = await Category.insertMany([
                {
                    categoryName: "Mobiles",
                    slug: "mobiles",
                    description: "Smartphones and mobile devices",
                    image: "",
                    parentCategory: null,
                    displayOrder: 1,
                    isFeatured: true,
                    status: true,
                    addedBy: userId,
                    updatedBy: [],
                },
                {
                    categoryName: "Laptops",
                    slug: "laptops",
                    description: "Laptops and notebooks",
                    image: "",
                    parentCategory: null,
                    displayOrder: 2,
                    isFeatured: true,
                    status: true,
                    addedBy: userId,
                    updatedBy: [],
                },
                {
                    categoryName: "Accessories",
                    slug: "accessories",
                    description: "Mobile and computer accessories",
                    image: "",
                    parentCategory: null,
                    displayOrder: 3,
                    isFeatured: true,
                    status: true,
                    addedBy: userId,
                    updatedBy: [],
                },
                {
                    categoryName: "Gaming",
                    slug: "gaming",
                    description: "Gaming consoles and gaming accessories",
                    image: "",
                    parentCategory: null,
                    displayOrder: 4,
                    isFeatured: true,
                    status: true,
                    addedBy: userId,
                    updatedBy: [],
                },
                {
                    categoryName: "Televisions",
                    slug: "televisions",
                    description: "Smart TVs and entertainment displays",
                    image: "",
                    parentCategory: null,
                    displayOrder: 5,
                    isFeatured: true,
                    status: true,
                    addedBy: userId,
                    updatedBy: [],
                },
                {
                    categoryName: "Audio",
                    slug: "audio",
                    description: "Headphones, speakers and audio devices",
                    image: "",
                    parentCategory: null,
                    displayOrder: 6,
                    isFeatured: false,
                    status: true,
                    addedBy: userId,
                    updatedBy: [],
                },
                {
                    categoryName: "Cameras",
                    slug: "cameras",
                    description: "Digital cameras and photography equipment",
                    image: "",
                    parentCategory: null,
                    displayOrder: 7,
                    isFeatured: false,
                    status: true,
                    addedBy: userId,
                    updatedBy: [],
                },
                {
                    categoryName: "Fashion",
                    slug: "fashion",
                    description: "Clothing, shoes and fashion accessories",
                    image: "",
                    parentCategory: null,
                    displayOrder: 8,
                    isFeatured: true,
                    status: true,
                    addedBy: userId,
                    updatedBy: [],
                },
                {
                    categoryName: "Home Appliances",
                    slug: "home-appliances",
                    description: "Home and kitchen appliances",
                    image: "",
                    parentCategory: null,
                    displayOrder: 9,
                    isFeatured: false,
                    status: true,
                    addedBy: userId,
                    updatedBy: [],
                },
                {
                    categoryName: "Watches",
                    slug: "watches",
                    description: "Smart watches and traditional watches",
                    image: "",
                    parentCategory: null,
                    displayOrder: 10,
                    isFeatured: false,
                    status: true,
                    addedBy: userId,
                    updatedBy: [],
                },
            ]);

            console.log(`${categories.length} categories created`);


            // =====================================================
            // 2. CREATE PRODUCTS USING CREATED CATEGORY IDS
            // =====================================================

            await Product.insertMany([

                // =================================================
                // 1. MOBILES
                // =================================================

                {
                    name: "Apple iPhone 16 Pro",
                    slug: "apple-iphone-16-pro",
                    description:
                        "Latest Apple flagship smartphone with A18 Pro chip and titanium body.",

                    categoryName: categories[0].categoryName,
                    category: categories[0]._id,

                    brand: "Apple",

                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Front View",
                        },
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Back View",
                        },
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
                        "5G Support",
                    ],

                    specifications: {
                        Display: "6.3-inch OLED",
                        Storage: "256GB",
                        RAM: "8GB",
                        Battery: "3582mAh",
                        OS: "iOS",
                    },

                    isFeatured: true,
                    isActive: true,
                    addedBy: userId,
                },


                // =================================================
                // 2. LAPTOPS
                // =================================================

                {
                    name: "MacBook Pro M4",
                    slug: "macbook-pro-m4",
                    description:
                        "Powerful Apple laptop designed for developers and professionals.",

                    categoryName: categories[1].categoryName,
                    category: categories[1]._id,

                    brand: "Apple",

                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Laptop Front",
                        },
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Laptop Back",
                        },
                    ],

                    price: 189999,
                    discountPercentage: 10,
                    stock: 20,
                    rating: 4.9,
                    reviews: 321,

                    highlights: [
                        "Apple M4 Chip",
                        "16GB RAM",
                        "512GB SSD",
                        "Retina Display",
                    ],

                    specifications: {
                        Display: "14.2-inch Liquid Retina XDR",
                        Storage: "512GB",
                        RAM: "16GB",
                        Processor: "Apple M4",
                        OS: "macOS",
                    },

                    isFeatured: true,
                    isActive: true,
                    addedBy: userId,
                },


                // =================================================
                // 3. ACCESSORIES
                // =================================================

                {
                    name: "Apple AirPods Pro 2",
                    slug: "apple-airpods-pro-2",
                    description:
                        "Premium wireless earbuds with active noise cancellation.",

                    categoryName: categories[2].categoryName,
                    category: categories[2]._id,

                    brand: "Apple",

                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "AirPods",
                        },
                    ],

                    price: 24999,
                    discountPercentage: 12,
                    stock: 80,
                    rating: 4.7,
                    reviews: 672,

                    highlights: [
                        "Active Noise Cancellation",
                        "Transparency Mode",
                        "Wireless Charging",
                        "USB-C",
                    ],

                    specifications: {
                        Connectivity: "Bluetooth",
                        Battery: "Up to 30 hours",
                        Charging: "USB-C",
                        Type: "TWS",
                    },

                    isFeatured: true,
                    isActive: true,
                    addedBy: userId,
                },


                // =================================================
                // 4. GAMING
                // =================================================

                {
                    name: "Sony PlayStation 5",
                    slug: "sony-playstation-5",
                    description:
                        "Next generation gaming console with ultra high speed SSD.",

                    categoryName: categories[3].categoryName,
                    category: categories[3]._id,

                    brand: "Sony",

                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Console",
                        },
                    ],

                    price: 54999,
                    discountPercentage: 5,
                    stock: 30,
                    rating: 4.8,
                    reviews: 850,

                    highlights: [
                        "4K Gaming",
                        "Ultra Fast SSD",
                        "Ray Tracing",
                        "DualSense Controller",
                    ],

                    specifications: {
                        Storage: "825GB SSD",
                        Resolution: "4K",
                        FPS: "120 FPS",
                        Connectivity: "WiFi 6",
                    },

                    isFeatured: true,
                    isActive: true,
                    addedBy: userId,
                },


                // =================================================
                // 5. TELEVISIONS
                // =================================================

                {
                    name: "Samsung 55 Inch 4K Smart TV",
                    slug: "samsung-55-inch-4k-smart-tv",
                    description:
                        "Premium 4K smart television with HDR and smart features.",

                    categoryName: categories[4].categoryName,
                    category: categories[4]._id,

                    brand: "Samsung",

                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "TV Front",
                        },
                    ],

                    price: 64999,
                    discountPercentage: 15,
                    stock: 25,
                    rating: 4.6,
                    reviews: 312,

                    highlights: [
                        "4K Resolution",
                        "HDR",
                        "Smart TV",
                        "Dolby Audio",
                    ],

                    specifications: {
                        Display: "55-inch",
                        Resolution: "4K UHD",
                        RefreshRate: "120Hz",
                        OS: "Tizen",
                    },

                    isFeatured: true,
                    isActive: true,
                    addedBy: userId,
                },


                // =================================================
                // 6. AUDIO
                // =================================================

                {
                    name: "Sony WH-1000XM5",
                    slug: "sony-wh-1000xm5",
                    description:
                        "Premium wireless headphones with industry-leading noise cancellation.",

                    categoryName: categories[5].categoryName,
                    category: categories[5]._id,

                    brand: "Sony",

                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Headphones",
                        },
                    ],

                    price: 29999,
                    discountPercentage: 10,
                    stock: 45,
                    rating: 4.8,
                    reviews: 540,

                    highlights: [
                        "Noise Cancellation",
                        "30 Hour Battery",
                        "Bluetooth 5.2",
                        "Hi-Res Audio",
                    ],

                    specifications: {
                        Battery: "30 hours",
                        Connectivity: "Bluetooth",
                        Microphone: "Built-in",
                        Type: "Over Ear",
                    },

                    isFeatured: true,
                    isActive: true,
                    addedBy: userId,
                },


                // =================================================
                // 7. CAMERAS
                // =================================================

                {
                    name: "Canon EOS R6 Mark II",
                    slug: "canon-eos-r6-mark-ii",
                    description:
                        "Professional mirrorless camera designed for photography and video.",

                    categoryName: categories[6].categoryName,
                    category: categories[6]._id,

                    brand: "Canon",

                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Camera Body",
                        },
                    ],

                    price: 219999,
                    discountPercentage: 8,
                    stock: 15,
                    rating: 4.8,
                    reviews: 156,

                    highlights: [
                        "24.2MP Sensor",
                        "4K Video",
                        "Dual Pixel AF",
                        "Image Stabilization",
                    ],

                    specifications: {
                        Sensor: "24.2MP Full Frame",
                        Video: "4K 60fps",
                        ISO: "100-102400",
                        Mount: "RF Mount",
                    },

                    isFeatured: true,
                    isActive: true,
                    addedBy: userId,
                },


                // =================================================
                // 8. FASHION
                // =================================================

                {
                    name: "Nike Air Max 270",
                    slug: "nike-air-max-270",
                    description:
                        "Comfortable and stylish sports shoes designed for everyday use.",

                    categoryName: categories[7].categoryName,
                    category: categories[7]._id,

                    brand: "Nike",

                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Shoes",
                        },
                    ],

                    price: 12999,
                    discountPercentage: 20,
                    stock: 100,
                    rating: 4.5,
                    reviews: 425,

                    highlights: [
                        "Air Cushioning",
                        "Lightweight",
                        "Breathable",
                        "Everyday Comfort",
                    ],

                    specifications: {
                        Type: "Running Shoes",
                        Material: "Synthetic",
                        Gender: "Unisex",
                        Sole: "Rubber",
                    },

                    isFeatured: false,
                    isActive: true,
                    addedBy: userId,
                },


                // =================================================
                // 9. HOME APPLIANCES
                // =================================================

                {
                    name: "LG 1.5 Ton Inverter AC",
                    slug: "lg-1-5-ton-inverter-ac",
                    description:
                        "Energy efficient inverter air conditioner with smart cooling technology.",

                    categoryName: categories[8].categoryName,
                    category: categories[8]._id,

                    brand: "LG",

                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "AC Front",
                        },
                    ],

                    price: 45999,
                    discountPercentage: 18,
                    stock: 40,
                    rating: 4.4,
                    reviews: 234,

                    highlights: [
                        "Inverter Technology",
                        "Energy Efficient",
                        "Fast Cooling",
                        "WiFi Control",
                    ],

                    specifications: {
                        Capacity: "1.5 Ton",
                        EnergyRating: "5 Star",
                        Compressor: "Inverter",
                        Refrigerant: "R32",
                    },

                    isFeatured: false,
                    isActive: true,
                    addedBy: userId,
                },


                // =================================================
                // 10. WATCHES
                // =================================================

                {
                    name: "Apple Watch Series 10",
                    slug: "apple-watch-series-10",
                    description:
                        "Advanced smartwatch with health monitoring and fitness tracking.",

                    categoryName: categories[9].categoryName,
                    category: categories[9]._id,

                    brand: "Apple",

                    images: [
                        {
                            image: "https://res.cloudinary.com/ddmzxke71/image/upload/v1782120689/products/xrdtkw77i4ofqzl0yup6.png",
                            name: "Watch Front",
                        },
                    ],

                    price: 49999,
                    discountPercentage: 10,
                    stock: 50,
                    rating: 4.7,
                    reviews: 378,

                    highlights: [
                        "Health Monitoring",
                        "Fitness Tracking",
                        "Water Resistant",
                        "GPS",
                    ],

                    specifications: {
                        Display: "46mm OLED",
                        Connectivity: "GPS + Cellular",
                        Battery: "18 hours",
                        OS: "watchOS",
                    },

                    isFeatured: true,
                    isActive: true,
                    addedBy: userId,
                },
            ]);

            console.log("10 products created successfully.");



            console.log("Seed data created successfully.");
























            // Insert initial Modules

            // const Insertmodules = await Module.insertMany([
            //     {
            //         "moduleName": "Product Category",
            //         "route": "productCategory",
            //         "icon": "No Icon",
            //         "status": "Active"
            //     },
            //     {

            //         "moduleName": "Role & Permission",
            //         "route": "RolePermissionManager",
            //         "icon": "TicketPercent",
            //         "status": "Active",
            //     },
            //     {
            //         "moduleName": "Coupons",
            //         "route": "coupons",
            //         "icon": "TicketPercent",
            //         "status": "Active",
            //     },
            //     {
            //         "moduleName": "Modules",
            //         "route": "modules",
            //         "icon": "Boxes",
            //         "status": "Active",
            //     },
            //     {
            //         "moduleName": "Roles",
            //         "route": "roles",
            //         "icon": "Shield",
            //         "status": "Active",
            //     },
            //     {
            //         "moduleName": "Users",
            //         "route": "users",
            //         "icon": "Users",
            //         "status": "Active",
            //     },
            //     {
            //         "moduleName": "Orders",
            //         "route": "orders",
            //         "icon": "ShoppingCart",
            //         "status": "Active",
            //     },
            //     {
            //         "moduleName": "Products",
            //         "route": "products",
            //         "icon": "Package",
            //         "status": "Active",
            //     },
            //     {
            //         "moduleName": "Admin Dashboard",
            //         "route": "dashboard",
            //         "icon": "LayoutDashboard",
            //         "status": "Active",
            //     }
            // ]);

            // Insert Initial Roles

            // const InserRoles = await Role.insertMany([
            //     {
            //         "roleName": "Super Admin",
            //         "description": "Super Admin",
            //         "status": "Active",
            //         "permissions": [
            //             {
            //                 "module": new mongoose.Types.ObjectId("6a884e1e19fc15d0bb166c80"),
            //                 "moduleName": "Admin Dashboard",
            //                 "canView": true,
            //                 "canCreate": true,
            //                 "canEdit": true,
            //                 "canDelete": true,

            //             },
            //             {
            //                 "module": new mongoose.Types.ObjectId("6a884e1e19fc15d0bb166c7f"),
            //                 "moduleName": "Products",
            //                 "canView": true,
            //                 "canCreate": true,
            //                 "canEdit": true,
            //                 "canDelete": true,

            //             },
            //             {
            //                 "module": new mongoose.Types.ObjectId("6a884e1e19fc15d0bb166c7e"),
            //                 "moduleName": "Orders",
            //                 "canView": true,
            //                 "canCreate": true,
            //                 "canEdit": true,
            //                 "canDelete": true,

            //             },
            //             {
            //                 "module": new mongoose.Types.ObjectId("6a884e1e19fc15d0bb166c7d"),
            //                 "moduleName": "Users",
            //                 "canView": true,
            //                 "canCreate": true,
            //                 "canEdit": true,
            //                 "canDelete": true,

            //             },
            //             {
            //                 "module": new mongoose.Types.ObjectId("6a884e1e19fc15d0bb166c7c"),
            //                 "moduleName": "Roles",
            //                 "canView": true,
            //                 "canCreate": true,
            //                 "canEdit": true,
            //                 "canDelete": true,

            //             },
            //             {
            //                 "module": new mongoose.Types.ObjectId("6a884e1e19fc15d0bb166c7b"),
            //                 "moduleName": "Modules",
            //                 "canView": true,
            //                 "canCreate": true,
            //                 "canEdit": true,
            //                 "canDelete": true,

            //             },
            //             {
            //                 "module": new mongoose.Types.ObjectId("6a884e1e19fc15d0bb166c7a"),
            //                 "moduleName": "Coupons",
            //                 "canView": true,
            //                 "canCreate": true,
            //                 "canEdit": true,
            //                 "canDelete": true,

            //             },
            //             {
            //                 "module": new mongoose.Types.ObjectId("6a884e1e19fc15d0bb166c79"),
            //                 "moduleName": "Role & Permission",
            //                 "canView": true,
            //                 "canCreate": true,
            //                 "canEdit": true,
            //                 "canDelete": true,

            //             },
            //             {
            //                 "module": new mongoose.Types.ObjectId("6a884e1e19fc15d0bb166c78"),
            //                 "moduleName": "Product Category",
            //                 "canView": true,
            //                 "canCreate": true,
            //                 "canEdit": true,
            //                 "canDelete": true,

            //             }
            //         ],
            //     }
            // ]);

            // Insert Intial users

            // await User.insertMany([
            //     {
            //         "name": "Nikhil Arora",
            //         "phone": "9811356113",
            //         "email": "na12@gmail.com",
            //         "password": "$2b$10$wVt.S425/Rdv8EGrE/m2G.4bYZoZ2FxfV/RZzqFDOFrK/WO5GBNrq",
            //         "role": "User",
            //         "status": "Active",
            //         "roleId": new mongoose.Types.ObjectId("6a5360d1d4a0dc03794e6fa7"),
            //     },
            //     {
            //         "name": "Dharamveer Arora",
            //         "phone": "9811356118",
            //         "email": "da12@gmail.com",
            //         "password": "$2b$10$XxSRFHVjEQKGuEb1UpsW1uRfQbhvpFm4MnuOI4O4s2rYHXAfaiz3C",
            //         "role": "User",
            //         "status": "Active",
            //         "roleId": new mongoose.Types.ObjectId("6a5360d1d4a0dc03794e6fa7"),
            //     },
            //     {
            //         "name": "Nikhil Arora",
            //         "phone": "9643644333",
            //         "email": "na8008983@gmail.com",
            //         "password": "$2b$10$D3mj3nRd9qjSV7oiZcvZB.uU6tK8mCDybFpLhOGqyFQ70kv8UFzPC",
            //         "role": "Super Admin",
            //         "status": "Active",
            //         "roleId": new mongoose.Types.ObjectId("6a536222d4a0dc03794e709b"),
            //     }
            // ])


        }

        const products = await Product.find();

        return NextResponse.json(products, { status: 200 });

    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 400 });
    }
}