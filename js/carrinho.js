var cupons=['desconto10','desconto20','desconto30','falela'];
var cuponsValor=['10','20','30','99'];
var cupomCorreto="";
var valorProdutos =0;
var  preco = new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'});
var cep = "";
var produtosCarrinho =[];
var dadosUsuario =[];
var htmlProduto= "";
var usuario = null;

//Funcoes recebidas do Index
var funcaoAdicionarProdutoCarrinho=null;
var funcaoRemoveProdutoCarrinho=null;
var funcaoPegarProduto=null;

//Funcoes executadas após o carregamento do html
window.onload = function() {
    $(function(){
        $("#localCabecalho").load("../html/cabecalho.html", function(){
        });
    });
    //Regula os componentes da tela ao redimencionar o tamanho.
    window.addEventListener('resize', function() {
        corpo=document.getElementById("corpo");
        if(window.innerWidth<680){
            corpo.classList.remove("corpoCentro");
            corpo.classList.add("corpoAjudatado");
        }
        else{
                corpo.classList.remove("corpoAjudatado");
                corpo.classList.add("corpoCentro");
        }
    }, true);
}

//Funcoes executadas após a verificação do status do usuario
function iniciar(){
    if(usuario==null){
        jsonStorage = JSON.parse(window.localStorage.getItem("produtoCarrinho"));
        if(jsonStorage!= null){
            for(i = 0;i<jsonStorage.length;i++){
                funcaoPegarProduto(jsonStorage[i].idProduto,jsonStorage[i].strCategoria,retornoBuscaProduto,i); 
            }
        }
    }
    modalUsuario(usuario);
}

//Retorno da busca dos produtos
function retornoBuscaProduto(resultado,i){
    console.log(resultado);
    var elemento = {id:resultado.id,strCategoria:jsonStorage[i].strCategoria,estilo:resultado.data().estilo,nome:resultado.data().nome,
        preco:resultado.data().preco,qtdProduto:jsonStorage[i].qtdProduto};
    produtosCarrinho.push(elemento);
    if((jsonStorage.length-1) == i){
        carregarProdutosCarrinho();
    }
}

//Carrega o html dos produtos do carrinho
function carregarProdutosCarrinho(){
    htmlProduto="";
    try{
        for(i=0;i<produtosCarrinho.length;i++){
            htmlProduto +=`<tr class="produtoTabela" id="produto${i}">`;
            htmlProduto +=`<td><img class="imgProdutoPqn" src="../imagens/produtos/${produtosCarrinho[i].id}.jpg"></td>`;
            htmlProduto +=`<td class="localDescricao"><div>`;
            htmlProduto +=`<p class="strDestaque">${produtosCarrinho[i].nome}</p><br>`;
            htmlProduto +=`<p>${produtosCarrinho[i].estilo}</p><br>`;
            htmlProduto +=`<p>${produtosCarrinho[i].strCategoria}</p></div></td>`;
            htmlProduto +=`<td><input type="number" placeholder="0" class="inputQtd" onchange="mudarQuantidade('${produtosCarrinho[i].id}','${produtosCarrinho[i].strCategoria}',this.value,${i})" id="inputQTD${i}" value="${produtosCarrinho[i].qtdProduto}"></td>`;
            htmlProduto +=`<td><p class="centralizarText strDestaque" id="valorTotal${i}">${preco.format(produtosCarrinho[i].preco* produtosCarrinho[i].qtdProduto)}</p>`;
            htmlProduto +=`<p class="centralizarText" id="valorUnitario${i}">${preco.format(produtosCarrinho[i].preco)}</p>`;
            if(produtosCarrinho[i].qtdProduto>1){
                htmlProduto +=`<p class="centralizarText">cada</p>`;
            }
            htmlProduto +=`</td><td><button class="botaoPagina" onclick="RemoverItem('produto${i}')">Remover</button></td></tr>`;
            valorProdutos+=produtosCarrinho[i].preco*produtosCarrinho[i].qtdProduto;
            produtosCarrinho[i].preco = produtosCarrinho[i].preco;
        }
    }catch{console.log("erro ao abrir o produto");}
    console.log(htmlProduto);    
    document.getElementById("LocalItensTabela").innerHTML=htmlProduto;
    document.getElementById("localValor").innerHTML = preco.format(valorProdutos);
    atualizarValorTotal();
    if(produtosCarrinho.length==0){
        document.getElementById("botaoComprar").remove();
        document.getElementById("LocalItensTabela").innerHTML = `<tr><td colspan="5"><p>Você ainda não possui itens</p></td></tr>`;
    }
}

//Verifica se o cupom está correto
function verificarCupom(){
    var cupomDigitado = document.getElementById("cupomDesconto").value;
    for(i=0;i<cupons.length;i++){
        if(cupons[i] == cupomDigitado){
            cupomCorreto = cupomDigitado;
            document.getElementById("localDesconto").innerHTML = preco.format(valorProdutos * parseInt(cuponsValor[i])/100);
            atualizarValorTotal(valorProdutos * parseInt(cuponsValor[i])/100);
            i=cupons.length;
        }
    }
}

//Atualiza o valor total.
function atualizarValorTotal(desconto =0){
    var valor = 0;
    for(i=0;i<produtosCarrinho.length;i++){
        valor += produtosCarrinho[i].preco * produtosCarrinho[i].qtdProduto;
    }
    valorProdutos = valor;
    document.getElementById("localValor").innerHTML = preco.format(valorProdutos);
    document.getElementById("localValorTotal").innerHTML = preco.format(valorProdutos - desconto);
}

//Remove um produto do carrinho
function RemoverItem(id){
    var elemento = document.getElementById(id);
    if(elemento!=null){
        elemento.remove();
        atualizarValorTotal();
        indice = parseInt(id.replace("produto",""));
        if(usuario == null){
            produtosCarrinho.splice(indice, 1);
            window.localStorage.setItem('produtoCarrinho',JSON.stringify(produtosCarrinho));
        }
        else{
            funcaoRemoveProdutoCarrinho(produtosCarrinho[indice].id);
            produtosCarrinho.splice(indice,1);
        }
    }
    atualizarValorTotal();
}

//Muda a quantidade no banco e altera o preço de acordo com a quantidade
function mudarQuantidade(idProduto,strCategoria,qtdProduto,i){
    if(qtdProduto<=0){
        document.getElementById("inputQTD"+i).value =1;
        qtdProduto = 1;
    }
    produtosCarrinho[i].qtdProduto=qtdProduto;
    if(usuario == null){        
        window.localStorage.setItem('produtoCarrinho',JSON.stringify(produtosCarrinho));
    }else{
        funcaoAdicionarProdutoCarrinho(idProduto,strCategoria,false,qtdProduto,true);        
    }
    document.getElementById("valorTotal"+i).innerHTML = preco.format(qtdProduto* produtosCarrinho[i].preco);
    atualizarValorTotal();
 
}

//Abre pagina de pagamento
function abrirPagamento(){
    if(usuario!= null){
        window.location.href="pagamento.html";
    }
    else{
        window.location.href="cadastro.html";
    }
}




