// SEO Utility Functions and Constants

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

// Base URL - Update this with your actual domain
export const BASE_URL = "https://delhiselling.com";

// Default SEO Configuration
export const DEFAULT_SEO: SEOConfig = {
  title: "Delhi Selling - Bulk Bags Wholesale Supplier in Delhi | Best Prices",
  description:
    "Leading bulk bags supplier in Delhi. Buy wholesale bags at best prices. Wide range of handbags, backpacks, travel bags, laptop bags & more. Quality guaranteed. Shop now!",
  keywords:
    "bulk bags Delhi, wholesale bags, bags supplier Delhi, bulk handbags, wholesale backpacks, bags dealer, cheap bags bulk, bags wholesale India, Delhi bags market, bulk luggage",
  ogImage: `${BASE_URL}/og-image.webp`,
  ogType: "website",
  canonicalUrl: BASE_URL,
};

// Page-specific SEO configurations
export const PAGE_SEO: Record<string, SEOConfig> = {
  home: {
    title:
      "Delhi Selling - Bulk Bags Wholesale Supplier in Delhi | Best Prices",
    description:
      "Leading bulk bags supplier in Delhi. Buy wholesale bags at best prices. Wide range of handbags, backpacks, travel bags, laptop bags & more. Quality guaranteed.",
    keywords:
      "bulk bags Delhi, wholesale bags, bags supplier Delhi, bulk handbags, wholesale backpacks, bags dealer",
    canonicalUrl: BASE_URL,
  },
  products: {
    title: "All Bags - Delhi Selling | Wholesale Bags Collection",
    description:
      "Browse our complete collection of wholesale bags. Find the best deals on handbags, backpacks, travel bags, laptop bags and more. Bulk pricing available.",
    keywords:
      "wholesale bags, bulk bags, delhi bags, bags catalog, wholesale handbags, bulk backpacks",
    canonicalUrl: `${BASE_URL}/products`,
  },
  categories: {
    title: "Bag Categories - Delhi Selling | Shop Bags by Category",
    description:
      "Explore our wide range of bag categories. From handbags to backpacks, find all types of bags for your business at wholesale prices.",
    keywords:
      "bag categories, wholesale bag types, delhi bags categories, handbags backpacks travel bags",
    canonicalUrl: `${BASE_URL}/categories`,
  },
  deals: {
    title: "Bulk Bag Deals & Special Offers - Delhi Selling",
    description:
      "Discover amazing bulk bag deals and special offers. Save more when you buy bags in bulk. Limited time offers on premium quality bags.",
    keywords:
      "bulk bag deals, wholesale bag offers, special deals delhi bags, bulk bag discounts",
    canonicalUrl: `${BASE_URL}/deals`,
  },
  contact: {
    title: "Contact Us - Delhi Selling | Bulk Bags Inquiries",
    description:
      "Get in touch with Delhi Selling for wholesale bag inquiries, bulk orders, or customer support. We are here to help your business grow.",
    keywords:
      "contact delhi selling, wholesale bags inquiry, bulk bag order contact",
    canonicalUrl: `${BASE_URL}/contact`,
  },
  about: {
    title: "About Us - Delhi Selling | Your Trusted Wholesale Bags Partner",
    description:
      "Learn about Delhi Selling, your trusted partner for wholesale bags and bulk deals in Delhi. Quality bags, competitive prices, reliable service.",
    keywords:
      "about delhi selling, wholesale bags company delhi, bulk bags supplier",
    canonicalUrl: `${BASE_URL}/about`,
  },
  cart: {
    title: "Shopping Cart - Delhi Selling",
    description:
      "Review your cart and proceed to checkout. Secure payment and fast delivery across Delhi NCR.",
    noindex: true,
    canonicalUrl: `${BASE_URL}/cart`,
  },
  checkout: {
    title: "Checkout - Delhi Selling",
    description:
      "Complete your order securely. Fast checkout process with multiple payment options.",
    noindex: true,
    nofollow: true,
    canonicalUrl: `${BASE_URL}/checkout`,
  },
  account: {
    title: "My Account - Delhi Selling",
    description:
      "Manage your account, view orders, and update your preferences.",
    noindex: true,
    canonicalUrl: `${BASE_URL}/account`,
  },
  login: {
    title: "Login - Delhi Selling",
    description:
      "Login to your Delhi Selling account to manage orders and preferences.",
    noindex: true,
    nofollow: true,
    canonicalUrl: `${BASE_URL}/login`,
  },
};

// Generate page-specific SEO config
export function getPageSEO(page: keyof typeof PAGE_SEO): SEOConfig {
  return PAGE_SEO[page] || DEFAULT_SEO;
}

// Generate product-specific SEO
export function getProductSEO(
  productName: string,
  description: string,
  price: number,
  category: string,
  imageUrl?: string,
): SEOConfig {
  return {
    title: `${productName} - Delhi Selling | Wholesale & Bulk Deals`,
    description: `${description.substring(0, 155)}... Buy ${productName} at wholesale prices. Starting from ₹${price}. Fast delivery in Delhi NCR.`,
    keywords: `${productName}, ${category}, wholesale ${category}, bulk ${productName}, delhi`,
    ogImage: imageUrl || DEFAULT_SEO.ogImage,
    ogType: "product",
  };
}

// Generate category-specific SEO
export function getCategorySEO(
  categoryName: string,
  description?: string,
  productCount?: number,
): SEOConfig {
  const desc =
    description ||
    `Shop wholesale ${categoryName} products at Delhi Selling. Best prices on bulk orders.`;
  const count = productCount ? ` Browse ${productCount}+ products.` : "";

  return {
    title: `${categoryName} - Delhi Selling | Wholesale ${categoryName} Products`,
    description: `${desc}${count} Fast delivery across Delhi NCR.`,
    keywords: `${categoryName} wholesale, bulk ${categoryName}, ${categoryName} delhi, wholesale ${categoryName} india`,
    canonicalUrl: `${BASE_URL}/category/${categoryName.toLowerCase().replace(/\s+/g, "-")}`,
  };
}

// Generate structured data for products
export function generateProductSchema(product: {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image || `${BASE_URL}/default-product.jpg`,
    brand: {
      "@type": "Brand",
      name: "Delhi Selling",
    },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/product/${product.id}`,
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.inStock !== false
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Delhi Selling",
      },
    },
    aggregateRating:
      product.rating && product.reviewCount
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
    category: product.category,
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

// Generate FAQ structured data
export function generateFAQSchema(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Generate Organization structured data
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Delhi Selling",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.webp`,
    description:
      "Leading bulk bags wholesale supplier in Delhi. Quality bags at best prices.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Delhi",
      addressRegion: "DL",
      addressCountry: "IN",
    },
    sameAs: [
      "https://www.facebook.com/delhiselling",
      "https://www.instagram.com/delhiselling",
      "https://twitter.com/delhiselling",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["English", "Hindi"],
    },
  };
}

// Helper to sanitize text for SEO
export function sanitizeForSEO(text: string): string {
  return text
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim()
    .substring(0, 160); // Limit length
}

// Generate meta robots content
export function generateRobotsContent(
  noindex?: boolean,
  nofollow?: boolean,
): string {
  const directives: string[] = [];

  if (noindex) {
    directives.push("noindex");
  } else {
    directives.push("index");
  }

  if (nofollow) {
    directives.push("nofollow");
  } else {
    directives.push("follow");
  }

  directives.push(
    "max-image-preview:large",
    "max-snippet:-1",
    "max-video-preview:-1",
  );

  return directives.join(", ");
}

// Generate sitemap URLs
export function generateSitemapUrls(
  products: { id: string; name: string; updatedAt?: Date }[],
  categories: { id: string; name: string }[],
) {
  const urls: {
    loc: string;
    lastmod?: string;
    changefreq: string;
    priority: number;
  }[] = [];

  // Static pages
  urls.push(
    { loc: BASE_URL, changefreq: "daily", priority: 1.0 },
    { loc: `${BASE_URL}/products`, changefreq: "daily", priority: 0.9 },
    { loc: `${BASE_URL}/categories`, changefreq: "weekly", priority: 0.9 },
    { loc: `${BASE_URL}/deals`, changefreq: "daily", priority: 0.8 },
    { loc: `${BASE_URL}/contact`, changefreq: "monthly", priority: 0.7 },
    { loc: `${BASE_URL}/about`, changefreq: "monthly", priority: 0.7 },
  );

  // Category pages
  categories.forEach((category) => {
    urls.push({
      loc: `${BASE_URL}/category/${category.id}`,
      changefreq: "weekly",
      priority: 0.8,
    });
  });

  // Product pages
  products.forEach((product) => {
    urls.push({
      loc: `${BASE_URL}/product/${product.id}`,
      lastmod: product.updatedAt
        ? product.updatedAt.toISOString().split("T")[0]
        : undefined,
      changefreq: "weekly",
      priority: 0.7,
    });
  });

  return urls;
}
