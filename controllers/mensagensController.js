import prisma from '../prisma/client.js';

// GET /mensagens — lista todas as mensagens
export async function listarMensagens(req, res, next) {
  try {
    const mensagens = await prisma.mensagem.findMany({
      include: {
        remetente: {
          select: { id: true, nome: true, fotoUrl: true },
        },
        destinatario: {
          select: { id: true, nome: true, fotoUrl: true },
        },
      },
      orderBy: { criadoEm: 'desc' },
    });

    res.json(mensagens);
  } catch (erro) {
    next(erro);
  }
}

// POST /mensagens — cria uma nova mensagem
export async function criarMensagem(req, res, next) {
  try {
    const { texto, remetenteId, destinatarioId } = req.body;

    // Validação de campo obrigatório (Erro 400 - Esperado)
    if (!texto || texto.trim() === '') {
      return res.status(400).json({ erro: 'O campo texto é obrigatório' });
    }

    const novaMensagem = await prisma.mensagem.create({
      data: {
        texto,
        remetenteId: Number(remetenteId),
        destinatarioId: Number(destinatarioId),
      },
      include: {
        remetente: {
          select: { id: true, nome: true, fotoUrl: true },
        },
        destinatario: {
          select: { id: true, nome: true, fotoUrl: true },
        },
      },
    });

    res.status(201).json(novaMensagem);
  } catch (erro) {
    next(erro);
  }
}

// DELETE /mensagens/:id — deleta uma mensagem
export async function deletarMensagem(req, res, next) {
  const { id } = req.params;

  try {
    await prisma.mensagem.delete({
      where: { id: Number(id) },
    });

    res.status(204).end();
  } catch (erro) {
    // Mantém a captura do erro 404 esperado
    res.status(404).json({ erro: 'Mensagem não encontrada' });
  }
}