"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Plus } from "lucide-react";

import { LogoCITi } from "@/assets";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const linkBase =
  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors";

export function Header() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Esquerda: logo + nome */}
        <Link href="/" className="flex items-center gap-3">
          <Image src={LogoCITi} alt="CITi" height={32} className="w-auto" priority />
          <span className="text-lg font-medium text-gray-800">
            Biblioteca Escolar
          </span>
        </Link>

        {/* Direita: navegação + CTA */}
        <nav className="flex items-center gap-2" aria-label="Navegação principal">
          <Link
            href="/"
            className={cn(
              linkBase,
              isActive("/")
                ? "bg-emerald-50 text-emerald-600"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Dashboard
          </Link>

          <Link
            href="/livros"
            className={cn(
              linkBase,
              isActive("/livros")
                ? "bg-emerald-50 text-emerald-600"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Livros
          </Link>

          <Button
            asChild
            className="ml-2 bg-emerald-500 text-white hover:bg-emerald-600"
          >
            <Link href="/formPage">
              <Plus className="h-4 w-4" />
              Novo Livro
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}