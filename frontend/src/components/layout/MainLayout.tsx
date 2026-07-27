import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Har public page (Home, About, Courses...) le eutai Navbar ra Footer
 * share garcha. Har page ma <Navbar /> ra <Footer /> alag-alag import
 * garने sato, yaha euta पटक matra wrap garने. <Outlet /> chai React
 * Router ko special placeholder ho — jun page URL sangai match huncha,
 * tyo page yahi render huncha.
 */
export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-cream-100">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}