const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const adapter = new PrismaMariaDb({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'preparacao_db',
  connectionLimit: 5
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.usuario.createMany({
    data: [
      {
        nome: 'Administrador',
        email: 'admin@email.com',
        senha: '123456'
      },
      {
        nome: 'João Silva',
        email: 'joao@email.com',
        senha: '123456'
      },
      {
        nome: 'Maria Souza',
        email: 'maria@email.com',
        senha: '123456'
      }
    ]
  });

  await prisma.produto.createMany({
    data: [
      {
        nome: 'Mesa MDF',
        descricao: 'Mesa fabricada em MDF',
        custo: 250.00,
        quantidade_estoque: 10,
        estoque_minimo: 5
      },
      {
        nome: 'Armário MDF',
        descricao: 'Armário fabricado em MDF',
        custo: 500.00,
        quantidade_estoque: 8,
        estoque_minimo: 3
      },
      {
        nome: 'Prateleira MDF',
        descricao: 'Prateleira fabricada em MDF',
        custo: 80.00,
        quantidade_estoque: 4,
        estoque_minimo: 5
      }
    ]
  });

  await prisma.producao.createMany({
    data: [
      {
        quantidade_produzida: 5,
        data_producao: new Date('2026-09-01'),
        id_produto: 1,
        id_usuario: 1
      },
      {
        quantidade_produzida: 10,
        data_producao: new Date('2026-09-02'),
        id_produto: 2,
        id_usuario: 2
      },
      {
        quantidade_produzida: 3,
        data_producao: new Date('2026-09-03'),
        id_produto: 3,
        id_usuario: 3
      }
    ]
  });

  console.log('Banco populado com sucesso!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
