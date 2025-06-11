var n=0;
var pulos=0;
var cartas=true;
var alex=true;
var sound=true;

function inicializacao() {
  let el = document.getElementById('player');
  el.textContent = prompt('Olá jogador, digite o seu nome:','Player1');
  el = document.getElementById('bank');
  el.textContent = prompt('Digite o nº do banco de perguntas:\n'+
	'1 : Show do Milhão 1\n2 : show do Milhão 2\n3 : Show do Milhão 3\n'+
	'4 : Show do Milhão 4\n5 : Show do Milhão 5\n6 : Show do Milhão Júnior 1\n'+
	'7 : Show do Milhão Júnior 2','1');
  aplay('boasorte',500);
  console.log(window.n);
  gera_nova_pergunta(false);
  document.getElementById('comecar').hidden=true;
}

function sel_perg(arr,nivel){ //seleciona uma pergunta aleatoriamente dentro de um nível de dificuldade A-D
  dif='';
  c=0; //variavel de controle
  n_=Math.floor(Math.random() * arr.length-1);
  while (dif!=nivel && c<100){
   n_=Math.floor(Math.random() * arr.length);
   if (arr[n_][7]=='N'){  //ve se essa pergunta já não foi feita antes  
     dif=arr[n_][8];		 //se não foi, pega o nivel de dificuldade
   }
   c++;
  }
  arr[n_][7]=='S';	 // e marca esta como pergunta ja feita
  return n_;	
}

function gera_nova_pergunta(pular_){
  num=1;
  //Escolhe uma pergunta
  if (n>0 && n<=5){  num=sel_perg(pergs,'A'); }
  else if (n>5 && n<=9){  num=sel_perg(pergs,'B'); }
  else if (n>9 && n<=12){  num=sel_perg(pergs,'C'); }
  else if (n>12 && n<=16){  num=sel_perg(pergs,'D'); }

  //Anota o número da pergunta segundo a posição dela no banco de dados
  let el = document.getElementById('numperg');  
  el.value=num.toString();
  //ve qual a ordem desta pergunta (se é a 1ª,2ª,3ª....)
  if (!pular_){
   window.n+=1;			
   el = document.getElementById('ordem');  
    console.log(window.n)
   el.value=window.n;
  }
  //
  aplay('ap'+window.n,2500);
  //carrega as alternativas - isso é feito na janela principal
  document.getElementById('questao').textContent=(pergs[num][1]);  //mostra a pergunta
  document.getElementById('_r1').textContent=pergs[num][2];
  document.getElementById('_r2').textContent=pergs[num][3];
  document.getElementById('_r3').textContent=pergs[num][4];
  document.getElementById('_r4').textContent=pergs[num][5];
  //mostra resposta : p/ testes
  el = document.getElementById('resp');  
  el.value=pergs[num][6];
  
  //mostra o quanto participante já ganhou e quanto ganhará se acertar a próxima
  el = document.getElementById('ouro');  
  el.src='img/OURO'+n+'.jpg';
  
}

function radio_getVal(name){
 var radioButtons = document.getElementsByName( name );
 for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
     console.log("radioButton " + i + ": " + radioButtons[i].value);
     return radioButtons[i].value;
    }
 }
}

function radio_setVal(name,v){
 var radioButtons = document.getElementsByName( name );
 radioButtons[v].checked=true;
}

function corrigir (){
  if (window.n>=10){ aplaynow('certeza3'); } //posso perguntar -- so mostre nas perguntas acima de 50k
  else if (window.n>=5){ aplaynow('certeza2');}
  else {aplaynow('certeza1');}
  //setTimeout(() => {
   opc=confirm('Está certo disso?');	 
   
  //}, 500); 
  
  num = document.getElementById('numperg').value;  
  if (opc){  //se o jogador confirmar...
	let ord=window.n; //document.getElementById('ordem').value;
    if(radio_getVal('r')==pergs[num][6]){  //certa resposta
	  aplay('correta');
      //alert('Certa Resposta');
      //document.getElementById('numperg').value += 1;//aumenta pontuação
      pergs[num][7]='S';//marca essa como ja respondida (campo já_foi)
      if (ord<16){
		for (var i=0;i<4;i++){
		 document.getElementById( 'r'+(i+1)).disabled=false; //se teve alternativas eliminadas
		 document.getElementById('_r'+(i+1)).hidden=false;   //no ajuda as cartas, reinicia os elementos
		}
        gera_nova_pergunta(false);//vai para a proxima pergunta
	  } else if(ord==16){
		  // animaçao personalizada: confetes, etc	  1 MILHAO
		  window.n=0;
		  document.getElementById('ordem').value=0;  
		  //habilita botao jogar novamente
		  document.getElementById('comecar').hidden=false;
	  }
    }else{  //errada
	  aplay('Errada');
	  let premio=0;
	  //if (premio.length>3){ premio=premio.substring()} //como por ponto seprador de milhares
	  premio=ver_premio(ord,false); //ate que pergunta o participante chegou? veja o premio 
	  alert('Errou a Resposta...\n e ganhará R$ '+premio+' reais!'); 
	  window.n=0; //reinicia contador de perguntas
	  document.getElementById('ordem').value=0;
	  document.getElementById('comecar').hidden=false;
	}
    
  }
}

function pular(){ //skips a question
 r=false;
 if (window.pulos>=3){alert('Você não pode mais pular as perguntas :-!');}
 else{ r=true;
  window.pulos+=1;
  document.getElementById('pular').value='Pular ('+(3-window.pulos)+')';
  if(window.pulos==3){
    document.getElementById('pular').disable;	  
  }
  gera_nova_pergunta(true);
 }
 return r
}

function cartas_(){ //ask help for cards that could eliminate 1-3 wrong answers
 if (cartas){
  //alert('not implemented');	
  aplaynow('carta');
  num = document.getElementById('numperg').value;   //num. da questao
  n_=-1;
  while (n_<0 || n_==pergs[num][6]-1){  //seleciona quantas alternativas eliminar
   n_=Math.floor(Math.random() * 3);    //mas garante que seja eliminada pelo menos 1
  }
  console.log('valor de n: '+n_);
  opt=0;
  while(opt<1 || opt>4){  //pergunta apenas por educação, mas no final tudo trata-se de sorte
   opt= prompt('Escolha uma carta digitando um número entre 1 e 4');
  }
  alert('A carta '+opt+' eliminará '+(n_+1)+' perguntas.');
  //(pergs[num][6]-1)
  var radioButtons = document.getElementsByName( 'r' );
  var labels		  = document.getElementsByName( 'r' );
  cont=0; //conta quantas alternativas foram eliminadas
  for (var i = 0; i < radioButtons.length; i++) {
    if(cont<n_+1 && radioButtons[i].value!=pergs[num][6]){
	  radioButtons[i].disabled=true; //elimina alternativa
	  document.getElementById( '_r'+(i+1) ).hidden=true;
	  cont++;
	} 

  }
  cartas=false; //marca essa ajuda como já utilizada
 }else{ alert('Você já pediu ajuda às cartas!');}
}

function alex_(){ //shows the right answer, not uses AI as in TV Show
 if (alex){
  num = document.getElementById('numperg').value;  
  radio_setVal('r', (pergs[num][6]-1) ); 
  alex=false;
  document.getElementById('alex').disable=true;	  
 }else{ alert('Você já pediu ajuda para o Alex!');}
}

function parar(){ //stop the game
 if (window.n==16) { aplay('faltapeito'); }  //pergunta do milhão
 opc=confirm('Está certo disso?');
 if (opc){
  if(pulos<3 || alex || cartas){
   alert('Não pare ainda...você ainda pode pedir ajuda ')	
  }else{
   ord=window.n;
   premio=ver_premio(ord,true);	 
   alert('Você parou e ganhou R$ '+premio+' reais!'); 
   //alert('Fez bem em parar, porque você ia errar a resposta.\n Você ganhou R$ '+premio+' reais!'); 
   document.getElementById('comecar').hidden=false;
  }
 }
}

function ver_premio(resp,parar){
  premio=0;
	if (resp==1){premio=0;}  //define premios caso erre a pergunta
	else if (resp==2 ){premio=500;   }  
	else if (resp==3 ){premio=1000;  } 
	else if (resp==4 ){premio=1500;  } 
	else if (resp==5 ){premio=2000;  } 
	else if (resp==6 ){premio=2500;  } 
	else if (resp==7 ){premio=5000;  } 
	else if (resp==8 ){premio=10000; } 
	else if (resp==9 ){premio=15000; } 
	else if (resp==10){premio=20000; } 
	else if (resp==11){premio=25000; } 
	else if (resp==12){premio=50000; } 
	else if (resp==13){premio=100000;} 
	else if (resp==14){premio=150000;} 
	else if (resp==15){premio=200000;} 
	else if (resp==16){
		if (!parar){ premio=0;}
		else {  premio=250000;   }
	}
   if (parar){ premio*=2;}
 
  return premio;
}

function aplay(name,time=1500){
 //let mySound = new Audio(file)
 //mySound.play()
 let el = document.getElementById(name);
 setTimeout(() => {
   if (sound){ el.play();	 }
 }, time); 

}

function aplaynow(name){
 let el = document.getElementById(name);
 if (sound){ el.play();	 }
}

function noSound(){
  let el = document.getElementById('nosound');
  sound=el.checked;
  	
}
//document.addEventListener('DOMContentLoaded', inicializacao);
