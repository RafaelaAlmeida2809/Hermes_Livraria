var usuario=null;
var jsonEnderecos=[];
var dadosUsuario =[];
var enderecosUsuario = [];
var favoritosUsuario = [];
var pedidosUsuario = [];
var  preco = new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'});

//Funcoes recebidas do Index
var funcaoAdicionarNovoEndereco=null;
var funcaoGetDadosUsuario =null;

//Funcoes executadas após o carregamento do html
window.onload = function() {
    $(function(){
        $("#localCabecalho").load("../html/cabecalho.html", function(){
        });
    });
}

//Funcoes executadas após a verificação do status do usuario
function iniciar(){
    modalUsuario(usuario);
}

//Carrega os dados do Usuario
function carregarDadosUsuario(){
        document.getElementById('inputNome').value = usuario.displayName;
        document.getElementById('inputEmail').value = usuario.email;
        document.getElementById('inputNascimento').value = dadosUsuario[0].nascimento;
        var inputCPF = document.getElementById('inputCPF');
        inputCPF.value =dadosUsuario[0].cpf;
        if(dadosUsuario[0].cpf !="" && dadosUsuario[0].cpf!=null){
            inputCPF.disabled = true;
        }
        document.getElementById('inputTelefone').value = dadosUsuario[0].telefone;				       
    if(dadosUsuario == []){
        document.getElementById("modalAviso").classList.add("mostrar");
        document.getElementById("textoAviso").innerHTML ="Finalize seu cadastro";
    }
    if(!usuario.emailVerified){
    	document.getElementById("modalAviso").classList.add("mostrar");
		document.getElementById("textoAviso").innerHTML ="Acesse o link de verificação que enviamos em seu email para continuar";
	}
    for(i=1;i<dadosUsuario.length;i++){
        jsonEnderecos.push(dadosUsuario[i]);
    }
    document.getElementById('body').classList.add('mostrar');
}

//Mudar aba carregada
function ativarAba(indice){
    for (i=1;i<5;i++){
        document.getElementById("aba"+i).classList.remove("aberto");
        document.getElementById("local"+i).classList.remove("mostrar");
    }
    document.getElementById("aba"+indice).classList.add("aberto");
    document.getElementById("local"+indice).classList.add("mostrar");
}

//Carrega html e dados do endereço
function carregarEnderecos(){
    var htmlEndereco = "";
    for(i=0;i<enderecosUsuario.length;i++){
        htmlEndereco+=`<div onclick="selecionarEndereco(${i})"><label id="endereco${i}" class="endereco">`;
        htmlEndereco+=`<p class="negrito">Endereço:</p>`;
        htmlEndereco+=`<div><p>${enderecosUsuario[i].logradouro}</p></div>`;
        htmlEndereco+=`<div><p>N° ${enderecosUsuario[i].numero}</p><p>CEP: ${enderecosUsuario[i].cep}</p></div>`;
        htmlEndereco+=`<div><p>Cidade: ${enderecosUsuario[i].cidade}</p><p>UF:${enderecosUsuario[i].uf}</p></div>`;
        htmlEndereco+=`</label></div>`;
    }
    htmlEndereco+=`<button class="botaoEstilo2" onclick="modalCadastroEndereco()">Adicionar outro endereco</button>`;
    document.getElementById("localEnderecos").innerHTML = htmlEndereco;
}
//Muda status da aba de cadastro do endereco
function modalCadastroEndereco(){
    var modal = document.getElementById("modalCadastrarEndereco");
    if(modal.classList.contains("mostrar")){
        modal.classList.remove("mostrar");
    }
    else{
        modal.classList.add("mostrar")
    }
}

//Carrega html e dados dos produtos favoritos
function carregarFavoritos(){
    var htmlFavorito = "";
    console.log(favoritosUsuario.length);
    for(i=0;i<favoritosUsuario.length;i++){
        if(favoritosUsuario[i].desconto >0){
            htmlFavorito += `<a class = "produto botaoPagina" href="produto.html?Id=${favoritosUsuario[i].idProduto}&Categoria=${favoritosUsuario[i].strCategoria}&Desconto=${favoritosUsuario[i].desconto}">`;
            htmlFavorito += `<h4 class="strDesconto">${favoritosUsuario[i].desconto}%</h4>`;
            precoProduto =favoritosUsuario[i].preco*(1-(favoritosUsuario[i].desconto/100)); 
        }
        else{
            htmlFavorito += `<a class = "produto botaoPagina" href="produto.html?Id=${favoritosUsuario[i].idProduto}&Categoria=${favoritosUsuario[i].strCategoria}">`;
            precoProduto = favoritosUsuario[i].preco;
        }
        htmlFavorito += `<img src="../imagens/produtos/${favoritosUsuario[i].idProduto}.jpg"/>`;
        htmlFavorito += `<p>${favoritosUsuario[i].nome}</p>`;
        htmlFavorito += `<p class="preco">${preco.format(precoProduto)}</p>`;
        htmlFavorito += `<button class="botaoEstilo1">Comprar</button></a>`; 
    }
    if(favoritosUsuario.length == 0){
        htmlFavorito = `<p>Você ainda não possui produtos favoritados</p>`;   
    }
    document.getElementById("localFavoritos").innerHTML=htmlFavorito;
}

//Carrega html e dados dos pedidos
function carregarPedidos(){
    var htmlPedido = "";
    for(i=0;i<pedidosUsuario.length;i++){
        htmlPedido+=`<div><div class="localPedidos cursorHover" onclick="abrirPedido(${i+1})">`;
        htmlPedido+=`<p class="negrito">Pedido ${i+1} </p>`;
        htmlPedido+=`<p class="conteudo">${pedidosUsuario[i].entrega}</p>`;
        htmlPedido+=`<p class="conteudo">${preco.format(pedidosUsuario[i].valorTotal)}</p>`;
        htmlPedido+=`<img class="imgNext" id="seta${i+1}" src="../imagens/icones/next.png"></div>`;
        htmlPedido+=`<div class="localProdutos cursorHover" id="localProdutos${i+1}">`;
        htmlPedido+=`<table border = "0" cellpadding="0" cellspacing="0">`;
        htmlPedido+=`<thead><tr class="cabecalhoTabela">`;
        htmlPedido+=`<td>Produto</td>`;
        htmlPedido+=`<td class="cedulaDescricao"></td>`;
        htmlPedido+=`<td class="centralizarText">Quantidade</td>`;
        htmlPedido+=`<td class="centralizarText">Preço</td></tr></thead>`;
        htmlPedido+=`<tbody id="LocalItensTabela">`;
        var qtdProdutos = pedidosUsuario[i].produtos.length;
        for(j=0;j<qtdProdutos;j++){
            htmlPedido +=`<tr class="produtoTabela">`;
            htmlPedido +=`<td><img class="imgProdutoPqn" src="../imagens/produtos/${pedidosUsuario[i].produtos[j].idProduto}.jpg"></td>`;
            htmlPedido +=`<td class="localDescricao"><div>`;
            htmlPedido +=`<p class="negrito">${pedidosUsuario[i].produtos[j].nome}</p><br>`;
            htmlPedido +=`<p>${pedidosUsuario[i].produtos[j].strCategoria}</p></div></td>`;
            htmlPedido +=`<td><p>${pedidosUsuario[i].produtos[j].qtdProduto}</p></td>`;
            htmlPedido +=`<td><p class="centralizarText"">${preco.format(pedidosUsuario[i].produtos[j].preco)}</p></td></tr>`;
        }
        htmlPedido+=`</tbody></table></div></div>`;
    }
    if(pedidosUsuario.length == 0){
        console.log("o");
        htmlPedido = `<div><p>Você ainda não possui pedidos</p></div>`;
    }
    document.getElementById("localPedidos").innerHTML = htmlPedido;
    console.log(pedidosUsuario.length);

}

//Expandir pedido selecionado
function abrirPedido(indice){
    var localProdutos = document.getElementById("localProdutos"+indice);
    var seta = document.getElementById("seta"+indice);
    if(localProdutos.classList.contains("mostrar")){
        localProdutos.classList.remove("mostrar");
        seta.classList.remove("girar270");
    }
    else{
        localProdutos.classList.add("mostrar");
        seta.classList.add("girar270");
    }
}

//Cadastra novo endereco
function criarEndereco(){
    var semErro = true;	
	var listaIds = ['inputLogradouro','inputNumero','inputCEP','inputCidade','inputEstado'];
	for(let i = 0; i< listaIds.length;i++){
		document.getElementById(listaIds[i]).classList.remove("erroInput");
		if(document.getElementById(listaIds[i]).value==null||document.getElementById(listaIds[i]).value==""){
			document.getElementById(listaIds[i]).classList.add("erroInput");
			semErro = false;
		}	
	}
    var jsonNovoEndereco = [];
    if(semErro){
        jsonNovoEndereco ={logradouro: document.getElementById("inputLogradouro").value,
            numero: document.getElementById("inputNumero").value,cep: document.getElementById("inputCEP").value,
            complemento:document.getElementById("inputComplemento").value,cidade: document.getElementById("inputCidade").value,
            uf: document.getElementById("inputEstado").value};
            funcaoAdicionarNovoEndereco(jsonNovoEndereco);
            modalCadastroEndereco();
            funcaoGetDadosUsuario();
    }
}