# Produto – Exercício (B/S/E/R + Mermaid)

Este repositório contém a classe **Produto** e o diagrama de classe em **Mermaid**.

## Diagrama de Classe (Mermaid)

```mermaid
classDiagram
    class Produto {
        - int id
        - String nome
        - double valorUnitario
        - UnidadeMedida unidadeMedida
        - Categoria categoria
        - Date dataCadastro

        + String editarValor(double novoValor)
        + int getId()
        + String getNome()
        + double getValorUnitario()
        + UnidadeMedida getUnidadeMedida()
        + Categoria getCategoria()
        + Date getDataCadastro()
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