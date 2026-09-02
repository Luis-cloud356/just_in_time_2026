import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBFDMAIkDqJ4jMpCklgEBRKOx5F8bGxU8Q",
    authDomain: "just-in-time-01-2025.firebaseapp.com",
    projectId: "just-in-time-01-2025",
    storageBucket: "just-in-time-01-2025.firebasestorage.app",
    messagingSenderId: "764302582870",
    appId: "1:764302582870:web:75081ab8d526dc649087f7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const url = "http://localhost:3000";
const pagina = window.location.pathname.split("/").pop();

onAuthStateChanged(auth, async (user) => {
    if (!user && pagina !== "login.html" && pagina !== "") {
        window.location.href = "login.html";
        return;
    }

    if (user && (pagina === "login.html" || pagina === "")) {
        window.location.href = "dashboard.html";
        return;
    }

    if (user) {
        const resUsuarios = await fetch(url + "/usuarios/listar");
        const usuarios = await resUsuarios.json();
        const usuarioLocal = usuarios.find(u => u.email.toLowerCase() === user.email.toLowerCase());

        if (!usuarioLocal) return;

        const nomeEl = document.getElementById("nome-usuario");
        if (nomeEl) {
            nomeEl.textContent = usuarioLocal.nome;
        }

        const btnLogout = document.getElementById("btn-logout");
        if (btnLogout) {
            btnLogout.addEventListener("click", async () => {
                await signOut(auth);
                window.location.href = "login.html";
            });
        }

        if (pagina === "dashboard.html") iniciarDashboard(usuarioLocal);
        if (pagina === "produtos.html") iniciarProdutos(usuarioLocal);
        if (pagina === "producao.html") iniciarProducao(usuarioLocal);
    }
});

let modoCadastro = false;
const btnToggle = document.getElementById("btn-toggle");
const grupoNome = document.getElementById("grupo-nome");
const tituloAuth = document.getElementById("titulo-auth");
const btnAuth = document.getElementById("btn-auth");
const msgErro = document.getElementById("msg-erro");

if (btnToggle) {
    btnToggle.addEventListener("click", () => {
        modoCadastro = !modoCadastro;
        grupoNome.style.display = modoCadastro ? "block" : "none";
        tituloAuth.textContent = modoCadastro ? "Criar Conta" : "Entrar";
        btnAuth.textContent = modoCadastro ? "Cadastrar" : "Entrar";
        btnToggle.textContent = modoCadastro ? "Já tenho uma conta" : "Criar nova conta";
        msgErro.textContent = "";
    });
}

if (btnAuth) {
    btnAuth.addEventListener("click", async () => {
        const nome = document.getElementById("input-nome").value.trim();
        const email = document.getElementById("input-email").value.trim();
        const senha = document.getElementById("input-senha").value.trim();

        if (modoCadastro && !nome) {
            msgErro.textContent = "Preencha o nome.";
            return;
        }

        if (!email || !senha) {
            msgErro.textContent = "Preencha e-mail e senha.";
            return;
        }

        try {
            if (modoCadastro) {
                await fetch(url + "/usuarios/cadastrar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nome, email, senha })
                });

                const cred = await createUserWithEmailAndPassword(auth, email, senha);
                await updateProfile(cred.user, { displayName: nome });
            } else {
                await signInWithEmailAndPassword(auth, email, senha);
            }
        } catch (e) {
            msgErro.textContent = modoCadastro ? "Erro ao criar conta: " + e.message : "E-mail ou senha inválidos.";
        }
    });
}

async function iniciarDashboard(usuarioLocal) {
    const [resProdutos, resProducao] = await Promise.all([
        fetch(url + "/produtos/listar?usuarioId=" + usuarioLocal.id),
        fetch(url + "/producao/listar?usuarioId=" + usuarioLocal.id)
    ]);
    const produtos = await resProdutos.json();
    const producoes = await resProducao.json();
    document.getElementById("total-produtos").textContent = produtos.length;
    document.getElementById("total-movimentacoes").textContent = producoes.length;
}

let todosProdutos = [];

async function iniciarProdutos(usuarioLocal) {
    await carregarProdutos(usuarioLocal);

    document.getElementById("btn-buscar").addEventListener("click", () => {
        const termo = document.getElementById("input-busca").value.toLowerCase();
        const filtrados = todosProdutos.filter(p => p.nome.toLowerCase().includes(termo));
        renderizarProdutos(filtrados, usuarioLocal);
    });

    const btnCancelar = document.getElementById("btn-cancelar-edicao");
    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => limparFormularioProduto());
    }

    document.getElementById("btn-salvar").addEventListener("click", async () => {
        const id = document.getElementById("produto-id").value;
        const nome = document.getElementById("produto-nome").value.trim();
        const descricao = document.getElementById("produto-descricao").value.trim();
        const custo = document.getElementById("produto-custo").value;
        const quantidade = document.getElementById("produto-quantidade").value;
        const estoqueMinimo = document.getElementById("produto-estoque-minimo").value;

        if (!nome || !custo || quantidade === "" || estoqueMinimo === "") {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        const body = {
            nome,
            descricao,
            custo: Number(custo),
            quantidade: Number(quantidade),
            estoqueMinimo: Number(estoqueMinimo),
            usuarioId: usuarioLocal.id
        };

        const metodo = id ? "PUT" : "POST";
        const rota = id ? "/produtos/atualizar/" + id : "/produtos/cadastrar";

        await fetch(url + rota, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        limparFormularioProduto();
        await carregarProdutos(usuarioLocal);
    });
}

function limparFormularioProduto() {
    document.getElementById("form-titulo").textContent = "Cadastrar Novo Produto";
    document.getElementById("produto-id").value = "";
    document.getElementById("produto-nome").value = "";
    document.getElementById("produto-descricao").value = "";
    document.getElementById("produto-custo").value = "";
    document.getElementById("produto-quantidade").value = "";
    document.getElementById("produto-estoque-minimo").value = "";
    document.getElementById("btn-salvar").textContent = "Salvar Produto";
    const btnCancelar = document.getElementById("btn-cancelar-edicao");
    if (btnCancelar) btnCancelar.style.display = "none";
}

async function carregarProdutos(usuarioLocal) {
    const res = await fetch(url + "/produtos/listar?usuarioId=" + usuarioLocal.id);
    todosProdutos = await res.json();
    renderizarProdutos(todosProdutos, usuarioLocal);
}

function renderizarProdutos(lista, usuarioLocal) {
    const tbody = document.getElementById("tabela-produtos");
    tbody.innerHTML = "";

    lista.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.nome}</td>
            <td>${p.descricao || "-"}</td>
            <td>R$ ${Number(p.custo).toFixed(2)}</td>
            <td>${p.quantidade}</td>
            <td>${p.estoqueMinimo}</td>
            <td>
                <button class="btn-warning" onclick="editarProduto(${p.id})">Editar</button>
                <button class="btn-danger" onclick="excluirProduto(${p.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    window.excluirProduto = async function(id) {
        if (!confirm("Deseja excluir este produto?")) return;
        await fetch(url + "/produtos/excluir/" + id, { method: "DELETE" });
        await carregarProdutos(usuarioLocal);
    };
}

window.editarProduto = function(id) {
    const p = todosProdutos.find(x => x.id === id);
    if (!p) return;
    document.getElementById("form-titulo").textContent = "Editar Produto";
    document.getElementById("produto-id").value = p.id;
    document.getElementById("produto-nome").value = p.nome;
    document.getElementById("produto-descricao").value = p.descricao || "";
    document.getElementById("produto-custo").value = p.custo;
    document.getElementById("produto-quantidade").value = p.quantidade;
    document.getElementById("produto-estoque-minimo").value = p.estoqueMinimo;
    document.getElementById("btn-salvar").textContent = "Salvar Alterações";
    const btnCancelar = document.getElementById("btn-cancelar-edicao");
    if (btnCancelar) btnCancelar.style.display = "inline-block";
    window.scrollTo({ top: 0, behavior: "smooth" });
};

let todasProducoes = [];

async function iniciarProducao(usuarioLocal) {
    document.getElementById("input-data").value = new Date().toISOString().split("T")[0];

    await carregarProdutosSelect(usuarioLocal);
    await carregarProducao(usuarioLocal);

    const btnCancelar = document.getElementById("btn-cancelar-edicao-producao");
    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => limparFormularioProducao());
    }

    document.getElementById("btn-registrar").addEventListener("click", async () => {
        const id = document.getElementById("producao-id").value;
        const produtoId = document.getElementById("select-produto").value;
        const tipo = document.getElementById("select-tipo").value;
        const quantidade = Number(document.getElementById("input-quantidade").value);
        const status = document.getElementById("select-status").value;
        const data = document.getElementById("input-data").value;

        if (!produtoId || !quantidade || !data) {
            alert("Preencha todos os campos.");
            return;
        }

        const produto = todosProdutos.find(p => p.id === Number(produtoId));
        const body = {
            tipo,
            quantidade,
            status,
            data: new Date(data).toISOString(),
            produtoId: Number(produtoId),
            usuarioId: usuarioLocal.id
        };

        const metodo = id ? "PUT" : "POST";
        const rota = id ? "/producao/atualizar/" + id : "/producao/cadastrar";

        await fetch(url + rota, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!id) {
            const novaQtd = tipo === "FABRICADO"
                ? produto.quantidade + quantidade
                : produto.quantidade - quantidade;

            await fetch(url + "/produtos/atualizar/" + produtoId, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...produto, quantidade: novaQtd })
            });

            if (tipo === "PEDIDO" && novaQtd < produto.estoqueMinimo) {
                alert("Alerta! Estoque de \"" + produto.nome + "\" abaixo do minimo!\nAtual: " + novaQtd + " | Minimo: " + produto.estoqueMinimo);
            }
        }

        limparFormularioProducao();
        await carregarProdutosSelect(usuarioLocal);
        await carregarProducao(usuarioLocal);
    });
}

function limparFormularioProducao() {
    document.getElementById("form-producao-titulo").textContent = "Nova Movimentação";
    document.getElementById("producao-id").value = "";
    document.getElementById("input-quantidade").value = "1";
    document.getElementById("select-status").value = "PENDENTE";
    document.getElementById("input-data").value = new Date().toISOString().split("T")[0];
    document.getElementById("btn-registrar").textContent = "Registrar";
    const btnCancelar = document.getElementById("btn-cancelar-edicao-producao");
    if (btnCancelar) btnCancelar.style.display = "none";
}

async function carregarProdutosSelect(usuarioLocal) {
    const res = await fetch(url + "/produtos/listar?usuarioId=" + usuarioLocal.id);
    todosProdutos = await res.json();

    const ordenados = [...todosProdutos].sort((a, b) => a.nome.localeCompare(b.nome));
    const select = document.getElementById("select-produto");
    select.innerHTML = "";
    ordenados.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.nome;
        select.appendChild(opt);
    });
}

async function carregarProducao(usuarioLocal) {
    const res = await fetch(url + "/producao/listar?usuarioId=" + usuarioLocal.id);
    todasProducoes = await res.json();
    const tbody = document.getElementById("tabela-producao");
    tbody.innerHTML = "";

    todasProducoes.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${new Date(p.data).toLocaleDateString("pt-br")}</td>
            <td>${p.produto?.nome || "-"}</td>
            <td>${p.tipo}</td>
            <td>${p.quantidade}</td>
            <td>${p.status}</td>
            <td>${p.usuario?.nome || "-"}</td>
            <td>
                <button class="btn-warning" onclick="editarProducao(${p.id})">Editar</button>
                <button class="btn-danger" onclick="excluirProducao(${p.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    window.excluirProducao = async function(id) {
        if (!confirm("Deseja excluir esta movimentacao?")) return;
        await fetch(url + "/producao/excluir/" + id, { method: "DELETE" });
        await carregarProducao(usuarioLocal);
    };
}

window.editarProducao = function(id) {
    const p = todasProducoes.find(x => x.id === id);
    if (!p) return;
    document.getElementById("form-producao-titulo").textContent = "Editar Movimentação";
    document.getElementById("producao-id").value = p.id;
    document.getElementById("select-produto").value = p.produtoId;
    document.getElementById("select-tipo").value = p.tipo;
    document.getElementById("input-quantidade").value = p.quantidade;
    document.getElementById("select-status").value = p.status;
    document.getElementById("input-data").value = new Date(p.data).toISOString().split("T")[0];
    document.getElementById("btn-registrar").textContent = "Salvar Alterações";
    const btnCancelar = document.getElementById("btn-cancelar-edicao-producao");
    if (btnCancelar) btnCancelar.style.display = "inline-block";
    window.scrollTo({ top: 0, behavior: "smooth" });
};