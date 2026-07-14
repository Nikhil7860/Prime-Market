// app/category/[categoryId]/page.tsx

import ProductGrid from "@/components/user/products/ProductGrid";

export default async function CategoryPage({
    params,
}: {
    params: { categoryId: string };
}) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/category/${params.categoryId}`,
        {
            cache: "no-store",
        }
    );

    const products = await res.json();

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">
                Products
            </h1>

            <ProductGrid products={products} />
        </div>
    );
}