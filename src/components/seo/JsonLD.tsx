export default function JsonLD() {
  const data = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: "Kampung Berseri Sulang Kidul",
    description:
      "Wisata edukasi modern di Jogja dan Klaten dengan pengalaman pertanian organik, TOGA, silase ternak, dan green tourism.",
    touristType: [
      "Educational Tourism",
      "Family Tourism",
      "School Study Tour",
      "Green Tourism",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bantul",
      addressRegion: "Daerah Istimewa Yogyakarta",
      addressCountry: "Indonesia",
    },
    image: "https://kampungberseri.id/og-jogja-tourism.jpg",
    url: "https://kampungberseri.id",
    telephone: "+6285643545567",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}