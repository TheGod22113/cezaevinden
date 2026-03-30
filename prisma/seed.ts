import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed başlıyor...')

  // ─── KULLANICILAR ───────────────────────────────────────────

  const adminHash   = await bcrypt.hash('admin123!',   12)
  const lawyerHash  = await bcrypt.hash('avukat123!',  12)
  const lawyer2Hash = await bcrypt.hash('avukat456!',  12)
  const lawyer3Hash = await bcrypt.hash('avukat789!',  12)
  const familyHash  = await bcrypt.hash('aile123!',    12)
  const family2Hash = await bcrypt.hash('aile456!',    12)
  const tahliyeHash = await bcrypt.hash('tahliye123!', 12)
  const mahkumHash  = await bcrypt.hash('mahkum123!',  12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@cezaevinden.com' },
    update: { emailVerified: new Date() },
    create: {
      email: 'admin@cezaevinden.com', name: 'Platform Yöneticisi',
      username: 'admin', password: adminHash,
      role: 'ADMIN', status: 'ACTIVE', verified: true, emailVerified: new Date(),
    },
  })

  const lawyer = await prisma.user.upsert({
    where: { email: 'av.mehmet@cezaevinden.com' },
    update: { emailVerified: new Date() },
    create: {
      email: 'av.mehmet@cezaevinden.com', name: 'Av. Mehmet Yılmaz',
      username: 'av.mehmet', password: lawyerHash,
      role: 'AVUKAT', status: 'ACTIVE', verified: true, baroNo: '12458',
      bio: '15 yıllık deneyimle infaz hukuku ve ceza davalarında uzmanlaşmış avukat. Cezaevi koşulları ve mahkum hakları konusunda gönüllü danışmanlık yapıyorum.',
      city: 'Ankara', emailVerified: new Date(),
    },
  })

  const lawyer2 = await prisma.user.upsert({
    where: { email: 'av.ayse@cezaevinden.com' },
    update: { emailVerified: new Date() },
    create: {
      email: 'av.ayse@cezaevinden.com', name: 'Av. Ayşe Demir',
      username: 'av.ayse', password: lawyer2Hash,
      role: 'AVUKAT', status: 'ACTIVE', verified: true, baroNo: '34891',
      bio: 'Ceza hukuku ve aile hukuku uzmanı. Özellikle kadın mahkumların ve aile üyelerinin haklarını korumak için gönüllü çalışmaktayım.',
      city: 'İstanbul', emailVerified: new Date(),
    },
  })

  const lawyer3 = await prisma.user.upsert({
    where: { email: 'av.kemal@cezaevinden.com' },
    update: { emailVerified: new Date() },
    create: {
      email: 'av.kemal@cezaevinden.com', name: 'Av. Kemal Arslan',
      username: 'av.kemal', password: lawyer3Hash,
      role: 'AVUKAT', status: 'ACTIVE', verified: true, baroNo: '9145',
      bio: 'AİHM başvuruları ve cezaevi koşullarına ilişkin idare davalarında uzmanlaştım. İnsan hakları alanında aktif çalışıyorum.',
      city: 'İzmir', emailVerified: new Date(),
    },
  })

  const family = await prisma.user.upsert({
    where: { email: 'fatma@example.com' },
    update: { emailVerified: new Date() },
    create: {
      email: 'fatma@example.com', name: 'Fatma Yıldız',
      username: 'fatmayildiz', password: familyHash,
      role: 'AILE', status: 'ACTIVE', city: 'Ankara',
      bio: 'Tutuklu yakını. Hukuki haklarımı öğrenmek için buradayım.',
      emailVerified: new Date(),
    },
  })

  const family2 = await prisma.user.upsert({
    where: { email: 'hatice@example.com' },
    update: { emailVerified: new Date() },
    create: {
      email: 'hatice@example.com', name: 'Hatice Kaya',
      username: 'haticekaya', password: family2Hash,
      role: 'AILE', status: 'ACTIVE', city: 'İstanbul',
      bio: 'Eşim tutuklu. Aileler olarak dayanışmamız çok önemli.',
      emailVerified: new Date(),
    },
  })

  const tahliye = await prisma.user.upsert({
    where: { email: 'ahmet@example.com' },
    update: { emailVerified: new Date() },
    create: {
      email: 'ahmet@example.com', name: 'Ahmet Kaya',
      username: 'ahmetkaya', password: tahliyeHash,
      role: 'TAHLIYE', status: 'ACTIVE', city: 'İzmir',
      bio: '2023\'te tahliye oldum. Yeniden topluma uyum sürecindeyim. Deneyimlerimi paylaşmak istiyorum.',
      emailVerified: new Date(),
    },
  })

  const mahkum = await prisma.user.upsert({
    where: { email: 'yusuf@example.com' },
    update: { emailVerified: new Date() },
    create: {
      email: 'yusuf@example.com', name: 'Yusuf Arslan',
      username: 'yusufarslan', password: mahkumHash,
      role: 'MAHKUM', status: 'ACTIVE', city: 'Bursa',
      bio: 'Açık cezaevindeyim. Haklarımızı öğrenmek için buradayım.',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Kullanıcılar oluşturuldu')

  // ─── GÖNDERILER ─────────────────────────────────────────────

  const postCount = await prisma.post.count()
  if (postCount === 0) {
    await prisma.post.createMany({
      data: [
        {
          authorId: lawyer.id,
          content: '⚖️ ÖNEMLİ DUYURU: 2024 yılında yapılan infaz kanunu değişiklikleri ile iyi hal indirimi hesaplamalarında yeni kriterler uygulanıyor. Özellikle 2022 sonrası suçlarda değişiklikler var. Soru sormak isteyenler mesaj atabilir.',
          category: 'Hukuki', isPinned: true,
        },
        {
          authorId: family.id,
          content: 'Açık cezaevinde izin hakkı hakkında bilgi alan var mı? Eşim açık cezaevine geçti ve haftalık izin talebinde bulunmak istiyoruz. Hangi belgeler gerekiyor?',
          category: 'Soru',
        },
        {
          authorId: tahliye.id,
          content: 'Tahliyenin üzerinden 8 ay geçti. Adli sicil affı başvurusu yaptım ve onaylandı. Merak edenler için süreci anlatayım: Nüfus müdürlüğüne dilekçe + sabıka kaydı + kimlik fotokopisi yeterli. Ortalama 30 gün sürüyor.',
          category: 'Deneyim',
        },
        {
          authorId: family2.id,
          content: 'Görüş saatleri ve koşulları hakkında sormak istiyorum. Eşimle ayda kaç kez görüşebilirim? Kapalı cezaevinde kurallar farklı mı açık cezaevinden?',
          category: 'Soru',
        },
        {
          authorId: lawyer2.id,
          content: '📢 Kadın mahkumların hakları konusunda bir rehber hazırladım. Hamilelik, emzirme, çocukla birlikte kalma hakları... Merak edenler DM atabilir, ücretsiz bilgi veriyorum.',
          category: 'Hukuki',
        },
        {
          authorId: tahliye.id,
          content: 'Yeniden topluma uyum süreci gerçekten zorlu ama imkansız değil. SGK kaydını yaptırın, KOSGEB\'den girişim desteği alabilirsiniz, ÇALIŞMA BAKANLIĞI\'nın ex-mahkum istihdamı teşviğinden yararlanın.',
          category: 'Deneyim',
        },
        {
          authorId: mahkum.id,
          content: 'Açık cezaevinde okumaya devam edebilir miyim? Uzaktan eğitim imkanları var mı? AÖF kayıt işlemleri için başvuru yaptı mı olan?',
          category: 'Soru',
          isAnonymous: false,
        },
        {
          authorId: family.id,
          content: 'Avukat kardeşlerimize çok teşekkürler. Özellikle Av. Mehmet Bey çok yardımcı oldu. Bu platform gerçekten çok değerli. Yalnız hissetmiyoruz artık.',
          category: 'Genel',
        },
      ],
    })
    console.log('✅ Gönderiler oluşturuldu')
  }

  // ─── FORUM KONULARI ─────────────────────────────────────────

  const topicCount = await prisma.forumTopic.count()
  if (topicCount === 0) {
    const topic1 = await prisma.forumTopic.create({
      data: {
        authorId: family.id,
        title: 'Koşullu salıverilme hesaplaması nasıl yapılır?',
        content: 'Eşim 8 yıl ceza aldı ve şu an 4. yılında. Koşullu salıverilme için ne kadar ceza çekmesi gerekiyor? Suç tipine göre fark var mı? Avukatımız yok, bilgi almak istedim.',
        category: 'İnfaz Hukuku',
        isSolved: true,
        views: 1204,
      },
    })
    await prisma.forumReply.create({
      data: {
        topicId: topic1.id, authorId: lawyer.id, isSolution: true,
        content: 'Genel kural olarak cezanın 2/3\'ünü iyi halli çektikten sonra koşullu salıverilme hakkı doğar (5275 sayılı Kanun md. 107). 8 yıllık cezada bu yaklaşık 5 yıl 4 ay oluyor.\n\nAncak bazı suç tipleri için bu oran 3/4\'e çıkabiliyor. Suçun niteliğine ve mahkeme kararına bakmak gerekir.\n\nİyi hal, disiplin cezası almamak, kurum programlarına katılmak gibi kriterlere bağlı. Ceza infaz kurumu sosyal çalışmacısıyla görüşmelerini öneririm.',
      },
    })
    await prisma.forumReply.create({
      data: {
        topicId: topic1.id, authorId: family2.id,
        content: 'Bizim de aynı durumumuz vardı. Av. Mehmet Bey\'in dediği doğru. Bir de sicil kaydında iyi hal görünmesi çok önemli, düzenli görüşe gidip moral vermek fark yaratıyor.',
      },
    })
    await prisma.forumReply.create({
      data: {
        topicId: topic1.id, authorId: lawyer2.id,
        content: 'Ek bilgi: Eğer terör suçu veya ağırlaştırılmış müebbet varsa oranlar farklı. O yüzden karar metnine bakmak şart.',
      },
    })

    const topic2 = await prisma.forumTopic.create({
      data: {
        authorId: family2.id,
        title: 'Açık cezaevine geçiş şartları — 2024 güncel',
        content: 'Eşim kapalı cezaevinde. Açık cezaevine geçiş için ne gerekiyor? Kaç yılını tamamlaması lazım, iyi hal dışında başka şart var mı?',
        category: 'İnfaz Hukuku',
        views: 892,
        isSolved: true,
      },
    })
    await prisma.forumReply.create({
      data: {
        topicId: topic2.id, authorId: lawyer.id, isSolution: true,
        content: 'Açık cezaevine ayrılma için:\n\n✅ Cezanın 1/5\'ini iyi halli çekmiş olmak (en az 30 gün)\n✅ Disiplin cezası almamış olmak\n✅ Risk değerlendirme puanı yeterli olmak\n✅ İnfaz hakimliğinin kararı\n\nSosyal çalışmacıya dilekçe veriliyor, ortalama 2-3 ay sürüyor. Cezanın türüne göre değişebilir.',
      },
    })
    await prisma.forumReply.create({
      data: {
        topicId: topic2.id, authorId: tahliye.id,
        content: 'Ben bu süreçten geçtim. Dilekçeyi kurumun sosyal çalışmacısına verdim, 6 haftada onaylandı. Belgeleri eksiksiz hazırlayın, gecikmemesi için.',
      },
    })

    const topic3 = await prisma.forumTopic.create({
      data: {
        authorId: tahliye.id,
        title: 'Tahliye sonrası iş bulma deneyimleri — paylaşalım',
        content: '6 ay önce tahliye oldum. İş bulmak gerçekten zorlu bir süreç. Kim hangi yolları denedi? Hangi sektörlerde daha kolay iş bulunuyor?',
        category: 'Tahliye Süreci',
        views: 567,
      },
    })
    await prisma.forumReply.create({
      data: {
        topicId: topic3.id, authorId: mahkum.id,
        content: 'Henüz tahliye olmadım ama burada okuyorum. Hazırlık için ne yapılabilir diye merak ediyorum.',
      },
    })
    await prisma.forumReply.create({
      data: {
        topicId: topic3.id, authorId: family.id,
        content: 'ÇALIŞMA BAKANLIĞI\'NIN işkur üzerinden ex-mahkum istihdamı teşviki var. İşverenler SGK prim desteği alıyor, bu yüzden bazıları tercih edebiliyor.',
      },
    })
    await prisma.forumReply.create({
      data: {
        topicId: topic3.id, authorId: lawyer2.id,
        content: 'Hukuki açıdan: Adli sicil kaydı affedilmişse çoğu iş için engel değil. Ancak kamu görevi ve bazı lisanslı meslekler için engel olabilir. Reşit olmayan kişilere yönelik suçlarda ise sürekli engel var.',
      },
    })

    const topic4 = await prisma.forumTopic.create({
      data: {
        authorId: mahkum.id,
        title: 'Cezaevinde avukatla görüşme hakkı — nasıl kullanılır?',
        content: 'Avukatla görüşme talebim defalarca reddediliyor. "Yer yok" diyorlar. Bu yasal mı? Ne yapabilirim?',
        category: 'İnfaz Hukuku',
        views: 345,
        isSolved: true,
      },
    })
    await prisma.forumReply.create({
      data: {
        topicId: topic4.id, authorId: lawyer3.id, isSolution: true,
        content: 'Bu kesinlikle yasal değil. CGTİHK md. 59 gereği tutuklu ve hükümlüler avukatlarıyla her zaman ve özel görüşebilir. Reddedilemez.\n\nYapmanız gerekenler:\n1. Yazılı dilekçe verin ve ret kararını yazılı isteyin\n2. İnfaz Hakimliği\'ne şikayet edin\n3. Cumhuriyet Başsavcılığı\'na şikayet edin\n\nBu konuda yardım etmekten mutluluk duyarım.',
      },
    })

    const topic5 = await prisma.forumTopic.create({
      data: {
        authorId: family2.id,
        title: 'Görüş günleri ve koşulları hakkında her şey',
        content: 'Ziyaret hakları konusunda bilgi paylaşalım. Kim kapalı, kim açık cezaevinde ziyaret yapıyor? Koşullar nasıl?',
        category: 'Aile & Ziyaret',
        views: 789,
      },
    })
    await prisma.forumReply.create({
      data: {
        topicId: topic5.id, authorId: lawyer.id,
        content: 'Kapalı cezaevlerinde haftada 1 kez, 1 saat (yakın) görüş hakkı var. Açık cezaevlerinde ise haftalık izin dahil daha esnek. Ziyaret edilecek kişinin izin listesine eklenmesi gerekiyor.',
      },
    })
    await prisma.forumReply.create({
      data: {
        topicId: topic5.id, authorId: family.id,
        content: 'Biz Ankara\'dan İzmir\'e gidiyoruz. Uzak mesafe için özel izin talep edebilirsiniz, genellikle olumlu yanıt veriyorlar.',
      },
    })

    const topic6 = await prisma.forumTopic.create({
      data: {
        authorId: tahliye.id,
        title: 'Denetimli serbestlik döneminde yükümlülükler neler?',
        content: 'Denetimli serbestliğe geçtikten sonra ne gibi yükümlülükler var? Hangi kurallara uymak gerekiyor? Biraz anlatan olursa iyi olur.',
        category: 'Tahliye Süreci',
        views: 421,
        isSolved: true,
      },
    })
    await prisma.forumReply.create({
      data: {
        topicId: topic6.id, authorId: lawyer.id, isSolution: true,
        content: 'Denetimli serbestlik yükümlülükleri:\n\n📌 Haftalık imza (müdürlüğe gitmek)\n📌 Belirlenen adresteyim bilgi vermek\n📌 Çalışma veya eğitim programına katılmak\n📌 Alkol/uyuşturucu kullanmamak (kontrol yapılabilir)\n📌 Yurt dışına çıkamamak (izinsiz)\n\nBu yükümlülüklere uymamak, geri cezaevine dönüşe yol açabilir. Dikkatli olun.',
      },
    })

    const topic7 = await prisma.forumTopic.create({
      data: {
        authorId: family.id,
        title: 'Psikolojik destek kaynakları — aileler için',
        content: 'Tutuklu yakını olmak gerçekten zorlu bir süreç. Psikolojik olarak nasıl başa çıkıyorsunuz? Hangi destek hizmetlerinden yararlandınız?',
        category: 'Psikolojik Destek',
        views: 312,
      },
    })
    await prisma.forumReply.create({
      data: {
        topicId: topic7.id, authorId: lawyer2.id,
        content: 'Aile danışma merkezleri (ADM) ücretsiz psikolojik destek sunuyor. Şehrinizde arayın. Ayrıca bazı barolar da bu konuda hizmet veriyor.',
      },
    })
    await prisma.forumReply.create({
      data: {
        topicId: topic7.id, authorId: family2.id,
        content: 'Bu platformdaki insanlarla konuşmak bile çok iyi geliyor. Yalnız olmadığımızı hissetmek önemli.',
      },
    })

    const topic8 = await prisma.forumTopic.create({
      data: {
        authorId: admin.id,
        title: 'Platform Kullanım Kuralları ve Topluluk Rehberi',
        content: 'Cezaevinden.com platformuna hoş geldiniz. Bu konuda platform kuralları ve topluluk rehberi yer almaktadır.\n\n🔹 Herkesin kimlik bilgilerini paylaşmayın\n🔹 Anonim mod seçeneğini kullanabilirsiniz\n🔹 Birbirinize saygılı olun\n🔹 Hukuki bilgileri doğrulanmış avukatlardan alın\n🔹 Şiddet içerikli paylaşımlar yasaktır\n\nSorularınız için @admin hesabına mesaj atabilirsiniz.',
        category: 'Genel',
        isPinned: true,
        views: 2341,
      },
    })

    console.log('✅ Forum konuları ve yanıtları oluşturuldu')
  }

  // ─── HUKUKİ SORULAR ─────────────────────────────────────────

  const questionCount = await prisma.legalQuestion.count()
  if (questionCount === 0) {
    const q1 = await prisma.legalQuestion.create({
      data: {
        authorId: family.id,
        title: 'Denetimli serbestlik başvurusu nasıl ve ne zaman yapılır?',
        content: 'Eşim 5 yıl ceza aldı, şu an 3. yılında. İyi halli devam ediyor. Denetimli serbestlikten ne zaman yararlanabilir? Hangi belgeler gerekiyor ve başvuruyu kim yapıyor?',
        category: 'İnfaz Hukuku',
        isAnswered: true, views: 892,
      },
    })
    await prisma.legalAnswer.create({
      data: {
        questionId: q1.id, authorId: lawyer.id, isOfficial: true, helpful: 67,
        content: 'Denetimli serbestlik için koşullu salıverilmesine 1 yıl (bazı suçlarda 2 yıl) kala başvuru yapılabilir.\n\n5 yıllık cezada koşullu salıverilme = 3 yıl 4 ay. Dolayısıyla yaklaşık 2 yıl 4 ay sonra DS başvurusu yapabilir.\n\nBaşvuru süreci:\n1. Ceza infaz kurumu sosyal çalışmacısına dilekçe\n2. İnfaz hakimliği kararı\n3. Denetimli serbestlik müdürlüğüne kayıt\n\nGerekli belgeler: dilekçe, ikametgah belgesi, sosyal çalışmacı raporu. Avukatınız bu süreçte kritik rol oynayabilir.',
      },
    })
    await prisma.legalAnswer.create({
      data: {
        questionId: q1.id, authorId: lawyer2.id, isOfficial: false, helpful: 23,
        content: 'Ek: Terör suçları, cinsel suçlar ve bazı özel suçlarda DS oranları farklıdır. Mahkeme kararına ve suç tipine bakmak gerekir. Genel hüküm değişmiş olabilir, güncel mevzuatı kontrol edin.',
      },
    })

    const q2 = await prisma.legalQuestion.create({
      data: {
        authorId: family2.id,
        title: 'Koşullu salıverilme oranları suç tipine göre nasıl değişiyor?',
        content: 'Eşim hakkında mahkeme 8 yıla hükmetti. Ama avukatımız "bu suç için 3/4 oran uygulanıyor" dedi. Hangi suçlarda 2/3, hangilerinde 3/4 uygulanıyor? Tam liste var mı?',
        category: 'İnfaz Hukuku',
        isAnswered: true, views: 634,
      },
    })
    await prisma.legalAnswer.create({
      data: {
        questionId: q2.id, authorId: lawyer.id, isOfficial: true, helpful: 89,
        content: '5275 sayılı CGTİHK md. 107\'ye göre:\n\n📌 2/3 oran (genel kural): Kasıtlı suçlar\n📌 3/4 oran: Ağırlaştırılmış müebbet, cinsel dokunulmazlığa karşı suçlar, terör suçları, uyuşturucu suçları (belirli miktarın üzeri)\n📌 1/2 oran (az): Taksirli suçlar\n\nAvukatınızın söylediği doğruysa mahkeme kararında suç maddesine bakın. Hangi madde ve fıkradan mahkum olduğu önemli.',
      },
    })

    const q3 = await prisma.legalQuestion.create({
      data: {
        authorId: mahkum.id,
        title: 'Avukatla görüşme hakkım defalarca engellendi, ne yapabilirim?',
        content: 'Kapalı cezaevindeyim. Avukatımla görüşmek istiyorum ama "yer yok", "sıra var" gibi gerekçelerle 3 haftadır engelleniyorum. Bu yasal mı? Nereye şikayet edebilirim?',
        category: 'Ceza Hukuku',
        isAnswered: true, views: 445,
      },
    })
    await prisma.legalAnswer.create({
      data: {
        questionId: q3.id, authorId: lawyer3.id, isOfficial: true, helpful: 112,
        content: 'Bu uygulama YASAYA AYKIRIDIR. CGTİHK md. 59: "Tutuklu ve hükümlüler avukatları ile her zaman ve özel görüşebilir."\n\nYapmanız gerekenler:\n1. Kurum müdürlüğüne yazılı dilekçe verin, "görüşmeyi neden reddediyorsunuz?" yazılı ret isteyin\n2. İnfaz Hakimliği\'ne şikayet dilekçesi verin\n3. Cumhuriyet Başsavcılığı\'na şikayet edin\n4. Avukatınız Baro\'ya da şikayette bulunabilir\n\nBu konuda ben de yardım edebilirim.',
      },
    })

    const q4 = await prisma.legalQuestion.create({
      data: {
        authorId: family.id,
        title: 'Cezaevinde kötü muamele iddiası için hangi yollar var?',
        content: 'Eşim cezaevinde psikolojik baskı gördüğünü söylüyor. Bu konuda ne yapabiliriz? Hangi kurumlara başvurulabilir?',
        category: 'İnsan Hakları',
        isAnswered: true, views: 523,
      },
    })
    await prisma.legalAnswer.create({
      data: {
        questionId: q4.id, authorId: lawyer3.id, isOfficial: true, helpful: 78,
        content: 'Kötü muamele iddialarında başvurulacak kurumlar:\n\n1. Cumhuriyet Başsavcılığı\'na suç duyurusu\n2. İnsan Hakları İl Kurulu\'na şikayet\n3. Türkiye İnsan Hakları ve Eşitlik Kurumu (TİHEK)\n4. Kamu Denetçisi (Ombudsman)\n5. AİHM başvurusu (iç hukuk yollarını tükettikten sonra)\n\nÖnemli: Delil koruyun. Yaralanma varsa hastane raporu alın. İfadeleri yazılı belgeleyin.',
      },
    })

    const q5 = await prisma.legalQuestion.create({
      data: {
        authorId: family2.id,
        title: 'Tahliye olan yakınım çalışmak istiyor — sabıka kaydı engel olur mu?',
        content: 'Kardeşim 2 ay önce tahliye oldu. Çeşitli işyerlerine başvurdu ama sabıka kaydı var. Adli sicil affı ne zaman ve nasıl alınıyor?',
        category: 'Sosyal Haklar',
        isAnswered: true, views: 389,
      },
    })
    await prisma.legalAnswer.create({
      data: {
        questionId: q5.id, authorId: lawyer.id, isOfficial: true, helpful: 56,
        content: 'Adli sicil affı için:\n\n5352 sayılı Kanun\'a göre cezanın çekilmesinden sonra belirli süreler geçince kayıt silinir:\n- 5 yıl ve altı hapis: Tahliyeden 3 yıl sonra\n- 5-10 yıl arası: Tahliyeden 5 yıl sonra\n\nBaşvuru: E-devlet veya Adalet Bakanlığı PTT şubelerine başvurulabilir.\n\nNot: Sabıka kaydı silinmeden de çoğu özel sektör işinde yasal engel yoktur. İşverenler talep edemez ama sorabilirler.',
      },
    })

    const q6 = await prisma.legalQuestion.create({
      data: {
        authorId: mahkum.id,
        title: 'Açık cezaevinde eğitim hakkı — AÖF kaydı yapılabilir mi?',
        content: 'Açık cezaevindeyim. Anadolu Üniversitesi\'nin Açıköğretim fakültesine kayıt yaptırmak istiyorum. Bunu nasıl yapabilirim? Cezaevi yönetimi izin vermesi şart mı?',
        category: 'Diğer',
        isAnswered: false, views: 167,
      },
    })

    const q7 = await prisma.legalQuestion.create({
      data: {
        authorId: family.id,
        title: 'Çocuklu kadın tutukluların hakları neler?',
        content: 'Kardeşim tutuklandı ve 2 yaşında çocuğu var. Çocuk yanında kalabilir mi? Cezaevinde çocukla ilgili özel haklar var mı?',
        category: 'Aile Hukuku',
        isAnswered: true, views: 298,
      },
    })
    await prisma.legalAnswer.create({
      data: {
        questionId: q7.id, authorId: lawyer2.id, isOfficial: true, helpful: 44,
        content: '0-6 yaş arası çocuklar annesiyle cezaevinde kalabilir (CGTİHK md. 69). Bunun için:\n- Anne talepte bulunmalı\n- Çocuğun yararına olduğuna dair değerlendirme yapılır\n- Cezaevinde kreş/çocuk birimi varsa tercih edilir\n\nÇocuğun diğer ebeveyn veya yakınlarıyla bakımı da mümkündür. Mahkeme karar verir.',
      },
    })

    console.log('✅ Hukuki sorular ve yanıtlar oluşturuldu')
  }

  // ─── HABERLER ───────────────────────────────────────────────

  const newsCount = await prisma.news.count()
  if (newsCount === 0) {
    await prisma.news.createMany({
      data: [
        {
          authorId: admin.id,
          title: 'İnfaz Kanunu\'nda 2024 Değişiklikleri: Neler Değişti?',
          summary: '2024 yılında yapılan düzenlemelerle infaz süreçlerinde önemli güncellemeler yapıldı. İyi hal indirimleri ve koşullu salıverilme süreçlerinde yeni kriterler belirlendi.',
          content: 'Türkiye Büyük Millet Meclisi\'nde kabul edilen son düzenlemelerle 5275 sayılı Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun\'da kapsamlı değişiklikler yapıldı.\n\nYapılan başlıca değişiklikler:\n\n1. İyi Hal Değerlendirmesi: Kurum içi eğitim programlarına katılım artık iyi hal puanlamasında daha fazla ağırlık taşıyor.\n\n2. Denetimli Serbestlik: Bazı suç tipleri için DS süresi yeniden düzenlendi.\n\n3. Elektronik Kelepçe: Daha fazla hükümlünün elektronik takip yöntemiyle DS\'den yararlanması öngörülüyor.\n\nDüzenlemeler 1 Mart 2024 tarihinden itibaren uygulanmaya başlandı.',
          category: 'Mevzuat', published: true,
        },
        {
          authorId: admin.id,
          title: 'Cezaevlerinde Kapasite Sorunu: Güncel Veriler',
          summary: 'Adalet Bakanlığı\'nın açıkladığı verilere göre cezaevi nüfusu artmaya devam ediyor. Yeni kurumların açılması planlanıyor.',
          content: 'Türkiye\'deki cezaevi nüfusu son 5 yılda yüzde 40 artış gösterdi. Adalet Bakanlığı bu durumu çözmek için çeşitli tedbirler almayı planlıyor.\n\nBakanlık tarafından açıklanan rakamlara göre:\n- Toplam kapasite: 220.000 kişi\n- Mevcut nüfus: 320.000\'i aşkın\n- Yeni kurumlar: 15 yeni cezaevi yapımı planlandı\n\nKapasite sorunu, cezaevi koşullarını doğrudan etkiliyor ve insan hakları örgütlerinin yakından takip ettiği bir konu olmaya devam ediyor.',
          category: 'Haber', published: true,
        },
        {
          authorId: lawyer.id,
          title: 'Denetimli Serbestlik: Sık Yapılan Hatalar',
          summary: 'Denetimli serbestlik döneminde yapılan hatalar nedeniyle yüzlerce kişi geri cezaevine dönmek zorunda kaldı. Uzmanlar uyarıyor.',
          content: 'Denetimli serbestlik (DS) kararının geri alınmasına neden olan en yaygın hatalar şöyle sıralanabilir:\n\n1. İmza ihlali: Belirlenen günlerde müdürlüğe gitmemek\n2. Adres bildirmeme: Taşınmalarını yetkililere bildirmemek\n3. Yükümlülük ihlali: Belirlenen kurslara veya programlara katılmamak\n4. Suç işleme: DS döneminde herhangi bir suç işlemek\n5. Alkol/uyuşturucu: Madde kullanımının tespit edilmesi\n\nHer ihlal, geri cezaevine dönüşle sonuçlanabilir. Dikkatli olunmasını tavsiye ediyorum.',
          category: 'Hukuki Bilgi', published: true,
        },
        {
          authorId: admin.id,
          title: 'Cezaevinde Eğitim İmkanları Genişletiliyor',
          summary: 'Milli Eğitim Bakanlığı ve Adalet Bakanlığı iş birliğiyle cezaevlerindeki eğitim programları kapsamı artırıldı.',
          content: 'İki bakanlık arasında imzalanan protokol kapsamında cezaevlerindeki eğitim imkanları önemli ölçüde genişletildi.\n\nYeni eklenen programlar:\n- Uzaktan yükseköğretim (AÖF)\n- Mesleki kurslar (kaynakçı, elektrikçi, bilgisayar)\n- İlk ve ortaöğretim tamamlama\n- Dil kursları (İngilizce, Almanca)\n\nBu gelişme, cezaevindeyken kendini geliştirmek isteyen hükümlüler için önemli bir fırsat sunuyor.',
          category: 'Haber', published: true,
        },
        {
          authorId: lawyer2.id,
          title: 'Kadın Mahkumların Hakları: Kapsamlı Rehber',
          summary: 'Kadın hükümlü ve tutukluların özel hakları nelerdir? Çocuk bakımından sağlık hizmetlerine kadar detaylı bilgi.',
          content: 'Kadın mahkumlar için özel düzenlemeler yapılmıştır:\n\n1. Doğum Hakkı: Gebelik ve doğum sonrası dönemde özel koşullar sağlanır\n2. Çocuk Birlikteliği: 0-6 yaş çocuk annesiyle kalabilir\n3. Ayrı Koğuş: Erkeklerden tamamen ayrı birimler zorunludur\n4. Sağlık: Jinekolojik muayene hakkı vardır\n5. Şiddet Mağdurları: Özel koruma tedbirleri alınır\n\nBu haklardan herhangi birinin ihlali halinde şikayet yolları mevcuttur.',
          category: 'Hukuki Bilgi', published: true,
        },
        {
          authorId: admin.id,
          title: 'Cezaevinden.com: 10.000 Üyeye Ulaştık!',
          summary: 'Platformumuzu tercih eden tüm üyelerimize teşekkür ederiz. Yeni özellikler ve geliştirmeler yolda.',
          content: 'Cezaevinden.com olarak kısa sürede 10.000 üyeye ulaşmanın gururunu yaşıyoruz. Bu milestone bize büyük sorumluluk yüklüyor.\n\nKullanıcılarımızın geri bildirimleri doğrultusunda geliştirmeye devam edeceğiz:\n\n- Daha fazla gönüllü avukat\n- Gelişmiş bildirim sistemi\n- Mobil uygulama (yakında)\n- Bölgesel toplantılar\n\nHerkese teşekkürler. Birlikte daha güçlüyüz! 💪',
          category: 'Duyuru', published: true,
        },
      ],
    })
    console.log('✅ Haberler oluşturuldu')
  }

  // ─── DESTEK KAYNAKLARI ──────────────────────────────────────

  const resourceCount = await prisma.supportResource.count()
  if (resourceCount === 0) {
    await prisma.supportResource.createMany({
      data: [
        {
          name: 'Ceza İnfaz Derneği (CİD)',
          description: 'Tutuklu ve hükümlü bireylerin haklarını savunan sivil toplum kuruluşu. Ücretsiz hukuki destek ve sosyal yardım programları sunuyor.',
          category: 'Hukuki Yardım', city: 'Ankara',
          phone: '0312 XXX XX XX', email: 'info@cezainfaz.org', verified: true,
        },
        {
          name: 'Tahliye Sonrası Destek Merkezi',
          description: 'Tahliye olan bireylere barınma, iş bulma ve sosyal uyum konularında rehberlik ve destek sunan merkez.',
          category: 'Barınma & İş', city: 'İstanbul',
          phone: '0216 XXX XX XX', verified: true,
        },
        {
          name: 'Aile Psikolojik Destek Hattı',
          description: 'Tutuklu yakınları için ücretsiz psikolojik destek ve rehberlik hizmetleri sunan uzman ekip.',
          category: 'Psikolojik Destek', city: 'Türkiye Geneli',
          phone: '0800 XXX XX XX', verified: true,
        },
        {
          name: 'İstanbul Barosu Adli Yardım',
          description: 'Maddi imkânı yetersiz olan kişilere ücretsiz avukatlık hizmeti sağlar. Ceza davaları ve infaz konularında uzman avukat ataması yapılıyor.',
          category: 'Hukuki Yardım', city: 'İstanbul',
          phone: '0212 XXX XX XX', email: 'adliyardim@istanbulbarosu.org.tr', verified: true,
        },
        {
          name: 'Ankara Barosu Ceza Hukuku Komisyonu',
          description: 'Ceza davaları ve infaz hukuku konularında ücretsiz danışmanlık. Haftada iki gün danışma saatleri mevcut.',
          category: 'Hukuki Yardım', city: 'Ankara',
          phone: '0312 XXX XX XX', verified: true,
        },
        {
          name: 'İHD İnsan Hakları Derneği',
          description: 'Cezaevlerindeki insan hakları ihlallerini belgeleyen ve şikâyetleri takip eden sivil toplum kuruluşu.',
          category: 'İnsan Hakları', city: 'Türkiye Geneli',
          phone: '0312 XXX XX XX', email: 'info@ihd.org.tr', verified: true,
        },
        {
          name: 'SODES Sosyal Destek Programı',
          description: 'Tahliye olan bireyler için Aile ve Sosyal Hizmetler Bakanlığı bünyesinde yürütülen mesleki eğitim ve istihdam programı.',
          category: 'İstihdam', city: 'Türkiye Geneli', verified: false,
        },
        {
          name: 'Mor Çatı Kadın Sığınağı',
          description: 'Cezaevinden tahliye olan ve şiddete maruz kalan kadınlar için barınma ve destek hizmetleri.',
          category: 'Barınma & İş', city: 'İstanbul',
          phone: '0212 XXX XX XX', email: 'info@morcati.org.tr', verified: true,
        },
      ],
    })
    console.log('✅ Destek kaynakları oluşturuldu')
  }

  console.log('\n✅ Seed tamamlandı!')
  console.log('─────────────────────────────────')
  console.log('Giriş bilgileri:')
  console.log('  Admin:  admin@cezaevinden.com   / admin123!')
  console.log('  Avukat: av.mehmet@cezaevinden.com / avukat123!')
  console.log('  Avukat: av.ayse@cezaevinden.com   / avukat456!')
  console.log('  Aile:   fatma@example.com          / aile123!')
  console.log('  Tahliye: ahmet@example.com         / tahliye123!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
