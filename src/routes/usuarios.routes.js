const express = require("express");

const router = express.Router();

const {
    cadastrar,
    login,
    listar,
    atualizar,
    excluir
} = require("../controllers/usuarios.controllers");

router.post("/cadastrar", cadastrar);
router.post("/login", login);
router.get("/listar", listar);
router.put("/atualizar/:id", atualizar);
router.delete("/excluir/:id", excluir);

module.exports = router;