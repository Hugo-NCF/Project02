import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background dark:bg-[#030813]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-outline-variant/30 dark:border-[#1a202c] bg-primary dark:bg-[#01040a]">
        <div className="mx-auto flex flex-col items-center justify-between gap-8 px-8 py-12 max-w-7xl md:flex-row">
          <div>
            <span className="font-headline italic text-xl text-brass">Campus Careers</span>
            <p className="mt-3 text-[12px] text-on-primary-container max-w-xs leading-relaxed">
              © {new Date().getFullYear()} Campus Careers · SWE Project 02
            </p>
          </div>
          <div className="flex gap-8 text-[12px] text-on-primary-container">
            <span>About Us</span>
            <span>Privacy Policy</span>
            <span>Accessibility</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
