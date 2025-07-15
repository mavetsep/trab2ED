// Estrutura de dados principal
var estoque = new Map();
// Seleciona os elementos do DOM
var form = document.getElementById('product-form');
var addStockForm = document.getElementById('add-stock-form'); // Novo formulário
var productList = document.getElementById('product-list');
var searchResult = document.getElementById('search-result');
var messageBox = document.getElementById('message');
var totalItems = document.getElementById('total-items');
var searchButton = document.getElementById('search-button');
var removeButton = document.getElementById('remove-button');
var clearButton = document.getElementById('clear-button');
// --- Funções de Persistência com LocalStorage ---
// Salva o estado atual do estoque no LocalStorage
function saveEstoque() {
    var estoqueArray = Array.from(estoque.entries());
    localStorage.setItem('estoqueApp', JSON.stringify(estoqueArray));
}
// Carrega o estoque salvo do LocalStorage ao iniciar
function loadEstoque() {
    var data = localStorage.getItem('estoqueApp');
    if (data) {
        var estoqueArray = JSON.parse(data);
        estoque.clear();
        for (var _i = 0, estoqueArray_1 = estoqueArray; _i < estoqueArray_1.length; _i++) {
            var _a = estoqueArray_1[_i], id = _a[0], produto = _a[1];
            estoque.set(id, produto);
        }
    }
}
// --- Funções Principais ---
// Mostra uma mensagem temporária na tela
function showMessage(msg, color) {
    if (color === void 0) { color = "green"; }
    messageBox.textContent = msg;
    messageBox.style.color = color;
    setTimeout(function () {
        messageBox.textContent = "";
    }, 3000);
}
// Renderiza a lista de produtos na tela
function listarProdutos() {
    productList.innerHTML = '';
    var total = 0;
    if (estoque.size === 0) {
        productList.innerHTML = '<li>Nenhum produto no estoque.</li>';
    }
    else {
        estoque.forEach(function (produto, id) {
            var li = document.createElement('li');
            li.textContent = "ID: ".concat(id, " | ").concat(produto.nome, " (Quantidade: ").concat(produto.quantidade, ")");
            if (produto.quantidade <= 5)
                li.classList.add("low-stock");
            productList.appendChild(li);
            total += produto.quantidade;
        });
    }
    totalItems.textContent = "\uD83D\uDD22 Total de itens no estoque: ".concat(total);
}
// Adiciona um novo produto
function adicionarProduto(e) {
    e.preventDefault();
    var id = document.getElementById('product-id').value.trim();
    var nome = document.getElementById('product-name').value.trim();
    var quantidade = parseInt(document.getElementById('product-quantity').value);
    if (!id || !nome || isNaN(quantidade) || quantidade <= 0) {
        showMessage("Preencha todos os campos corretamente!", "red");
        return;
    }
    if (estoque.has(id)) {
        showMessage("Produto já cadastrado com esse ID. Use a seção 'Adicionar ao Estoque' para atualizar.", "red");
        return;
    }
    estoque.set(id, { nome: nome, quantidade: quantidade });
    saveEstoque();
    showMessage("Novo produto adicionado com sucesso!");
    form.reset();
    listarProdutos();
}
// função pra adicionar quantidade a um produto existente
function adicionarEstoque(e) {
    e.preventDefault();
    var id = document.getElementById('add-stock-id').value.trim();
    var quantidadeAdicional = parseInt(document.getElementById('add-stock-quantity').value);
    if (!id || isNaN(quantidadeAdicional) || quantidadeAdicional <= 0) {
        showMessage("Por favor, preencha o ID e a quantidade a ser adicionada.", "red");
        return;
    }
    if (estoque.has(id)) {
        var produto = estoque.get(id);
        produto.quantidade += quantidadeAdicional; // Soma a quantidade
        estoque.set(id, produto); // Atualiza o valor no Map
        saveEstoque();
        listarProdutos();
        showMessage("".concat(quantidadeAdicional, " unidade(s) adicionada(s) ao produto '").concat(produto.nome, "'!"), "blue");
        addStockForm.reset();
    }
    else {
        showMessage("Produto com este ID não encontrado no estoque.", "red");
    }
}
// Busca um produto pelo ID
function searchProduct() {
    var id = document.getElementById('search-id').value.trim();
    if (!id) {
        searchResult.textContent = "Digite um ID para buscar.";
        return;
    }
    if (estoque.has(id)) {
        var produto = estoque.get(id);
        searchResult.textContent = "\uD83D\uDD0D ".concat(produto.nome, " - Quantidade: ").concat(produto.quantidade);
    }
    else {
        searchResult.textContent = "❌ Produto não encontrado.";
    }
}
// Remove um produto pelo ID
function removeProduct() {
    var id = document.getElementById('remove-id').value.trim();
    if (!id) {
        showMessage("Digite um ID para remover.", "red");
        return;
    }
    if (estoque.delete(id)) {
        saveEstoque();
        showMessage("Produto removido com sucesso!");
        document.getElementById('remove-id').value = '';
        listarProdutos();
    }
    else {
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
document.addEventListener('DOMContentLoaded', function () {
    loadEstoque();
    listarProdutos();
});
