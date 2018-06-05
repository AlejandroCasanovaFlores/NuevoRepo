//Recibimos un objeto como parámetro, el cual evaluaremos.
function getNombreClase(obj){
	/*
	Invocamos la funcion toString() de la clase Object, pero la usamos el objeto a evaluar.-
	call() lo que hace, es usar la función toString() pero de clase Object. Recordemos que todas las clases heredan de la clase Object.
	OJO: La función toString() de la clase Object devulve el siguiente String "[object Object]", en cambio, si usaramos el método toString() de cada clase, los resultados
	cambiarián, ya que, cada clase sobreEscribe dicho método para su propio fin.
	Es por lo explicado anteriormente, que usamos una expresion regular solo para retornar la segunda palabra del string.
	[1] Significa que devolverá el segundo elemento del array que devuelve la funcion match().- Ya que el primero sería " String" y
	el segundo "String".- ¿Y por que devuelve 2? Por que al usar () en una expresión regular, lo que este dentro de ese parentesis,
	lo almacenará aparte.
	*/
	return Object.prototype.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
}

Date.prototype.sumarDias = function(dias){
	this.setDate(this.getDate()+dias);
	return this;
}

Date.prototype.diferenciaHoras = function(fecha){
	try{
		if(getNombreClase(fecha)=="date"){
			var milisegundos = fecha - this;
			return Math.abs(Math.floor(((milisegundos/1000)/60)/60));
		}else{
			throw {mensaje:"Se necesita un objeto de tipo Date para continuar.", tipo:getNombreClase(fecha)};
		}
	}catch(e){
		console.error(e.mensaje + " Tú ingresaste un "+e.tipo+"!");
	}
}


function crearCookie(nombre, valor, segVida){
	let value = escape(valor);

	let muerte = new Date();
	muerte.setSeconds(muerte.getSeconds()+segVida);

	document.cookie = nombre+"="+value+";expires="+muerte.toUTCString()+";";
}

function eliminarCookie(nombre){
	let fecha = new Date();
	document.cookie = nombre+"=x;expires="+fecha.toUTCString()+";";
}

function getCookie(nombre){
	var cookies = document.cookie;

	var cookieArr = cookies.split('; ');

	for(var i=0; i < cookieArr.length; i++){
		var datosArr = cookieArr[i].split('=');

		if(datosArr[0] === nombre){
			return datosArr[1];
		}

	}

	return undefined;
}

function aleatorio(min, max) {

	let aleatorio = Math.random();

  	return Math.floor(aleatorio * (max - min)) + min;
}