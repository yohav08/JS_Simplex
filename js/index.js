// Método para mostrar los espacios de captura del número de cantidad de variables y restricciones
function Editar(){
    document.getElementById("captura_cantidad").style = "display: block";
    document.getElementById("captura_cantidad_1").style = "display: block";
    document.getElementById("modelo_funcion").style = "display: none";
    document.getElementById("modelo_restricciones").style = "display: none";
    document.getElementById("objetivo").style = "display: none";
    document.getElementById("modelo_textual").style = "display: none";   
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
        document.getElementById("modelo_grafic").style = "display: block";
        
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
            document.getElementById("N_restriccion").innerHTML +='&nbsp&nbsp&nbsp<select id="variables_adicionales'+(i+1)+'" style="width : 90px; border: 4px solid rgba(0, 0, 0, 0.0);" class="matriz form-select-sm"><option value="menor_igual"> ≤ </option> <option value="mayor_igual"> ≥ </option> <option style="display: none;" value="igual"> = </option> </select> &nbsp&nbsp&nbsp';
            document.getElementById("N_restriccion").innerHTML +='<center> <input id="num_X'+(i+1)+'" type="number" style="width : 100px; border: 5px solid rgba(0, 0, 0, 0.0);" class="matriz form-control"> </center>';
        }
    }else{
        alert("El número de variables debe ser mayor a 02 y menor a 20, y el número de restricciones debe ser Mayor a 01 Menor o igual a 20");
    }

    // Ocultando la restriccion de "=" en el método gráfico
    let combo = document.getElementById("grafico_simplex");
    let objetivo = combo.options[combo.selectedIndex].text;
    if (objetivo == "Método Simplex") {
        for (let i = 0; i < n_restricciones; i++) {
            let combo_1 = document.getElementById("variables_adicionales"+(i+1)).options[2];
            combo_1.style = "display: block";
        }
    }

}

// Método para condicionar solo dos variables para el método gráfico
function Method_1() {
    let combo = document.getElementById("grafico_simplex");
    let objetivo = combo.options[combo.selectedIndex].text;

    if (objetivo == "Método Simplex") {
        document.getElementById("tam_variables").value ='';
        document.getElementById("tam_variables").disabled = false;

    }else if (objetivo == "Grafico") {
        document.getElementById("tam_variables").value ='2';
        document.getElementById("tam_variables").disabled = true;
    }
    
}


function Generar_simplex(){

    document.getElementById("modelo_textual").style = "display: block";

    // #filas
    let n_variables = parseFloat(document.getElementById("tam_variables").value);  
    // #columnas
    let n_restricciones = parseFloat(document.getElementById("tam_restricciones").value);
    // # de variables artificiales
    let variable_r = 0, variable_s = 0, variable_h = 0, auxiliar = 0;

    // Reiniciando las variables textuales agregadas
    document.getElementById("modelo_textual_1").innerHTML ='';
    
    //Agregando modelo textual de las variables artificiales que se trabajarán
    for (let i = 0; i < n_restricciones; i++) {
        let combo_1 = document.getElementById("variables_adicionales"+(i+1));
        let rest_1 = combo_1.options[combo_1.selectedIndex].value;

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

    //Creando matriz dinámica para capturar el modelo
    let matriz = new Array(n_restricciones);
    for (let i = 0; i < n_restricciones; i++) {
        matriz[i] = new Array(n_variables+1);
    }
    //Creando la matriz con los respectivos valores extraídos del modelo
    for (let i = 0; i < n_restricciones; i++) {
        for (let y = 0; y <n_variables; y++) {
            matriz [i][y] = parseFloat(document.getElementById("num_X"+(y+1)+"_Y"+(i+1)+"").value);
        }   
        matriz[i][n_restricciones] = parseFloat(document.getElementById("num_X"+(i+1)+"").value);     
    }

    // Contando el número de variables artificiales, de Superavit y Holgura que se agregarán
    let variable_aux = variable_r+ variable_s+variable_h;

    // Creando matriz dinámica con las variables artificiales
    let matriz_aux = new Array(n_restricciones);
    for (let i = 0; i < n_restricciones; i++) {
        matriz_aux[i] = new Array(variable_aux);
    }
    // Rellenando la Matriz de ceros para agregar las variables artificales
    for (let i = 0; i < n_restricciones; i++) {
        for (let y = 0; y < variable_aux; y++) {
            matriz_aux[i][y]= 0 ;
        }
    }

    variable_h = 0; variable_r = 0; variable_s = 0;
    let C_x = [];

    auxiliar = 0;
    //Agregando las variables artificiales a la matriz
    for (let i = 0; i < n_restricciones; i++) {
        let combo_1 = document.getElementById("variables_adicionales"+(i+1));
        let rest_1 = combo_1.options[combo_1.selectedIndex].value;

        if (rest_1 == "mayor_igual") {
            // Darle nombre a la fila de artificiales 
            variable_s++;
            // variable_r++;
            C_x.push("S"+variable_s);

            matriz_aux [i][auxiliar] = -1;
            auxiliar++;
        }else if (rest_1 == "menor_igual") {
            variable_h++;
            C_x.push("H"+variable_h);

            matriz_aux [i][auxiliar] = 1;  
            auxiliar++;
        }
    }

    for (let i = 0; i < n_restricciones; i++) {
        let combo_1 = document.getElementById("variables_adicionales"+(i+1));
        let rest_1 = combo_1.options[combo_1.selectedIndex].value;

        if (rest_1 == "mayor_igual") {
            // Darle nombre a la fila de artificiales 
            variable_r++;

            C_x.push("R"+variable_r);
            matriz_aux [i][auxiliar] = 1;
            auxiliar++;   
        
        }else if (rest_1 == "igual") {
            variable_r++;
            C_x.push("R"+variable_r);

            matriz_aux [i][auxiliar] = 1;  
            auxiliar++;    
        }
    }

    console.log("----------Variables Artificiales:")
    console.log(C_x);
    console.log("----------Matriz Auxiliar:");
    console.log(matriz_aux); 

    let var_R = [];
    //Organizando las R al final en el arreglo 
    /* 
    for (let i = 0; i < C_x.length; i++) {
        if (C_x[i] == "R"+(i+1)) {

            var_R.push("R"+(i+1)+"");
            C_x.splice(i, 1);
        } 
    }
    let aux_2 = 0;
    let tam = (var_R.length+C_x.length);

    for (let i = C_x.length; i < tam; i++) {
        C_x.push("R"+(aux_2+1));
        aux_2++;
    }
    */

    // C_x.unshift("Cx", "Xb")
    // C_x.push("Bi");
    

    // Agregando las variables al tamaño de la tabla
    // document.getElementById("thead_1").innerHTML +='<tr class="table-active">';
    // for (let i = 0; i < C_x.length; i++) {
    //     document.getElementById("thead_1").innerHTML +='<th>'+C_x[i]+'</th>';
    // }
    // document.getElementById("thead_1").innerHTML +='</tr>';

    console.log("Matriz Auxiliar:");
    console.log(matriz_aux);   
    
    console.log("Variables Artificiales:")
    console.log(C_x);

    
    // let combo = document.getElementById("objetivo_1");
    // let objetivo = combo.options[combo.selectedIndex].text;
    // if ( objetivo == "Maximizar") {
    //     console.log('Maximización');
    // }else if (objetivo == "min") {
    //     console.log('Minimizar');
    // }

        
    
}


function Generar_grafico() {

    let  grafic;
    if (grafic) grafic.destroy();
    // #filas
    let n_variables = parseFloat(document.getElementById("tam_variables").value);  
    // #columnas
    let n_restricciones = parseFloat(document.getElementById("tam_restricciones").value);

    // Objetivo (Minimizar o maximizar)
    let combo = document.getElementById("objetivo_1");
    let objetivo = combo.options[combo.selectedIndex].text;

    //Creando matriz dinámica para capturar el modelo
    let matriz = new Array(n_restricciones);
    for (let i = 0; i < n_restricciones; i++) {
        matriz[i] = new Array(n_variables+1);
    }
    //Creando la matriz con los respectivos valores extraídos del modelo
    for (let i = 0; i < n_restricciones; i++) {
        for (let y = 0; y <n_variables; y++) {
            matriz [i][y] = parseFloat(document.getElementById("num_X"+(y+1)+"_Y"+(i+1)+"").value);
        }   
        matriz[i][n_variables] = parseFloat(document.getElementById("num_X"+(i+1)+"").value);     
    }

    // Creando función con los datos del modelo
    let funcion = new Array(n_variables);
    for (let i = 0; i < n_variables; i++) {
        funcion [i] = parseFloat(document.getElementById("fun_X"+(i+1)).value);
    }

    //Reiniciando el modelo textual para el método gráfico
    document.getElementById("Fun_objetivo").innerHTML = '';
    document.getElementById("Res_objetivo").innerHTML = '';

    // Agregando la Funcion textual del método gráfico
    if (objetivo == "Maximizar") {
        document.getElementById("Fun_objetivo").innerHTML += "Maximizar Z = ";
    }else if (objetivo == "Minimizar") {
        document.getElementById("Fun_objetivo").innerHTML += "Minimizar Z = ";
    }    
    document.getElementById("Fun_objetivo").innerHTML +=funcion[0]+"X";
    if (funcion[1] < 0) {
        document.getElementById("Fun_objetivo").innerHTML += " "+funcion[1]+"Y ";
    }else {
        document.getElementById("Fun_objetivo").innerHTML += " + "+funcion[1]+"Y ";
    }
    
    // Agregando el modelo de las restricciones textuales del método gráfico
    for (let i = 0; i < n_restricciones; i++) {
        let combo_1 = document.getElementById("variables_adicionales"+(i+1));
        let rest_1 = combo_1.options[combo_1.selectedIndex].value;
        document.getElementById("Res_objetivo").innerHTML +='<div class="container"></div> <label><h7>Restriccion N° '+(i+1)+': &nbsp&nbsp&nbsp</h7></label>';
        
        for (let y = 0; y < n_variables; y++) {
            if (y < n_variables-1) {
                document.getElementById("Res_objetivo").innerHTML += matriz[i][y]+"X ";
            }else{
                if (matriz[i][y] < 0) {
                    document.getElementById("Res_objetivo").innerHTML += " "+matriz[i][y]+"Y ";
                    if (rest_1 == "mayor_igual") {
                        document.getElementById("Res_objetivo").innerHTML += " ≥ ";
                        document.getElementById("Res_objetivo").innerHTML += matriz[i][y+1];
        
                    } else if (rest_1 == "menor_igual") {
                        document.getElementById("Res_objetivo").innerHTML += " ≤ ";
                        document.getElementById("Res_objetivo").innerHTML += matriz[i][y+1];
                    }
                }else{
                    document.getElementById("Res_objetivo").innerHTML += " + "+matriz[i][y]+"Y ";
                    if (rest_1 == "mayor_igual") {
                        document.getElementById("Res_objetivo").innerHTML += " ≥ ";
                        document.getElementById("Res_objetivo").innerHTML += matriz[i][y+1];
        
                    } else if (rest_1 == "menor_igual") {
                        document.getElementById("Res_objetivo").innerHTML += " ≤ ";
                        document.getElementById("Res_objetivo").innerHTML += matriz[i][y+1];
                    }
                }  
            }
        }
    }
    document.getElementById("Res_objetivo").innerHTML += "<br> X, Y ≥ 0";


    // Extrayendo las coordenadas X y Y de cada una de las restricciones
    let coordenadas_X = new Array();
    let coordenadas_Y = new Array();
    let recta_X = new Array();
    let recta_Y = new Array();

    for (let i = 0; i < n_restricciones; i++) { 
        if (matriz[i][0] == 0) {
            recta_X.push(0)
            recta_Y.push(matriz[i][2] / matriz[i][1]);
            
        }else if(matriz[i][1] == 0){
            recta_X.push(matriz[i][2] / matriz[i][0]);
            recta_Y.push(0);

        }else {
            coordenadas_X.push(0);
            coordenadas_Y.push(matriz[i][2] / matriz[i][1]);
            coordenadas_X.push(matriz[i][2] / matriz[i][0]);
            coordenadas_Y.push(0);
        }  
    }

    // Graficar las restricciones

    
    // Comenzar a determinar los puntos que delimitan la region factible
    

    console.log("Matriz: ");
    console.log(matriz);
    

    
    document.getElementById("contenedor_grafica").innerHTML = '';
    document.getElementById("contenedor_grafica").innerHTML += '<canvas id="grafica_chart" style="background-color: aliceblue; max-width: 100%; height: 50em; width: 94%;"> </canvas>';
    

    let grafico = document.getElementById("grafica_chart").getContext('2d');
    

    if (grafic) {
        grafic.destroy();
    } 

    let names = ["Grafico", "Simplex", "Simplex 2F"]
    let edades = [4,5,6]

    grafic = new Chart(grafico,{
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: "Cantidad",
                data: edades,
                borderwidth: 1.5
            }]
        }
    });




}


function Generar_metodo() {
    let combo = document.getElementById("grafico_simplex");
    let objetivo = combo.options[combo.selectedIndex].text;

    if (objetivo == "Método Simplex") {
        Generar_simplex();

    }else if (objetivo == "Grafico") {
        Generar_grafico();
        // Generar Simplex
    }

}

