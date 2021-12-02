
var indexProdutosPromocao = 0;
var preco = new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'});
var indexProdutos = 0;
var listaProdutos = [];
var usuario = null;

//Funcoes recebidas do Index
var funcaoMontarJsonProdutosDesconto=null;
var funcaoFiltro=null;

//Funcoes executadas após o carregamento do html
window.onload = function() {    
    $(function(){
        $("#localCabecalho").load("../html/cabecalho.html", function(){
        });
    });
    if(window.location.href.includes("Categoria")){
        const parametros  = new URLSearchParams(window.location.search);
        if(window.location.href.includes("Estilo")){
            atualizarProdutos(parametros.get("Categoria"),parametros.get("Estilo"));
        }
        else{
            atualizarProdutos(parametros.get("Categoria"));
        }
    }
    else{
        funcaoMontarJsonProdutosDesconto();
    }
    window.addEventListener('resize', function() {
        carregarProdutosPromocao();
    }, true);
}

//Funcoes executadas após a verificação do status do usuario
function iniciar(){
    modalUsuario(usuario); 
}

//Abre elementos em promocao e carrega os itens
function carregarProdutosPromocao(){
    if(!document.getElementById("abaInicial").classList.contains("mostrar")){
        document.getElementById("abaProdutos").classList.remove("mostrar");
        document.getElementById("abaInicial").classList.add("mostrar");
    }
    var elemento = document.getElementById("localProdutosPromocao");
    qtdSlots = Math.floor((window.innerWidth -100)/180);
    qtdProxProd = qtdSlots - indexProdutosPromocao;
    carregarTodosProdutos(qtdSlots,listaProdutos,true,elemento);
}

//Atualiza o status da seta
function atualizarSetas(){
    qtdSlots = Math.floor((window.innerWidth -100)/150);
    qtdProxProd = qtdSlots - indexProdutosPromocao;
    if(indexProdutosPromocao==0){
        document.getElementById("setaEsquerda").classList.add("desativado");
        document.getElementById("setaEsquerda").onclick = null;
    }
    else{
        document.getElementById("setaEsquerda").onclick = function() {
            carregarProdutosPromocao(qtdSlots,listaProdutos,true,-1);
            }
        document.getElementById("setaEsquerda").classList.remove("desativado");
    }
    try{
        if( indexProdutosPromocao+qtdSlots>=listaProdutos.length){
            document.getElementById("setaDireita").classList.add("desativado");
            document.getElementById("setaDireita").onclick = null;
        }
        else{
            document.getElementById("setaDireita").onclick = function() {
                carregarProdutosPromocao(qtdSlots,listaProdutos,true,1);
            }
            document.getElementById("setaDireita").classList.remove("desativado");
        }
    }catch{};
}

//Carrega html dos produtos
function carregarTodosProdutos(qtdSlots,jsonLista,promocao,elemento,valor=null){
    let codigoHtml = "";
    if(elemento!=null){
        primeiroLivro = indexProdutos;
        if(valor>0){
            primeiroLivro =indexProdutos+qtdSlots;
        }
        else if(valor<0){
            primeiroLivro =indexProdutos-qtdSlots;
            if(indexProdutos-qtdSlots<0){
                primeiroLivro=0;
            }
        }
        for(i=primeiroLivro;i<(primeiroLivro+qtdSlots)&&i<jsonLista.length;i++){
           var precoProduto = 0;
            if(jsonLista[i].desconto !=0){
                codigoHtml += `<a class = "produto botaoPagina" href="produto.html?Id=${jsonLista[i].id}&Categoria=${jsonLista[i].categoria}&Desconto=${jsonLista[i].desconto}">`;
                codigoHtml += `<h4 class="strDesconto">${jsonLista[i].desconto}%</h4>`;
                precoProduto =jsonLista[i].preco*(1-(jsonLista[i].desconto/100)); 
            }
            else{
                codigoHtml += `<a class = "produto botaoPagina" href="produto.html?Id=${jsonLista[i].id}&Categoria=${jsonLista[i].categoria}">`;
                precoProduto = jsonLista[i].preco;
            }
            codigoHtml += `<img src="../imagens/produtos/${jsonLista[i].id}.jpg"/>`;
            codigoHtml += `<p>${jsonLista[i].nome}</p>`;
            codigoHtml += `<p class="preco">${preco.format(precoProduto)}</p>`;
            codigoHtml += `<button class="botaoEstilo1">Comprar</button></a>`;   
        }
        console.log(jsonLista.length);
        if(jsonLista.length==0){
            codigoHtml += `<div class="centralizar"><p class="negrito">Nenhum produto encontrado</p></div>`;
        }
        elemento.innerHTML=codigoHtml;
        indexProdutosPromocao = primeiroLivro;
        if(promocao){
            atualizarSetas();
        }
        document.getElementById("localAviso").innerHTML ="";
    }
}

//Abre elementos e carrega os itens
function carregarPaginaProduto(){ 
    var produtosFiltrados = [];
    console.log(listaProdutos);
    if(!document.getElementById("abaProdutos").classList.contains("mostrar")){
        document.getElementById("abaInicial").classList.remove("mostrar");
        document.getElementById("abaProdutos").classList.add("mostrar");
    }
    var elemento = document.getElementById("localProdutos");
    qtdSlots = 50; 
    qtdProxProd = qtdSlots - indexProdutos;
    const parametros  = new URLSearchParams(window.location.search);
	if(strEstilo!= null && listaProdutos!= null){
		produtosFiltrados=listaProdutos.filter(function(produto) {
            return produto.estilo.indexOf(strEstilo) > -1;
        });   
        carregarTodosProdutos(qtdSlots,produtosFiltrados,false,elemento);
	}
    else{
        carregarTodosProdutos(50,listaProdutos,false,elemento);
    }
}