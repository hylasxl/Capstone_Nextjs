import Navbar from "@/components/NavBar";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex-1 flex flex-col">
            <Navbar />
            <div className="flex-1 p-6 bg-gray-100 overflow-auto">
                {children}
            </div>
        </div>
    );
}
