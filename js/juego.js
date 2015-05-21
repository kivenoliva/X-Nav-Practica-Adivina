    
    var ciudad = "";
    var capitales = "";//variable donde iran las capitales que vienen del json creado por mi para el juego de capitales
    var comunidades = "";
    var paisesEuropa = "";
    
    var coordenadasPulsadas = "";
    var coordenadasJuego = "";
    var dificultad = 3000;
    var dificultad_Selecc = "Profesional";
    
    var repeticion = null;
    var jugando;
    var cambiosHistorial = 0;
    var numgo = 0;
    var estoyRejugando = false;
    var retrasoGo = 0;
    
    var contador = 0;//contador para ir viendo qe fotos tienen que ir pasando.
    var ads = [];//array que tendra todas las fotos de flick para ir pasandolas una a una
    
    
    //funcion que prepara la pantalla para cualquier juego (en todos se hace esto)
    function pantallaJuegos() {
        ads = [];
        document.banner.src = "";
        if (repeticion){
            clearInterval(repeticion);
        }          
        contador = 0;
        coordenadasPulsadas = "";
        coordenadasJuego = "";
        $("#comienzo").hide();
        $("#puntuacion").hide();
        $("#fotos").show();
        $("#respuesta").show();
        $("#parar").show();
        $("#dificultad").hide();
        $("#seleccDif").hide();
        $("#TodosJuegos").hide();    
        $("#mostrarJuegos").hide();
        $("#nuevo").hide(); 
        $("#ultimosJuegos").hide();  
        $("#Repo").hide();
    };
    
    //funcion para cuando me seleccionan el juego de capitales
    function jugarCapitales(){    
        pantallaJuegos();
   
        jugando = "Capitales";
        if(capitales === ""){
            $.getJSON("juegos/capitales.json", function(data) { 
                capitales = data;
                randomm(capitales);
            });    
        }else{
            randomm(capitales);
        }         
    };
    
    //funcion para cuando me seleccionan el juego de comunidades
    function jugarComunidades(){
        pantallaJuegos();
   
        jugando = "CapitalesDeComunidades";
        if(comunidades === ""){
            $.getJSON("juegos/capitalesDeComunidadesAutonomasEspaña.json", function(data) { 
                comunidades = data;
                randomm(comunidades);
            });    
        }else{
            randomm(comunidades);
        }      
        
    };
    
    //funcion para cuando me seleccionan jugar al juego de paises
    function jugarPaises(){
        pantallaJuegos();
   
        jugando = "PaisesEuropeos";
        if(paisesEuropa === ""){
            $.getJSON("juegos/paisesEuropeos.json", function(data) { 
                paisesEuropa = data;
                randomm(paisesEuropa);
            });    
        }else{
            randomm(paisesEuropa);
        }     
    };
    
    //funcion que calcula la distancia en km entre dos puntos dando las coordenadas
    function dist(lat1, lon1, lat2, lon2){
        rad = function(x) {return x*Math.PI/180;}

        var R     = 6378.137;                         
        var dLat  = rad( lat2 - lat1 );
        var dLong = rad( lon2 - lon1 );

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;

        return d.toFixed(3);                     
    };
        
    
    //funcion que hace que las fotos vayan saliendo de una en una
    function pasarFotos(){       
        contador++;
        contador = contador % ads.length
        document.banner.src = ads[contador];         
    };
    
    
    //Escoge dentro del json de un juego determinado una de las adivinanzas disponibles para jugar.
    function randomm(datos){
    
        //saco num aleatorio del array de posibles adivinanzas
        var aleatorio = Math.floor(Math.random() * datos.features.length);
        
        //saco las coordenadas del numero que ha salido.
        coordenadasJuego = datos.features[aleatorio].geometry.coordinates;
        coordenadasJuego = coordenadasJuego.toString();
        
        //saco la ciudad del numero que ha salido
        ciudad =  datos.features[aleatorio].properties.name;
        console.log(ciudad);
        var urlFlickr = "http://api.flickr.com/services/feeds/photos_public.gne?tags=" + ciudad + "&tagmode=any&format=json&jsoncallback=?";
        
        $.getJSON(urlFlickr, function(data) {
            
            $.each( data.items, function( i, item ) {
                ads.push(item.media.m);
                if ( i === 100 ) {
                    return false;
                }
            });

            pasarFotos();    
            repeticion = setInterval("pasarFotos()", dificultad);  
        });                 
    };
    
    //Funcion que me recorre el historial y me guarda las ultimas partidas jugadas
    function bucleGuardaUltimas(){
        numgo = 0;
        $("#ultimos").html("");
        console.log(cambiosHistorial);
        for (i=1; i<cambiosHistorial;  i++){
                numgo++;
                history.go(-1);
        }
        
        history.go(cambiosHistorial-1);    
    };
    
    
    //funcion para cuando me seleccionan un juego para volver a jugar desde los ultimos jugados
    function reJugar(num, x){
    
        switch (x) {           
        case "Principiante":
            dificultad = 5000; 
            document.getElementById("dificultad").innerHTML = "Nivel de dificultad seleccionado: PRINCIPIANTE";
            dificultad_Selecc = "Principiante";
            break;
        case "Amateur":
            dificultad = 4000; 
            document.getElementById("dificultad").innerHTML = "Nivel de dificultad seleccionado: AMATEUR";
            dificultad_Selecc = "Amateur";       
            break;
        case "Profesional":
            dificultad = 3000; 
            document.getElementById("dificultad").innerHTML = "Nivel de dificultad seleccionado: PROFESIONAL";
            dificultad_Selecc = "Profesional";       
            break;
        case "Clase Mundial":
            dificultad = 1500; 
            document.getElementById("dificultad").innerHTML = "Nivel de dificultad seleccionado: CLASE MUNDIAL";
            dificultad_Selecc = "Clase Mundial";           
            break;
        default:
            dificultad = 800; 
            document.getElementById("dificultad").innerHTML = "Nivel de dificultad seleccionado: LEYENDA";
            dificultad_Selecc = "Leyenda";
            break;
        }
        estoyRejugando = true;
        history.go(num);
        retrasoGo = num;
    };
    
    //funcion que me hace falra en mostrarJuegosRepo que escribe los juegos que encuentra
    function showFiles(error, contents) {
        if (error) {
            $("#contenidorepo").html("<p>Error code: " + error.error + "</p>");
        } else {

            var files = [];
            for (var i = 0, len = contents.length; i < len; i++) {
                files.push(contents[i].name);
            };
            $("#Repo").html("<p>Juegos:</p>" + "<ul id='files'><li>" + files.join("</li><li>") + "</li></ul>");

        };
    };
       
    //funcion que muestra los juegos disponibles en la app    
    function mostrarJuegosRepo(){
        
        var github = new Github({});
       
        repo = github.getRepo("kivenoliva", "X-Nav-Practica-Adivina");
        repo.contents('master', 'juegos', showFiles);
    
    };
                                                                                                             
jQuery(document).ready(function() {
    
    $("#fotos").hide();
    $("#respuesta").hide();
    $("#puntuacion").hide();
    $("#parar").hide();
    $("#nuevo").hide();
    $("#volverAljuego").hide();
    $("#Repo").hide();
  
  
    //Cargo el mapa ------------- Trabajo siempre con el mismo mapa cargado solo una vez ------------------------->
    var map = L.map('map');
    
    map.setView([40.2838, -3.8215], 2);
    
    L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    var popup = L.popup();
    function onMapClick(e) {
        popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(map);
        coordenadasPulsadas = e.latlng.toString();
    }
    map.on('click', onMapClick);
    //------------------------------------------------------------------------------------------------------------>
        
        
    //Me pulsan el boton para jugar al juego de capitales    
    $("#capitales").click(function(){
        jugarCapitales();
        alert("COMIENZA JUEGO DE ADIVINAR CAPITALES");
    });
     
    //Me pulsan el boton para jugar al juego de capitales de comunidades autonomas en españa
    $("#comunidades").click(function(){
        jugarComunidades();
        alert("COMIENZA JUEGO DE ADIVINAR CAPITALES DE COMUNIDADES ESPAÑOLAS");           
    });
    
    //Me pulsan al boton de jugar al juego de adivinar paises en europa
    $("#paises").click(function(){
        jugarPaises();
        alert("COMIENZA JUEGO DE ADIVINAR PAISES EN EUROPA");            
    });
    
    //Me pulsan el boton de parar juego a medias de estar jugando
    $("#parar").click(function(){
        alert("HAS ABANDONADO EL JUEGO");
        ads = [];
        document.banner.src = "";  
        clearInterval(repeticion);
        contador = 0;
        coordenadasPulsadas = "";
        coordenadasJuego = "";
        $("#comienzo").show();
        $("#fotos").hide();
        $("#respuesta").hide();
        $("#puntuacion").hide();
        $("#parar").hide();
        $("#nuevo").hide();
        $("#seleccDif").show();
        $("#TodosJuegos").show();
        $("#mostrarJuegos").show();
        $("#dificultad").show();
        $("#ultimosJuegos").show();
        $("#Repo").hide();
        
    });
    
    //Despues de pinchar la respuesta en el mapa me pinchan al boton de responder la adivinanza
    $("#respuesta").click(function(){
        
        if(coordenadasPulsadas === ""){
            alert ("Pulsa primero el sitio sobre el mapa");
        
        }else{
            //preparo lo que se va a ver en la pantalla
            $("#fotos").hide();
            $("#respuesta").hide();
            $("#puntuacion").show();
            $("#parar").hide();
            $("#nuevo").show();
            $("#seleccDif").hide();
            $("#TodosJuegos").hide();
            $("#mostrarJuegos").hide();
            $("#dificultad").hide();
            $("#ultimosJuegos").hide();
            $("#Repo").hide();
            clearInterval(repeticion);
        
            //Preparo y saco las coordenadas que me han pulsado en numero.
            var str = coordenadasPulsadas.split("(");
            str = str[1].split(")");
            str = str[0].split(", ");
            var latitudResp = parseInt(str[0]);//latitud que han pulsado
            var longitudResp = parseInt(str[1]);//longitud que han pulsado
            
            //Preparo y saco en numero las coordenadas que tenia el juego guardadas del sitio        
            var str2 = coordenadasJuego.split(",");
            var latitudJuego = parseInt(str2[0]);//latitud del juego
            var longitudJuego = parseInt(str2[1]);//longitud del juego            

            //calculo la distancia entre los dos puntos
            var distancia = dist(latitudJuego, longitudJuego, latitudResp, longitudResp);   //Retorna numero en Km
            var puntuacion = (contador * distancia);
            
            //Meto en el html la distancia y puntuacion
            document.getElementById("distancia").innerHTML = distancia + " Km";
            document.getElementById("lugar").innerHTML = ciudad;
            document.getElementById("puntos").innerHTML = puntuacion + " puntos";
                       
            if(estoyRejugando){
            
                estoyRejugando = false;
                history.go(-retrasoGo);
            }
            
            //cambio el historial cada vez que acabo un juego
            var object = {nombre: jugando, puntos: puntuacion, dificultad: dificultad_Selecc};
            history.pushState(object, '', jugando);
            if (cambiosHistorial < 10){
                cambiosHistorial ++;
            }
            console.log(cambiosHistorial);
         
            //Reinicio las variables que me hacen falta pa jugar despues
            ads = [];
            document.banner.src = "";             
            contador = 0;
            coordenadasPulsadas = "";
            coordenadasJuego = "";           
        }                                          
    });
    
    
    //Cuando me pinchan en el boton de ir a un Juego Nuevo
    $("#nuevo").click(function(){
        $("#fotos").hide();
        $("#respuesta").hide();
        $("#puntuacion").hide();
        $("#parar").hide();
        $("#nuevo").hide();
        $("#comienzo").show();
        $("#TodosJuegos").show();
        $("#mostrarJuegos").show();
        $("#seleccDif").show();
        $("#dificultad").show();
        $("#ultimosJuegos").show();
        $("#Repo").hide();
        history.pushState(null, '', 'JuegoNuevo');
        if (cambiosHistorial < 10){
            cambiosHistorial ++;
        }
        //Actualizo ultimos juegos jugados
        bucleGuardaUltimas();
    });
    
    
    //Si me pinchan para la dificultad
    $("#1").click(function(){
        dificultad = 5000; 
        document.getElementById("dificultad").innerHTML = "Nivel de dificultad seleccionado: PRINCIPIANTE";
        dificultad_Selecc = "Principiante";
    });
    $("#2").click(function(){
        dificultad = 4000;
        document.getElementById("dificultad").innerHTML = "Nivel de dificultad seleccionado: AMATEUR"; 
        dificultad_Selecc = "Amateur";
    });
    $("#3").click(function(){
        dificultad = 3000; 
        document.getElementById("dificultad").innerHTML = "Nivel de dificultad seleccionado: PROFESIONAL"; 
        dificultad_Selecc = "Profesional";
    });
    $("#4").click(function(){
        dificultad = 1500; 
        document.getElementById("dificultad").innerHTML = "Nivel de dificultad seleccionado: CLASE MUNDIAL"; 
        dificultad_Selecc = "Clase Mundial"
    });
    $("#5").click(function(){ 
        dificultad = 800;
        document.getElementById("dificultad").innerHTML = "Nivel de dificultad seleccionado: LEYENDA"; 
        dificultad_Selecc = "Leyenda";   
    });     
    
       
    //Evento que me salta cuando hago un cambio en el historial forzado por mi
    window.addEventListener('popstate', function(e) {
        
        if(estoyRejugando){

            if(e.state){
            
                console.log(e.state.nombre);
                switch (e.state.nombre) {
                
                case "Capitales":
                    jugarCapitales();
                    alert("COMIENZA JUEGO DE ADIVINAR CAPITALES");              
                    break;
         
                case "CapitalesDeComunidades":
                    jugarComunidades();
                    alert("COMIENZA JUEGO DE ADIVINAR CAPITALES DE COMUNIDADES ESPAÑOLAS");                   
                    break;

                default:
                    jugarPaises();
                    alert("COMIENZA JUEGO DE ADIVINAR PAISES EN EUROPA");     
                    break;
                }
                
            }       
        }else{

            if(e.state){
                
                var nombre = e.state.nombre;
                var puntos = e.state.puntos;
                var dif = e.state.dificultad;
                
                var argumento = "<li onclick='reJugar(-"+ numgo + "," + JSON.stringify(dif) + ")'> JUEGO: " + nombre + 
                ", DIFICULTAD: " + dif + "<br> PUNTOS: " + puntos + "</li>";
                
                console.log(argumento);
                document.getElementById("ultimos").innerHTML += argumento;                  
            }
        }
           
    });   
    
    //Despues de ver los juegos disponibles en un repo de GitHub me pinchan para volver a jugar normal
    $("#volverAljuego").click(function(){
        $("#fotos").hide();
        $("#respuesta").hide();
        $("#puntuacion").hide();
        $("#parar").hide();
        $("#nuevo").hide();
        $("#comienzo").show();
        $("#TodosJuegos").show();
        $("#seleccDif").show();
        $("#dificultad").show();
        $("#ultimosJuegos").show();
        $("#mostrarJuegos").show();
        $("#volverAljuego").hide();
        $("#Repo").hide();
    });
    
    //Me pulsan para ver los juegos disponibles en github
    $("#mostrarJuegos").click(function(){
        $("#mostrarJuegos").hide();
        $("#comienzo").hide();
        $("#puntuacion").hide();
        $("#dificultad").hide();
        $("#seleccDif").hide();
        $("#TodosJuegos").hide();    
        $("#nuevo").hide(); 
        $("#ultimosJuegos").hide();  
        $("#volverAljuego").show();
        $("#Repo").show();
        mostrarJuegosRepo();
    });
    
});
