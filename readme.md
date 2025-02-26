# Express.js REST API

Este é um projeto de API REST desenvolvida com **Express.js** e **MySQL**, focado na gestão de usuários.

## Tecnologias Utilizadas
- **Node.js**
- **Express.js**
- **MySQL** (via **Knex.js**)
- **JWT** para autenticação
- **bcrypt** para hashing de senhas

## Instalação

Clone o repositório:
```sh
git clone <git@github.com:Pedro-Chaves/api_crud_login.git>
cd api_crud_login
```

Instale as dependências:
```sh
npm install
```

Crie um arquivo **.env** na raiz do projeto e configure suas variáveis de ambiente:
```
PORT=8080
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=apiusers
JWT_SECRET=sua_chave_secreta
```

## Uso

### Iniciar o Servidor
```sh
npm start
```
O servidor rodará por padrão em **http://localhost:8080**.

### Rotas Principais

#### Autenticação
- `POST /user/login` → Realiza login e retorna um token JWT

#### Usuários
- `GET /user` → Retorna todos os usuários (autenticado)
- `GET /user/:id` → Retorna um usuário por ID (autenticado)
- `POST /user/create` → Cria um novo usuário
- `PUT /user` → Atualiza um usuário (autenticado)
- `DELETE /user/:id` → Exclui um usuário (autenticado)

#### Recuperação de Senha
- `POST /user/password_recover` → Gera um token de recuperação
- `POST /user/change_password` → Altera a senha com um token válido

## Estrutura do Projeto
```
express-js-rest-api-base/
│── controllers/     # Controladores das rotas
│── middlewares/     # Middlewares de autenticação
│── models/          # Models para acesso ao banco de dados
│── routes/          # Definição das rotas
│── database/        # Configuração do banco de dados (Knex.js)
│── index.js         # Ponto de entrada do servidor
│── .env.example     # Exemplo de arquivo de variáveis de ambiente
│── package.json     # Dependências e scripts do projeto
```

## Melhorias Futuras
- Implementar Swagger para documentação da API
- Melhorar a gestão de erros e logs
- Criar testes automatizados com Jest

## Autor
Desenvolvido por Pedro Henrique Moreira Chaves. 🚀

Se gostou, deixe uma ⭐ no repositório!
