import prisma from '../prisma/client.js';

// select que omite senhaHash — reutilizado em todas as queries de alunos
const selectSemSenha = {
  id: true,
  nome: true,
  email: true,
  cidade: true,
  frase: true,
  planosFuturos: true,
  fotoUrl: true,
  role: true,
  criadoEm: true,
  // senhaHash NÃO está aqui — nunca retornado pela API
};

// GET /alunos — lista todos os alunos
export async function listarAlunos(req, res) {
  const alunos = await prisma.aluno.findMany({
    select: selectSemSenha,
  });

  res.json(alunos);
}

// GET /alunos/:id — busca um aluno pelo ID
export async function buscarAluno(req, res) {
  const { id } = req.params;

  const aluno = await prisma.aluno.findUnique({
    where: { id: Number(id) },
    select: selectSemSenha,
  });

  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }

  res.json(aluno);
}

// POST /alunos — cria um novo aluno
// 🎯 POST /alunos — cria um novo aluno
// Dica: use prisma.aluno.create({ data: { ... }, select: selectSemSenha })
// Dica: os dados do aluno vêm de req.body (nome, email, senhaHash, cidade, frase, planosFuturos)
// Dica: retorne status 201 com o aluno criado
export async function criarAluno(req, res) {
  try {
    // 1. Extraia os campos de req.body: nome, email, senhaHash, cidade, frase, planosFuturos
    const { nome, email, senhaHash, cidade, frase, planosFuturos } = req.body;

    // 2. Use prisma.aluno.create() com data e select: selectSemSenha
    const alunoCriado = await prisma.aluno.create({
      data: {
        nome,
        email,
        senhaHash,
        cidade,
        frase,
        planosFuturos
      },
      select: selectSemSenha // Garante que a senha criptografada não volte na resposta HTTP
    });

    // 3. Retorne res.status(201).json(alunoCriado)
    return res.status(201).json(alunoCriado);

  } catch (error) {
    console.error("Erro ao criar aluno:", error);
    return res.status(500).json({ erro: "Não foi possível criar o aluno." });
  }
}

// PUT /alunos/:id — atualiza um aluno existente
export async function atualizarAluno(req, res) {
  const { id } = req.params;
  const dados = req.body;

  try {
    const alunoAtualizado = await prisma.aluno.update({
      where: {
        id: Number(id),
      },
      data: dados,
      select: selectSemSenha,
    });

    return res.status(200).json(alunoAtualizado);
  } catch (error) {
    return res.status(404).json({
      erro: 'Aluno não encontrado',
    });
  }
}

// DELETE /alunos/:id — deleta um aluno
export async function deletarAluno(req, res) {
  const { id } = req.params;

  try {
    await prisma.aluno.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(204).end();
  } catch (error) {
    return res.status(404).json({
      erro: 'Aluno não encontrado',
    });
  }
}