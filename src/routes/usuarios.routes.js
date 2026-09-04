const express = require("express");

const router = express.Router();

const {
    login,
    listar,
    atualizar,
    excluir
} = require("../controllers/usuarios.controllers");


router.post("/login", login);
router.get("/listar", listar);
router.put("/atualizar/:id", atualizar);
router.delete("/excluir/:id", excluir);

module.exports = router;