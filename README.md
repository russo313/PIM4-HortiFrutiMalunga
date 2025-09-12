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
