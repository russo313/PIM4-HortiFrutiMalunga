# Hortifruti Malunga - Front-end

Aplicação Angular simples para visualizar os cadastros expostos pela API .NET.

## Como rodar
```bash
cd web/app
npm install
npm start
```
A aplicação ficará disponível em `http://localhost:4200` (certifique-se de que a API esteja rodando em `http://localhost:8080`).

## Rotas disponíveis
- `/` – resumo com contagem de registros e alertas pendentes.
- `/categories` – lista de categorias.
- `/products` – lista de produtos com tipo, unidade e validade.
- `/customers` – lista de clientes.
- `/movements` – auditoria de movimentação de estoque.
- `/alerts` – alertas de validade (com botão para marcar como lido).

Os dados são somente leitura nesta versão, seguindo o escopo didático das sprints iniciais.
