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

