import { prisma } from '@isyurtlari/database';

export default async function Head({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product) {
    return (
      <>
        <title>Ürün Bulunamadı | isyurtlari.com.tr</title>
        <meta name="robots" content="noindex" />
      </>
    );
  }

  const title = `${product.name} | isyurtlari.com.tr`;
  const description = `${product.name} - Adalet Bakanlığı'nın Sosyal Girişimi tarafından ${product.category.name} eğitimi alan hükümlüler tarafından el emeğiyle üretilmiştir.`;
  const url = `https://isyurtlari.com.tr/urun/${product.slug}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={`${product.name} | isyurtlari.com.tr`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="product" />
      {product.imageUrl && <meta property="og:image" content={product.imageUrl} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: product.name,
            description: product.description || description,
            price: product.price,
            priceCurrency: 'TRY',
            category: product.category.name,
            brand: {
              '@type': 'Organization',
              name: 'Adalet Bakanlığı İşyurtları',
            },
            offers: {
              '@type': 'Offer',
              availability: product.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              priceCurrency: 'TRY',
              price: product.price,
              url: url,
            },
          }),
        }}
      />
    </>
  );
}
