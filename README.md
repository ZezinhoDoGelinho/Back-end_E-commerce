
<h1 align="center" style="font-weight: bold;">Back-end E-commerce 💻</h1>

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

<p align="center">
 <a href="#started">Getting Started</a> • 
  <a href="#routes">API Endpoints</a> •
 <a href="#colab">Collaborators</a> •
 <a href="#contribute">Contribute</a>
</p>

<p align="center">
  <b>
  API que é responsavel pelo cadastro de usuarios, categorias e produtos.<br>
  Na criação da API foi utilizado: Express, JWT, yup, a biblioteca uuid.<br>
  Para fazer a conexão com os bancos de dados: Sequelize para Postgres e Mongoose para MongoDB.
  </b>
</p>

<h2 id="started">🚀 Para começar</h2>

Para que a aplicação funcione:

<h3>Pre-requisitos</h3>

Você precisará ter em sua maquina:

- [NodeJS](https://github.com/)
- [Docker](https://www.docker.com/)

<h3>Digite no terminal</h3>

<h4>Para clonar o repositorio</h4>

```bash
git clone ZezinhoDoGelinho/Back-end_E-commerce
```

<h4>Instale as dependencias</h4>

```bash
yarn
```
<h4>Baixe as imagens do PostgreSQL e do MongoDB</h4>

```bash
docker pull postgres
```
```bash
docker pull mongo
```

<h4>Crie um um container Docker para o postgreSQL</h4>

```bash
docker run --name postgres -e POSTGRES_PASSWORD=roupas -p 5432:5432 -d postgres
```

<h4>Crie um um container Docker para o MongoDB</h4>

```bash
docker run --name carrinho-mongoDB -p 27017:27017 -d -t mongo
```

<h3>Configure o sistema de envio de emails</h3>
<h4>altere as configurações do arquivo "src/app/nodemailer/config/mail.json"</h4>

```bash
{
    "service": "gmail",
    "host": " smtp.gmail.com",
    "port": 587,
    "user": "SeuEmail@gmail.com", 
    "pass": "SuaSenhaDeAppDoGmail"
}
```

<h3>Starting</h3>

```bash
yarn dev
``````


<h2 id="routes">📍 API Endpoints</h2>

Aqui estão as rotas destá API e a descrição.
​
| Rotas                | Descrição                                         
|----------------------|-----------------------------------------------------
| <kbd> POST /users </kbd>                 | Rota de cadastro de usuario 
| <kbd> POST /sessions </kbd>              | Rota de Login de usuario 
| <kbd> POST /recover-password </kbd>      | Rota de Gerar token de Recuperação de senha 
| <kbd> POST /redefine-password </kbd>     | Rota que valida e Redefine a senha 
| <kbd> POST /admin </kbd>                 | Rota para Promove usuarios a admins 
| <kbd> DELETE /admin </kbd>               | Rota para deleta admin da tabela de admins
| <kbd> POST /products </kbd>              | Rota Para criar novos produtos
| <kbd> GET /products </kbd>               | Rota Para pegar todos os produtos do banco de dados
| <kbd> PUT /products/:id </kbd>           | Rota Para editar um produto atravez de seu id
| <kbd> DELETE /products/:id </kbd>        | Rota Para excluir um produto atravez de seu id
| <kbd> POST /categories </kbd>            | Rota Para criar novas categorias
| <kbd> GET /categories </kbd>             | Rota Para pegar todas as categorias do banco de dados
| <kbd> PUT /categories/:id </kbd>         | Rota Para editar uma categoria atravez de seu id
| <kbd> DELETE /categories/:id </kbd>      | Rota Para excluir uma categoria atravez de seu id
| <kbd> POST /orders </kbd>                | Rota Para criar um pedido
| <kbd> GET /orders </kbd>                | Rota Para Pegar todos os pedidos
| <kbd> PUT /orders/:id </kbd>                | Rota Para Editar statos do pedido atravez de seu id


<h2 id="colab">🤝 Collaborators</h2>

Responsavel pelo projeto

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/ZezinhoDoGelinho">
        <img src="https://avatars.githubusercontent.com/u/122682835?v=4" width="100px;" alt="Paulo Vitor Profile Picture"/><br>
        <sub>
          <b>Paulo Vitor</b>
        </sub>
      </a>
    </td>
  </tr>
</table>
