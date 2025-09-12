package com.exemplo.produto.service;

import com.exemplo.produto.entity.Produto;
import com.exemplo.produto.repository.ProdutoRepository;
import com.exemplo.produto.repository.InMemoryProdutoRepository;

import java.util.List;
import java.util.Optional;

public class ProdutoService {
    private final ProdutoRepository repo;

    public ProdutoService() {
        this.repo = new InMemoryProdutoRepository();
    }

    // Injeção por construtor (útil em testes)
    public ProdutoService(ProdutoRepository repo) {
        this.repo = repo;
    }

    public Produto criar(Produto p) {
        repo.save(p);
        return p;
    }

    public List<Produto> listar() {
        return repo.findAll();
    }

    public Optional<Produto> buscar(int id) {
        return repo.findById(id);
    }

    public boolean remover(int id) {
        return repo.deleteById(id);
    }

    public String atualizarValor(int id, double novoValor) {
        return repo.findById(id)
                .map(p -> p.editarValor(novoValor))
                .orElse("Produto não encontrado: id=" + id);
    }
}
