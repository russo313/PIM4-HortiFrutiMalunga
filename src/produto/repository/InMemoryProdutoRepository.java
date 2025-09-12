package com.exemplo.produto.repository;

import com.exemplo.produto.entity.Produto;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class InMemoryProdutoRepository implements ProdutoRepository {
    private final Map<Integer, Produto> db = new ConcurrentHashMap<>();

    @Override
    public void save(Produto p) { db.put(p.getId(), p); }

    @Override
    public Optional<Produto> findById(int id) { return Optional.ofNullable(db.get(id)); }

    @Override
    public List<Produto> findAll() { return new ArrayList<>(db.values()); }

    @Override
    public boolean deleteById(int id) { return db.remove(id) != null; }
}
