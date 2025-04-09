using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using FI.AtividadeEntrevista.BLL;
using FI.AtividadeEntrevista.DML;
using FI.WebAtividadeEntrevista.Models;
using FI.WebAtividadeEntrevista.Models.Validations;
using WebAtividadeEntrevista.Models;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            BoCliente boClient = new BoCliente();
            BoBeneficiario boBeneficiario = new BoBeneficiario();

            List<string> erros = new List<string>();

            if (!CpfValidator.IsValidCpf(model.Cpf))
            {
                Response.StatusCode = 400;
                return Json("CPF inválido. Por favor, verifique os dados e tente novamente.");
            }

            if (!this.ModelState.IsValid)
            {
                erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                if (boClient.VerificarExistencia(model.Cpf))
                {
                    Response.StatusCode = 400;
                    return Json("O CPF informado já pertence a um cliente. Insira um CPF válido");
                }

                model.Id = boClient.Incluir(new Cliente
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
                });

                if (model.Beneficiarios != null)
                {
                    foreach (BeneficiarioModel beneficiario in model.Beneficiarios)
                    {
                        if (CpfValidator.IsValidCpf(beneficiario.CPF))
                        {
                            boBeneficiario.Incluir(new Beneficiario()
                            {
                                CPF = beneficiario.CPF,
                                Nome = beneficiario.Nome,
                                ClienteId = model.Id
                            });
                        }
                        else
                            erros.Add($"CPF {beneficiario.CPF} do cliente {beneficiario.Nome} é inválido.");
                    }

                    if (erros.Count > 0)
                    {
                        erros.Add("Cadastro parcialmente realizado.");
                        return Json(string.Join(Environment.NewLine, erros));
                    }
                }

                return Json("Cadastro realizado.");
            }
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            BoCliente bo = new BoCliente();

            List<string> erros = new List<string>();

            if (!CpfValidator.IsValidCpf(model.Cpf))
            {
                Response.StatusCode = 400;
                return Json("CPF inválido. Por favor, verifique os dados e tente novamente.");
            }

            if (!this.ModelState.IsValid)
            {
                erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                bo.Alterar(new Cliente
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
                });

                return Json("Cadastro alterado com sucesso");
            }
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoCliente bo = new BoCliente();
            Cliente cliente = bo.Consultar(id);
            ClienteModel model = null;

            if (cliente != null)
            {
                model = new ClienteModel
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
                    Cpf = cliente.Cpf
                };
            }

            return View(model);
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
    }
}