// const { PrismaClient } = require("../generated/prisma");
// const prisma = new PrismaClient();

// async function seed() {
//   await prisma.creature.createMany({
//     data: [
//       {
//         code: "001",
//         name: "Valkyrie Randgris",
//         respawn: "8h (Nasce a cada 8h)",
//         spriteUrl: "https://file5s.ratemyserver.net/mobs/1765.gif",
//       },
//       {
//         code: "002",
//         name: "Ifrit",
//         respawn: "11h",
//         spriteUrl: "https://file5s.ratemyserver.net/mobs/1832.gif",
//       },
//       {
//         code: "003",
//         name: "Satan Morroc",
//         respawn: "12h",
//         spriteUrl: "https://file5s.ratemyserver.net/mobs/1917.gif",
//       },
//     ],
//   });

//   console.log("Seed finalizado com sucesso!");
//   await prisma.$disconnect();
// }

// seed().catch((e) => {
//   console.error("Erro ao executar seed:", e);
//   prisma.$disconnect();
//   process.exit(1);
// });
