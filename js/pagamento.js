
var dadosUsuario =[];
var usuario = null;
var idEnderecoEscolhido=-1;
var  preco = new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'});
var valorTotal = 0;
var enderecosUsuario = [];
var favoritosUsuario =[];
var produtosCarrinho=[];

//Funcoes recebidas do Index
var funcaoAdicionarNovoEndereco=null;
var funcaoAdicionarPedido = null;
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

//Abre uma forma de pagamento
function abrirFormaPagamento(id){
    document.getElementById("pagamentoCartao").classList.remove("mostrar");
    document.getElementById("pagamentoBoleto").classList.remove("mostrar");
    document.getElementById("pagamentoPix").classList.remove("mostrar");
    document.getElementById(id).classList.add("mostrar");
    window.location.href="#localPagamento";
}

//Muda status do modal de endereco
function modaisEnderecos(id){
    var modal = document.getElementById(id);
    if(modal.classList.contains("mostrar")){
        modal.classList.remove("mostrar");
    }
    else{
        modal.classList.add("mostrar")
    }
}

//Carrega os dados do usuario
function carregarDadosUsuario(){
    if(usuario!= null ||usuario!=""){
        document.getElementById('inputNome').value = usuario.displayName;
        document.getElementById('inputEmail').value = usuario.email;
        var inputCPF = document.getElementById('inputCPF');
        var inputTelefone =document.getElementById('inputTelefone');
        inputCPF.value = dadosUsuario[0].cpf;
        inputTelefone.value = dadosUsuario[0].telefone;
        if(dadosUsuario[0].cpf !="" && dadosUsuario[0].cpf!=null){
            inputCPF.disabled = true;
            inputCPF.classList.remove("erroInput");
        }
        else{
            inputCPF.classList.add("erroInput");
        }
        if(dadosUsuario[0].telefone !="" && dadosUsuario[0].telefone != null){  
            inputTelefone.classList.remove("erroInput");
        }
        else{
            inputTelefone.classList.add("erroInput");
        }
    }
    
}

//Atualiza o html do campo endereco com os dados do endereco selecionado
function atualizarEnderecoSelecionado(){
    if(idEnderecoEscolhido!=-1){
        var htmlEndereco = "";
        htmlEndereco+=`<p class="negrito">Endereço:</p>`;
        htmlEndereco+=`<div><p>${enderecosUsuario[idEnderecoEscolhido].logradouro}</p></div>`;
        htmlEndereco+=`<div><p>N° ${enderecosUsuario[idEnderecoEscolhido].numero}</p><p>CEP: ${enderecosUsuario[idEnderecoEscolhido].cep}</p></div>`;
        htmlEndereco+=`<div><p>Cidade: ${enderecosUsuario[idEnderecoEscolhido].cidade}</p><p>UF:${enderecosUsuario[idEnderecoEscolhido].uf}</p></div>`;
        htmlEndereco+=`<button class="botaoEstilo2" onclick="abrirModalEnderecos()">Selecionar outro endereço</button>`;
        document.getElementById("enderecoSelecionado").innerHTML = htmlEndereco;
    }
}

//Carrega o html dos enderecos cadastrados
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
    document.getElementById("localEnderecos").innerHTML = htmlEndereco;
}

//Seleciona um endereco
function selecionarEndereco(id){
    idEnderecoEscolhido = id;
    for(i=0;i<enderecosUsuario.length;i++){
        document.getElementById("endereco"+i).classList.remove("enderecoSelecionado");
    }
    document.getElementById("endereco"+id).classList.add("enderecoSelecionado");
}

//Cria um novo endereco
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
            modaisEnderecos("modalCadastrarEndereco");
            funcaoGetDadosUsuario();
    }
}

//carrega o html dos produtos do carrinho
function carregarProdutosCarrinho(){
    if(produtosCarrinho.length==0){
        window.location.href="carrinho.html";
    }
    var htmlEndereco = "";
    for(i=0;i<produtosCarrinho.length;i++){
        htmlEndereco+=`<div class="produtoP bordaInferior">`;
        htmlEndereco+=`<p>${produtosCarrinho[i].nome}</p> `;
        htmlEndereco+=`<p>${preco.format(produtosCarrinho[i].preco*(1-(parseInt(produtosCarrinho[i].desconto)/100)))}</p></div>`;
        valorTotal +=produtosCarrinho[i].preco*(1-(parseInt(produtosCarrinho[i].desconto)/100));
    }
    document.getElementById("localProdutos").innerHTML = htmlEndereco;
    document.getElementById("localValorTotal").innerHTML = preco.format(valorTotal);
    document.getElementById("localDescontoCupom").innerHTML = preco.format(0);
    document.getElementById("localFrete").innerHTML = preco.format(0); 
}

//Salva o pedido no banco
function finalizarPedido(){
    funcaoCriarPedido();
}