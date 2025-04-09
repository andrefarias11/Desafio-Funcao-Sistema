using FI.AtividadeEntrevista.BLL;
using FI.AtividadeEntrevista.DML;
using FI.WebAtividadeEntrevista.Models;
using FI.WebAtividadeEntrevista.Models.Validations;
using FI.WebAtividadeEntrevista.Resources;
using System;
using System.Collections.Generic;
using System.Linq;
using WebAtividadeEntrevista.Models;

namespace WebAtividadeEntrevista.AppServices
{
    public class ClienteService
    {
        private readonly BoCliente _boCliente = new BoCliente();
        private readonly BoBeneficiario _boBeneficiario = new BoBeneficiario();

        public ResultadoOperacao IncluirCliente(ClienteModel model)
        {
            var resultado = new ResultadoOperacao();

            if (!CpfValidator.IsValidCpf(model.Cpf))
            {
                resultado.Erros.Add(Mensagens.Erro_CPF_Invalido);
                return resultado;
            }

            if (_boCliente.VerificarExistencia(model.Cpf))
            {
                resultado.Erros.Add(Mensagens.Erro_CPF_Ja_Existe);
                return resultado;
            }

            var beneficiariosValidos = new List<Beneficiario>();
            var cpfsValidos = new HashSet<string>();

            if (model.Beneficiarios != null && model.Beneficiarios.Any())
            {
                foreach (var beneficiario in model.Beneficiarios)
                {
                    if (!CpfValidator.IsValidCpf(beneficiario.CPF))
                    {
                        resultado.Erros.Add(string.Format(Mensagens.Erro_CPF_Beneficiario, beneficiario.CPF, beneficiario.Nome));
                        continue;
                    }

                    if (!cpfsValidos.Add(beneficiario.CPF))
                    {
                        resultado.Erros.Add($"CPF duplicado: {beneficiario.CPF} para o beneficiário {beneficiario.Nome}");
                        continue;
                    }

                    beneficiariosValidos.Add(new Beneficiario
                    {
                        CPF = beneficiario.CPF,
                        Nome = beneficiario.Nome
                    });
                }

                if (resultado.Erros.Any())
                {
                    resultado.Erros.Add(Mensagens.Erro_Cadastro_Parcial);
                    resultado.Sucesso = false;
                    return resultado;
                }
            }

            var cliente = new Cliente
            {
                CEP = model.CEP,
                Cidade = model.Cidade,
                Email = model.Email,
                Estado = model.Estado,
                Logradouro = model.Logradouro,
                Nacionalidade = model.Nacionalidade,
                Nome = model.Nome,
                Sobrenome = model.Sobrenome,
                Telefone = model.Telefone,
                Cpf = model.Cpf
            };

            model.Id = _boCliente.Incluir(cliente);

            foreach (var beneficiario in beneficiariosValidos)
            {
                beneficiario.ClienteId = model.Id;
                _boBeneficiario.Incluir(beneficiario);
            }

            resultado.Sucesso = true;
            return resultado;
        }

        public ResultadoOperacao AlterarCliente(ClienteModel model)
        {
            var resultado = new ResultadoOperacao();

            if (!CpfValidator.IsValidCpf(model.Cpf))
            {
                resultado.Erros.Add(Mensagens.Erro_CPF_Invalido);
                return resultado;
            }

            var cliente = new Cliente
            {
                Id = model.Id,
                CEP = model.CEP,
                Cidade = model.Cidade,
                Email = model.Email,
                Estado = model.Estado,
                Logradouro = model.Logradouro,
                Nacionalidade = model.Nacionalidade,
                Nome = model.Nome,
                Sobrenome = model.Sobrenome,
                Telefone = model.Telefone,
                Cpf = model.Cpf
            };

            _boCliente.Alterar(cliente);

            if (model.Beneficiarios != null)
            {
                foreach (var beneficiario in model.Beneficiarios)
                {
                    if (CpfValidator.IsValidCpf(beneficiario.CPF))
                    {
                        _boBeneficiario.Incluir(new Beneficiario
                        {
                            CPF = beneficiario.CPF,
                            Nome = beneficiario.Nome,
                            ClienteId = model.Id
                        });
                    }
                    else
                    {
                        resultado.Erros.Add(string.Format(Mensagens.Erro_CPF_Beneficiario, beneficiario.CPF, beneficiario.Nome));
                    }
                }

                if (resultado.Erros.Count > 0)
                    resultado.Erros.Add(Mensagens.Erro_Cadastro_Parcial);
            }

            resultado.Sucesso = resultado.Erros.Count == 0;
            return resultado;
        }

        public ClienteModel ObterClientePorId(long id)
        {
            var cliente = _boCliente.Consultar(id);

            if (cliente == null)
                return null;

            return new ClienteModel
            {
                Id = cliente.Id,
                CEP = cliente.CEP,
                Cidade = cliente.Cidade,
                Email = cliente.Email,
                Estado = cliente.Estado,
                Logradouro = cliente.Logradouro,
                Nacionalidade = cliente.Nacionalidade,
                Nome = cliente.Nome,
                Sobrenome = cliente.Sobrenome,
                Telefone = cliente.Telefone,
                Cpf = cliente.Cpf,
                Beneficiarios = cliente.Beneficiarios?.Select(b => new BeneficiarioModel
                {
                    CPF = b.CPF,
                    Nome = b.Nome
                }).ToList()
            };
        }

        public List<Cliente> ListarClientes(int inicio, int tamanhoPagina, string campoOrdenacao, string ordem, out int total)
        {
            bool crescente = string.Equals(ordem, "ASC", StringComparison.InvariantCultureIgnoreCase);
            return _boCliente.Pesquisa(inicio, tamanhoPagina, campoOrdenacao, crescente, out total);
        }
    }

    public class ResultadoOperacao
    {
        public bool Sucesso { get; set; }
        public List<string> Erros { get; set; }

        public ResultadoOperacao()
        {
            Sucesso = false;
            Erros = new List<string>();
        }
    }
}
