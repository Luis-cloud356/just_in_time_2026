const prisma = require("../data/prisma");

const listar = async (req, res) => {
    const usuarios = await prisma.usuario.findMany();
    return res.status(200).json(usuarios);
};

const cadastrar = async (req, res) => {
    const data = req.body;

    let usuario = await prisma.usuario.findUnique({
        where: { email: data.email }
    });

    if (!usuario) {
        usuario = await prisma.usuario.create({
            data: {
                nome: data.nome,
                email: data.email,
                senha: data.senha
            }
        });
    }

    return res.status(201).json(usuario);
};

const login = async (req, res) => {
    const data = req.body;

    const usuario = await prisma.usuario.findFirst({
        where: {
            email: data.email,
            senha: data.senha
        }
    });

    if (!usuario) {
        return res.status(401).json({ erro: "E-mail ou senha inválidos" });
    }

    return res.status(200).json(usuario);
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const usuario = await prisma.usuario.update({
        where: { id: Number(id) },
        data: {
            nome: data.nome,
            email: data.email,
            senha: data.senha
        }
    });

    return res.status(200).json(usuario);
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const usuario = await prisma.usuario.delete({
        where: { id: Number(id) }
    });

    return res.status(200).json(usuario);
};

module.exports = {
    cadastrar,
    login,
    listar,
    atualizar,
    excluir
};