#!/usr/bin/env node

/**
 * Product Restoration Script
 * Adds sample categories and products back to the database
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const protocol = BASE_URL.startsWith('https') ? https : http;
    const url = new URL(path, BASE_URL);

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  console.log('🌱 Ürün ve Kategori Restorasyonu Başlıyor...\n');

  // Categories to create
  const categories = [
    { name: 'Gıda Ürünleri', slug: 'gida', description: 'Hükümlüler tarafından el emeğiyle üretilen gıda ürünleri' },
    { name: 'Tekstil Ürünleri', slug: 'tekstil', description: 'Derzillik eğitimi alan hükümlüler tarafından üretilen tekstil ürünleri' },
    { name: 'Ahşap Ürünleri', slug: 'ahsap', description: 'Marangozlık eğitimi sayesinde yapılan ahşap ve mobilya ürünleri' },
    { name: 'Sanat & Zanaat', slug: 'sanat-zanaat', description: 'El sanatları ve yaratıcı üretim programlarıyla yapılan ürünler' },
    { name: 'Peyzaj & Çiçek', slug: 'peyzaj-cicek', description: 'Peyzaj tasarımı eğitimi sayesinde hazırlanan ürünler' },
  ];

  console.log('📁 Kategoriler Ekleniyor...');
  const categoryMap = {};

  for (const cat of categories) {
    try {
      const res = await request('POST', '/api/admin/categories', cat);
      if (res.status === 201 || res.status === 200) {
        categoryMap[cat.slug] = res.data.id;
        console.log(`✅ ${cat.name} eklendi`);
      } else {
        console.log(`⚠️  ${cat.name} - Hata: ${res.data.error}`);
      }
    } catch (err) {
      console.error(`❌ ${cat.name} - İstek hatası:`, err.message);
    }
  }

  console.log('\n📦 Ürünler Ekleniyor...');

  const products = [
    // Gıda
    { name: 'Zeytinyağı - 500ml', slug: 'zeytinyagi-500ml', categorySlug: 'gida', price: 45, quantity: 50,
      description: 'Adalet Bakanlığı işyurtlarında üretilen saf zeytinyağı. %100 doğal ve organik.' },
    { name: 'Reçel Çeşitleri Paketi', slug: 'recel-cesitleri', categorySlug: 'gida', price: 35, quantity: 40,
      description: 'Ev yapımı reçel: Çilek, vişne, dut ve kayısı reçelleri. Her biri özenle hazırlanmıştır.' },
    { name: 'Bal & Arı Ürünleri', slug: 'bal-ari-urunleri', categorySlug: 'gida', price: 55, quantity: 30,
      description: 'Doğal arı ürünleri: Bal, propolis ve arı poleninden oluşan sağlık paketi.' },
    { name: 'Kuru Fasulye & Tahıllar', slug: 'kuru-fasulye-tahillar', categorySlug: 'gida', price: 28, quantity: 60,
      description: 'Seçilmiş kaliteli kuru fasulye, nohut ve tahıllar. Beslenme ve aşçılık eğitimi ürünü.' },

    // Tekstil
    { name: 'El Dokuma Örtüsü', slug: 'el-dokuma-ortusu', categorySlug: 'tekstil', price: 120, quantity: 20,
      description: 'Hükümlüler tarafından el dokuması yapılan çok amaçlı örtü. Derzillik eğitimi ürünü.' },
    { name: 'Pamuklu T-shirt Koleksiyonu', slug: 'pamuklu-tshirt', categorySlug: 'tekstil', price: 50, quantity: 80,
      description: 'Yumuşak pamuklu kumaştan dikilen şık t-shirtler. Farklı renklerde mevcuttur.' },
    { name: 'Takı Çantası', slug: 'takı-cantasi', categorySlug: 'tekstil', price: 65, quantity: 35,
      description: 'Derzillerince el emeğiyle dikilen, şık tasarımlı takı ve aksesuar çantası.' },
    { name: 'Bez Çanta Setleri', slug: 'bez-canta-setleri', categorySlug: 'tekstil', price: 45, quantity: 50,
      description: 'Kaliteli bezden yapılmış, çevre dostu alışveriş çantaları. 3\'lü set halinde.' },

    // Ahşap
    { name: 'Ceviz Ağacından Mutfak Seti', slug: 'ceviz-mutfak-seti', categorySlug: 'ahsap', price: 150, quantity: 15,
      description: 'Doğal ceviz ağacından oyulmuş, el yapımı mutfak aletleri seti. Marangozlık eğitimi ürünü.' },
    { name: 'Dekoratif Ahşap Kutular', slug: 'ahsap-kutular', categorySlug: 'ahsap', price: 85, quantity: 25,
      description: 'Renkli ve desenli ahşap saklama kutuları. Evinizdeki dekorasyonu güzelleştirecek.' },
    { name: 'Ahşap Beslenme Tahtaları', slug: 'ahsap-tahtalar', categorySlug: 'ahsap', price: 95, quantity: 30,
      description: 'Masif ahşaptan yapılan kesme tahtaları. Mutfakanızın ideal yardımcısı.' },

    // Sanat & Zanaat
    { name: 'El Yapımı Seramik Set', slug: 'seramik-set', categorySlug: 'sanat-zanaat', price: 110, quantity: 20,
      description: 'Sanat terapisi programı kapsamında yapılan seramik tabak ve kase seti.' },
    { name: 'Oya & Dantel Koleksiyonu', slug: 'oya-dantel', categorySlug: 'sanat-zanaat', price: 75, quantity: 40,
      description: 'Geleneksel oyacılık eğitimi sayesinde yapılan el danteli ve oyalar. Aksesuar ve dekorasyon için.' },
    { name: 'Çiçek Silindir Balotlar', slug: 'cicek-balotlar', categorySlug: 'peyzaj-cicek', price: 60, quantity: 35,
      description: 'Kurutulmuş ve preserved çiçeklerden yapılan dekoratif ürünler. Evinin güzelliğini arttır.' },
    { name: 'Doğal Sabun Koleksiyonu', slug: 'dogal-sabun', categorySlug: 'sanat-zanaat', price: 48, quantity: 45,
      description: 'Doğal yağlardan yapılan el yapımı sabunlar. Cilt sağlığı için ideal. Çevre dostu üretim.' },
  ];

  let addedCount = 0;
  for (const prod of products) {
    const categoryId = categoryMap[prod.categorySlug];
    if (!categoryId) {
      console.log(`⚠️  ${prod.name} - Kategori bulunamadı`);
      continue;
    }

    try {
      const res = await request('POST', '/api/admin/products', {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        categoryId,
        price: prod.price,
        quantity: prod.quantity,
        imageUrl: null,
      });

      if (res.status === 201 || res.status === 200) {
        console.log(`✅ ${prod.name}`);
        addedCount++;
      } else {
        console.log(`⚠️  ${prod.name} - Hata: ${res.data.error}`);
      }
    } catch (err) {
      console.error(`❌ ${prod.name} - İstek hatası:`, err.message);
    }

    // Small delay between requests
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\n✨ Tamamlandı! ${addedCount}/${products.length} ürün eklendi.\n`);
  console.log('💡 İpucu: Ürünlere resim eklemek için /admin/urunler sayfasını ziyaret edin.');
}

main().catch(err => {
  console.error('❌ Hata:', err);
  process.exit(1);
});
