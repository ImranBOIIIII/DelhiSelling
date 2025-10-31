import { Helmet } from 'react-helmet-async';
import { SEOConfig, DEFAULT_SEO, BASE_URL, generateRobotsContent } from '../utils/seo';

interface SEOProps extends Partial<SEOConfig> {
  children?: React.ReactNode;
  schemaData?: object | object[];
}

export default function SEO({
  title = DEFAULT_SEO.title,
  description = DEFAULT_SEO.description,
  keywords = DEFAULT_SEO.keywords,
  ogImage = DEFAULT_SEO.ogImage,
  ogType = DEFAULT_SEO.ogType,
  canonicalUrl = DEFAULT_SEO.canonicalUrl,
  noindex = false,
  nofollow = false,
  children,
  schemaData,
}: SEOProps) {
  const fullTitle = title.includes('Delhi Selling') ? title : `${title} - Delhi Selling`;
  const robotsContent = generateRobotsContent(noindex, nofollow);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType || 'website'} />
      <meta property="og:url" content={canonicalUrl || BASE_URL} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:site_name" content="Delhi Selling" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl || BASE_URL} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      <meta name="twitter:creator" content="@delhiselling" />

      {/* Structured Data */}
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(schemaData) ? schemaData : [schemaData])}
        </script>
      )}

      {/* Additional custom elements */}
      {children}
    </Helmet>
  );
}
