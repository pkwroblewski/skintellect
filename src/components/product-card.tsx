import Image from "next/image";
import Link from "next/link";

export interface ProductBadge {
  label: string;
  variant: "success" | "info" | "warning" | "neutral";
}

export interface ProductCardProps {
  title: string;
  brand: string;
  imageUrl: string;
  status?: string;
  ingredients?: string[];
  badges?: ProductBadge[];
  href?: string;
}

const badgeStyles: Record<ProductBadge["variant"], string> = {
  success: "bg-green-100 text-green-700",
  info: "bg-blue-50 text-blue-600",
  warning: "bg-amber-50 text-amber-700",
  neutral: "bg-zinc-100 text-zinc-600",
};

export function ProductCard({
  title,
  brand,
  imageUrl,
  badges = [],
  href = "#",
}: ProductCardProps) {
  return (
    <Link href={href} className="block group">
      <article className="bg-white rounded-3xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* Image Section */}
        <div className="relative aspect-[4/3] bg-zinc-50 rounded-2xl overflow-hidden mb-4">
          <div className="absolute inset-0 p-4 flex items-center justify-center">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg 
                  className="w-16 h-16 text-zinc-200" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" 
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-1 mb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            {brand}
          </p>
          <h3 className="text-lg font-semibold text-zinc-900 truncate group-hover:text-zinc-700 transition-colors">
            {title}
          </h3>
        </div>

        {/* Badges Footer */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <span
                key={index}
                className={`text-xs px-3 py-1 rounded-full font-medium ${badgeStyles[badge.variant]}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}

