var categorias = [];
var strPesquisa="";
var strCategoria="";
var strEstilo="";

//Funcoes recebidas do Index
var funcaoDeslogar = null;
var funcaoFiltrarProdutos=null;
var funcaoFiltro = null;

//Carrega categorias
function carregarCategorias(lista){
    categorias = lista;
    carregarSpinnerPesquisa();
    carregarMenuSuperior();
    receberDados();
    if(window.location.href.includes("carrinho")){
        document.getElementById("botaoCarrinho").innerHTML="";
    }
}

//Carrega as categorias do spinner
function carregarSpinnerPesquisa(){
    localHtml = document.getElementById("DropPesquisa");
    if(localHtml!=null){
        let html = "";
        for(i = 0; i<categorias.length;i++){
            html +=`<option value="${i}">${categorias[i].nome}</option>`;
        }
        localHtml.innerHTML=html;
    }
}

//Carrega o html do menu horizontal
function carregarMenuSuperior(){
    var elemento = document.getElementById("localMenu");
    let codigoHtml = "";
    if(elemento!=null){
        for(i=0;i<categorias.length;i++){
            if(!window.location.href.includes("inicio")){
			    codigoHtml+= `<a class="cursorHover"  href = "inicio.html?Categoria=${categorias[i].nome}">${categorias[i].nome}</a>`;
            }
            else{
                codigoHtml += `<a class="cursorHover" onclick="atualizarProdutos('${categorias[i].nome}')">${categorias[i].nome}</a>`;
            }
        }
        elemento.innerHTML=codigoHtml;
        document.getElementById('body').classList.add('mostrar');
    }
}

//Edita o status do menu vertical
function abrirMenu (id,adicionar,indice = null){
    var elemento = document.getElementById(id);
    if (elemento!=null){
        if(adicionar){
            elemento.classList.add("mostrar");
            for(i=0;i<categorias.length+1;i++){
                var botao = document.getElementById("botao"+i);
                if(botao!= null){
                    if(i==indice){
                        if(!botao.classList.contains("selecionar")){
                        botao.classList.add("selecionar");    
                        }                
                    }
                    else{
                        if(botao.classList.contains("selecionar")){
                            botao.classList.remove("selecionar");
                        }
                    }
                }
            }
            if(indice!=null){
                carregarMenuSecundario(indice);
            }
            else{
                carregarMenu();
            }
        }
        else{
            if(elemento.classList.contains("mostrar")){
                elemento.classList.remove("mostrar");
                var elemento2 = document.getElementById("conteudoMenu2");
                elemento2.innerHTML="";
            }
        }
    }   
}

//Carrega o menu vertical primeiro nivel
function carregarMenu(){

    localHtml = document.getElementById("conteudoMenu1");
    if(localHtml!=null){
        let html = "";
        for(i = 0; i<categorias.length;i++){
            html += `<div class="menuDrop1" onmouseover="abrirMenu('menuVertical2',true,${i},this)" id='botao${i}'>`;
            html +=`<a class="ItemClasse">${categorias[i].nome}</a>`;
            html +=`<img class="imgNext" src="../imagens/icones/next.png"></div><br>`;
        }
        localHtml.innerHTML = html;
    }   
}

//Carrega o menu vertical segundo nivel
function carregarMenuSecundario(indice){
    localHtml = document.getElementById("conteudoMenu2");
    if(localHtml!=null){
        let html = "";
        for(i = 0; i<categorias[indice].lista.length;i++){
            html += `<div class="menuDrop2">`;
            if(!window.location.href.includes("inicio.html")){
                html += `<a class="itens" href="inicio.html?Categoria=${categorias[indice].nome}&Estilo=${categorias[indice].lista[i]}">${categorias[indice].lista[i]}</a></div>`;
            }
            else{
                html += `<a class="itens" onclick="atualizarProdutos('${categorias[indice].nome}','${categorias[indice].lista[i]}')">${categorias[indice].lista[i]}</a></div>`;
            }
        }
        localHtml.innerHTML = html;
        
    }
}

//Atualiza os produtos
function atualizarProdutos(categoriaEscolhida,estiloEscolhido =null){
    if(document.getElementById("localAviso")!=null){
        document.getElementById("localAviso").innerHTML  = `<p class="strAviso">CARREGANDO</p>`;
    }
    strEstilo = estiloEscolhido;
    if(strCategoria != categoriaEscolhida){
        strCategoria = categoriaEscolhida;
        funcaoFiltro(strCategoria);
    }else{
        carregarPaginaProduto();
    }
}

//Pesquisa o que foi digitado no input
function pesquisar(){
    strPesquisa = document.getElementById("inputPesquisa").value;
    document.getElementById("localAviso").innerHTML = `<p class="strAviso">CARREGANDO</p>`;
    strEstilo = null;
    try{
        strCategoria = categorias[document.getElementById("DropPesquisa").value].nome;
        funcaoFiltrarProdutos(strCategoria);
    }catch{
        funcaoFiltrarProdutos();
    }
}

//Pega os dados no href
function receberDados() {
    const parametros  = new URLSearchParams(window.location.search);
    try{
        strPesquisa = parametros.get("strPesquisa");
        strCategoria = parametros.get("Categoria");
        var indiceDrop =categorias.findIndex(function(item, i){
            return item.nome === strCategoria;
          });
        document.getElementById("inputPesquisa").value = strPesquisa;
        document.getElementById("DropPesquisa").value = indiceDrop;
    }catch{}
}

//Carrega a aba inicial
function abrirAbaInicial(){
    if(window.location.href.includes("inicio.html")){
        funcaoMontarJsonProdutosDesconto();
    }
    else{
        window.location.href = "inicio.html";
    }
}

//Muda status modal
function abrirModal(resultado){
    var modal = document.getElementById("modalUsuario");
    if(usuario != null){
        if(resultado){
            modal.classList.add("mostrar");
        }
        else{
            modal.classList.remove("mostrar");
        }
    }
}

//Muda status modal usuario
function modalUsuario(usuario){
    nomeUsuario = document.getElementById("nomeUsuario");
    if(usuario != null){
        nomeUsuario.innerHTML = usuario.displayName;
    }
    else{
        nomeUsuario.innerHTML="Logar ou cadastrar";
        nomeUsuario.addEventListener('click',abrirCadastro);
        abrirModal(false);
        document.getElementById("imgUsuario").addEventListener('click',abrirCadastro);
    }
}

//Abre pagina de cadastro
function abrirCadastro(){
    window.location.href = "cadastro.html";
}