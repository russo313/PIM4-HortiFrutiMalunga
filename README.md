﻿# Hortifruti Malunga – API

Projeto acadêmico (PIM IV) em C# / ASP.NET Core. A API expõe os recursos do hortifruti para ser consumida pelo front Angular (próximas sprints).

## Estrutura
- `api/Hortifruti.Api` – API ASP.NET Core, EF Core e autenticação JWT.
- `web/` – espaço reservado para o front (Sprint 2 em diante).
- `docs/` – materiais do PIM I/II/III/IV.
- `.github/workflows/ci.yml` – pipeline de build (restore + build).

## Pré-requisitos
- Windows 10/11 64 bits com Docker Desktop + WSL2
- .NET SDK 9.0
- Git
- (Opcional) Azure Data Studio ou DBeaver para acessar o SQL Server

## Executar localmente
```bash
cp .env.example .env
# ajuste as senhas se desejar

docker compose up -d --build
```

Endpoints principais:
- `GET http://localhost:8080/health`
- `GET http://localhost:8080/api/status`
- `POST http://localhost:8080/api/auth/login`
  ```json
  {
    "email": "admin@hortifruti.local",
    "password": "Admin@123"
  }
  ```

Use o token JWT retornado para acessar as demais rotas (`Authorization: Bearer ...`).

## Recursos disponíveis
| Sprint | Recurso | Método | Rota | Observações |
|--------|---------|--------|------|-------------|
| 1 | Categorias | GET | `/api/categories` | Lista todas |
| 1 | Categorias | GET | `/api/categories/{id}` | |
| 1 | Categorias | POST | `/api/categories` | Admin/Gerente |
| 1 | Categorias | PUT | `/api/categories/{id}` | Admin/Gerente |
| 1 | Categorias | DELETE | `/api/categories/{id}` | Bloqueia exclusão com produtos |
| 1 | Produtos | GET | `/api/products` | Inclui categoria e estoque mínimo |
| 1 | Produtos | GET | `/api/products/{id}` | |
| 1 | Produtos | POST | `/api/products` | Valida UNIDADE/PESO, unidade e categoria |
| 1 | Produtos | PUT | `/api/products/{id}` | |
| 1 | Produtos | DELETE | `/api/products/{id}` | Admin/Gerente |
| 1 | Clientes | GET | `/api/customers` | |
| 1 | Clientes | GET | `/api/customers/{id}` | |
| 1 | Clientes | POST | `/api/customers` | Normaliza telefone/e-mail |
| 1 | Clientes | PUT | `/api/customers/{id}` | |
| 1 | Clientes | DELETE | /api/customers/{id} | Admin/Gerente |
| 2 | Vendas | GET | /api/sales | Lista vendas com itens |
| 2 | Vendas | GET | /api/sales/{id} | Detalhe |
| 2 | Vendas | POST | /api/sales | Baixa automatica de estoque |
| 3 | Estoque | GET | `/api/stock/movements` | Auditoria com filtros (produto, período, motivo) |
| 3 | Estoque | GET | `/api/stock/balance/{produtoId}` | Saldo atual calculado |
| 3 | Estoque | POST | `/api/stock/manual-decrease` | Estoquista+ registra baixa manual |
| 4 | Validade | GET | `/api/validity/next?days=7` | Consulta produtos que vencem em N dias |
| 4 | Alertas | GET | `/api/validity/alerts` | Lista alertas gerados |
| 4 | Alertas | PATCH | `/api/validity/alerts/{id}/read` | Marca alerta como lido |
| 4 | Validade | POST | `/api/validity/run?days=7` | (Admin/Gerente) força geração manual |
| 5 | Relatórios | GET | `/api/reports/sales?format=json|csv|pdf` | Agrupado por dia/mês/produto |

### Regras aplicadas
- Produtos aceitam `SaleType` `Unit` ou `Weight`; estoque mínimo decimal apenas para PESO; UNIDADE exige valores inteiros.
- Unidade de medida limitada a `un`, `kg`, `g`, `maco`, `pct` (case insensitive).
- Código de barras é limpado, mantendo apenas dígitos.
- Telefone de cliente é armazenado somente com números; e-mail é normalizado em minúsculas.
- Baixa manual retorna 422 quando saldo insuficiente ou quantidade invalida.
- Alertas de validade são gerados automaticamente (job 24h) e podem ser executados manualmente.
- Vendas realizam baixa automática de estoque e registram movimentos para auditoria.

## Seeds iniciais
- Usuário admin (`admin@hortifruti.local` / `Admin@123`).
- Categorias “Hortalicas” e “Frutas” com dois produtos exemplo (com validade).
- Dois clientes fictícios.
- Movimento de estoque inicial (+50) para cada produto.

## Próximas sprints\n- Sprint 5: relatórios / exportações.
- Sprint 5: relatórios / exportações.
- Sprint 6: endurecer segurança, backup e UX.

## Referências
- Plano de ação `docs/pim4tudao-20250830T001202Z-1-001/📌 Plano de Ação – PIM IV (Continuidade).pdf`
- Orientações oficiais `docs/pim4tudao-20250830T001202Z-1-001/ADS_2025_2_PIM_IV_QUARTO_E_TERCEIRO_SEMESTRES - BRASÍLIA.pdf`


