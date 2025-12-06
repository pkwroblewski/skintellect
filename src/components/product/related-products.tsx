/**
 * Related Products Component
 * 
 * Shows similar products the user might be interested in.
 */

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui";

interface RelatedProduct {
  id: string;
  slug: string;
  name: string;
  brand: {
    name: string;
  };
  category: string;
  imageUrl?: string | null;
  safetyScore: number;
  isFungalAcneSafe: boolean;
  averageRating?: number | null;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
  title?: string;
}

export function RelatedProducts({ products, title = "You Might Also Like" }: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {products.slice(0, 4).map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group block"
          >
            <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-2 relative">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                  <svg 
                    className="w-8 h-8 text-slate-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
              )}
              
              {/* FA Safe badge overlay */}
              {product.isFungalAcneSafe && (
                <div className="absolute top-1.5 right-1.5">
                  <Badge variant="success" size="sm">FA</Badge>
                </div>
              )}
            </div>
            
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                {product.brand.name}
              </p>
              <p className="text-xs font-medium text-slate-900 line-clamp-2 group-hover:text-rose-700 transition-colors">
                {product.name}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {product.averageRating != null && product.averageRating > 0 && (
                  <div className="flex items-center gap-0.5">
                    <svg
                      className="w-3 h-3 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-[10px] text-slate-500">
                      {product.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}
                <span className="text-[10px] text-slate-400">
                  Score: {product.safetyScore.toFixed(1)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

