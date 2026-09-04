const API = "http://localhost:3000/usuario";

const nome = document.getElementById("input-nome");
const email = document.getElementById("input-email");
const senha = document.getElementById("input-senha");

const grupoNome = document.getElementById("grupo-nome");
const titulo = document.getElementById("titulo-auth");
const btn = document.getElementById("btn-auth");
const toggle = document.getElementById("btn-toggle");
const msg = document.getElementById("msg-erro");

let cadastro = false;

// Alternar entre login e cadastro
toggle.onclick = () => {
    cadastro = !cadastro;

    grupoNome.style.display = cadastro ? "block" : "none";
    titulo.textContent = cadastro ? "Criar conta" : "Entrar";
    btn.textContent = cadastro ? "Cadastrar" : "Entrar";
    toggle.textContent = cadastro
        ? "Já tenho uma conta"
        : "Criar nova conta";

    msg.textContent = "";
};

// Entrar ou cadastrar
btn.onclick = async () => {

    const n = nome.value.trim();
    const e = email.value.trim().toLowerCase();
    const s = senha.value;

    msg.style.color = "red";

    if (cadastro && !n)
        return msg.textContent = "Digite seu nome.";

    if (!e || !e.includes("@"))
        return msg.textContent = "Digite um e-mail válido.";

    if (s.length < 6)
        return msg.textContent = "A senha deve ter 6 caracteres.";

    try {

        const usuarios = await fetch(API).then(r => r.json());

        if (cadastro) {

            if (usuarios.some(u => u.email.toLowerCase() === e))
                return msg.textContent = "E-mail já cadastrado.";

            await fetch(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: n,
                    email: e,
                    senha: s
                })
            });

            msg.style.color = "green";
            msg.textContent = "Conta criada com sucesso!";

            cadastro = false;
            grupoNome.style.display = "none";
            titulo.textContent = "Entrar";
            btn.textContent = "Entrar";
            toggle.textContent = "Criar nova conta";

        } else {

            const usuario = usuarios.find(
                u => u.email.toLowerCase() === e && u.senha === s
            );

            if (!usuario)
                return msg.textContent = "E-mail ou senha incorretos.";

            sessionStorage.setItem(
                "usuario",
                JSON.stringify(usuario)
            );

            msg.style.color = "green";
            msg.textContent = `Bem-vindo, ${usuario.nome}!`;

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        }

    } catch (erro) {

        console.error(erro);

        msg.textContent = "Erro ao conectar com a API.";
    }
};

