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
        quantidade: 10,
        estoqueMinimo: 5
      },
      {
        nome: 'Armário MDF',
        descricao: 'Armário fabricado em MDF',
        custo: 500.00,
        quantidade: 8,
        estoqueMinimo: 3
      },
      {
        nome: 'Prateleira MDF',
        descricao: 'Prateleira fabricada em MDF',
        custo: 80.00,
        quantidade: 4,
        estoqueMinimo: 5
      }
    ]
  });

  await prisma.producao.createMany({
    data: [
      {
        quantidade_produzida: 5,
        data_producao: new Date('2026-09-01'),
        produtoId: 1,
        usuarioId: 1
      },
      {
        quantidade_produzida: 10,
        data_producao: new Date('2026-09-02'),
        produtoId: 2,
        usuarioId: 2
      },
      {
        quantidade_produzida: 3,
        data_producao: new Date('2026-09-03'),
        produtoId: 3,
        usuarioId: 3
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
