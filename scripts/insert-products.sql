-- Gıda Kategorisi
INSERT INTO "ProductCategory" (id, name, slug, description, "createdAt")
VALUES (
  'gida-cat-001',
  'Gıda Ürünleri',
  'gida-urunleri',
  'Adalet Bakanlığı İsyurtları tarafından üretilen kaliteli gıda ürünleri',
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- Ürünleri Ekle
INSERT INTO "Product" (id, name, slug, description, "categoryId", price, quantity, "imageUrl", "createdAt", "updatedAt")
VALUES
  ('1', 'Badem', 'badem', 'İsyurtları tarafından üretilen kaliteli badem. Taze ve besleyici.', (SELECT id FROM "ProductCategory" WHERE slug = 'gida-urunleri' LIMIT 1), 45.00, 50, 'https://iydb.adalet.gov.tr/Resimler/Galeri/27102022162041badem.jpg', NOW(), NOW()),
  ('2', 'Biber Reçeli', 'biber-receli', 'Ev yapımı biber reçeli. Doğal ve katkısız.', (SELECT id FROM "ProductCategory" WHERE slug = 'gida-urunleri' LIMIT 1), 30.00, 40, 'https://iydb.adalet.gov.tr/Resimler/Galeri/27102022162645biber%20receli.jpg', NOW(), NOW()),
  ('3', 'Biber Salçası', 'biber-salcasi', 'Geleneksel yöntemle yapılmış biber salçası.', (SELECT id FROM "ProductCategory" WHERE slug = 'gida-urunleri' LIMIT 1), 28.00, 40, 'https://iydb.adalet.gov.tr/Resimler/Galeri/27102022162742biber%20salçası.jpg', NOW(), NOW()),
  ('4', 'Çekirdek', 'cekirdek', 'İsyurtları bahçesinden taze çekirdek.', (SELECT id FROM "ProductCategory" WHERE slug = 'gida-urunleri' LIMIT 1), 35.00, 35, 'https://iydb.adalet.gov.tr/Resimler/Galeri/27102022162813çekirdek.jpg', NOW(), NOW()),
  ('5', 'Domates Salçası', 'domates-salcasi', 'Doğal koşullarda kurutulmuş domates ile yapılmış salça.', (SELECT id FROM "ProductCategory" WHERE slug = 'gida-urunleri' LIMIT 1), 25.00, 45, 'https://iydb.adalet.gov.tr/Resimler/Galeri/27102022162823domates%20salcası.jpg', NOW(), NOW()),
  ('6', 'Fındık', 'findik', 'Taze ve lezzetli fındık. Bol besleyici değer.', (SELECT id FROM "ProductCategory" WHERE slug = 'gida-urunleri' LIMIT 1), 65.00, 30, 'https://iydb.adalet.gov.tr/Resimler/Galeri/27102022162828fındık.jpg', NOW(), NOW()),
  ('7', 'Haşaş Ezme', 'hasas-ezme', 'Sesam tohumundan yapılmış haşaş ezme.', (SELECT id FROM "ProductCategory" WHERE slug = 'gida-urunleri' LIMIT 1), 32.00, 25, 'https://iydb.adalet.gov.tr/Resimler/Galeri/27102022162847haşaşezmesi.jpg', NOW(), NOW()),
  ('8', 'İncir Reçeli', 'incir-receli', 'Ev yapımı, doğal incir reçeli. Tatlı ve besleyici.', (SELECT id FROM "ProductCategory" WHERE slug = 'gida-urunleri' LIMIT 1), 35.00, 30, 'https://iydb.adalet.gov.tr/Resimler/Galeri/27102022162924incirreçeli.jpg', NOW(), NOW()),
  ('9', 'Kuru Baklagil', 'kuru-baklagil', 'Kuru nohut, fasulye ve mercimek karışımı.', (SELECT id FROM "ProductCategory" WHERE slug = 'gida-urunleri' LIMIT 1), 18.00, 50, 'https://iydb.adalet.gov.tr/Resimler/Galeri/27102022162931kurubakliyat.jpg', NOW(), NOW()),
  ('10', 'Pirinç', 'pirinc', 'Kaliteli, hasıl pirinç. Pişmesi kolay.', (SELECT id FROM "ProductCategory" WHERE slug = 'gida-urunleri' LIMIT 1), 15.00, 60, 'https://iydb.adalet.gov.tr/Resimler/Galeri/27102022162936pirinc.jpg', NOW(), NOW()),
  ('11', 'Sarı Üzüm (Kuru Üzüm)', 'sari-uzum', 'Kurutulmuş sarı üzüm. Doğal şeker kaynağı.', (SELECT id FROM "ProductCategory" WHERE slug = 'gida-urunleri' LIMIT 1), 40.00, 35, 'https://iydb.adalet.gov.tr/Resimler/Galeri/27102022162942sarıüzüm.jpg', NOW(), NOW()),
  ('12', 'Siyah Üzüm (Kuru Üzüm)', 'siyah-uzum', 'Seçkin siyah kuru üzüm. Antioksidan açısından zengin.', (SELECT id FROM "ProductCategory" WHERE slug = 'gida-urunleri' LIMIT 1), 42.00, 35, 'https://iydb.adalet.gov.tr/Resimler/Galeri/27102022162951siyahüzüm.jpg', NOW(), NOW()),
  ('13', 'Tereyağ', 'tereyag', 'Doğal yapımda, hiçbir katkı maddesi olmayan tereyağ.', (SELECT id FROM "ProductCategory" WHERE slug = 'gida-urunleri' LIMIT 1), 55.00, 25, 'https://iydb.adalet.gov.tr/Resimler/Galeri/27102022162956tereyağ.jpg', NOW(), NOW()),
  ('14', 'Üzüm Pekmezi', 'uzum-pekmezi', 'Doğal üzüm pekmezi. Şeker ilavesi yok.', (SELECT id FROM "ProductCategory" WHERE slug = 'gida-urunleri' LIMIT 1), 32.00, 30, 'https://iydb.adalet.gov.tr/Resimler/Galeri/27102022163002üzüm%20pekmezi.jpg', NOW(), NOW()),
  ('15', 'Yer Fıstığı', 'yer-fistagi', 'Taze yer fıstığı. Protein açısından zengin.', (SELECT id FROM "ProductCategory" WHERE slug = 'gida-urunleri' LIMIT 1), 38.00, 40, 'https://iydb.adalet.gov.tr/Resimler/Galeri/27102022163009yerfıstığı.jpg', NOW(), NOW()),
  ('16', 'Yeşil Zeytin', 'yesil-zeytin', 'İsyurtları tarımında üretilen yeşil zeytin.', (SELECT id FROM "ProductCategory" WHERE slug = 'gida-urunleri' LIMIT 1), 48.00, 25, 'https://iydb.adalet.gov.tr/Resimler/Galeri/27102022163015yeşilzeytin.jpg', NOW(), NOW()),
  ('17', 'Zeytinyağ', 'zeytinyag', 'Extra virgin zeytinyağ. Soğuk preslenmiş.', (SELECT id FROM "ProductCategory" WHERE slug = 'gida-urunleri' LIMIT 1), 75.00, 20, 'https://iydb.adalet.gov.tr/Resimler/Galeri/27102022163021zeytinyağ.jpg', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;
