package com.exemplo.produto.controller;

import com.exemplo.produto.entity.*;
import com.exemplo.produto.service.ProdutoService;

public class ProdutoController {
    private final ProdutoService service = new ProdutoService();

    // Demonstração simples para rodar no Main
    public void demo() {
        var p1 = new Produto(1, "Banana", 8.90, UnidadeMedida.KILO, Categoria.FRUTA);
        var p2 = new Produto(2, "Tomate", 12.50, UnidadeMedida.KILO, Categoria.VERDURA);

        service.criar(p1);
        service.criar(p2);

        System.out.println("-- Lista inicial --");
        service.listar().forEach(System.out::println);

        System.out.println(service.atualizarValor(1, 9.99));

        System.out.println("-- Após atualização --");
        service.listar().forEach(System.out::println);
    }
}
