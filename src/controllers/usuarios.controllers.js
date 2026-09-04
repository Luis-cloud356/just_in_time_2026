const prisma = require("../data/prisma");

const listar = async (req, res) => {
    const usuarios = await prisma.usuario.findMany();
    return res.status(200).json(usuarios);
};

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email
            }
        });
        if (!usuario) {
            return res.status(401).json({
                mensagem: "E-mail ou senha incorretos"
            });
        }
        if (usuario.senha !== senha) {
            return res.status(401).json({
                mensagem: "E-mail ou senha incorretos"
            });
        }
        res.status(200).json({
            mensagem: "Login realizado com sucesso",
            usuario: {
                usuarioId: usuario.usuarioId,
                nome: usuario.nome,
                email: usuario.email
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao realizar login"
        });
    }
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
    login,
    listar,
    atualizar,
    excluir
};