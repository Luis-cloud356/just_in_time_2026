const prisma = require("../data/prisma");

const listar = async (req, res) => {
    const { usuarioId } = req.query;

    const produtos = await prisma.produto.findMany(
        usuarioId ? { where: { usuarioId: Number(usuarioId) } } : {}
    );

    return res.status(200).json(produtos);
};

const cadastrar = async (req, res) => {
    const data = req.body;

    const produto = await prisma.produto.create({
        data: {
            nome: data.nome,
            descricao: data.descricao,
            custo: Number(data.custo),
            quantidade: Number(data.quantidade),
            estoqueMinimo: Number(data.estoqueMinimo),
            usuarioId: Number(data.usuarioId)
        }
    });

    return res.status(201).json(produto);
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const produto = await prisma.produto.update({
        where: { id: Number(id) },
        data: {
            nome: data.nome,
            descricao: data.descricao,
            custo: Number(data.custo),
            quantidade: Number(data.quantidade),
            estoqueMinimo: Number(data.estoqueMinimo)
        }
    });

    return res.status(200).json(produto);
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const produto = await prisma.produto.delete({
        where: { id: Number(id) }
    });

    return res.status(200).json(produto);
};

module.exports = {
    cadastrar,
    listar,
    atualizar,
    excluir
};