<<<<<<< HEAD
```mermaid
classDiagram
    class Produto {
        - int id
        - String nome
        - double valorUnitario
        - UnidadeMedida unidadeMedida
        - Categoria categoria
        - Date dataCadastro

        + String editarValor(double valorNovo)
    }

    class UnidadeMedida {
        <<enumeration>>
        KILO
        UNIDADE
        GRAMA
        LITRO
        DUZIA
    }

    class Categoria {
        <<enumeration>>
        FRUTA
        LEGUME
        VERDURA
        PROTEINA
        OUTROS
    }

    Produto --> UnidadeMedida
    Produto --> Categoria
```


## BORD 
```mermaid
classDiagram
    Cliente "1" --> "N" Pedido
    Pedido "1" --> "N" ItemPedido
    ItemPedido "N" --> "1" Produto
    Produto --> Categoria
    Produto --> UnidadeMedida
    Estoque "1" --> "N" Produto

    class Cliente
    class Pedido
    class ItemPedido
    class Produto
    class Categoria
    class UnidadeMedida
    class Estoque
=======
# Hortifruti Malunga - Sprint 0

Projeto acad�mico (PIM IV) desenvolvido em C# com ASP.NET Core. O objetivo da sprint 0 � garantir que o ambiente sobe com banco SQL Server, API dispon�vel e base de dados m�nima para evoluir nas pr�ximas sprints.

## Estrutura
- `api/Hortifruti.Api` � API ASP.NET Core (Controllers, Data, Models, Services).
- `docs/` � materiais vindos dos PIMs anteriores.
- `docker-compose.yml` � sobe SQL Server + API.

## Pr�-requisitos
- Docker Desktop + WSL2 habilitado.
- .NET SDK 9.0 (ou superior compat�vel).
- Git.

## Como executar (Sprint 0)
1. Copie o arquivo de exemplo e ajuste as vari�veis:
   ```bash
   cp .env.example .env
   ```
2. Suba os servi�os:
   ```bash
   docker compose up -d --build
   ```
3. Verifique os endpoints principais:
   - Health check: `http://localhost:8080/health`
   - Status: `http://localhost:8080/api/status`
4. Login para obter JWT:
   ```http
   POST http://localhost:8080/api/auth/login
   {
     "email": "admin@hortifruti.local",
     "password": "Admin@123"
   }
   ```
   Use o token nas requisi��es autenticadas (ex.: `GET /api/products`).

## Banco de dados
- SQL Server roda no cont�iner `hortifruti-sqlserver`.
- Scripts autom�ticos criam as tabelas e inserem:
  - Usu�rio admin (`admin@hortifruti.local`).
  - Categorias e produtos exemplo (unidade e peso).

## Pr�ximos passos (sprints seguintes)
- Implementar CRUD de categorias, produtos e clientes.
- Adicionar migrations, testes automatizados e pipeline CI/CD.
- Evoluir regras de estoque, vendas, alertas e relat�rios conforme plano de a��o.

## Refer�ncias
- Documentos do PIM (dispon�veis em `docs/pim4tudao-...`).
- Plano de a��o com backlog completo.
>>>>>>> 1e52c75 (Sprint 0 base)

