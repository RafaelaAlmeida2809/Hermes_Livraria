var usuario = null;
function iniciar(){}

//Verifica se todos os dados obrigatorios do cadastro foram preenchidos
function VerificarCamposCadastro(){
	var semErro = true;	
	var listaIds = ['inputSenha','inputEmail','inputNome','inputNascimento','inputCPF','inputTelefone'];
	for(let i = 0; i< listaIds.length;i++){
		document.getElementById(listaIds[i]).classList.remove("erroInput");
		if(document.getElementById(listaIds[i]).value==null||document.getElementById(listaIds[i]).value==""){
			document.getElementById(listaIds[i]).classList.add("erroInput");
			semErro = false;
			console.log(listaIds[i]);
		}	
	}
	if(!document.getElementById('inputEmail').value.includes('@')){
		document.getElementById('inputEmail').classList.add("erroInput");
		semErro = false;
	}
	if(document.getElementById('inputSenha').length<7){
		document.getElementById('inputSenha').classList.add("erroInput");
		semErro = false;
	}
	if(!semErro){
		document.getElementById('erroCadastrar').innerHTML ="";
		document.getElementById('erroCadastrar').innerHTML +=`<div>Preencha corretamente os campos obrigatórios</div>`;
	}
	return semErro;
}

//Informa qual o erro ao realizar o cadastrar
function ErroCadastro(erro){ 
    document.getElementById('erroCadastrar').innerHTML="";
    if(erro.code == "auth/weak-password"){
        document.getElementById('inputSenha').classList.add("erroInput");
        document.getElementById('erroCadastrar').innerHTML +=`<div>Senha muito fraca, tente outra.</div>`;
    }
    if(erro.code == "auth/email-already-in-use"){
        document.getElementById('inputEmail').classList.add("erroInput");
        document.getElementById('erroCadastrar').innerHTML +=`<div>Este email já possui um cadastro!</div>`;
    }
    if(erro.code == "auth/invalid-email"){
        document.getElementById('inputEmail').classList.add("erroInput");
        document.getElementById('erroCadastrar').innerHTML +=`<div>Digite um email válido;</div>`;
    }
}

//Informa qual o erro ao realizar o login
function ErroLogin(erro){
    document.getElementById('erroLogar').innerHTML ="";
    document.getElementById('localEmail').classList.remove("erroInput");
    document.getElementById('localSenha').classList.remove("erroInput");
    if(erro.code == "auth/user-not-found" || erro.code == "auth/wrong-password"){
        document.getElementById('localEmail').classList.add("erroInput");
        document.getElementById('localSenha').classList.add("erroInput");
        document.getElementById('erroLogar').innerHTML +=`<div>Email ou senha incorretos.</div>`;
    }
    if(erro.code == "auth/too-many-requests"){
        document.getElementById('erroLogar').innerHTML +=`<div>Muitas tentativas, tente mais tarde.</div>`;
    }
    if(erro.code == "auth/invalid-email"){
        document.getElementById('localEmail').classList.add("erroInput");
        document.getElementById('erroLogar').innerHTML +=`<div>Digite um email válido.</div>`;
    }
    if(document.getElementById('localSenha').value==null||document.getElementById('localSenha').value==""){
        document.getElementById('localSenha').classList.add("erroInput");
        document.getElementById('erroLogar').innerHTML +=`<div>Digite uma senha.</div>`;
    }
}

//Abre a aba de cadastro
function mudarAba(){
	var abaCadastro = document.getElementById('abaCadastro');
	var abaLogin = document.getElementById('abaLogin');
	if(abaCadastro.classList.contains("mostrar")){
		abaCadastro.classList.remove("mostrar");
		abaLogin.classList.add("mostrar");
	}
	else{
		abaLogin.classList.remove("mostrar");
		abaCadastro.classList.add("mostrar");
	}
}

//Abre recuperação de senha
function abaRecuperarSenha(){
	var abaRecuperar = document.getElementById('abaRecuperar');
	var abaLogin = document.getElementById('abaLogin');
	if(abaRecuperar.classList.contains("mostrar")){
		abaRecuperar.classList.remove("mostrar");
		abaLogin.classList.add("mostrar");
	}
	else{
		abaLogin.classList.remove("mostrar");
		abaRecuperar.classList.add("mostrar");
	}
}