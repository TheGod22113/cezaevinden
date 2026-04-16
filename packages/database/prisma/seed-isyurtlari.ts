import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 İşyurtları Ürünleri Seeding Başlıyor...')

  // Create or update categories (don't delete existing ones)
  const gida = await prisma.productCategory.upsert({
    where: { slug: 'gida' },
    update: {},
    create: {
      name: 'Gıda Ürünleri',
      slug: 'gida',
      description: 'Adalet Bakanlığı İşyurtlarında üretilen gıda ürünleri'
    }
  })

  // Create Temizlik ve Kozmetik category
  const temizlik = await prisma.productCategory.upsert({
    where: { slug: 'temizlik' },
    update: { name: 'Temizlik ve Kozmetik' },
    create: {
      name: 'Temizlik ve Kozmetik',
      slug: 'temizlik',
      description: 'Adalet Bakanlığı İşyurtlarında üretilen temizlik ve kozmetik ürünleri'
    }
  })

  // Create Hediyelik category
  const hediyelik = await prisma.productCategory.upsert({
    where: { slug: 'hediyelik' },
    update: {},
    create: {
      name: 'Hediyelik Ürünleri',
      slug: 'hediyelik',
      description: 'Adalet Bakanlığı İşyurtlarında üretilen el yapımı hediyelik ürünleri'
    }
  })

  console.log('✅ Kategoriler hazırlandı')

  // Helper function for slugify
  function slugify(text: string): string {
    return text.toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
  }

  // Create products - Adalet Bakanlığı sitesinden alınan gıda ve temizlik ürünleri
  const products = [
    {
      name: 'Badem',
      slug: 'badem',
      description: 'Adalet Bakanlığı İşyurtlarında üretilen kaliteli badem.',
      categoryId: gida.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Biber Reçeli',
      slug: 'biber-receli',
      description: 'El emeğiyle yapılan biber reçeli. Beslenme eğitimi ürünü.',
      categoryId: gida.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Biber Salçası',
      slug: 'biber-salcasi',
      description: 'Hükümlüler tarafından işlenen biber salçası.',
      categoryId: gida.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Çekirdek',
      slug: 'cekirdek',
      description: 'Doğal çekirdek ürünü. İşyurtlarında işlenmektedir.',
      categoryId: gida.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Domates Salçası',
      slug: 'domates-salcasi',
      description: 'Adalet Bakanlığı İşyurtlarında üretilen domates salçası.',
      categoryId: gida.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Fındık',
      slug: 'findik',
      description: 'Kaliteli işlenmemiş fındık. İşyurtlarında seçilmektedir.',
      categoryId: gida.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Haşaşezmesi',
      slug: 'hasasezmesi',
      description: 'Geleneksel haşaşezmesi yapımı. El emeğinin ürünü.',
      categoryId: gida.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'İncir Reçeli',
      slug: 'incir-receli',
      description: 'Ev yapımı tarzı incir reçeli. Beslenme eğitimi ürünü.',
      categoryId: gida.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Kuru Baklagiller',
      slug: 'kuru-baklagyller',
      description: 'Seçilmiş ve işlenmiş kuru baklagiller. Beslenme eğitimi kapsamında.',
      categoryId: gida.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Pirinç',
      slug: 'pirinc',
      description: 'Kaliteli işlenmiş pirinç. İşyurtlarında işlenmektedir.',
      categoryId: gida.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Sarı Üzüm',
      slug: 'sari-uzum',
      description: 'Doğal sarı üzüm. Adalet Bakanlığı İşyurtlarının ürünü.',
      categoryId: gida.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Siyah Üzüm',
      slug: 'siyah-uzum',
      description: 'Sağlıklı siyah üzüm. İşyurtlarında işlenmektedir.',
      categoryId: gida.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Tereyağ',
      slug: 'tereyag',
      description: 'El emeğiyle yapılan tereyağ. Beslenme eğitimi ürünü.',
      categoryId: gida.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Üzüm Pekmezi',
      slug: 'uzum-pekmezi',
      description: 'Geleneksel üzüm pekmezi yapımı. İşyurtlarında üretilmektedir.',
      categoryId: gida.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Yerfıstığı',
      slug: 'yerfistigi',
      description: 'Işletilmiş yerfıstığı. İşyurtlarının ürünü.',
      categoryId: gida.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Yeşil Zeytin',
      slug: 'yesil-zeytin',
      description: 'Doğal yeşil zeytin. Beslenme eğitimi ürünü.',
      categoryId: gida.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Zeytinyağı',
      slug: 'zeytinyagi',
      description: 'Adalet Bakanlığı İşyurtlarında üretilen saf zeytinyağı. %100 doğal.',
      categoryId: gida.id,
      price: 0,
      quantity: 0
    },
    // Temizlik Ürünleri
    {
      name: 'Tıraş Losyonu',
      slug: slugify('tıraş losyonu'),
      description: 'El emeğiyle hazırlanan doğal tıraş losyonu.',
      categoryId: temizlik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Gül Kolonyası',
      slug: slugify('gül kolonyası'),
      description: 'Adalet Bakanlığı İşyurtlarında üretilen gül kolonyası.',
      categoryId: temizlik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Doğal Sabun',
      slug: slugify('el yapımı doğal sabun'),
      description: 'Doğal malzemelerden yapılan el yapımı sabun. Beslenme eğitimi ürünü.',
      categoryId: temizlik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Yüzey Temizleyici',
      slug: slugify('yüzey temizleyici'),
      description: 'Doğal yüzey temizleme ürünü. Çevre dostu üretim.',
      categoryId: temizlik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Lavaanta Kolonyası',
      slug: slugify('lavaanta kolonyası'),
      description: 'Lavaanta ekstraktıyla yapılan doğal kolonyası.',
      categoryId: temizlik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Sıvı Sabun',
      slug: slugify('sıvı sabun'),
      description: 'Doğal yağlardan yapılan sıvı sabun. El bakım ürünü.',
      categoryId: temizlik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Kadın Parfümü 32-01',
      slug: slugify('kadın parfümü 32-01'),
      description: 'El emeğiyle hazırlanan kadın parfümü. Seri: 32-01',
      categoryId: temizlik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Kadın Parfümü 32-02',
      slug: slugify('kadın parfümü 32-02'),
      description: 'El emeğiyle hazırlanan kadın parfümü. Seri: 32-02',
      categoryId: temizlik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Kadın Parfümü 32-03',
      slug: slugify('kadın parfümü 32-03'),
      description: 'El emeğiyle hazırlanan kadın parfümü. Seri: 32-03',
      categoryId: temizlik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Erkek Parfümü 32-01',
      slug: slugify('erkek parfümü 32-01'),
      description: 'El emeğiyle hazırlanan erkek parfümü. Seri: 32-01',
      categoryId: temizlik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Erkek Parfümü 32-02',
      slug: slugify('erkek parfümü 32-02'),
      description: 'El emeğiyle hazırlanan erkek parfümü. Seri: 32-02',
      categoryId: temizlik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'Erkek Parfümü 32-03',
      slug: slugify('erkek parfümü 32-03'),
      description: 'El emeğiyle hazırlanan erkek parfümü. Seri: 32-03',
      categoryId: temizlik.id,
      price: 0,
      quantity: 0
    },
    // Hediyelik Ürünleri
    {
      name: 'El Yapımı Çini Vazo',
      slug: slugify('el yapımı çini vazo'),
      description: 'Seramik el sanatları eğitimi sayesinde yapılan çini vazo.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Gümüş Takı Seti',
      slug: slugify('el yapımı gümüş takı seti'),
      description: 'Kuyumculuk eğitimi ürünü. El emeğiyle yapılan gümüş takı seti.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Gümüş Yüzükler',
      slug: slugify('el yapımı gümüş yüzükler'),
      description: 'Kuyumculuk eğitimi kapsamında yapılan gümüş yüzükler.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Dokuması Namazlık',
      slug: slugify('el dokuması namazlık'),
      description: 'El dokuma eğitimi ürünü. Geleneksel dokuma tekniğiyle yapılmıştır.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Çini Tabak',
      slug: slugify('el yapımı çini tabak'),
      description: 'Seramik eğitimi sayesinde yapılan dekoratif çini tabak.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Gümüş Kehribar Tesbih',
      slug: slugify('el yapımı gümüş kehribar tesbih'),
      description: 'Kuyumculuk ve el sanatları eğitimi ürünü. Gümüş ve kehribardan yapılmıştır.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Sedef Kaplamalı Satranç Seti',
      slug: slugify('el yapımı sedef kaplamalı satranç seti'),
      description: 'Marangozluk ve el sanatları eğitimi ürünü. Sedef kaplamalı satranç seti.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Ahşap Lamba',
      slug: slugify('el yapımı ahşap lamba'),
      description: 'Marangozluk eğitimi sayesinde yapılan dekoratif ahşap lamba.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Ahşap Kitaplık',
      slug: slugify('el yapımı ahşap kitaplık'),
      description: 'Marangozluk eğitimi ürünü. El emeğiyle yapılan ahşap kitaplık.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Mumluk-Şamdan',
      slug: slugify('el yapımı mumluk-şamdan'),
      description: 'Seramik ve metal işleme eğitimi ürünü. Dekoratif mumluk-şamdan.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Akvaryum',
      slug: slugify('el yapımı akvaryum'),
      description: 'Cam işleme ve tasarım eğitimi ürünü. El yapımı akvaryum.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Çini Minik Vazolar',
      slug: slugify('el yapımı çini minik vazolar'),
      description: 'Seramik eğitimi sayesinde yapılan minik dekoratif vazolar.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Oyma Pipo',
      slug: slugify('el yapımı oyma pipo'),
      description: 'Ahşap oyma eğitimi ürünü. El emeğiyle oyulmuş pipo.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Kaktüs',
      slug: slugify('el yapımı kaktüs'),
      description: 'Seramik ve dekorasyon eğitimi ürünü. El yapımı seramik kaktüs.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Çömlekler',
      slug: slugify('el yapımı çömlekler'),
      description: 'Seramik eğitimi sayesinde yapılan geleneksel çömlekler.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Çini İbrik ve Altlık',
      slug: slugify('el yapımı çini ibik ve altlık'),
      description: 'Seramik eğitimi ürünü. Çini ibrik ve altlık seti.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Oltu Tesbihler',
      slug: slugify('el yapımı oltu tesbihler'),
      description: 'El sanatları eğitimi ürünü. Oltu taşından yapılan tesbihler.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Bakır İşlemeler',
      slug: slugify('el yapımı bakır işlemeler'),
      description: 'Metal işleme eğitimi sayesinde yapılan bakır işlemeler.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Kahve Seti',
      slug: slugify('el yapımı kahve seti'),
      description: 'Seramik ve metal işleme eğitimi ürünü. El yapımı kahve seti.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Porselen Çini Hediyelikler',
      slug: slugify('el yapımı porselen çini hediyelikler'),
      description: 'Seramik eğitimi sayesinde yapılan porselen çini hediyelik eşyalar.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    },
    {
      name: 'El Yapımı Porselen Çini Çay Seti',
      slug: slugify('el yapımı porselen çini çay seti'),
      description: 'Seramik ve tasarım eğitimi ürünü. Porselen çini çay seti.',
      categoryId: hediyelik.id,
      price: 0,
      quantity: 0
    }
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        price: product.price,
        quantity: product.quantity,
        // imageUrl'i GÜNCELLEME - mevcut resimi koru!
      },
      create: product
    })
  }

  console.log(`✅ ${products.length} ürün oluşturuldu`)
  console.log('✨ Seeding tamamlandı!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
