const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkProducts() {
  const products = await prisma.product.findMany({
    include: { category: true },
  });

  console.log(`\n📦 Toplam ${products.length} ürün\n`);

  if (products.length > 0) {
    const byCategory = {};
    products.forEach((p) => {
      if (!byCategory[p.category.name]) byCategory[p.category.name] = [];
      byCategory[p.category.name].push(p.name);
    });

    Object.entries(byCategory).forEach(([cat, names]) => {
      console.log(`📂 ${cat}: ${names.length} ürün`);
      names.forEach((n) => console.log(`   - ${n}`));
    });
  }

  await prisma.$disconnect();
}

checkProducts().catch(console.error);
