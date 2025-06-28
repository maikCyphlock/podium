"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut, SessionProvider } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/dashboard", label: "Dashboard", private: true },
  { href: "/events", label: "Eventos", private: true },
  { href: "/dashboard/profile", label: "Perfil", private: true },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isLoggedIn = !!session?.user;
  const userRole = session?.user?.role;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full border-b bg-white/95 backdrop-blur sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between gap-4 px-2 md:px-0">
        <div className="flex mx-3 items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Icons.Trophy className="h-6 w-6 text-blue-600" />
            Podium
          </Link>
          <div className="hidden md:flex gap-2 ml-6">
            {navLinks.map((link) => {
              if (link.private && !isLoggedIn) return null;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === link.href ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {mobileOpen ? <Icons.X className="h-6 w-6" /> : <Icons.Menu className="h-6 w-6" />}
          </button>
        </div>
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <span className="hidden md:inline text-sm text-gray-600 mr-2">
                {session.user.name || session.user.email}
              </span>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                <Icons.LogOut className="h-4 w-4 mr-1" /> Salir
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">
                  <Icons.LogIn className="h-4 w-4 mr-1" /> Ingresar
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">
                  <Icons.UserPlus className="h-4 w-4 mr-1" /> Registrarse
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b px-4 pb-4 pt-2 shadow-sm animate-fade-in-down">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              if (link.private && !isLoggedIn) return null;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${pathname === link.href ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex flex-col gap-2 mt-2">
              {isLoggedIn ? (
                <Button variant="outline" size="sm" onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}>
                  <Icons.LogOut className="h-4 w-4 mr-1" /> Salir
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm" onClick={() => setMobileOpen(false)}>
                    <Link href="/login">
                      <Icons.LogIn className="h-4 w-4 mr-1" /> Ingresar
                    </Link>
                  </Button>
                  <Button asChild size="sm" onClick={() => setMobileOpen(false)}>
                    <Link href="/register">
                      <Icons.UserPlus className="h-4 w-4 mr-1" /> Registrarse
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 