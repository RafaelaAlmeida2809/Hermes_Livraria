
var  preco = new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'});
var jsonProduto = [];
var idProduto="";
var strCategoria="";
var desconto=0;
var usuario = null;
var produto = null;
var precoUnitario = 0;

//Funcoes recebidas do Index
var funcaoPegarProduto =null;
var funcaoAdicionarProdutoCarrinho=null;
var funcaoProdutoFavoritoBanco=null;
var funcaoBuscarFavoritoBanco=null;

//Funcoes executadas após o carregamento do html
window.onload= function() {
    $(function(){
        $("#localCabecalho").load("../html/cabecalho.html", function(){
        });
    });
    jsonStorage = JSON.parse(window.localStorage.getItem("produtoCarrinho"));
    if(jsonStorage!= null){
        for(i = 0;i<jsonStorage.length;i++){
            jsonProduto.push(jsonStorage[i]);
        }
    }    
    const parametros  = new URLSearchParams(window.location.search);
    idProduto=parametros.get("Id");
    strCategoria=parametros.get("Categoria");
    if(window.location.href.includes("Desconto")){
        desconto = parametros.get("Desconto");
    }
    funcaoPegarProduto(idProduto,strCategoria,carregarProduto);
    regularComponentes();
    window.addEventListener('resize', function() {
        regularComponentes();
    }, true);
}

//Funcoes executadas após a verificação do status do usuario
function iniciar(){
    modalUsuario(usuario);
    if(usuario !=null){
        funcaoBuscarFavoritoBanco(idProduto);
        document.getElementById("imgCoracao").classList.add("mostrar");
    }
}

//Muda status de componentes de acordo com o tamanho da tela
function regularComponentes(){
    if (window.innerWidth<=850){
        document.getElementById("localInformaçoes").classList.remove("mostrar");
        document.getElementById("localMensagem").classList.add("mostrar");
        document.getElementById("localInformaçoes2").classList.add("mostrar");
    }
    else{
        document.getElementById("localMensagem").classList.remove("mostrar");
        document.getElementById("localInformaçoes2").classList.remove("mostrar");
        document.getElementById("localInformaçoes").classList.add("mostrar");
    }
}

//Carrega os dados do produto
function carregarProduto(doc){
    if(doc!=null){
        produto = doc;
        if(desconto!=0){
            precoUnitario = parseFloat(doc.data().preco) *(1-(parseInt(desconto)/100));
            localPrecoAntigo= document.getElementById("precoAntigo");
            localPrecoAntigo.classList.remove("desativar");
            localPrecoAntigo.innerHTML=preco.format(parseFloat(doc.data().preco));
        }
        else{
            console.log("semdesconto");
            precoUnitario = parseFloat(doc.data().preco);
        }
        document.getElementById("nomeProduto").innerHTML=doc.data().nome;
        document.getElementById("descricaoProduto").innerHTML=doc.data().descricao;
        document.getElementById("descricaoProduto2").innerHTML=doc.data().descricao;
        document.getElementById("editoraProduto").innerHTML=doc.data().editora;
        document.getElementById("editoraProduto2").innerHTML=doc.data().editora;
        document.getElementById("paginasProduto").innerHTML=doc.data().paginas +"páginas";
        document.getElementById("paginasProduto2").innerHTML=doc.data().paginas +"páginas";
        document.getElementById("capaProduto").innerHTML=doc.data().capa;
        document.getElementById("capaProduto2").innerHTML=doc.data().capa;
        document.getElementById("idiomaProduto").innerHTML=doc.data().idioma;
        document.getElementById("idiomaProduto2").innerHTML=doc.data().idioma;
        document.getElementById("anoProduto").innerHTML=doc.data().ano;
        document.getElementById("anoProduto2").innerHTML=doc.data().ano;
        document.getElementById("precoProduto").innerHTML=preco.format(precoUnitario);
        document.getElementById("imagemProduto").src ="../imagens/produtos/"+doc.id+".jpg";
        document.getElementById("precoTotalProduto").innerHTML = preco.format(precoUnitario);
        document.getElementById("imagemGrande").src ="../imagens/produtos/"+doc.id+".jpg";
    }
}

//Adiciona o produto ao carrinho
function adicionarProdutoCarrinho(comprar=false){
    var qtdProduto = document.getElementById("qtdProduto").value;
    if(usuario==null){
        let repitido = false;
        for(i = 0;i<jsonProduto.length;i++){
            if(jsonProduto[i].idProduto ==idProduto){
                jsonProduto[i].qtdProduto = parseInt(jsonProduto[i].qtdProduto) + 1;
                repitido = true;
            }
        }
        if(!repitido){
            var produto = {"idProduto":idProduto,"strCategoria":strCategoria,"qtdProduto":qtdProduto};
            jsonProduto.push(produto);
        }
        window.localStorage.setItem('produtoCarrinho',JSON.stringify(jsonProduto));
        if(comprar){
            window.location.href = "carrinho.html";
        }
    }
    else{
        funcaoAdicionarProdutoCarrinho(idProduto,strCategoria,false,qtdProduto,false,comprar);
    }
    if(!comprar){
        document.getElementById("localAviso").innerHTML  = `<p class="strAviso">Produto adicionado ao carrinho</p>`;
    }
}

//Atualiza o preço total
function alterarPrecoTotal(qtdProduto){
    if(qtdProduto<=0){
        document.getElementById("qtdProduto").value =1;
        qtdProduto = 1;
    }
    document.getElementById("precoTotalProduto").innerHTML = preco.format(precoUnitario*qtdProduto);
}

//Abre a imagem zoom
function abrirImagem (resultado){
    if(resultado){
        document.getElementById("imagemGrande").classList.add("mostrar");
    }
    else{
        
        document.getElementById("imagemGrande").classList.remove("mostrar");
    }
}

//Adiciona ou remove um item da lista de favoritos
function favoritar(inicio = false){
    if( document.getElementById("imgCoracao2").classList.contains("mostrar")){
        document.getElementById("imgCoracao2").classList.remove("mostrar");
    }
    else{
        document.getElementById("imgCoracao2").classList.add("mostrar");
    }
    if(!inicio){
        funcaoProdutoFavoritoBanco(idProduto,strCategoria);
    }
}
