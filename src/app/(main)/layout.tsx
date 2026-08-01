import Footer from "@/components/user/dashboard/Footer";
import Navbar from "@/components/user/dashboard/Navbar";
import { SocketProvider } from "@/providers/SocketProvider";


export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main>
                <SocketProvider>
                    {children}
                </SocketProvider>
            </main>
            <Footer />
        </>
    );
}