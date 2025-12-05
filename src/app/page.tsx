import { Hero } from "@/components/hero";
import { ProductGrid } from "@/components/product-grid";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-rose-500 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      <div id="main-content">
        {/* Hero Section with Tabbed Search */}
        <Hero />

        {/* Product Browse Section with Sidebar Filters */}
        <ProductGrid />

        {/* Features Section (Dark) */}
        <FeaturesSection />
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
