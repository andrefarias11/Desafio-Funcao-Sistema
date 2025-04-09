# 📋 Desafio Função Sistema

## ✨ Funcionalidades

- 👤 Cadastro completo de clientes (nome, CPF, e-mail, telefone, etc).
- ➕ Inclusão de múltiplos **beneficiários**.
- ✅ Validação de **CPF** (cliente e beneficiários).
- 🚫 Prevenção de **CPFs duplicados** entre beneficiários.
- 🖼️ Modal interativo para adicionar beneficiários.
- 🔗 Integração com back-end em C# (.NET).

## 🛠️ Tecnologias Utilizadas

- ⚙️ ASP.NET MVC (.NET)
- 🎨 HTML, CSS, JavaScript e Bootstrap
- 🧠 jQuery
- 🔄 JSON para comunicação cliente-servidor

## 🚀 Como usar

1. 🔽 Clone este repositório.
2. 🧑‍💻 Abra o projeto no **Visual Studio**.
3. ▶️ Execute o projeto (F5 ou Ctrl + F5).
4. ✍️ Preencha o formulário com os dados do cliente.
5. 👥 Adicione beneficiários clicando em **"Incluir"**.
6. 💾 Clique em **"Salvar"** para finalizar o cadastro.

## 📦 Estrutura

- `ClienteModel`: informações do cliente + lista de beneficiários.
- `BeneficiarioModel`: nome + CPF.
- 🧩 JavaScript: validação de campos, inclusão dinâmica e feedback ao usuário.
- 🎯 Controller: valida e persiste os dados com carinho.

## ⚠️ Observações

- O CPF é validado com base nos **dígitos verificadores**.  
- Beneficiários com **CPFs duplicados ou inválidos** não são permitidos.  
- Tudo isso feito pensando na melhor experiência possível! 😊
