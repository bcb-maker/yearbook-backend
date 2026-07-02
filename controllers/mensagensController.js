import prisma from '../prisma/client.js';

// GET /mensagens — lista todas as mensagens (mais recentes primeiro)
export async function listarMensagens(req, res) {
  try {
    const mensagens = await prisma.mensagem.findMany({
      orderBy: { criadoEm: 'desc' },
      include: {
        autor: {
          select: {
            id: true,
            nome: true,
            fotoUrl: true,
          },
        },
      },
    });

    return res.status(200).json(mensagens);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
}

// POST /mensagens — cria nova mensagem
export async function criarMensagem(req, res) {
  try {
    const { texto, imagemUrl, autorId } = req.body;

    if (!texto || texto.trim() === '') {
      return res.status(400).json({
        erro: 'O texto da mensagem não pode estar vazio.',
      });
    }

    const novaMensagem = await prisma.mensagem.create({
      data: {
        texto,
        imagemUrl,
        autorId: Number(autorId),
      },
      include: {
        autor: {
          select: {
            id: true,
            nome: true,
            fotoUrl: true,
          },
        },
      },
    });

    return res.status(201).json(novaMensagem);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
}

// DELETE /mensagens/:id — remove mensagem
export async function deletarMensagem(req, res) {
  try {
    const id = Number(req.params.id);

    await prisma.mensagem.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(204).json({
        erro: 'Mensagem não encontrada',
      });
    }

    return res.status(500).json({ erro: error.message });
  }
}