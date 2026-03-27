import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed başlıyor...')

  // Admin kullanıcı
  const adminHash = await bcrypt.hash('admin123!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cezaevinden.com' },
    update: {},
    create: {
      email:    'admin@cezaevinden.com',
      name:     'Platform Yöneticisi',
      username: 'admin',
      password: adminHash,
      role:     'ADMIN',
      status:   'ACTIVE',
      verified: true,
    },
  })

  // Örnek avukat
  const lawyerHash = await bcrypt.hash('avukat123!', 12)
  const lawyer = await prisma.user.upsert({
    where: { email: 'av.mehmet@cezaevinden.com' },
    update: {},
    create: {
      email:    'av.mehmet@cezaevinden.com',
      name:     'Av. Mehmet Yılmaz',
      username: 'av.mehmet',
      password: lawyerHash,
      role:     'AVUKAT',
      status:   'ACTIVE',
      verified: true,
      baroNo:   '12458',
      bio:      '15 yıllık deneyimle infaz hukuku uzmanı. Gönüllü danışmanlık yapıyorum.',
      city:     'Ankara',
    },
  })

  // Örnek avukat 2
  const lawyer2Hash = await bcrypt.hash('avukat456!', 12)
  const lawyer2 = await prisma.user.upsert({
    where: { email: 'av.ayse@cezaevinden.com' },
    update: {},
    create: {
      email:    'av.ayse@cezaevinden.com',
      name:     'Av. Ayşe Demir',
      username: 'av.ayse',
      password: lawyer2Hash,
      role:     'AVUKAT',
      status:   'ACTIVE',
      verified: true,
      baroNo:   '34891',
      bio:      'Ceza hukuku uzmanı. İnsan hakları alanında çalışıyorum.',
      city:     'İstanbul',
    },
  })

  // Örnek aile üyesi
  const familyHash = await bcrypt.hash('aile123!', 12)
  const family = await prisma.user.upsert({
    where: { email: 'fatma@example.com' },
    update: {},
    create: {
      email:    'fatma@example.com',
      name:     'Fatma Yıldız',
      username: 'fatmayildiz',
      password: familyHash,
      role:     'AILE',
      status:   'ACTIVE',
      city:     'Ankara',
      bio:      'Tutuklu yakını. Hukuki haklarımı öğrenmek için buradayım.',
    },
  })

  // Örnek tahliye olmuş kullanıcı
  const tahliyeHash = await bcrypt.hash('tahliye123!', 12)
  const tahliye = await prisma.user.upsert({
    where: { email: 'ahmet@example.com' },
    update: {},
    create: {
      email:    'ahmet@example.com',
      name:     'Ahmet Kaya',
      username: 'ahmetkaya',
      password: tahliyeHash,
      role:     'TAHLIYE',
      status:   'ACTIVE',
      city:     'İzmir',
      bio:      '2023\'te tahliye oldum. Yeniden topluma uyum sürecindeyim.',
    },
  })

  // Örnek gönderiler
  await prisma.post.createMany({
    data: [
      {
        authorId:    lawyer.id,
        content:     '⚖️ ÖNEMLİ: 7529 Sayılı Kanun ile infaz indirimlerinde değişiklik yapıldı. İyi hal indirimi hesaplamalarında yeni kriterler uygulanıyor. Detaylı soru için mesaj atabilirsiniz.',
        category:    'Hukuki',
        isPinned:    true,
      },
      {
        authorId:    family.id,
        content:     'Açık cezaevinde izin hakkı hakkında bilgi alan var mı? Hangi belgeler gerekiyor, süreci nasıl işliyor?',
        category:    'Soru',
      },
      {
        authorId:    tahliye.id,
        content:     'Tahliyenin üzerinden 6 ay geçti. İş bulmak gerçekten zor ama pes etmiyorum. Bu topluluk çok destek oluyor.',
        category:    'Deneyim',
      },
      {
        authorId:    family.id,
        content:     'Avukat kardeşlerimize çok teşekkürler. Sorularımı yanıtladılar ve haklarımız konusunda aydınlandık.',
        category:    'Genel',
        isAnonymous: false,
      },
    ],
    skipDuplicates: true,
  })

  // Forum konusu
  const topic = await prisma.forumTopic.create({
    data: {
      authorId: family.id,
      title:    'Koşullu salıverilme hesaplaması nasıl yapılır?',
      content:  'Eşim 8 yıl ceza aldı. Koşullu salıverilme ne zaman başvurabilir? Suç tipine göre fark var mı?',
      category: 'İnfaz Hukuku',
    },
  })

  await prisma.forumReply.create({
    data: {
      topicId:   topic.id,
      authorId:  lawyer.id,
      content:   'Genel kural olarak cezanın 2/3\'ünü çektikten sonra koşullu salıverilme başvurusu yapılabilir. 8 yıllık cezada bu yaklaşık 5 yıl 4 ay oluyor. Ancak suç tipine ve iyi hal kararlarına göre bu süre değişebilir. Detay için özel mesaj atabilirsiniz.',
      isSolution: true,
    },
  })

  // Hukuki soru
  const question = await prisma.legalQuestion.create({
    data: {
      authorId:   family.id,
      title:      'Denetimli serbestlik başvurusu nasıl yapılır?',
      content:    'Eşim 5 yıl ceza aldı, şu an 3. yılında. Denetimli serbestlikten ne zaman yararlanabilir? Hangi belgeler gerekiyor?',
      category:   'İnfaz Hukuku',
      isAnswered: true,
    },
  })

  await prisma.legalAnswer.create({
    data: {
      questionId: question.id,
      authorId:   lawyer.id,
      content:    'Koşullu salıverilmesine 1 yıl kala denetimli serbestlik başvurusu yapılabilir. 5 yıllık cezada koşullu salıverilme süresi 3 yıl 4 aydır. Dolayısıyla yaklaşık 2 yıl 4 ay sonra başvurabilir. Başvuru için kurumda bulunan sosyal çalışmacıya müracaat edin.',
      isOfficial: true,
      helpful:    34,
    },
  })

  // Haber
  await prisma.news.create({
    data: {
      title:     'İnfaz Kanunu\'nda Yeni Düzenlemeler',
      summary:   '2024 yılında yapılan değişikliklerle infaz süreçlerinde önemli güncellemeler yapıldı.',
      content:   'Türkiye Büyük Millet Meclisi\'nde kabul edilen son düzenlemelerle infaz kanununda kapsamlı değişiklikler yapılmıştır. İyi hal indirimleri, koşullu salıverilme süreleri ve denetimli serbestlik uygulamalarında yeni kriterler belirlenmiştir.\n\nDüzenlemeler 1 Ocak 2024 tarihinden itibaren yürürlüğe girmiştir.',
      category:  'Mevzuat',
      published: true,
      authorId:  admin.id,
    },
  })

  // Destek kaynakları
  await prisma.supportResource.createMany({
    data: [
      {
        name:        'Ceza İnfaz Derneği',
        description: 'Tutuklu ve hükümlü bireylerin haklarını savunan sivil toplum kuruluşu. Hukuki destek ve sosyal yardım programları.',
        category:    'Hukuki Yardım',
        city:        'Ankara',
        phone:       '0312 XXX XX XX',
        email:       'info@cezainfaz.org',
        website:     'https://cezainfaz.org',
        verified:    true,
      },
      {
        name:        'Tahliye Sonrası Destek Merkezi',
        description: 'Tahliye olan bireylere barınma, iş bulma ve sosyal uyum konularında destek sunan merkez.',
        category:    'Barınma',
        city:        'İstanbul',
        phone:       '0216 XXX XX XX',
        verified:    true,
      },
      {
        name:        'Aile Psikolojik Destek Hattı',
        description: 'Tutuklu yakınları için ücretsiz psikolojik destek hizmetleri sunan uzman ekip.',
        category:    'Psikolojik',
        city:        'Türkiye Geneli',
        phone:       '0800 XXX XX XX',
        verified:    true,
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Seed tamamlandı!')
  console.log('   Admin:  admin@cezaevinden.com / admin123!')
  console.log('   Avukat: av.mehmet@cezaevinden.com / avukat123!')
  console.log('   Aile:   fatma@example.com / aile123!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
