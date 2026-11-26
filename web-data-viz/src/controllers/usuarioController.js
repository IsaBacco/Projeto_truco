var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        // Banco "truco": só existe a tabela usuario (não há tabela
                        // aquario/empresa), então devolvemos o usuário logado direto.
                        res.json({
                            id: resultadoAutenticar[0].id,
                            email: resultadoAutenticar[0].email,
                            nome: resultadoAutenticar[0].nome,
                            aquarios: []
                        });
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    // var fkEmpresa = req.body.idEmpresaVincularServer;

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    // } else if (fkEmpresa == undefined) {
    //     res.status(400).send("Sua empresa a vincular está undefined!");
    } else if (email.indexOf("@") == -1) {
        res.status(400).send("Email inválido! Use o formato nome@provedor.com");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        // Antes de inserir, garantimos que o email ainda não foi cadastrado
        // (o banco "truco" não tem constraint de email único).
        usuarioModel.buscarPorEmail(email)
            .then(function (resultadoBusca) {
                if (resultadoBusca.length > 0) {
                    res.status(409).json({ mensagem: "Este email já está cadastrado!" });
                    return null;
                }

                return usuarioModel.cadastrar(nome, email, senha)
                    .then(function (resultado) {
                        if (resultado) {
                            res.status(201).json(resultado);
                        }
                    });
            })
            .catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    autenticar,
    cadastrar
}