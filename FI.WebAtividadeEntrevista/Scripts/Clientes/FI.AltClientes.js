$(document).ready(function () {
    var beneficiarios = [];

    if (obj) {
        $('#formCadastro #Id').val(obj.Id);
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(formatarCpf(obj.CPF));

        console.log(obj);

        if (obj.Beneficiarios && obj.Beneficiarios.length > 0) {
            beneficiarios = obj.Beneficiarios.map(b => ({
                cpf: formatarCpf(b.CPF),
                nome: b.Nome
            }));
            atualizarTabelaBeneficiarios();
        }
    }

    $('#adicionarBeneficiario').click(function () {
        var nome = $("#beneficiarioNome").val().trim();
        var cpf = $("#beneficiarioCPF").val().trim();

        if (!nome || !cpf) {
            ModalDialog("Dados obrigatórios", "Preencha nome e CPF do beneficiário.");
            return;
        }

        if (!validarCPF(cpf)) {
            ModalDialog("CPF Inválido", "CPF inválido. Use o formato 000.000.000-00.");
            return;
        }

        cpf = formatarCpf(cpf);

        if (beneficiarios.some(b => b.cpf === cpf)) {
            ModalDialog("CPF Duplicado", "Já existe um beneficiário com esse CPF.");
            return;
        }

        beneficiarios.push({ nome: nome, cpf: cpf });
        atualizarTabelaBeneficiarios();

        $("#beneficiarioNome").val('');
        $("#beneficiarioCPF").val('');
    });

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        const cpfFormatado = $(this).find("#CPF").val().replace(/[.-]/g, '');

        const dados = {
            Id: $(this).find("#Id").val(),
            Nome: $(this).find("#Nome").val(),
            CEP: $(this).find("#CEP").val(),
            Email: $(this).find("#Email").val(),
            Sobrenome: $(this).find("#Sobrenome").val(),
            Nacionalidade: $(this).find("#Nacionalidade").val(),
            Estado: $(this).find("#Estado").val(),
            Cidade: $(this).find("#Cidade").val(),
            Logradouro: $(this).find("#Logradouro").val(),
            Telefone: $(this).find("#Telefone").val(),
            CPF: formatarCpf(cpfFormatado),
            Beneficiarios: beneficiarios
        };

        $.ajax({
            url: urlPost,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(dados),
            error: function (r) {
                if (r.status == 400)
                    ModalDialog("Erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Erro", "Erro interno no servidor.");
            },
            success: function (r) {
                ModalDialog("Sucesso!", r);
                $("#formCadastro")[0].reset();
                window.location.href = urlRetorno;
            }
        });
    });

    function atualizarTabelaBeneficiarios() {
        var tabela = $("#tabelaBeneficiarios tbody");
        tabela.empty();
        beneficiarios.forEach(function (b, index) {
            tabela.append(`
                <tr>
                    <td>${b.cpf}</td>
                    <td>${b.nome}</td>
                    <td>
                        <button type="button" class="btn btn-primary btn-sm" onclick="alterarBeneficiario(${index})">Alterar</button>
                        <button type="button" class="btn btn-danger btn-sm" onclick="excluirBeneficiario(${index})">Excluir</button>
                    </td>
                </tr>
            `);
        });
    }

    window.alterarBeneficiario = function (index) {
        var b = beneficiarios[index];
        $("#beneficiarioNome").val(b.nome);
        $("#beneficiarioCPF").val(b.cpf);
        excluirBeneficiario(index);
    };

    window.excluirBeneficiario = function (index) {
        beneficiarios.splice(index, 1);
        atualizarTabelaBeneficiarios();
    };

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

    function formatarCpf(cpf) {
        if (!cpf) return "";
        cpf = cpf.toString().replace(/\D/g, '');
        if (cpf.length !== 11) return cpf;
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        let soma = 0, resto;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        return resto === parseInt(cpf.substring(10, 11));
    }
});
