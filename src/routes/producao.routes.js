const express = require("express");

const router = express.Router();

const {
    cadastrar,
    listar,
    atualizar,
    excluir
} = require("../controllers/producao.controllers");

router.post("/cadastrar", cadastrar);
router.get("/listar", listar);
router.put("/atualizar/:id", atualizar);
router.delete("/excluir/:id", excluir);

module.exports = router;