"use client";

interface Props {
    title: string;
    description: string;
}

export default function DashboardHeader({ title, description }: Props) {
    return (
        <div className="mb-10">

            <h1 className="text-4xl font-bold tracking-tight text-white">

                {title}

            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">

                {description}

            </p>

        </div>
    );
}