// Define o tipo para um produto
type Produto = {
  nome: string;
  quantidade: number;
};

// Estrutura de dados principal
const estoque = new Map<string, Produto>();

// Seleciona os elementos do DOM
const form = document.getElementById('product-form') as HTMLFormElement;
const addStockForm = document.getElementById('add-stock-form') as HTMLFormElement; // Novo formulário
const productList = document.getElementById('product-list')!;
const searchResult = document.getElementById('search-result')!;
const messageBox = document.getElementById('message')!;
const totalItems = document.getElementById('total-items')!;
const searchButton = document.getElementById('search-button')!;
const removeButton = document.getElementById('remove-button')!;
const clearButton = document.getElementById('clear-button')!;

// --- Funções de Persistência com LocalStorage ---

// Salva o estado atual do estoque no LocalStorage
function saveEstoque() {
  const estoqueArray = Array.from(estoque.entries());
  localStorage.setItem('estoqueApp', JSON.stringify(estoqueArray));
}

// Carrega o estoque salvo do LocalStorage ao iniciar
function loadEstoque() {
  const data = localStorage.getItem('estoqueApp');
  if (data) {
    const estoqueArray: [string, Produto][] = JSON.parse(data);
    estoque.clear();
    for (const [id, produto] of estoqueArray) {
      estoque.set(id, produto);
    }
  }
}

// --- Funções Principais ---

// Mostra uma mensagem temporária na tela
function showMessage(msg: string, color = "green") {
  messageBox.textContent = msg;
  messageBox.style.color = color;
  setTimeout(() => {
    messageBox.textContent = "";
  }, 3000);
}

// Renderiza a lista de produtos na tela
function listarProdutos() {
  productList.innerHTML = '';
  let total = 0;
  if (estoque.size === 0) {
    productList.innerHTML = '<li>Nenhum produto no estoque.</li>';
  } else {
    estoque.forEach((produto, id) => {
      const li = document.createElement('li');
      li.textContent = `ID: ${id} | ${produto.nome} (Quantidade: ${produto.quantidade})`;
      if (produto.quantidade <= 5) li.classList.add("low-stock");
      productList.appendChild(li);
      total += produto.quantidade;
    });
  }
  totalItems.textContent = `🔢 Total de itens no estoque: ${total}`;
}

// Adiciona um novo produto
function adicionarProduto(e: Event) {
  e.preventDefault();
  const id = (document.getElementById('product-id') as HTMLInputElement).value.trim();
  const nome = (document.getElementById('product-name') as HTMLInputElement).value.trim();
  const quantidade = parseInt((document.getElementById('product-quantity') as HTMLInputElement).value);

  if (!id || !nome || isNaN(quantidade) || quantidade <= 0) {
    showMessage("Preencha todos os campos corretamente!", "red");
    return;
  }

  if (estoque.has(id)) {
    showMessage("Produto já cadastrado com esse ID. Use a seção 'Adicionar ao Estoque' para atualizar.", "red");
    return;
  }

  estoque.set(id, { nome, quantidade });
  saveEstoque();
  showMessage("Novo produto adicionado com sucesso!");
  form.reset();
  listarProdutos();
}

// função pra adicionar quantidade a um produto existente
function adicionarEstoque(e: Event) {
    e.preventDefault();
    const id = (document.getElementById('add-stock-id') as HTMLInputElement).value.trim();
    const quantidadeAdicional = parseInt((document.getElementById('add-stock-quantity') as HTMLInputElement).value);

    if (!id || isNaN(quantidadeAdicional) || quantidadeAdicional <= 0) {
        showMessage("Por favor, preencha o ID e a quantidade a ser adicionada.", "red");
        return;
    }

    if (estoque.has(id)) {
        const produto = estoque.get(id)!;
        produto.quantidade += quantidadeAdicional; // Soma a quantidade
        estoque.set(id, produto); // Atualiza o valor no Map

        saveEstoque();
        listarProdutos();
        showMessage(`${quantidadeAdicional} unidade(s) adicionada(s) ao produto '${produto.nome}'!`, "blue");
        addStockForm.reset();
    } else {
        showMessage("Produto com este ID não encontrado no estoque.", "red");
    }
}


// Busca um produto pelo ID
function searchProduct() {
  const id = (document.getElementById('search-id') as HTMLInputElement).value.trim();
  if (!id) {
    searchResult.textContent = "Digite um ID para buscar.";
    return;
  }
  if (estoque.has(id)) {
    const produto = estoque.get(id)!;
    searchResult.textContent = `🔍 ${produto.nome} - Quantidade: ${produto.quantidade}`;
  } else {
    searchResult.textContent = "❌ Produto não encontrado.";
  }
}

// Remove um produto pelo ID
function removeProduct() {
  const id = (document.getElementById('remove-id') as HTMLInputElement).value.trim();
  if (!id) {
    showMessage("Digite um ID para remover.", "red");
    return;
  }
  if (estoque.delete(id)) {
    saveEstoque();
    showMessage("Produto removido com sucesso!");
    (document.getElementById('remove-id') as HTMLInputElement).value = '';
    listarProdutos();
  } else {
    showMessage("Produto não encontrado.", "red");
  }
}

// Limpa todo o estoque
function clearEstoque() {
  if (estoque.size === 0) {
    showMessage("O estoque já está vazio.", "blue");
    return;
  }
  if (confirm("Você tem certeza que deseja limpar todo o estoque?")) {
    estoque.clear();
    saveEstoque();
    listarProdutos();
    showMessage("Estoque totalmente limpo!");
  }
}

// --- Event Listeners ---
form.addEventListener('submit', adicionarProduto);
addStockForm.addEventListener('submit', adicionarEstoque); // Novo listener
searchButton.addEventListener('click', searchProduct);
removeButton.addEventListener('click', removeProduct);
clearButton.addEventListener('click', clearEstoque);

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
  loadEstoque();
  listarProdutos();
});