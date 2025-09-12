# Produto – Exercício (B/S/E/R + Mermaid)

Este repositório contém a classe **Produto** e o diagrama de classe em **Mermaid**.

## Diagrama de Classe

```mermaid
classDiagram
    class Produto {
        - int id
        - String nome
        - double valorUnitario
        - UnidadeMedida unidadeMedida
        - Categoria categoria
        - LocalDate dataCadastro

        + void editarValor(double novoValor)
        + int getId()
        + String getNome()
        + double getValorUnitario()
        + UnidadeMedida getUnidadeMedida()
        + Categoria getCategoria()
        + LocalDate getDataCadastro()
    }

    enum UnidadeMedida {
        KILO
        UNIDADE
        GRAMA
        LITRO
        DUZIA
    }

    enum Categoria {
        FRUTA
        LEGUME
        VERDURA
        PROTEINA
        OUTROS
    }

    Produto --> UnidadeMedida
    Produto --> Categoria
