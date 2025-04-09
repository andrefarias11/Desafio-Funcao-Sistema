$(document).ready(function () {
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

        if (obj.Beneficiarios && obj.Beneficiarios.length > 0) {
            obj.Beneficiarios.forEach(function (b) {
                $('#tabelaBeneficiarios tbody').append(`
                    <tr>
                        <td>${formatarCpf(b.CPF)}</td>
                        <td>${b.Nome}</td>
                        <td><button type="button" class="btn btn-danger btn-sm remover-beneficiario">Remover</button></td>
                    </tr>
                `);
            });
        }
    }

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        const cpfFormatado = $(this).find("#CPF").val().replace(/[.-]/g, '');

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "Id": $(this).find("#Id").val(),
                "Nome": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": formatarCpf(cpfFormatado) 
            },
            error: function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success: function (r) {
                ModalDialog("Sucesso!", r);
                $("#formCadastro")[0].reset();
                window.location.href = urlRetorno;
            }
        });
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

    function formatarCpf(cpf) {
        if (!cpf) return "";
        cpf = cpf.toString().replace(/\D/g, '');

        if (cpf.length !== 11) return cpf;

        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
});
