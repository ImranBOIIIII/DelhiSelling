import type { VercelRequest, VercelResponse } from '@vercel/node';

// This is a Vercel serverless function that generates a dynamic sitemap
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // In a real implementation, you would fetch products and categories from Firebase
    // For now, we'll generate a basic sitemap with static pages
    
    const baseUrl = 'https://delhiselling.com';
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/products', priority: '0.9', changefreq: 'daily' },
      { url: '/categories', priority: '0.9', changefreq: 'weekly' },
      { url: '/deals', priority: '0.8', changefreq: 'daily' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    ];
    
    // Categories
    const categories = [
      'ladies-purse',
      'gents-wallet',
      'school-bags',
      'laptop-bags',
      'tiffin-bags',
      'summer-bags',
      'trolly-bags',
      'suitcase',
      'slider-bags',
      'gym-bags',
      'office-bags'
    ];
    
    // Build XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add static pages
    staticPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });
    
    // Add category pages
    categories.forEach(category => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/category/${category}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    
    // Set headers
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    
    return res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}
