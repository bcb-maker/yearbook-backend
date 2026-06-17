import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

async function main() {
  console.log('--- DESAFIO 1: findUnique inexistente ---');

  const alunoInexistente = await prisma.aluno.findUnique({
    where: { id: 999 },
  });

  console.log('Aluno inexistente:', alunoInexistente);

  console.log('\n--- DESAFIO 2: listar alunos sem senhaHash ---');

  const alunosSemSenha = await prisma.aluno.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      cidade: true,
      frase: true,
      planosFuturos: true,
      fotoUrl: true,
      role: true,
      criadoEm: true,
    },
  });

  console.log('Alunos sem senhaHash:', alunosSemSenha);

  console.log('\n--- DESAFIO 3: criar mensagem ---');

  const novaMensagem = await prisma.mensagem.create({
  data: {
    titulo: 'Recado da turma',
    conteudo: 'Salve, turma! Vamos com tudo nesse último ano!',
    autor: {
      connect: {
        id: 1,
      },
    },
  },
});

  console.log('Mensagem criada:', novaMensagem);

  console.log('\n--- DESAFIO 3: listar mensagens com autor ---');

  const mensagens = await prisma.mensagem.findMany({
    include: {
      autor: {
        select: {
          nome: true,
          fotoUrl: true,
        },
      },
    },
  });

  console.log('Mensagens com autor:', JSON.stringify(mensagens, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });