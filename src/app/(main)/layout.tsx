import Footer from "@/components/user/dashboard/Footer";
import Navbar from "@/components/user/dashboard/Navbar";


export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    );
}