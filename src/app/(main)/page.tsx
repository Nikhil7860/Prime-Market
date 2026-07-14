"use client";

import { useEffect, useState } from "react";
import Carousel from "@/components/user/dashboard/Carousel";
import ProductCard from "@/components/user/products/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import { getProducts } from "@/services/product.service";
import { useAppDispatch } from "@/hooks/redux";
import { addCategory, addToCartState } from "@/redux/cart/cartSlice";

interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price: number;
  stock: number;
}

export default function HomePage() {
  const dispatch = useAppDispatch();
  const [productList, setProductList] = useState<Product[]>([]);
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scroll = (category: string, direction: "left" | "right") => {
    const container = scrollRefs.current[category];
    if (!container) return;
    container.scrollBy({ left: direction === "right" ? 1200 : -1200, behavior: "smooth" });
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data: any = await getProducts();

      const productList = Array.isArray(data) ? data : [];

      setProductList(productList);

      const uniqueCategories: any = [
        "All",
        ...new Set(productList.map((item: any) => item.categoryName)),
      ];
      dispatch(addCategory(uniqueCategories));
    } catch (error) {
      console.error(error);
    }
  };


  const groupedProducts = productList.reduce((acc: any, product: any) => {
    if (!acc[product.category]) acc[product.categoryName] = [];
    acc[product.categoryName].push(product);
    return acc;
  }, {});

  return (
    <>
      <div className="min-h-screen bg-slate-950">
        <main className="mx-auto w-full max-w-[1700px] px-3 py-5 sm:px-5 lg:px-8">

          <Carousel />

          {Object.entries(groupedProducts).map(([category, items]: any) => (

            <section
              key={category}
              className="mt-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-4 sm:mt-12 sm:p-6 lg:mt-16 lg:p-8"
            >

              {/* Header */}

              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 text-3xl shadow-lg sm:h-16 sm:w-16 sm:text-4xl">
                    📱
                  </div>

                  <div>

                    <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                      {category}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400 sm:text-base">
                      Explore our latest {category.toLowerCase()} collection
                    </p>

                  </div>

                </div>

                <Link
                  href={`/products?category=${category.toLowerCase()}`}
                  className="rounded-full border border-blue-500
    px-5 py-2
    text-blue-400
    transition
    hover:bg-blue-500
    hover:text-white"
                >
                  View All →
                </Link>

              </div>

              {/* Product Slider */}

              <div className="group relative">

                {/* Left Arrow */}

                <button
                  onClick={() => scroll(category, "left")}
                  aria-label="Scroll Left"
                  className="
        absolute left-2 top-1/2 z-20
        flex h-10 w-10 -translate-y-1/2
        items-center justify-center
        rounded-full
        border border-slate-700
        bg-slate-900/90
        text-white
        shadow-xl
        backdrop-blur-md

        opacity-100
        lg:opacity-0
        lg:group-hover:opacity-100

        transition-all duration-300
        hover:scale-110
        hover:border-blue-500
        hover:bg-blue-600
        active:scale-95
    "
                >
                  <ChevronLeft
                    size={22}
                    className="transition-transform duration-300 group-hover:-translate-x-0.5"
                  />
                </button>

                {/* Products */}

                <div
                  ref={(el) => {
                    scrollRefs.current[category] = el;
                  }}
                  className="
              scrollbar-hide
              overflow-x-auto
              scroll-smooth
              px-0
              xl:px-16
            "
                >
                  <ProductCard product={items} />
                </div>

                {/* Right Arrow */}

                <button
                  onClick={() => scroll(category, "right")}
                  className="
    absolute right-2 top-1/2 z-20
    flex -translate-y-1/2
    h-10 w-10
    sm:h-11 sm:w-11
    lg:h-12 lg:w-12
    items-center justify-center
    rounded-full
    border border-slate-700
    bg-slate-900/90
    text-white
    shadow-xl
    backdrop-blur-md

    opacity-100
    lg:opacity-0
    lg:group-hover:opacity-100

    transition-all duration-300
    hover:scale-110
    hover:border-blue-500
    hover:bg-blue-600

    active:scale-95
  "
                >
                  <ChevronRight size={28} className="sm:h-6 sm:w-6" />
                </button>

              </div>

            </section>

          ))}

        </main>
      </div>

    </>
  );
}