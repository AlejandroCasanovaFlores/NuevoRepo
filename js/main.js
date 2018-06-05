// Variables jkashdkjashdkjhasdkj
var arrSegmentos = [];
var miRuleta;
var alAgua=null;
var arrConcursantes = [];
var colores = ['#eae56f', '#89f26e', '#7de6ef', '#e7706f', '#FACC2E', '#B40486', '#D8D8D8', '#3B240B'];
var indiceColor = 0;

var stop = false;
var bandera = false;
var nombreEstafa = "";


//Funciones
var generarLista = () => {

	let select = document.getElementById("select");
	select.disabled = false;

	let textarea = document.getElementById('textarea');
	var textoSinModificar = textarea.value.toUpperCase();
	if(textoSinModificar==""){
		swal({title:"Atención: ", text:"Por favor, ingresa a los concursantes!", icon:"warning", button:"Esta bien"});
	}else{
		arrConcursantes = textoSinModificar.split(",");

		let basura = true;

		while(basura){
			for(var i = 0; i<arrConcursantes.length; i++){
				let auxiliar = arrConcursantes[i].trim();

				if(auxiliar == ""){
					arrConcursantes.splice(i, 1);
					break;
				}

				if(i == arrConcursantes.length-1)
					basura = false;
			};
		}

		if(arrConcursantes.length < 3){
			swal({title:"Atención: ", text:"Mínimo 3 personas", icon:"info", button:"Esta bien"});
			return;
		}

		$('#btnReset').toggle();

		cambiarEstado('section');
		cambiarEstado('aside')
		textarea.value = "";

		eliminarLista();

		editarSelect(arrConcursantes.length);

		let padre = document.getElementById('lista');
		let hijo = document.createElement('ol');
		hijo.setAttribute("id", "listaDesordenada");

		for(var i=0; i<arrConcursantes.length; i++){

			if(i>7 && indiceColor==8)
				indiceColor=0;

			arrSegmentos[i] = {'fillStyle':colores[indiceColor++],'text':arrConcursantes[i]};
			let nieto = document.createElement('li');
			nieto.setAttribute("id", arrConcursantes[i]);
			nieto.innerHTML = "<strong>"+arrConcursantes[i]+"</strong>";
			hijo.appendChild(nieto);
		}

		indiceColor = 0;

		padre.appendChild(hijo);

		crearRuleta();
	}
}

var crearRuleta = () => {
	miRuleta = new Winwheel({
		'numSegments':arrConcursantes.length, //Este es el valor de los segmentos.-
		'outerRadius': 190, //Acá definimos el radio de cada segmento.-
		'innerRadius': 20,
		'lineWidth': 5,
		'segments':arrSegmentos,
		'textFontSize': 12,
		'animation':{
			'type': 'spinToStop',
			'duration': 3,
			'callbackFinished': 'Mensaje()',
			'callbackAfter': 'dibujarIndicador()'
		}
	});

	dibujarIndicador();
}

var dibujarIndicador = () => {
    var ctx = miRuleta.ctx;
    ctx.strokeStyle = 'navy';     
    ctx.fillStyle = 'black';     
    ctx.lineWidth = 2;
    ctx.beginPath();             
    ctx.moveTo(170, 0);          
    ctx.lineTo(230, 0);          
    ctx.lineTo(200, 40);
    ctx.lineTo(171, 0);
    ctx.stroke();                
    ctx.fill();                  
}

var Mensaje = () => {
   var SegmentoSeleccionado = miRuleta.getIndicatedSegment();
   let concursante = SegmentoSeleccionado.text;

   actualizarConcursantes(concursante);
   setTimeout(function(){
	   if(alAgua==null){
	   		if(bandera==true && nombreEstafa != ""){
	   			concursante = nombreEstafa;
	   		}
	   		swal({title:concursante, text:"Felicidades, eres el nuevo ganador.", icon:"success", button:"Genial!"});
	   		bandera = false;
	   }else{
	   		swal({title:concursante, text:"Lo siento, haz quedado fuera.", icon:"error", button:"Sigamos"});
	   }
   }, 1500);
   //Reinicio de la ruleta
   miRuleta.stopAnimation(false);
   //miRuleta.rotationAngle = 0;
   miRuleta.draw();
   dibujarIndicador();
}

var actualizarConcursantes = concursante => {	
	if(alAgua>0){
		var arrEliminado = arrConcursantes.splice(arrConcursantes.indexOf(concursante), 1);
		var li = document.getElementById(arrEliminado[0]);
		li.setAttribute("class","eliminado");
		for(var i=0; i<arrConcursantes.length;i++){
			let incognito = aleatorio(0,8);
			arrSegmentos[i] = {'fillStyle':colores[incognito],'text':arrConcursantes[i]};
		}
		//crearRuleta();
		alAgua--;
	}else if(alAgua==0){
		let li = document.getElementById((bandera==true)?nombreEstafa.toUpperCase():concursante);
		
		if(li == null)
			li = document.getElementById(concursante);

		li.setAttribute("class","ganador");
		cambiarEstado('section');
		alAgua=null;
	}
}

var eliminarLista = () => {

	let padre = document.getElementById("lista");
	let listaDesordenada = document.getElementById("listaDesordenada");

	if(listaDesordenada!=null)
		padre.removeChild(listaDesordenada);

}

var capturaSelect = () => {
	let select = document.getElementById('select');
	select.disabled = true;

	if(alAgua==null)
		alAgua=select.value;
	
	crearRuleta();
	miRuleta.startAnimation();
}

var cambiarEstado = (identificador) => {
	$(identificador).toggle("slow");
};

var reiniciarRuleta = () => {

	let aside = document.getElementById('aside');
	if($('aside').css("display") == "none")
		cambiarEstado('aside');

	let section = document.getElementById('section');
	if($('section').css("display") != "none")
		cambiarEstado('section');

	alAgua = null;
	bandera = false;
	nombreEstafa = "";
	stop=false;
	eliminarLista();
	$('#btnReset').toggle();
}

var editarSelect = (numConcursantes) => {
	let select = document.getElementById('select');
	/*Devuelve un Object con los hijos del padre, más datos informativos*/
	let objHijos = $('select').children('option');
	/*De esta manera transformamos el object en array*/
	let arrHijos = Object.values(objHijos);

	//Le resto 2 al largo, ya que los ultimos dos elementos, son informarivos (O sea, hay que sacarlos)
	for(let i=0; i<arrHijos.length-2; i++){
		select.removeChild(arrHijos[i]);
	}

	if(numConcursantes == 3){
		let hijo0 = document.createElement('option');
		hijo0.setAttribute("value", "0");
		hijo0.innerHTML = "0";
		select.appendChild(hijo0);

		let hijo = document.createElement('option');
		hijo.setAttribute("value","1");
		hijo.innerHTML = "1";
		select.appendChild(hijo);

	}else if(numConcursantes > 3 && numConcursantes <= 10){
		let hijo = document.createElement('option');
		hijo.setAttribute("value","1");
		hijo.innerHTML = "1";
		select.appendChild(hijo);

		let hijo2 = document.createElement('option');
		hijo2.setAttribute("value","3");
		hijo2.innerHTML = "3";
		select.appendChild(hijo2);
	}else{
		let hijo = document.createElement('option');
		hijo.setAttribute("value","1");
		hijo.innerHTML = "1";
		select.appendChild(hijo);

		let hijo2 = document.createElement('option');
		hijo2.setAttribute("value","3");
		hijo2.innerHTML = "3";
		select.appendChild(hijo2);

		let hijo3 = document.createElement('option');
		hijo3.setAttribute("value","6");
		hijo3.innerHTML = "6";
		select.appendChild(hijo3);
	}

}

//Resto de código

var btnIngresar = document.getElementById('btnIngresar');
btnIngresar.addEventListener("click", generarLista);

var btnGirar = document.getElementById('btnGirar');
btnGirar.addEventListener("click", capturaSelect);

var botonReset = document.getElementById('btnReset');
botonReset.addEventListener("click", reiniciarRuleta);

$('#receptor').on("dblclick", function(){
	console.log("bandera a cambiado a true");
	bandera	= true;
});

$(document).on("keypress", function(e){
	if(bandera == true && stop == false){

		if(e.key == '.'){
			stop = true;
			return;
		}

		nombreEstafa += (e.charCode == 32)?" ":e.key.toUpperCase();
	}
});