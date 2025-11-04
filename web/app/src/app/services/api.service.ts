export type SaleType = "Unit" | "Weight";

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  saleType: SaleType;
  unitOfMeasure: string;
  minimumStock?: number;
  expirationDate?: string;
  barcode?: string;
  active: boolean;
  highlights?: string[];
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  favoriteProducts?: string[];
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: "Entry" | "Exit" | "Adjustment" | string;
  reason: "Sale" | "Donation" | "Loss" | "Expiry" | "Others" | string;
  quantity: number;
  timestamp: string;
  note?: string;
}

export interface ValidityAlert {
  id: string;
  productId: string;
  productName: string;
  validUntil: string;
  daysRemaining: number;
  status: "Novo" | "Lido";
  generatedAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  customerId?: string;
  customerName?: string;
  date: string;
  totalAmount: number;
  items: SaleItem[];
  paymentMethod: string;
}

export const categoriesData: Category[] = [
  { id: "cat-01", name: "Hortaliças", description: "Folhas e verduras frescas" },
  { id: "cat-02", name: "Frutas Tropicais", description: "Sabores do clima quente" },
  { id: "cat-03", name: "Legumes", description: "Ingredientes para o dia a dia" },
  { id: "cat-04", name: "Ervas Aromáticas", description: "Toque especial para as receitas" },
  { id: "cat-05", name: "Orgânicos", description: "Produção sustentável certificada" },
  { id: "cat-06", name: "Raízes e Tubérculos", description: "Energia natural da terra" },
  { id: "cat-07", name: "Cestas", description: "Seleções prontas para consumo" },
  { id: "cat-08", name: "Grãos e Cereais", description: "Acompanhamentos e farinhas" },
  { id: "cat-09", name: "Sucos Naturais", description: "Prensados a frio" },
  { id: "cat-10", name: "Itens Gourmet", description: "Produtos premium e diferenciados" }
];

export const productsData: Product[] = [
  {
    id: "prd-01",
    name: "Alface Crespa Hidropônica",
    categoryId: "cat-01",
    categoryName: "Hortaliças",
    saleType: "Unit",
    unitOfMeasure: "un",
    minimumStock: 15,
    expirationDate: "2025-10-18",
    active: true,
    highlights: ["Colhida diariamente", "Libre de agrotóxicos"]
  },
  {
    id: "prd-02",
    name: "Mix de Folhas Baby",
    categoryId: "cat-01",
    categoryName: "Hortaliças",
    saleType: "Weight",
    unitOfMeasure: "g",
    minimumStock: 5,
    expirationDate: "2025-10-16",
    active: true,
    highlights: ["Rúcula, espinafre e agrião baby", "Ideal para saladas especiais"]
  },
  {
    id: "prd-03",
    name: "Banana Nanica Premium",
    categoryId: "cat-02",
    categoryName: "Frutas Tropicais",
    saleType: "Weight",
    unitOfMeasure: "kg",
    minimumStock: 12,
    active: true,
    highlights: ["Doces selecionadas", "Fornecedores parceiros"]
  },
  {
    id: "prd-04",
    name: "Manga Palmer",
    categoryId: "cat-02",
    categoryName: "Frutas Tropicais",
    saleType: "Unit",
    unitOfMeasure: "un",
    minimumStock: 10,
    active: true,
    highlights: ["Polpa avermelhada", "Suco com baixa fibra"]
  },
  {
    id: "prd-05",
    name: "Tomate Italiano",
    categoryId: "cat-03",
    categoryName: "Legumes",
    saleType: "Weight",
    unitOfMeasure: "kg",
    minimumStock: 8,
    expirationDate: "2025-10-22",
    active: true,
    highlights: ["Ideal para molhos", "Menor acidez"]
  },
  {
    id: "prd-06",
    name: "Cenoura Baby",
    categoryId: "cat-03",
    categoryName: "Legumes",
    saleType: "Weight",
    unitOfMeasure: "kg",
    minimumStock: 6,
    expirationDate: "2025-10-25",
    active: true,
    highlights: ["Pronta para consumo", "Textura crocante"]
  },
  {
    id: "prd-07",
    name: "Manjericão Genovês",
    categoryId: "cat-04",
    categoryName: "Ervas Aromáticas",
    saleType: "Unit",
    unitOfMeasure: "maço",
    expirationDate: "2025-10-14",
    active: true,
    highlights: ["Excelente para pesto", "Cultivo em estufa"]
  },
  {
    id: "prd-08",
    name: "Batata Doce Roxa",
    categoryId: "cat-06",
    categoryName: "Raízes e Tubérculos",
    saleType: "Weight",
    unitOfMeasure: "kg",
    minimumStock: 10,
    active: true,
    highlights: ["Baixo índice glicêmico", "Fonte de betacaroteno"]
  },
  {
    id: "prd-09",
    name: "Cesta Detox Semanal",
    categoryId: "cat-07",
    categoryName: "Cestas",
    saleType: "Unit",
    unitOfMeasure: "kit",
    active: true,
    highlights: ["Inclui sucos, sopas e snacks saudáveis", "Entrega programada"]
  },
  {
    id: "prd-10",
    name: "Farinha de Amêndoas Premium",
    categoryId: "cat-08",
    categoryName: "Grãos e Cereais",
    saleType: "Weight",
    unitOfMeasure: "kg",
    active: true,
    highlights: ["Ideal para receitas low carb", "Embalagem a vácuo"]
  }
];

export const customersData: Customer[] = [
  { id: "cus-01", name: "Maria Silva", phone: "(11) 99999-8888", email: "maria@cliente.local", favoriteProducts: ["Alface Crespa Hidropônica", "Cesta Detox Semanal"] },
  { id: "cus-02", name: "José Santos", phone: "(11) 91111-3333", email: "jose@cliente.local", favoriteProducts: ["Tomate Italiano"] },
  { id: "cus-03", name: "Ana Pereira", phone: "(11) 93456-7890", email: "ana@cliente.local", favoriteProducts: ["Manga Palmer", "Farinha de Amêndoas Premium"] },
  { id: "cus-04", name: "Cláudia Ramos", phone: "(11) 92222-4455", email: "claudia@cliente.local" },
  { id: "cus-05", name: "Rafael Costa", phone: "(11) 91212-3434", email: "rafael@cliente.local" },
  { id: "cus-06", name: "Bianca Nunes", phone: "(11) 98888-1212", email: "bianca@cliente.local" },
  { id: "cus-07", name: "Lucas Freitas", phone: "(11) 90001-9999", email: "lucas@cliente.local" },
  { id: "cus-08", name: "Fernanda Alves", phone: "(11) 97676-5656", email: "fernanda@cliente.local" },
  { id: "cus-09", name: "Gustavo Lima", phone: "(11) 95555-8888", email: "gustavo@cliente.local" },
  { id: "cus-10", name: "Patrícia Torres", phone: "(11) 93333-0000", email: "patricia@cliente.local" }
];

export const stockMovementsData: StockMovement[] = [
  {
    id: "mov-01",
    productId: "prd-01",
    productName: "Alface Crespa Hidropônica",
    type: "Entry",
    reason: "Others",
    quantity: 30,
    timestamp: "2025-10-12T08:30:00-03:00",
    note: "Estoque inicial"
  },
  {
    id: "mov-02",
    productId: "prd-02",
    productName: "Mix de Folhas Baby",
    type: "Entry",
    reason: "Others",
    quantity: 12,
    timestamp: "2025-10-12T09:15:00-03:00",
    note: "Chegada do fornecedor VerdeVivo"
  },
  {
    id: "mov-03",
    productId: "prd-03",
    productName: "Banana Nanica Premium",
    type: "Entry",
    reason: "Others",
    quantity: 25,
    timestamp: "2025-10-11T07:45:00-03:00",
    note: "Lote Fazenda Primavera"
  },
  {
    id: "mov-04",
    productId: "prd-05",
    productName: "Tomate Italiano",
    type: "Exit",
    reason: "Sale",
    quantity: 6,
    timestamp: "2025-10-12T12:10:00-03:00",
    note: "Pedido #VEN-1042"
  },
  {
    id: "mov-05",
    productId: "prd-07",
    productName: "Manjericão Genovês",
    type: "Exit",
    reason: "Donation",
    quantity: 8,
    timestamp: "2025-10-09T15:00:00-03:00",
    note: "Doação ONG Sabor Solidário"
  },
  {
    id: "mov-06",
    productId: "prd-08",
    productName: "Batata Doce Roxa",
    type: "Entry",
    reason: "Others",
    quantity: 40,
    timestamp: "2025-10-10T10:25:00-03:00",
    note: "Parceria Sitio Flor do Campo"
  },
  {
    id: "mov-07",
    productId: "prd-10",
    productName: "Farinha de Amêndoas Premium",
    type: "Entry",
    reason: "Others",
    quantity: 15,
    timestamp: "2025-10-08T16:40:00-03:00",
    note: "Lote importado"
  },
  {
    id: "mov-08",
    productId: "prd-04",
    productName: "Manga Palmer",
    type: "Exit",
    reason: "Sale",
    quantity: 9,
    timestamp: "2025-10-13T11:55:00-03:00",
    note: "Pedido #VEN-1051"
  },
  {
    id: "mov-09",
    productId: "prd-06",
    productName: "Cenoura Baby",
    type: "Exit",
    reason: "Loss",
    quantity: 3,
    timestamp: "2025-10-07T18:20:00-03:00",
    note: "Avaria na embalagem"
  },
  {
    id: "mov-10",
    productId: "prd-09",
    productName: "Cesta Detox Semanal",
    type: "Entry",
    reason: "Others",
    quantity: 20,
    timestamp: "2025-10-11T14:00:00-03:00",
    note: "Montagem da semana"
  }
];

export const validityAlertsData: ValidityAlert[] = [
  {
    id: "val-01",
    productId: "prd-02",
    productName: "Mix de Folhas Baby",
    validUntil: "2025-10-16",
    daysRemaining: 3,
    status: "Novo",
    generatedAt: "2025-10-13T06:00:00-03:00"
  },
  {
    id: "val-02",
    productId: "prd-07",
    productName: "Manjericão Genovês",
    validUntil: "2025-10-14",
    daysRemaining: 1,
    status: "Novo",
    generatedAt: "2025-10-13T06:00:00-03:00"
  },
  {
    id: "val-03",
    productId: "prd-01",
    productName: "Alface Crespa Hidropônica",
    validUntil: "2025-10-18",
    daysRemaining: 5,
    status: "Lido",
    generatedAt: "2025-10-12T06:00:00-03:00"
  },
  {
    id: "val-04",
    productId: "prd-05",
    productName: "Tomate Italiano",
    validUntil: "2025-10-22",
    daysRemaining: 9,
    status: "Lido",
    generatedAt: "2025-10-13T06:00:00-03:00"
  },
  {
    id: "val-05",
    productId: "prd-04",
    productName: "Manga Palmer",
    validUntil: "2025-10-19",
    daysRemaining: 6,
    status: "Novo",
    generatedAt: "2025-10-13T06:00:00-03:00"
  }
];

export const salesData: Sale[] = [
  {
    id: "VEN-1042",
    customerId: "cus-01",
    customerName: "Maria Silva",
    date: "2025-10-12T12:10:00-03:00",
    paymentMethod: "Cartão de crédito",
    totalAmount: 128.4,
    items: [
      { productId: "prd-05", productName: "Tomate Italiano", quantity: 2.5, unitPrice: 14.9, subtotal: 37.25 },
      { productId: "prd-01", productName: "Alface Crespa Hidropônica", quantity: 3, unitPrice: 6.9, subtotal: 20.7 },
      { productId: "prd-09", productName: "Cesta Detox Semanal", quantity: 1, unitPrice: 70.45, subtotal: 70.45 }
    ]
  },
  {
    id: "VEN-1043",
    customerId: "cus-02",
    customerName: "José Santos",
    date: "2025-10-12T15:45:00-03:00",
    paymentMethod: "Pix",
    totalAmount: 52.35,
    items: [
      { productId: "prd-03", productName: "Banana Nanica Premium", quantity: 3, unitPrice: 9.5, subtotal: 28.5 },
      { productId: "prd-04", productName: "Manga Palmer", quantity: 3, unitPrice: 7.95, subtotal: 23.85 }
    ]
  },
  {
    id: "VEN-1044",
    customerId: "cus-03",
    customerName: "Ana Pereira",
    date: "2025-10-11T11:30:00-03:00",
    paymentMethod: "Cartão de débito",
    totalAmount: 89.6,
    items: [
      { productId: "prd-10", productName: "Farinha de Amêndoas Premium", quantity: 1, unitPrice: 39.9, subtotal: 39.9 },
      { productId: "prd-06", productName: "Cenoura Baby", quantity: 1.8, unitPrice: 27.5, subtotal: 49.5 }
    ]
  },
  {
    id: "VEN-1045",
    customerName: "Cliente balcão",
    date: "2025-10-11T17:55:00-03:00",
    paymentMethod: "Dinheiro",
    totalAmount: 36.7,
    items: [
      { productId: "prd-07", productName: "Manjericão Genovês", quantity: 2, unitPrice: 8.9, subtotal: 17.8 },
      { productId: "prd-02", productName: "Mix de Folhas Baby", quantity: 0.6, unitPrice: 31.5, subtotal: 18.9 }
    ]
  },
  {
    id: "VEN-1046",
    customerId: "cus-05",
    customerName: "Rafael Costa",
    date: "2025-10-10T13:40:00-03:00",
    paymentMethod: "Pix",
    totalAmount: 64.3,
    items: [
      { productId: "prd-08", productName: "Batata Doce Roxa", quantity: 3, unitPrice: 11.9, subtotal: 35.7 },
      { productId: "prd-05", productName: "Tomate Italiano", quantity: 2, unitPrice: 14.3, subtotal: 28.6 }
    ]
  },
  {
    id: "VEN-1047",
    customerId: "cus-06",
    customerName: "Bianca Nunes",
    date: "2025-10-09T18:15:00-03:00",
    paymentMethod: "Cartão de crédito",
    totalAmount: 112.2,
    items: [
      { productId: "prd-09", productName: "Cesta Detox Semanal", quantity: 1, unitPrice: 70.45, subtotal: 70.45 },
      { productId: "prd-01", productName: "Alface Crespa Hidropônica", quantity: 4, unitPrice: 6.9, subtotal: 27.6 },
      { productId: "prd-03", productName: "Banana Nanica Premium", quantity: 1.5, unitPrice: 9.5, subtotal: 14.25 }
    ]
  },
  {
    id: "VEN-1048",
    customerId: "cus-08",
    customerName: "Fernanda Alves",
    date: "2025-10-09T09:20:00-03:00",
    paymentMethod: "Cartão de débito",
    totalAmount: 47.8,
    items: [
      { productId: "prd-06", productName: "Cenoura Baby", quantity: 1.2, unitPrice: 27.5, subtotal: 33 },
      { productId: "prd-02", productName: "Mix de Folhas Baby", quantity: 0.5, unitPrice: 31.5, subtotal: 15.75 }
    ]
  },
  {
    id: "VEN-1049",
    customerName: "Cliente balcão",
    date: "2025-10-08T17:05:00-03:00",
    paymentMethod: "Dinheiro",
    totalAmount: 22.5,
    items: [
      { productId: "prd-07", productName: "Manjericão Genovês", quantity: 1, unitPrice: 8.9, subtotal: 8.9 },
      { productId: "prd-04", productName: "Manga Palmer", quantity: 1.5, unitPrice: 9.1, subtotal: 13.65 }
    ]
  },
  {
    id: "VEN-1050",
    customerId: "cus-09",
    customerName: "Gustavo Lima",
    date: "2025-10-08T10:50:00-03:00",
    paymentMethod: "Pix",
    totalAmount: 93.6,
    items: [
      { productId: "prd-03", productName: "Banana Nanica Premium", quantity: 2.5, unitPrice: 9.5, subtotal: 23.75 },
      { productId: "prd-05", productName: "Tomate Italiano", quantity: 3, unitPrice: 14.3, subtotal: 42.9 },
      { productId: "prd-10", productName: "Farinha de Amêndoas Premium", quantity: 0.7, unitPrice: 39.9, subtotal: 27.93 }
    ]
  },
  {
    id: "VEN-1051",
    customerId: "cus-04",
    customerName: "Cláudia Ramos",
    date: "2025-10-07T16:25:00-03:00",
    paymentMethod: "Cartão de crédito",
    totalAmount: 58.45,
    items: [
      { productId: "prd-04", productName: "Manga Palmer", quantity: 2.5, unitPrice: 7.95, subtotal: 19.88 },
      { productId: "prd-01", productName: "Alface Crespa Hidropônica", quantity: 3, unitPrice: 6.9, subtotal: 20.7 },
      { productId: "prd-07", productName: "Manjericão Genovês", quantity: 2, unitPrice: 8.9, subtotal: 17.8 }
    ]
  }
];

export const saleTypesLabels: Record<SaleType, string> = {
  Unit: "Unidade",
  Weight: "Peso"
};
