// Dynamic Sitemap Generator
import { Product, Category } from '../types';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

const BASE_URL = 'https://delhiselling.com';

export function generateSitemap(products: Product[], categories: Category[]): string {
  const urls: SitemapUrl[] = [];

  // Add static pages
  urls.push({
    loc: BASE_URL,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 1.0,
  });

  urls.push({
    loc: `${BASE_URL}/products`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.9,
  });

  urls.push({
    loc: `${BASE_URL}/categories`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.9,
  });

  urls.push({
    loc: `${BASE_URL}/deals`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.8,
  });

  urls.push({
    loc: `${BASE_URL}/contact`,
    changefreq: 'monthly',
    priority: 0.7,
  });

  urls.push({
    loc: `${BASE_URL}/about`,
    changefreq: 'monthly',
    priority: 0.7,
  });

  // Add category pages
  categories.forEach((category) => {
    const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    urls.push({
      loc: `${BASE_URL}/category/${category.id || categorySlug}`,
      changefreq: 'weekly',
      priority: 0.8,
    });
  });

  // Add product pages
  products.forEach((product) => {
    urls.push({
      loc: `${BASE_URL}/product/${product.id}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.7,
    });
  });

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map((url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Generate a downloadable sitemap blob
export function downloadSitemap(products: Product[], categories: Category[]): void {
  const sitemapContent = generateSitemap(products, categories);
  const blob = new Blob([sitemapContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate sitemap and save to public directory (for build time)
export async function saveSitemap(products: Product[], categories: Category[]): Promise<string> {
  const sitemapContent = generateSitemap(products, categories);
  return sitemapContent;
}
