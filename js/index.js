// Método para mostrar los espacios de captura del número de cantidad de variables y restricciones
function Editar(){
    document.getElementById("captura_cantidad").style = "display: block";
    document.getElementById("captura_cantidad_1").style = "display: block";
    document.getElementById("modelo_funcion").style = "display: none";
    document.getElementById("modelo_restricciones").style = "display: none";
    document.getElementById("objetivo").style = "display: none";   
}

// Método para la generación del modelo para la captura de datos del método
function Modelo() {
    let n_variables = document.getElementById("tam_variables").value;  
    let n_restricciones = document.getElementById("tam_restricciones").value;   
    
    if (n_variables <= 20 && n_variables >= 2) {

        // Mostrando el Modelo
        document.getElementById("captura_cantidad").style = "display: none";
        document.getElementById("captura_cantidad_1").style = "display: none";
        document.getElementById("modelo_funcion").style = "display: block";
        document.getElementById("modelo_restricciones").style = "display: block";
        document.getElementById("objetivo").style = "display: block";
        
        // Reiniciando el modelo
        document.getElementById("N_restriccion").innerHTML ='';
        document.getElementById("funcion").innerHTML ='';
        
        // Agregando la función
        document.getElementById("funcion").innerHTML +='<div class="container"> <br></div> <label><h5>Función: &nbsp&nbsp&nbsp</h5></label><br>';
        for (let i = 0; i < n_variables-1; i++) {
            document.getElementById("funcion").innerHTML +='<center> <input  id="fun_X'+(i+1)+'" type="number" style="width : 100px; border: 5px solid rgba(0, 0, 0, 0.0);" class="form-control">';
            document.getElementById("funcion").innerHTML +='<div><span id="var_X'+(i+1)+'" style="font-size: 1.5em; color: azure;">&nbspX<sub id="variable">'+(i+1)+'</sub><span id="signo">+</span>&nbsp</span></div><center> '; 
        }
        document.getElementById("funcion").innerHTML +='<center> <input  id="fun_X'+n_variables+'" type="number" style="width : 100px; border: 5px solid rgba(0, 0, 0, 0.0);" class="form-control">';
        document.getElementById("funcion").innerHTML +='<div><span id="var_X'+n_variables+'" style="font-size: 1.5em; color: azure;">&nbspX<sub id="variable">'+n_variables+'</sub></span></div><center> '; 
        
        // Agregando las Restricciones 
        for (let i = 0; i < n_restricciones; i++) {
            document.getElementById("N_restriccion").innerHTML +='<div class="container"><br></div> <label><h5>Restriccion N° '+(i+1)+': &nbsp&nbsp&nbsp</h5></label>';

            for (let y = 0; y < n_variables; y++) {
                
                if (y < n_variables-1) {
                    document.getElementById("N_restriccion").innerHTML += '<center> <input  id="num_X'+(y+1)+'_Y'+(i+1)+'" type="number" style="width : 90px; border: 4px solid rgba(0, 0, 0, 0.0);" class="matriz form-control"> </center>';
                    document.getElementById("N_restriccion").innerHTML += '<center> <div><span id="var_X'+(y+1)+'_Y'+(i+1)+'" style="font-size: 1.5em; color: azure;">&nbspX<sub id="variable">'+(y+1)+'</sub><span id="signo">+</span>&nbsp</span></div> </center>';
                }else{
                    document.getElementById("N_restriccion").innerHTML += '<center> <input  id="num_X'+(y+1)+'_Y'+(i+1)+'" type="number" style="width : 90px; border: 4px solid rgba(0, 0, 0, 0.0);" class="matriz form-control"> </center>';
                    document.getElementById("N_restriccion").innerHTML += '<center> <div><span id="var_X'+(y+1)+'_Y'+(i+1)+'" style="font-size: 1.5em; color: azure;">&nbspX<sub id="variable">'+(y+1)+'</sub>&nbsp</span></div> </center>';
                }
            } 
            document.getElementById("N_restriccion").innerHTML +='&nbsp&nbsp&nbsp<select id="variables_adicionales'+(i+1)+'" style="width : 90px; border: 4px solid rgba(0, 0, 0, 0.0);" class="matriz form-select-sm"><option value="menor_igual"> ≤ </option> <option value="mayor_igual"> ≥ </option> <option value="igual"> = </option> </select> &nbsp&nbsp&nbsp';
            document.getElementById("N_restriccion").innerHTML +='<center> <input id="num_X'+(i+1)+'" type="number" style="width : 100px; border: 5px solid rgba(0, 0, 0, 0.0);" class="matriz form-control"> </center>';
        }
    }else{
        alert("El número de variables debe ser mayor a 02 y menor a 20, y el número de restricciones debe ser Mayor a 01 Menor o igual a 20");
    }
}

function Generar_metodo(){

    //filas
    let n_variables = document.getElementById("tam_variables").value;  
    //columnas
    let n_restricciones = document.getElementById("tam_restricciones").value;

    let variable_r = 0;
    let variable_s = 0;
    let variable_h = 0;

    let matriz = new Array(2);
    matriz[0] = new Array(n_variables+1);
    matriz[1] = new Array(n_restricciones);


    // Reiniciando las variables agregadas
    document.getElementById("modelo_textual_1").innerHTML ='';
    let posicion_artificial = 0;
    
    for (let i = 0; i < n_restricciones; i++) {
        let combo_1 = document.getElementById("variables_adicionales"+(i+1));
        let rest_1 = combo_1.options[combo_1.selectedIndex].value;

        // console.log("HOLA: "+i+": "+rest_1);

        
        if (rest_1 == "mayor_igual") {
            variable_s++;
            variable_r++;
            
            
            document.getElementById("modelo_textual_1").innerHTML +='<li style="font-size: 1.2rem; color: aliceblue;"><span>'+'&nbsp&nbsp&nbsp '+(i+1)+'. Tiene signo "≥" (mayor igual) por lo que se restará la variable de exceso S'+variable_s+' y se sumará la variable artificial R'+variable_r+'.</span></li>';
    
        } else if (rest_1 == "menor_igual") {
            variable_h++;
            document.getElementById("modelo_textual_1").innerHTML +='<li style="font-size: 1.2rem; color: aliceblue;"><span>'+'&nbsp&nbsp&nbsp '+(i+1)+'. Tiene signo "≤" (menor igual) por lo que se agregará la variable de holgura H'+(variable_h)+'.</span></li>';
            
        } else if (rest_1 == "igual") {
            variable_r++;
            document.getElementById("modelo_textual_1").innerHTML +='<li style="font-size: 1.2rem; color: aliceblue;"><span>'+'&nbsp&nbsp&nbsp '+(i+1)+'. Tiene signo "=" (igual) por lo que se agregará la variable artificial R'+variable_r+'.</span></li>';
            
        }
    }
    
    let variable_aux= variable_r+ variable_s+variable_h;
    console.log("Variables artificiales: "+variable_aux);

    let matriz_aux = new Array(2);
    matriz_aux[0] = new Array(variable_aux);
    matriz_aux[1] = new Array(n_restricciones);

    
    for (let i = 0; i < variable_aux; i++) {
        matriz_aux[0][i]=0;
        matriz_aux[1][i]=0;

        // for (let j = 0; j < n_restricciones; j++) {
        //     matriz_aux[i][j] = 0;  
        // }
        
    }

    let auxiliar=0;
    for (let i = 0; i < n_restricciones; i++) {
        

        let combo_1 = document.getElementById("variables_adicionales"+(i+1));
        let rest_1 = combo_1.options[combo_1.selectedIndex].value;

        if (rest_1 == "mayor_igual") {
            // variable_s++; // -1
            //  variable_r++; // 1
            console.log("Mayor igual: pos i-"+i+" pos y:"+auxiliar+" valor: "+(-1));
            matriz_aux [i][auxiliar] = -1;
            auxiliar++;

            //auxiliar general que es utilizado para cada var artificial, crear un auxiliar extra para
            // el problema de la variable R, que se aregue a la matriz 
            
            
        }if (rest_1 == "menor_igual") {
            // variable_h++;
            console.log("Menor igual: pos i-"+i+" pos y:"+auxiliar+" valor: "+1);
            matriz_aux [i][auxiliar] = 1;
            auxiliar++;

        }else if (rest_1 == "igual") {
            // variable_r++; // 1            
            console.log("igual: pos i-"+i+" pos y:"+auxiliar+" valor: "+1);
            matriz_aux [i][auxiliar] = 1;
            auxiliar++;
        }
        
        
        //mensajito de las restricciones


    }
    console.log(matriz_aux);



    
     
    
 
    

    let aux = n_variables-1;

    for (let i = 0; i < n_restricciones; i++) {
        for (let y = 0; y < n_variables; y++) {
            matriz [i][y] = document.getElementById("num_X"+(y+1)+"_Y"+(i+1)+"").value;
        }   
        matriz[i][n_restricciones] = document.getElementById("num_X"+(i+1)+"").value;     
    }

    // let combo = document.getElementById("objetivo_1");
    // let objetivo = combo.options[combo.selectedIndex].text;

    // if ( objetivo == "Maximizar") {
    //     console.log('Maximización');
        
    // }else if (objetivo == "min") {
    //     console.log('Minimizar');
    // }

    console.log("Matriz:")
    console.log(matriz);
    
}

void function test() {
    console.log('test function executed');
};
