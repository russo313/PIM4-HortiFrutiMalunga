package com.exemplo.produto.entity;

import java.time.LocalDate;

public class Produto {
    private int id;
    private String nome;
    private double valorUnitario;
    private UnidadeMedida unidadeMedida;
    private Categoria categoria;
    private LocalDate dataCadastro;

    public Produto(int id, String nome, double valorUnitario, UnidadeMedida unidadeMedida, Categoria categoria) {
        this.id = id;
        this.nome = nome;
        this.valorUnitario = valorUnitario;
        this.unidadeMedida = unidadeMedida;
        this.categoria = categoria;
        this.dataCadastro = LocalDate.now();
    }

    /** Atualiza o valor e retorna uma mensagem (como no enunciado: String). */
    public String editarValor(double valorNovo) {
        double antigo = this.valorUnitario;
        this.valorUnitario = valorNovo;
        return String.format("Valor do produto '%s' alterado de %.2f para %.2f", nome, antigo, valorNovo);
    }

    public int getId() { return id; }
    public String getNome() { return nome; }
    public double getValorUnitario() { return valorUnitario; }
    public UnidadeMedida getUnidadeMedida() { return unidadeMedida; }
    public Categoria getCategoria() { return categoria; }
    public LocalDate getDataCadastro() { return dataCadastro; }

    @Override
    public String toString() {
        return "Produto{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", valorUnitario=" + valorUnitario +
                ", unidadeMedida=" + unidadeMedida +
                ", categoria=" + categoria +
                ", dataCadastro=" + dataCadastro +
                '}';
    }
}
