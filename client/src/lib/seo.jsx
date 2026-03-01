import { Helmet } from 'react-helmet-async';

/**
 * SEO Component - Manages meta tags for each page
 * Usage: <SEO title="Page Title" description="Page description" image="/path/to/image.jpg" />
 */
export const SEO = ({ 
  title = 'Mugi Tattoo Studio | Professional Tattoo Artist', 
  description = 'Premium tattoo studio specializing in custom tattoo designs. Book your tattoo appointment online today.',
  image = 'https://mugi-tattoo.com/og-image.jpg',
  url = 'https://mugi-tattoo.com/',
  type = 'website',
  keywords = 'tattoo studio, tattoo artist, custom tattoos'
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
