import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const costos = [
    { dayOfWeek: 0, baseCost: 5.00 },
    { dayOfWeek: 1, baseCost: 3.00 },
    { dayOfWeek: 2, baseCost: 3.00 },
    { dayOfWeek: 3, baseCost: 3.00 },
    { dayOfWeek: 4, baseCost: 3.00 },
    { dayOfWeek: 5, baseCost: 3.50 },
    { dayOfWeek: 6, baseCost: 5.00 },
  ];

  for (const costo of costos) {
    await prisma.shippingCost.upsert({
      where: { dayOfWeek: costo.dayOfWeek },
      update: { baseCost: costo.baseCost },
      create: costo,
    });
    console.log(`Insertado día ${costo.dayOfWeek}`);
  }

  console.log('Costos de envío insertados correctamente');
}

main()
  .then(() => console.log('Seeder terminado'))
  .catch((e) => {
    console.error('Error en seeder:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());