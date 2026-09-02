const prisma = require("../data/prisma");

const listar = async (req, res) => {
    const { usuarioId } = req.query;

    const producoes = await prisma.producao.findMany({
        where: usuarioId ? { usuarioId: Number(usuarioId) } : {},
        include: {
            produto: true,
            usuario: true
        }
    });

    return res.status(200).json(producoes);
};

const cadastrar = async (req, res) => {
    const data = req.body;

    const producao = await prisma.producao.create({
        data: {
            tipo: data.tipo,
            quantidade: Number(data.quantidade),
            status: data.status || "PENDENTE",
            data: new Date(data.data),
            produtoId: Number(data.produtoId),
            usuarioId: Number(data.usuarioId)
        }
    });

    return res.status(201).json(producao);
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const producao = await prisma.producao.update({
        where: { id: Number(id) },
        data: {
            tipo: data.tipo,
            quantidade: Number(data.quantidade),
            status: data.status,
            data: new Date(data.data),
            produtoId: Number(data.produtoId),
            usuarioId: Number(data.usuarioId)
        }
    });

    return res.status(200).json(producao);
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const producao = await prisma.producao.delete({
        where: { id: Number(id) }
    });

    return res.status(200).json(producao);
};

module.exports = {
    cadastrar,
    listar,
    atualizar,
    excluir
};