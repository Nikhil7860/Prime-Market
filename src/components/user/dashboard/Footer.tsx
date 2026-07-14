export default function Footer() {
    return (
        <footer className="mt-16 border-t border-white/10 bg-slate-900">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-center text-sm text-gray-400 md:flex-row">
                <div>
                    <h2 className="text-lg font-bold text-white">
                        🛍️ PrimeMarket
                    </h2>

                    <p className="mt-1">
                        Your one-stop destination for online shopping.
                    </p>
                </div>

                <div className="flex gap-6">
                    <a
                        href="#"
                        className="transition hover:text-blue-400"
                    >
                        Privacy Policy
                    </a>

                    <a
                        href="#"
                        className="transition hover:text-blue-400"
                    >
                        Terms
                    </a>

                    <a
                        href="#"
                        className="transition hover:text-blue-400"
                    >
                        Contact
                    </a>
                </div>

                <p>
                    © {new Date().getFullYear()} PrimeMarket. All rights reserved.
                </p>
            </div>
        </footer>
    );
}