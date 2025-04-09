$(document).ready(function () {
    var beneficiarios = [];

    $('#formCadastro #CPF').mask('000.000.000-00');
    $('#modalBeneficiarios').on('shown.bs.modal', function () {
        $('#beneficiarioCPF').mask('000.000.000-00');
    });

    function atualizarTabelaBeneficiarios() {
        var tabela = $("#tabelaBeneficiarios tbody");
        tabela.empty();

        beneficiarios.forEach(function (beneficiario, index) {
            tabela.append('<tr>' +
                '<td>' + beneficiario.cpf + '</td>' +
                '<td>' + beneficiario.nome + '</td>' +
                '<td>' +
                '<button type="button" class="btn btn-primary btn-sm" onclick="alterarBeneficiario(' + index + ')">Alterar</button> ' +
                '<button type="button" class="btn btn-primary btn-sm" onclick="excluirBeneficiario(' + index + ')">Excluir</button>' +
                '</td>' +
                '</tr>');
        });
    }

    function validarCPF(cpf) {
        var regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        return regex.test(cpf);
    }

    $("#adicionarBeneficiario").click(function () {
        var nome = $("#beneficiarioNome").val().trim();
        var cpf = $("#beneficiarioCPF").val().trim();

        if (!validarCPF(cpf)) {
            ModalDialog("CPF Inválido", "CPF inválido. Por favor, use o formato 000.000.000-00.");
            return;
        }

        if (beneficiarios.some(function (b) { return b.cpf === cpf; })) {
            ModalDialog("CPF Duplicado", "Já existe um beneficiário com esse CPF.");
            return;
        }

        beneficiarios.push({ nome: nome, cpf: cpf });
        atualizarTabelaBeneficiarios();

        $("#beneficiarioNome").val('');
        $("#beneficiarioCPF").val('');
    });

    document.getElementById("SalvarId").addEventListener("click", function () {
        var IdNumber = $("#CPF").val();
        fetch('/Cliente/Incluir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                CEP: $("#CEP").val(),
                Cidade: $("#Cidade").val(),
                Email: $("#Email").val(),
                Estado: $("#Estado").val(),
                Logradouro: $("#Logradouro").val(),
                Nacionalidade: $("#Nacionalidade").val(),
                Nome: $("#Nome").val(),
                Sobrenome: $("#Sobrenome").val(),
                Telefone: $("#Telefone").val(),
                CPF: $("#CPF").val(),
                Beneficiarios: beneficiarios
            })
        })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Erro ao adicionar cliente!");
                }
                return response.text(); // Mudado de JSON para texto
            })
            .then(function (text) {
                var mensagens = text.split('\n');

                mensagens.forEach(function (mensagem, index) {
                    setTimeout(function () {
                        ModalDialog("Aviso", mensagem);
                    }, index * 500);
                });

                setTimeout(function () {
                    location.reload();
                }, mensagens.length * 500 + 1000);
            })
            .catch(function (error) {
                ModalDialog("Erro", error.message || "Erro ao adicionar cliente!");
            });
    });

    function adicionarBeneficiarioBD(CPF) {
        var requests = beneficiarios.map(function (beneficiario) {
            var IdFormated = beneficiario.cpf.replace(/\./g, "").replace("-", "");
            return fetch('/Beneficiario/Incluir', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clienteCPF: CPF,
                    Id: IdFormated,
                    Nome: beneficiario.nome,
                    CPF: beneficiario.cpf
                })
            });
        });

        Promise.all(requests)
            .then(function (responses) {
                var erro = responses.some(function (r) { return !r.ok; });
                if (erro) {
                    throw new Error("Erro ao adicionar Beneficiário!");
                }

                ModalDialog("Sucesso!", "Cliente e beneficiários adicionados com sucesso.");
                setTimeout(function () {
                    location.reload();
                }, 2000);
            })
            .catch(function (error) {
                console.log("Erro: ", error);
            });
    }

    window.alterarBeneficiario = function (index) {
        var beneficiario = beneficiarios[index];
        $("#beneficiarioNome").val(beneficiario.nome);
        $("#beneficiarioCPF").val(beneficiario.cpf);
        excluirBeneficiario(index);
    };

    window.excluirBeneficiario = function (index) {
        beneficiarios.splice(index, 1);
        atualizarTabelaBeneficiarios();
    };
});

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var dialogHtml = '<div id="' + random + '" class="modal fade">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
        '<h4 class="modal-title">' + titulo + '</h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<p>' + texto + '</p>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

    $('body').append(dialogHtml);
    $('#' + random).modal('show');
}
