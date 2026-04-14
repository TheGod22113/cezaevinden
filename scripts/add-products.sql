-- Gıda Ürünleri Kategorisini Kontrol Et ve Ekle
INSERT INTO "ProductCategory" (id, name, slug, description, "imageUrl", "createdAt")
VALUES
  ('cat-gida', 'Gıda Ürünleri', 'gida-urunleri', 'Adalet Bakanlığı İşyurtlarında Üretilen Gıda Ürünleri', NULL, NOW())
ON CONFLICT (slug) DO NOTHING;

-- Ürünleri Ekle
INSERT INTO "Product" (id, name, slug, description, "categoryId", price, quantity, "imageUrl", "createdAt", "updatedAt")
SELECT
  substr(md5(random()::text), 1, 12),
  name,
  LOWER(REPLACE(REPLACE(REPLACE(REPLACE(name, ' ', '-'), 'ç', 'c'), 'ğ', 'g'), 'ş', 's')),
  description,
  'cat-gida',
  price,
  100, -- Default stok
  NULL, -- Resim URL'si daha sonra eklenebilir
  NOW(),
  NOW()
FROM (VALUES
  ('Badem', 'Adalet Bakanlığı işyurtlarında özel olarak seçilmiş ve işlenmiş badem.'),
  ('Biber Reçeli', 'Taze biberlerin geleneksel yöntemlerle reçel haline getirilmiş hali.'),
  ('Biber Salçası', 'Doğal malzemeler kullanılarak yapılan biber salçası.'),
  ('Çekirdek', 'Seçilmiş ve işlenmiş çeşitli çekirdek ürünleri.'),
  ('Domates Salçası', 'Kaliteli domateslerden yapılan doğal domates salçası.'),
  ('Fındık', 'Türkiye''nin ünlü fındıklarından seçilmiş ürün.'),
  ('Haşa Sezmesi', 'Geleneksel Anadolu lezzetlerinden biri olan haşa sezmesi.'),
  ('İncir Reçeli', 'Taze incirlerin özel tarifi ile yapılan reçel.'),
  ('Kuru Baklagil', 'Çeşitli kuru baklagil ürünleri (nohut, fasulye, vb.).'),
  ('Pirinç', 'Yüksek kaliteli pirinç ürünleri.'),
  ('Sarı Üzüm', 'Kurutulmuş sarı üzüm (kismiş).'),
  ('Siyah Üzüm', 'Kurutulmuş siyah üzüm.'),
  ('Tereyağ', 'Saf ve doğal tereyağ.'),
  ('Üzüm Pekmezi', 'Geleneksel yöntemle yapılan üzüm pekmezi.'),
  ('Yerfıstığı', 'Seçilmiş ve işlenmiş yerfıstığı.'),
  ('Yeşil Zeytin', 'Taze yeşil zeytin ürünleri.'),
  ('Zeytin Yağı', 'İlk sıkımdan elde edilen zeytin yağı.')
) AS products(name, description)
ON CONFLICT (slug) DO NOTHING;
