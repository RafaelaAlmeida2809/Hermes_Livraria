	
import 'firebase/app';
import "firebase/firestore";
import "firebase/auth";
import { async } from '@firebase/util';
//chave
var firebaseConfig = {
	apiKey: "AIzaSyADVahP4LoiNjKqD7Tnw6u6zyTzryvKfYg",
			authDomain: "hermes-vendas.firebaseapp.com",
			projectId: "hermes-vendas",
			storageBucket: "hermes-vendas.appspot.com",
			messagingSenderId: "591795079161",
			appId: "1:591795079161:web:def69a6719a23ebe6e5f28",
			measurementId: "G-43EJ28FEYC"
};

// Initialize Firebase
const fireBaseApp = firebase.initializeApp(firebaseConfig);

// Espera finalizar a inicialização.
firebase.auth().onAuthStateChanged(user => verificarLogin()
);


// ReCaptcha
if(window.location.href.includes("cadastro.html")){
	var resultadoRecaptcha = false;
	window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('reCaptcha', {
		'callback': (response) => {
			resultadoRecaptcha = true;
		},
		'expired-callback': () => {
		}
	})
	recaptchaVerifier.render().then(widgetId =>{
		window.recaptchaWidgetId= widgetId;
	});
}

MontarJsonCategorias();
var carregado = false;

// Atribui função aos botoes
if(document.getElementById('loginGoogle')!=null){
	document.getElementById('loginGoogle').addEventListener('click', GoogleLogin);
}
if(document.getElementById('loginFacebook')!=null){
	document.getElementById('loginFacebook').addEventListener('click', FacebookLogin);	
}
if(document.getElementById('botaoLogar')!=null){
	document.getElementById('botaoLogar').addEventListener('click', EmailLogin);	
}
if(document.getElementById('botaoCadastro')!=null){
	document.getElementById('botaoCadastro').addEventListener('click', CriarLogin);
}
if(document.getElementById('botaoRecuperar')!=null){
	document.getElementById('botaoRecuperar').addEventListener('click', redefinirSenha);	
}
if(document.getElementById('botaoAviso')!=null){
	document.getElementById('botaoAviso').addEventListener('click', abaAlert);	
}
if(document.getElementById('botaoAtualizar')!=null){
	document.getElementById('botaoAtualizar').addEventListener('click', salvarBanco);	
}
if(window.location.href.includes('produto.html')){
	funcaoPegarProduto = pegarUmProduto;
	funcaoAdicionarProdutoCarrinho =adicionarProdutoCarrinhoBanco;
	funcaoProdutoFavoritoBanco =produtoFavoritoBanco;
	funcaoBuscarFavoritoBanco = buscarFavoritoBanco;
}
if(window.location.href.includes("carrinho.html")){
	funcaoRemoveProdutoCarrinho = removeProdutoCarrinhoBanco;
	funcaoAdicionarProdutoCarrinho =adicionarProdutoCarrinhoBanco;
	funcaoPegarProduto = pegarUmProduto;
}
if(window.location.href.includes("pagamento.html")){
	funcaoAdicionarPedido = adicionarPedido;
	funcaoAdicionarNovoEndereco = adicionarNovoEndereco;
	funcaoGetDadosUsuario = getDados;
}
if(window.location.href.includes("perfil.html")){
	funcaoAdicionarNovoEndereco = adicionarNovoEndereco;
	funcaoGetDadosUsuario = getDados;
}
if(!window.location.href.includes("cadastro.html")){
	funcaoDeslogar = deslogar;
	funcaoFiltrarProdutos = filtrarProdutos;
}
if(window.location.href.includes("inicio.html")){
	funcaoMontarJsonProdutosDesconto  = montarJsonProdutosDesconto;
	funcaoFiltro = montarJsonProdutos;
}

// Provedores utilizados
let provedorGoogle = new firebase.auth.GoogleAuthProvider();
let provedorFacebook = new firebase.auth.FacebookAuthProvider();

//Desloga da conta
function deslogar(){
	firebase.auth().signOut().then(() => {
		if(window.location.href.includes('perfil.html')){
			window.location.href = "inicio.html";
		}
		else{
			modalUsuario(null);
		}
	}).catch((error) => {
		console.log("erro ao deslogar");
	});
}
//Verifica se está logado
function verificarLogin(){
	$(document).ready(function() {
		console.log( "testando.." );
		var user = firebase.auth().currentUser;
		usuario = user;
		if(user!= null){
			if(window.location.href.includes('cadastro.html')){
				window.location.href= 'perfil.html';
			}
			else if(window.location.href.includes('carrinho.html')){
				window.location.href= 'carrinho.html';
			}
			getDados();
		}else{
			if(window.location.href.includes('perfil.html')){
				window.location.href = "cadastro.html";
			}
		}
		iniciar();
	});
}	
//Salvar no banco
async function salvarBanco(){
	try{
		const a = fireBaseApp.firestore();
		const usuarios =  a.collection('usuarios');
		usuarios.doc(document.getElementById('inputEmail').value).set({
			nascimento:document.getElementById('inputNascimento').value,
			cpf:document.getElementById('inputCPF').value,
			telefone:document.getElementById('inputTelefone').value
		});
		usuarios.doc(document.getElementById('inputEmail').value).collection('produtosCarrinho').doc("base").set({
			idProduto:""
		});
		if(window.location.href.includes("perfil.html")){
			document.getElementById("textoAviso").innerHTML="Dados salvos com sucesso";			
			document.getElementById("modalAviso").classList.add("mostrar");
		}
		else{
			window.location.href="perfil.html";
		}
	}catch(erro){
		console.log("erro banco1:"+ erro);
	}
}

//pega todos os dados do usuario 
async function getDados(){
	
		var hrefAtual = window.location.href;
		if(usuario != null){
			if(hrefAtual.includes("pagamento.html") || hrefAtual.includes("perfil.html")){
				getDadosUsuario();
			}
			if(hrefAtual.includes("pagamento.html") || hrefAtual.includes("perfil.html")){
				getDadosEnderecos();
			}
			if(hrefAtual.includes("perfil.html")){
				getDadosFavoritos();
			}
			if(hrefAtual.includes("perfil.html")){
				getDadosPedidos();
			}
			if(hrefAtual.includes("pagamento.html") || hrefAtual.includes("carrinho.html")){
				getDadosCarrinho();
			}
		}
	
}

//pega os dados do usuario
var jsonUsuario=[];
function getDadosUsuario(){
	jsonUsuario=[];
	var elemento=null;
	const fireBase1 = fireBaseApp.firestore();
	const usuarios =  fireBase1.collection('usuarios');
	usuarios.doc(usuario.email).get().then((doc) =>{
		elemento = {cpf: doc.data().cpf, nascimento : doc.data().nascimento,telefone : doc.data().telefone};
		jsonUsuario.push(elemento);
	}).finally((finalizacao)=>{
		devolverDadosUsuario();
	})
}
function devolverDadosUsuario(){
	dadosUsuario = jsonUsuario;
	setTimeout(function () {
		carregarDadosUsuario();
	  }, 200);
}

//pega os enderecos do usuario
var jsonEnderecosUsuario=[];
function getDadosEnderecos(){
	jsonEnderecosUsuario=[];
	var elemento=null;
	const fireBase1 = fireBaseApp.firestore();
	const usuarios =  fireBase1.collection('usuarios');
	usuarios.doc(usuario.email).collection("enderecos").get().then((querySnapshot) => {
		querySnapshot.forEach((endereco) => {
			if(endereco.id !="base"){
				elemento = {logradouro: endereco.data().logradouro,numero: endereco.data().numero,cep: endereco.data().cep,
					complemento:endereco.data().complemento,cidade: endereco.data().cidade,uf: endereco.data().uf};
				jsonEnderecosUsuario.push(elemento);
			}
		})
	}).finally((finalizacao)=>{
		devolverDadosEnderecos();
	})
}
function devolverDadosEnderecos(){
	enderecosUsuario = jsonEnderecosUsuario;
	setTimeout(function () {
		carregarEnderecos();
	  }, 1000);
}

//pega os favoritos do usuario
var jsonFavoritosUsuario=[];
function getDadosFavoritos(){
	jsonFavoritosUsuario=[];
	var elemento=null;
	const fireBase1 = fireBaseApp.firestore();
	const usuarios =  fireBase1.collection('usuarios');
	usuarios.doc(usuario.email).collection("produtosFavorito").get().then((querySnapshot2) => {
		querySnapshot2.forEach((favorito) => {
			if(favorito.id !="base"){
				var produtos = fireBase1.collection("categorias").doc(favorito.data().strCategoria).collection("Produtos");
				produtos.doc(favorito.id).get().then((produto)=>{ 
					var produtosPromocao = fireBase1.collection("produtosPromocao");
					produtosPromocao.doc(favorito.id).get().then((promocao)=>{ 
						var desconto = 0;
						if(promocao.exists){
							desconto = promocao.data().descontoPorcent;
						}
						elemento = {idProduto: favorito.id,strCategoria: favorito.data().strCategoria,preco:produto.data().preco,
							nome:produto.data().nome,desconto:desconto};
						jsonFavoritosUsuario.push(elemento);
					}).finally((finalizacao)=>{
						devolverDadosFavoritos();
					})
				})
			}
		})
	})

}
function devolverDadosFavoritos(){
	favoritosUsuario = jsonFavoritosUsuario;
	setTimeout(function () {
		carregarFavoritos();
	  }, 1000);
}

//pega os pedidos do usuario
var jsonPedidosUsuario=[];
function getDadosPedidos(){
	jsonPedidosUsuario=[];
	var jsonTemporario=[];
	var elemento=null;
	var elemento2= null;
	const fireBase1 = fireBaseApp.firestore();
	const usuarios =  fireBase1.collection('usuarios');
	var pedidosUsuario = usuarios.doc(usuario.email).collection("pedidos");
	pedidosUsuario.get().then((querySnapshot3) => {
		querySnapshot3.forEach((pedido) => {
			if(pedido.id !="base"){
				console.log(pedido.id);
				pedidosUsuario.doc(pedido.id).collection("produtos").get().then((doc)=>{
					doc.forEach((doc2) => {
						elemento2={idProduto:doc2.id,strCategoria:doc2.data().strCategoria,preco:doc2.data().preco,nome:doc2.data().nome,qtdProduto:doc2.data().qtdProduto};
						jsonTemporario.push(elemento2);
					})
				}).finally((finalizacao)=>{
					elemento = {idPedido:pedido.id,data:pedido.data().data,pago:pedido.data().pago,valorTotal:pedido.data().valorTotal,
						entrega:pedido.data().entrega,produtos:jsonTemporario};
					jsonPedidosUsuario.push(elemento);
				});							
			}
		})
	}).finally((finalizacao)=>{
		devolverDadosPedidos();
	})
}
function devolverDadosPedidos(){ 
	pedidosUsuario = jsonPedidosUsuario;
	setTimeout(function () {
		carregarPedidos();
	  }, 1000);
}

//pega os carrinho do usuario
var jsonCarrinhoUsuario=[];
function getDadosCarrinho(){
	jsonCarrinhoUsuario=[];
	var elemento=null;
	const fireBase1 = fireBaseApp.firestore();
	const usuarios =  fireBase1.collection('usuarios');
	var produtosCarrinho =  usuarios.doc(usuario.email).collection("produtosCarrinho");
	produtosCarrinho.get().then((produtos) => {
		produtos.forEach((produtoCarrinho) => {
			if(produtoCarrinho.id !="base"){
				var produto = fireBase1.collection('categorias').doc(produtoCarrinho.data().strCategoria).collection('Produtos').doc(produtoCarrinho.id);
				produto.get().then((doc2) => {
					var desconto = 0;
					var promocao = fireBase1.collection('produtosPromocao');
					promocao.doc(produtoCarrinho.id).get().then((produtoDesconto) => {
						if(produtoDesconto.exists){
							desconto=produtoDesconto.data().descontoPorcent;
						}
						elemento = {id: produtoCarrinho.id,nome: doc2.data().nome, preco: doc2.data().preco,
							estilo: doc2.data().estilo,desconto:desconto,categoria:produtoCarrinho.data().strCategoria,
							qtdProduto:parseInt(produtoCarrinho.data().qtdProduto),strCategoria:produtoCarrinho.data().strCategoria};
						jsonCarrinhoUsuario.push(elemento);
					}).finally((finalizacao)=>{
						devolverDadosCarrinho();
					})
				})
			}
		})
	})
}
function devolverDadosCarrinho(){
	produtosCarrinho = jsonCarrinhoUsuario;
	setTimeout(function () {
		carregarProdutosCarrinho();
	  }, 500);
}

//Criar login
function CriarLogin(){
	var resultado = VerificarCamposCadastro();
	if(!resultadoRecaptcha){
		console.log("reCAPTCHA inválido");
	}
	if(resultado && resultadoRecaptcha){
		firebase.auth().createUserWithEmailAndPassword(document.getElementById('inputEmail').value,
		document.getElementById('inputSenha').value).then((userCredential) => {
			var user = userCredential.user;
			salvarBanco();
			user.updateProfile({
				displayName: document.getElementById('inputNome').value,
				}).then(() => {
					emailConfirmacao();
					console.log("sucesso");
			  }).catch((error) => {
				console.log("erro:"+error.code);
			  });  
		}).catch((erro) => {
			console.log("erro:"+erro.code);
			console.log(erro.message);
			ErroCadastro(erro);	
		});
	}
}

//Envia um email de confirmacao ao usuario
function emailConfirmacao(){
	firebase.auth().languageCode ="pt-br";
	firebase.auth().currentUser.sendEmailVerification()
  .then(() => {
    console.log("email enviado");
  });
}

//Envia um email para redefinir a senha ao usuario
function redefinirSenha() {
	firebase.auth().sendPasswordResetEmail(document.getElementById('localEmailRecuperar').value).then(() => {
    	document.getElementById("modalAviso").classList.add("mostrar");
		document.getElementById("textoAviso").innerHTML ="Um email foi enviado, verifique seu email";
		abaRecuperarSenha();
  	}).catch((error) => {
    	console.log(error.code);
    	console.log(error.message);
  	});
}

// Logar com a conta do Google(popup)
function GoogleLogin(){
	carregado = true;
	console.log('Acessando');
	firebase.auth().signInWithPopup(provedorGoogle).then(resultado=>{
		var user = resultado.user;
		finalizarLogin(user);
	}).catch(e=>{
		console.log("Erro "+e);
	})
}

// Logar com a conta do Facebook(popup)
function FacebookLogin(){
	console.log('Acessando');
	carregado = true;
	firebase.auth().signInWithPopup(provedorFacebook).then(resultado=>{
		/** @type {firebase.auth.OAuthCredential} */
		var credencial = resultado.credential;
		var user = resultado.user;
		var accessToken = credencial.accessToken;
		finalizarLogin(user);
	})
	.catch((error) => {
		console.log("Erro "+error);
	});
}

// Logar com email e senha
function EmailLogin() {	
	carregado = true;
	firebase.auth().signInWithEmailAndPassword(document.getElementById('localEmail').value,
	document.getElementById('localSenha').value).then((userCredential) => {
		var user = userCredential.user;
		finalizarLogin(user);
	}).catch((erro) => {
		ErroLogin(erro);
		console.log(error.code);
		console.log(error.message);
	});
}

//desloga da conta do usuario
function finalizarLogin(user){
	console.log("logou");
	montarBanco(user);
	usuario = user;
	var jsonStorage = JSON.parse(window.localStorage.getItem("produtoCarrinho"));
    if(jsonStorage!= null){
		for(let i = 0;i<jsonStorage.length;i++){
			var ultimo = false;
			if(i == jsonStorage.length - 1){
				ultimo = true;
			}
			adicionarProdutoCarrinhoBanco(jsonStorage[i].idProduto,jsonStorage[i].strCategoria, ultimo);
		}

	}else{
		window.location.href="perfil.html";
	}
}

//cria o banco para aqueles que logaram pelo facebook ou google
function montarBanco(user){
	const fireBase1 = fireBaseApp.firestore();
	const usuarios =  fireBase1.collection('usuarios');
	usuarios.doc(user.email).get().then((doc) => {
		if (!doc.exists){	
			usuarios.doc(user.email).set({
				nascimento:"",
				cpf:"",
				telefone:""
			});
			usuarios.doc(user.email).collection('produtosCarrinho').doc("base").set({
				idProduto:""
			});
			usuarios.doc(user.email).collection('produtosFavorito').doc("base").set({
				idProduto:""
			});
			usuarios.doc(user.email).collection('enderecos').doc("base").set({
				idProduto:""
			});
			usuarios.doc(user.email).collection('pedidos').doc("base").set({
				idProduto:""
			});
		}
	});
}

//abre o alert
function abaAlert(){
	document.getElementById("modalAviso").classList.remove("mostrar");
}

//Monta um json dos produtos de uma categoria
var jsonCategorias = [];
function MontarJsonCategorias(){
    const fireBase1 = fireBaseApp.firestore();
    const categorias =  fireBase1.collection('categorias');
	categorias.get().then((querySnapshot) => {
		var i = 0;
		querySnapshot.forEach((doc) => {
			var elemento = {nome: doc.id, lista : doc.data().nome};
			jsonCategorias.push(elemento);
		})
	}).finally((finalizacao)=>{
		carregarNaPagina();
	})
}
function carregarNaPagina (){
	if(!window.location.href.includes("cadastro.html")){
		carregarCategorias(jsonCategorias);
	}
}

//pega um  unico produto
function pegarUmProduto(idProduto, categoriaProduto, funcaoRetorno,index=null){
    const fireBase1 = fireBaseApp.firestore();
	const produto = fireBase1.collection('categorias').doc(categoriaProduto).collection('Produtos').doc(idProduto);
	
	produto.get().then((doc) => {
		console.log(idProduto +" "+ categoriaProduto);
		if (doc.exists){
			if(index!=null){
				funcaoRetorno(doc,index);
			}
			else{
				funcaoRetorno(doc);
			}
		}
		else{
			funcaoRetorno(null,index);
			removeProdutoCarrinhoBanco(idProduto);
		}
	})
}

var jsonProdutosInicio = [];
//filtra os produtos;             //FUNÇÃO AINDA EM FASE DE DESENVOLVIMENTO
function filtrarProdutos(categoriaSelecionada = null){
	jsonProdutosInicio = [];
	var pesquisa = document.getElementById('inputPesquisa').value;
	var pesquisaChave = pesquisa.toLowerCase().split(' ');
    const fireBase1 = fireBaseApp.firestore();
	const categorias= fireBase1.collection('categorias');
	categorias.get().then((categoria)=> {
		if(categoriaSelecionada==null){
			categoria.forEach((c) => {
				console.log(c.id+" c.id");
				const produtos= fireBase1.collection('categorias').doc(c.id).collection('Produtos')
				.where('palavra-chave', 'array-contains-any',pesquisaChave);
				produtos.get().then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						var produtoPromocao = fireBase1.collection('produtosPromocao').doc(doc.id);
						produtoPromocao.get().then((doc2) => {
							var desconto = 0;
							if (doc2.exists){
								desconto = doc2.data().descontoPorcent;
							}
							var elemento = {nome: doc.data().nome, id: doc.id, preco: doc.data().preco,desconto:desconto};
							jsonProdutosInicio.push(elemento);
						})
						
					});
				});
			});
		}
		else{
			const produtos= fireBase1.collection('categorias').doc(categoriaSelecionada).collection('Produtos')
				.where('palavra-chave', 'array-contains-any',pesquisaChave);
			produtos.get().then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					var produtoPromocao = fireBase1.collection('produtosPromocao').doc(doc.id);
						produtoPromocao.get().then((doc2) => {
							var desconto = 0;
							if (doc2.exists){
								desconto = doc2.data().descontoPorcent;
							}
							var elemento = {nome: doc.data().nome, id: doc.id, preco: doc.data().preco,desconto:desconto};
					jsonProdutosInicio.push(elemento);
						})
					
				});
		});

		}
	}).finally((finalizacao)=>{
		carregarProdutosNaPagina();
	})
}
//monta um json com os dados dos produtos
function montarJsonProdutos(categoria){
    const fireBase1 = fireBaseApp.firestore();
	jsonProdutosInicio=[];
	var produtos = fireBase1.collection('categorias').doc(categoria).collection('Produtos');
	produtos.get().then((querySnapshot) => {
		var i = 0;
		querySnapshot.forEach((doc) => {
			var produtoPromocao = fireBase1.collection('produtosPromocao').doc(doc.id);
			produtoPromocao.get().then((doc2) => {
				var desconto = 0;
				if (doc2.exists){
					desconto = doc2.data().descontoPorcent;
				}
				var elemento = {'id': doc.id,'nome': doc.data().nome, 'preco': doc.data().preco,'estilo': doc.data().estilo,desconto:desconto,
					categoria:categoria};
				jsonProdutosInicio.push(elemento);
			})
		})
	}).finally((finalizacao)=>{
		carregarProdutosNaPagina();
	})
}

function carregarProdutosNaPagina (){
	listaProdutos = jsonProdutosInicio;
	setTimeout(function () {
		carregarPaginaProduto();
	  }, 1000);
}



//monta um json com os dados dos produtos em desconto
var jsonProdutosPromocao = [];
function montarJsonProdutosDesconto(){
    const fireBase1 = fireBaseApp.firestore();
	var produtos = fireBase1.collection('produtosPromocao');
	var resultado=false;
	var elemento=null;
	produtos.get().then((querySnapshot) => {
		var i = 0;
		querySnapshot.forEach((doc) => {
			var produto = fireBase1.collection('categorias').doc(doc.data().strCategoria).collection('Produtos').doc(doc.id);
			produto.get().then((doc2) => {
				elemento = {'id': doc.id,'nome': doc2.data().nome, 'preco': doc2.data().preco,'estilo': doc2.data().estilo,
					'desconto':doc.data().descontoPorcent,'categoria':doc.data().strCategoria};
				jsonProdutosPromocao.push(elemento);
			})			
		})		
	}).finally((finalizacao)=>{
		devolverProdutoDesconto();
	})
}
function devolverProdutoDesconto (){
	listaProdutos = jsonProdutosPromocao;
	setTimeout(function () {
		carregarProdutosPromocao();
	  }, 1000);
}

// adiciona um novo endereco
function adicionarNovoEndereco(jsonEndereco){
	const a = fireBaseApp.firestore();
	const endereco =  a.collection('usuarios').doc(usuario.email).collection('enderecos');
	endereco.doc().set({
		logradouro:jsonEndereco.logradouro,
		numero:jsonEndereco.numero,
		cidade:jsonEndereco.cidade,
		uf:jsonEndereco.uf,
		cep:jsonEndereco.cep,
		complemento:jsonEndereco.complemento
	});
}

//adiciona os produtos no carrinho no banco       
 function adicionarProdutoCarrinhoBanco(idProduto,strCategoria, ultimo = false,valor=1,mudar = false,comprarAgora){
	const fireBase1 = fireBaseApp.firestore();
	const produtos =  fireBase1.collection('usuarios').doc(usuario.email).collection('produtosCarrinho');
	produtos.doc(idProduto).get().then((doc) => {
		var quantidade = 1;
		if(!mudar && doc.exists){
			quantidade = parseInt(doc.data().qtdProduto) +parseInt(valor);
		}
		else{
			quantidade = parseInt(valor);
		}
		if (!doc.exists){	
			produtos.doc(idProduto).set({
				strCategoria:strCategoria,
				qtdProduto:quantidade
			}).then((aas)=>{
				if(ultimo==true){
					window.localStorage.setItem('produtoCarrinho',null);
					window.location.href = "perfil.html";
				}
			}).finally((finalizacao)=>{
				if(comprarAgora){
					window.location.href="carrinho.html";
				}
			})
		}
		else{
			produtos.doc(idProduto).set({
				strCategoria:strCategoria,
					qtdProduto:quantidade
			}).then((aas)=>{
				if(ultimo==true){
					window.localStorage.setItem('produtoCarrinho',null);
					window.location.href = "perfil.html";
				}
			}).finally((finalizacao)=>{
				if(comprarAgora){
					window.location.href="carrinho.html";
				}
			})
		}
	})
}

//remove produtos do carrinho no banco
function removeProdutoCarrinhoBanco(idProduto){
	const fireBase1 = fireBaseApp.firestore();
	const produto =  fireBase1.collection('usuarios').doc(usuario.email).collection('produtosCarrinho').doc(idProduto);
	produto.delete();
}

//adiciona e remove produtos favoritos do banco 
function produtoFavoritoBanco(idProduto,strCategoria){
	const fireBase1 = fireBaseApp.firestore();
	const produto =  fireBase1.collection('usuarios').doc(usuario.email).collection('produtosFavorito').doc(idProduto);
	produto.get().then((doc) => {
		if (!doc.exists){	
			produto.set({
				strCategoria:strCategoria,
			});
		}
		else{
		produto.delete();
		}		
	});
}

//verifica se o produto está favoritado
function buscarFavoritoBanco(idProduto){
	const fireBase1 = fireBaseApp.firestore();
	const produto =  fireBase1.collection('usuarios').doc(usuario.email).collection('produtosFavorito').doc(idProduto);
	produto.get().then((doc) => {
		if(doc.exists){
			favoritar(true);
		}		
	});
}

//adiciona um pedido e limpa o carrinho
function adicionarPedido(){
	const firebase1 = fireBaseApp.firestore();
	const pedido =  firebase1.collection('usuarios').doc(usuario.email).collection('pedidos').doc();
	pedido.set({
		data:new Date(),
		entrega:"em andamento",
		pago:false,
		valorTotal:valorTotal
	})
	for(i=0;i<produtosCarrinho.length;i++){
		pedido.collection("produtos").doc(produtosCarrinho[i].id).set({
			nome:produtosCarrinho[i].nome,
			preco:produtosCarrinho[i].preco,
			qtdProduto:produtosCarrinho[i].qtdProduto *(1-(produtosCarrinho[i].desconto/100)),
			strCategoria:produtosCarrinho[i].categoria
		})
		removeProdutoCarrinhoBanco(produtosCarrinho[i].id)
	}
    window.location.href="perfil.html";
}