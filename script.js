//Varibales globales
let palabra = "";           //Palabra a adivinar
let personalizado=false;   //activado modo palabra personalizada
let intentos = [10,8,6,4]; //numero de intentos según dificultad
let int;                    //numero de intentos de la dificultad seleccionada
let paso = 0;               //numero de intentos gastados
let letrasNoCorrectas = [];

window.onload = function (){
    recogerPalabra();

    //Seleccion de elementos del DOM para asignar eventos
    let tipo = document.getElementsByName("tipo");
    let botonJugar = document.getElementById("enviar");
    let val = document.getElementById("validar");

    //EVENTOS SELECCION TIPO JUEGO
    tipo[0].addEventListener("click",function(){asignarTipoJuego(true)});
    tipo[1].addEventListener("click",function(){asignarTipoJuego(false)});

    
    //EVENTO BOTÓN JUGAR
    botonJugar.addEventListener("click", function(ev){
        ev.preventDefault();
        let input,letra,pal;
        let section = document.getElementById("juego");
        let dificultad = document.getElementById("dificultad").value;
        int = intentos[dificultad];
        recogerPalabra();
        for(let i=0; i<int; i++){
            pal = document.createElement("div");
            pal.setAttribute("class","pal");
            for(let j=0; j<palabra.length; j++){
                letra = document.createElement("div");
                letra.setAttribute("class","letra");
                input = document.createElement("input");
                input.setAttribute("class","inputL p"+i);
                input.setAttribute("type","text");
                input.setAttribute("maxlength", 1);
                input.setAttribute("id", i+""+j);
                input.addEventListener("keyup", moverCursor);
                input.addEventListener("change", letraGastada);
                if(i>0){
                    input.disabled = true;
                }
                letra.appendChild(input);
                pal.appendChild(letra);
            }
            section.appendChild(pal);
        }
        document.getElementById("validar").style.display = "block";
        document.getElementById("formJuego").style.display = "none";
        document.getElementsByTagName("a")[0].style.display = "none";
    });

    //EVENTO BOTÓN COMPROBAR
    val.addEventListener("click", function(ev){
        ev.preventDefault();
        let container, letr, letras, correcto = true;
        let palabraComp = document.getElementsByClassName("p"+paso);
        for(let i=0; i<palabraComp.length; i++){
            container =  palabraComp[i].parentNode;

            if(palabraComp[i].value == palabra[i]){
                container.style.background = "green";
            }else if(letraEsta(palabraComp[i].value)){
                container.style.background = "yellow";
                correcto = false;
            }else{
                container.style.background = "gray";
                correcto = false;
                letrasNoCorrectas.push(palabraComp[i].value);
            }
        }
        for(let i=0; i<palabraComp.length; i++){
            container =  palabraComp[i].parentNode;
            palabraComp[i].style.display = 'none';
            letr = document.createTextNode(palabraComp[i].value.toUpperCase());
            container.appendChild(letr);
        }
        paso++;
        if(paso==int){
            paso=0;
            document.getElementById("validar").style.display = "none";
            alert("La palabra era "+palabra);
        }
        if(correcto){
            letras = document.getElementsByClassName("inputL");
            for(let i=0; i<letras.length; i++){
                letras[i].disabled = true;
            }
            alert("Has ganado");
        }else{
            letras = document.getElementsByClassName("p"+paso);
            for(let i=0; i<letras.length; i++){
                letras[i].disabled = false;
            }
        }
    });
}

function asignarTipoJuego(tipoJuego){ // Muestra / oculta la opción de escribir tu propia plabra
    personalizado = tipoJuego;
    let display = tipoJuego ? "block":"none";
    document.getElementById("palabra").style.display = display;
}

function recogerPalabra(){ //Obtiene una palabra aleatoria a partir de la API, o bien recoge la personalizada
    if(!personalizado){
        fetch('https://palabras-aleatorias-public-api.herokuapp.com/random-by-length?length=5').then((res) => res.json()).then((data) => {
            palabra = data.body.Word;
            palabra = removeAccents(palabra);
            document.getElementById("inputP").value = palabra;
        });
    }
    palabra = document.getElementById("inputP").value;
    palabra = removeAccents(palabra);
}

function letraEsta(l){//Comprueba si una letra está en la palabra escrita (Mostrar letra en amarillo)
    for(let j=0; j<palabra.length; j++){
        if(palabra[j]==l){
            return true;
        }
    }
}

function moverCursor(){ //Una vez escribes una letra, mueve el cursor al siguiente input
    let idletra = this.getAttribute("id")[1];
    let idpalabra = this.getAttribute("id")[0];
    let numInput = parseInt(idletra)+1;
    let input = document.getElementById(idpalabra+""+numInput);
    if(input!=null && this.value!=""){
        input.focus();
    }
}

function letraGastada(){ //Pone de color rojo una letra si la escribes habiendo comprobado antes que no está
    if(letrasNoCorrectas.includes(this.value)){
        this.style.color = "red";
    }else{
        this.style.color = "black";
    }
}

const removeAccents = (str) => { //Elimina acentos y caracteres extraños de la palabra
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } 
