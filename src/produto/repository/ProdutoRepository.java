package com.exemplo.produto.repository;

import com.exemplo.produto.entity.Produto;
import java.util.*;

public interface ProdutoRepository {
    void save(Produto p);
    Optional<Produto> findById(int id);
    List<Produto> findAll();
    boolean deleteById(int id);
}
