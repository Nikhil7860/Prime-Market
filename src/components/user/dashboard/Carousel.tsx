"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const images = [
    "https://res.cloudinary.com/ddmzxke71/image/upload/v1782034904/samples/upscale-face-1.jpg",
    "https://res.cloudinary.com/ddmzxke71/image/upload/v1782034906/cld-sample-2.jpg",
    "https://res.cloudinary.com/ddmzxke71/image/upload/v1782034906/cld-sample-3.jpg",
    "https://res.cloudinary.com/ddmzxke71/image/upload/v1782034906/cld-sample-4.jpg",
    "https://res.cloudinary.com/ddmzxke71/image/upload/v1782034906/cld-sample-5.jpg",
    "https://res.cloudinary.com/ddmzxke71/image/upload/v1782034906/cld-sample-6.jpg",
];

export default function Carousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(
                (prev) => (prev + 1) % images.length
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative mx-auto mt-6 h-[220px] overflow-hidden rounded-2xl shadow-2xl sm:h-[300px] lg:h-[400px]">
            <Image
                src={images[currentIndex]}
                alt={`Banner ${currentIndex + 1}`}
                fill
                priority
                className="object-cover transition-opacity duration-700" />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Dots */}
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-3">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-3 w-3 rounded-full transition ${currentIndex === index ? "bg-white" : "bg-white/40"}`} />
                ))}
            </div>
        </div>
    );
}