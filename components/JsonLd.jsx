// components/JsonLd.jsx

export default function JsonLd({
  softwareName,
  rating,
  reviewCount,
  price,
  currency,
  category,
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": softwareName,
    "applicationCategory": category,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency,
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating.toString(),
      "reviewCount": reviewCount.toString(),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}