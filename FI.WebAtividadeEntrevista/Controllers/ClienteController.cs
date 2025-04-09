using System;
using System.Linq;
using System.Web.Mvc;
using FI.WebAtividadeEntrevista.Resources;
using WebAtividadeEntrevista.AppServices;
using WebAtividadeEntrevista.Models;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        private readonly ClienteService _clienteService = new ClienteService();

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
            if (!ModelState.IsValid)
            {
                var erros = ModelState.Values
                                      .SelectMany(v => v.Errors)
                                      .Select(e => e.ErrorMessage)
                                      .ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }

            var result = _clienteService.IncluirCliente(model);

            if (!result.Sucesso)
            {
                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, result.Erros));
            }

            return Json(Mensagens.Sucesso_Cadastro);

        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            if (!ModelState.IsValid)
            {
                var erros = ModelState.Values
                                      .SelectMany(v => v.Errors)
                                      .Select(e => e.ErrorMessage)
                                      .ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }

            var result = _clienteService.AlterarCliente(model);

            if (!result.Sucesso)
            {
                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, result.Erros));
            }

            return Json(Mensagens.Sucesso_Alteracao);
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            var model = _clienteService.ObterClientePorId(id);
            return View(model);
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd;
                string campo = string.Empty;
                string crescente = string.Empty;

                var array = jtSorting?.Split(' ') ?? new string[0];

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                var clientes = _clienteService.ListarClientes(jtStartIndex, jtPageSize, campo, crescente, out qtd);

                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
    }
}
