"use client";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { LayoutDashboard, LayoutTemplate, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        if (pathname !== "/admin/login" && pathname !== "/admin/register") {
          router.push("/admin/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading Admin...</div>;

  if (!isAuthenticated && (pathname === "/admin/login" || pathname === "/admin/register")) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  if (!isAuthenticated) return null;

  const navLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Hero Section", href: "/admin/hero", icon: LayoutTemplate },
    { name: "Partners", href: "/admin/partners", icon: LayoutTemplate },
    { name: "Services", href: "/admin/services", icon: LayoutTemplate },
    { name: "Case Studies", href: "/admin/casestudies", icon: LayoutTemplate },
    { name: "Reviews", href: "/admin/reviews", icon: LayoutTemplate },
    { name: "Pricing", href: "/admin/pricing", icon: LayoutTemplate },
    { name: "FAQ", href: "/admin/faq", icon: LayoutTemplate },
    { name: "Contact", href: "/admin/contact", icon: LayoutTemplate }
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md z-10 hidden md:block border-r border-gray-200">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">ArtFolio DB</h2>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.name} href={link.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}>
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-8"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between md:hidden">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={handleLogout} className="text-red-500"><LogOut/></button>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
