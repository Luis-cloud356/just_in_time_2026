require('dotenv').config();
const express = require('express');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static('../web'));

const usuariosRoutes = require('./src/routes/usuarios.routes');
const produtosRoutes = require('./src/routes/produtos.routes');
const producaoRoutes = require('./src/routes/producao.routes');

app.use('/usuarios', usuariosRoutes);
app.use('/produtos', produtosRoutes);
app.use('/producao', producaoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;