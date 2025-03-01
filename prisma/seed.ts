import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.levelConfig.createMany({
    data: [
      {level: 1, maxEnergy: 500},
      {level: 5, maxEnergy: 510},
      {level: 10, maxEnergy: 520},
      {level: 15, maxEnergy: 530},
      {level: 20, maxEnergy: 540},
    ],
  });
}
main()
  .then(async () => {
    console.log('Seeds loaded successfully!');
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
  });
