$(document).ready(function () {
    var beneficiarios = [];

    // Máscaras
    $('#formCadastro #CPF').mask('000.000.000-00');
    $('#modalBeneficiarios').on('shown.bs.modal', function () {
        $('#beneficiarioCPF').mask('000.000.000-00');
    });

    // Atualiza a tabela de beneficiários
    function atualizarTabelaBeneficiarios() {
        var tabela = $("#tabelaBeneficiarios tbody");
        tabela.empty();

        beneficiarios.forEach(function (beneficiario, index) {
            tabela.append(`
                <tr>
                    <td>${beneficiario.cpf}</td>
                    <td>${beneficiario.nome}</td>
                    <td>
                        <button type="button" class="btn btn-primary btn-sm" onclick="alterarBeneficiario(${index})">Alterar</button>
                        <button type="button" class="btn btn-danger btn-sm" onclick="excluirBeneficiario(${index})">Excluir</button>
                    </td>
                </tr>
            `);
        });
    }

    function validarCPF(cpf) {
        var regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        return regex.test(cpf);
    }

    // Adiciona beneficiário
    $("#adicionarBeneficiario").click(function () {
        var nome = $("#beneficiarioNome").val().trim();
        var cpf = $("#beneficiarioCPF").val().trim();

        if (!validarCPF(cpf)) {
            ModalDialog("CPF Inválido", "CPF inválido. Por favor, use o formato 000.000.000-00.");
            return;
        }

        if (beneficiarios.some(b => b.cpf === cpf)) {
            ModalDialog("CPF Duplicado", "Já existe um beneficiário com esse CPF.");
            return;
        }

        beneficiarios.push({ nome: nome, cpf: cpf });
        atualizarTabelaBeneficiarios();

        $("#beneficiarioNome").val('');
        $("#beneficiarioCPF").val('');
    });

    // Botão Salvar
    $("#SalvarId").on("click", function (e) {
        e.preventDefault();

        // Garante um ID válido (pode ser vazio ou zero se for novo)
        const id = $("#Id").val() || 0;

        fetch('/Cliente/Incluir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id: id,
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
            .then(response => {
                if (!response.ok) throw new Error("Erro ao adicionar cliente!");
                return response.text();
            })
            .then(text => {
                var mensagens = text.split('\n').filter(m => m.trim() !== '');
                mensagens.forEach((mensagem, i) => {
                    setTimeout(() => ModalDialog("Aviso", mensagem), i * 500);
                });

                setTimeout(() => location.reload(), mensagens.length * 500 + 1000);
            })
            .catch(error => ModalDialog("Erro", error.message || "Erro ao adicionar cliente!"));
    });

    // Alterar e excluir beneficiário
    window.alterarBeneficiario = function (index) {
        const b = beneficiarios[index];
        $("#beneficiarioNome").val(b.nome);
        $("#beneficiarioCPF").val(b.cpf);
        excluirBeneficiario(index);
    };

    window.excluirBeneficiario = function (index) {
        beneficiarios.splice(index, 1);
        atualizarTabelaBeneficiarios();
    };
});

// Função de modal dinâmica
function ModalDialog(titulo, texto) {
    const randomId = "modal" + Math.random().toString().replace('.', '');
    const dialogHtml = `
        <div id="${randomId}" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">${titulo}</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>${texto}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(dialogHtml);
    $('#' + randomId).modal('show');

    // Remove o modal da DOM após fechar
    $('#' + randomId).on('hidden.bs.modal', function () {
        $(this).remove();
    });
}
