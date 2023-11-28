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

    // document.getElementById("col_pivote_inicial").innerHTML = '';
    // document.getElementById("fil_pivote_inicial").innerHTML = '';
    // document.getElementById("elem_pivote_inicial").innerHTML = '';
    document.getElementById("modelo_textual").style = "display: block";

    // #filas
    let n_variables = parseFloat(document.getElementById("tam_variables").value);  
    // #columnas
    let n_restricciones = parseFloat(document.getElementById("tam_restricciones").value);
    // # de variables artificiales
    let variable_r = 0;
    let variable_s = 0
    let variable_h = 0
    let auxiliar = 0;

    // Reiniciando el modelo agregado
    document.getElementById("modelo_textual_1").innerHTML ='';
    document.getElementById("thead_encabezado").innerHTML = '';
    document.getElementById("tbody_matriz").innerHTML = '';
    document.getElementById("tfoot_end").innerHTML = '';
    
    //Creando matriz_inicial dinámica para capturar el modelo
    let matriz_inicial = new Array(n_restricciones-1);
    for (let i = 0; i < n_restricciones; i++) {
        matriz_inicial[i] = new Array(n_variables);
    }
    //Creando la matriz_inicial con los respectivos valores extraídos del modelo
    for (let i = 0; i < n_restricciones; i++) {
        for (let y = 0; y <n_variables; y++) {
            matriz_inicial [i][y] = parseFloat(document.getElementById("num_X"+(y+1)+"_Y"+(i+1)+"").value);
        }   
        // matriz_inicial[i][n_variables] = parseFloat(document.getElementById("num_X"+(i+1)+"").value);     
    }

    // Extrayendo los valores de Bi
    let B_i = new Array(n_restricciones);
    for (let i = 0; i < n_restricciones; i++) {
        B_i[i] = parseFloat(document.getElementById("num_X"+(i+1)+"").value);   
    }

    for (let i = 0; i < B_i.length; i++) {
        let combo_1 = document.getElementById("variables_adicionales"+(i+1));
        let rest_1 = combo_1.options[combo_1.selectedIndex].value;
        
        if (B_i[i] < 0) {
            for (let y = 0; y < n_variables; y++) { 
                auxiliar = matriz_inicial [i][y] * -1;
                matriz_inicial [i][y] = parseFloat(auxiliar);  
            }
            if (rest_1 == "mayor_igual") {
                combo_1.value= "menor_igual";
    
            } else if (rest_1 == "menor_igual") {
                combo_1.value= "mayor_igual";
    
            } else if (rest_1 == "igual") {
                combo_1.value= "mayor_igual";
            }
        }   
    }
    // Si es negativo lo "multiplica por -1"
    for (let i = 0; i < B_i.length; i++) {
        if (B_i[i] < 0) {
            B_i[i] = Math.abs(B_i[i]);   
        }
    }


    //Agregando modelo textual de las variables artificiales que se trabajarán
    for (let i = 0; i < n_restricciones; i++) {
        let combo_1 = document.getElementById("variables_adicionales"+(i+1));
        let rest_1 = combo_1.options[combo_1.selectedIndex].value;

        if (rest_1 == "mayor_igual") {
            variable_s++;
            variable_r++;
            document.getElementById("modelo_textual_1").innerHTML +='<li id="artificial_'+(i+1)+'" style="font-size: 1.2rem; color: aliceblue;"><span>'+'&nbsp&nbsp&nbsp '+(i+1)+'. Tiene signo "≥" (mayor igual) por lo que se restará la variable de exceso S'+variable_s+' y se sumará la variable artificial R'+variable_r+'. </span></li>';
    
        } else if (rest_1 == "menor_igual") {
            variable_h++;
            document.getElementById("modelo_textual_1").innerHTML +='<li id="artificial_'+(i+1)+'" style="font-size: 1.2rem; color: aliceblue;"><span>'+'&nbsp&nbsp&nbsp '+(i+1)+'. Tiene signo "≤" (menor igual) por lo que se agregará la variable de holgura H'+(variable_h)+'. </span></li>';
            
        } else if (rest_1 == "igual") {
            variable_r++;
            document.getElementById("modelo_textual_1").innerHTML +='<li id="artificial_'+(i+1)+'" style="font-size: 1.2rem; color: aliceblue;"><span>'+'&nbsp&nbsp&nbsp '+(i+1)+'. Tiene signo "=" (igual) por lo que se agregará la variable artificial R'+variable_r+'. </span></li>';
            
        }
    }

    for (let i = 0; i < n_restricciones; i++) {
        if (B_i[i] < 0) {
            // se multiplica por -1
            document.getElementById("artificial_"+(i+1)).innerHTML += 'El término independiente era negativo y se multiplicó por -1 a todos los coeficientes de la restricción [cambia de singo: ( ≤ ) a  ( ≥ ) o viceversa, si es ( = ) se mantiente]';
        }   
    }    

    // Contando el número de variables artificiales, de Superavit y Holgura que se agregarán
    let variable_aux = variable_r+ variable_s+variable_h;

    // Creando matriz_aux dinámica con las variables artificiales
    let matriz_aux = new Array(n_restricciones);
    for (let i = 0; i < n_restricciones; i++) {
        matriz_aux[i] = new Array(variable_aux);
    }
    // Rellenando la matriz_aux de ceros para agregar las variables artificales
    for (let i = 0; i < n_restricciones; i++) {
        for (let y = 0; y < variable_aux; y++) {
            matriz_aux[i][y]= 0 ;
        }
    }

    let combo = document.getElementById("objetivo_1");
    let objetivo = combo.options[combo.selectedIndex].text;


    // Reiniciando los contadores
    variable_h = 0; 
    variable_r = 0; 
    variable_s = 0;
    auxiliar = 0;

    // Declarando arreglo que contiene los nombres de las variables(en texto))
    let C_x = new Array();
    let val_Cx = new Array();
    let val_Xb = new Array();


    //Agregando las variables artificiales S y H a la matriz_auxiliar
    for (let i = 0; i < n_restricciones; i++) {
        let combo_1 = document.getElementById("variables_adicionales"+(i+1));
        let rest_1 = combo_1.options[combo_1.selectedIndex].value;

        if (rest_1 == "mayor_igual") {
            matriz_aux [i][auxiliar] = -1;
            auxiliar++;
            variable_s++;
            C_x.push("S"+variable_s);

        }else if (rest_1 == "menor_igual") {
            matriz_aux [i][auxiliar] = 1;  
            auxiliar++;
            variable_h++;
            C_x.push("H"+variable_h);
        }
    }
    //Agregando las variables artificiales R a la matriz_auxiliar 
    for (let i = 0; i < n_restricciones; i++) {
        let combo_1 = document.getElementById("variables_adicionales"+(i+1));
        let rest_1 = combo_1.options[combo_1.selectedIndex].value;

        if (rest_1 == "mayor_igual") { 
            matriz_aux [i][auxiliar] = 1;
            auxiliar++; 
            variable_r++;
            C_x.push("R"+variable_r);  

        }else if (rest_1 == "igual") { 
            matriz_aux [i][auxiliar] = 1;  
            auxiliar++;
            variable_r++;
            C_x.push("R"+variable_r);  
        }
    }
    
    //Agregando los nombres de las variables
    for (let i = n_variables-1; i >= 0; i--) {
        C_x.unshift("X"+(i+1));        
    }
    C_x.push("Bi");

    // Reiniciando los contadores
    variable_h = 0; 
    variable_r = 0; 
    variable_s = 0;
    // Definiendo las variables de la columna C_X numeradas y textuales
    for (let i = 0; i < n_restricciones; i++) {
        for (let y = 0; y < variable_aux; y++) {
            if (matriz_aux[i][y] == 1) {
                if (objetivo == "Maximizar") {
                    if (C_x[y+n_variables].charAt(0) == "R") {
                        val_Cx [i] = -1;
                        variable_r++;
                        val_Xb.push("R"+variable_r);
                    }else if (C_x[y+n_variables].charAt(0) == "H") {
                        val_Cx [i] = 0;
                        variable_h++;
                        val_Xb.push("H"+variable_h);
                    }
                }else if (objetivo == "Minimizar") {
                    if (C_x[y+n_variables].charAt(0) == "R") {
                        val_Cx [i] = 1;
                        variable_r++;
                        val_Xb.push("R"+variable_r);
                    }else if (C_x[y+n_variables].charAt(0) == "H") {
                        val_Cx [i] = 0;
                        variable_h++;
                        val_Xb.push("H"+variable_h);
                    }
                }
            }
        }
    }
    
    //Creando matriz_final para el modelo completo
    auxiliar = n_variables+variable_aux;
    let matriz_final = new Array(n_restricciones-1);
    for (let i = 0; i < n_restricciones; i++) {
        matriz_final[i] = new Array(auxiliar);
    }

    //Creando la matriz_final completa sin Bi
    for (let i = 0; i < n_restricciones; i++) {
        for (let y = 0; y <n_variables; y++) {
            matriz_final [i][y] = matriz_inicial [i][y];
        }    
    }
    for (let i = 0; i < n_restricciones; i++) {
        for (let y = n_variables; y < auxiliar; y++) {
            matriz_final [i][y] = matriz_aux [i][y-n_variables];
        }
    }

    // ENCABEZADO DE LA MATRIZ_FINAL 
    let largo_tabla = C_x.length+2;
    document.getElementById("thead_encabezado").innerHTML += '<tr id="encabezado_1">';
    for (let i = 0; i < largo_tabla; i++) {
        if (i==0) {
            document.getElementById("encabezado_1").innerHTML +='<th class="table-active"></th>';
        }else if (i==1) {
            document.getElementById("encabezado_1").innerHTML +='<th class="table-active">Cj</th>';
        }else if (C_x[i-2].charAt(0) == "R" ) {
            if ( objetivo == "Maximizar"){
                document.getElementById("encabezado_1").innerHTML +='<th>-1</th>';
            }else if (objetivo == "Minimizar") {
                document.getElementById("encabezado_1").innerHTML +='<th>1</th>';
            }
        } else{
            document.getElementById("encabezado_1").innerHTML +='<th>0</th>';
        }        
    } 
    document.getElementById("thead_encabezado").innerHTML +='</tr>';

    document.getElementById("thead_encabezado").innerHTML +='<tr id="encabezado_2" class="table-active">';
    for (let i = 0; i < largo_tabla; i++) {
        if (i==0) {
            document.getElementById("encabezado_2").innerHTML +='<th class="table-active">Cx</th>';
        }else if (i==1) {
            document.getElementById("encabezado_2").innerHTML +='<th class="table-active">Xb</th>';
        }else{
            document.getElementById("encabezado_2").innerHTML +='<th>'+C_x[i-2]+'</th>';
        }
    } 
    document.getElementById("thead_encabezado").innerHTML +='</tr>';

    // BODY - INSERSIÓN DE LA MATRIZ LAS VARIABLES ARTIFICIALES ETC.
    for (let i = 0; i < n_restricciones; i++) {
        document.getElementById("tbody_matriz").innerHTML += '<tr id="tbody_matriz_'+(i+1)+'">';
        document.getElementById('tbody_matriz_'+(i+1)+'').innerHTML +='<th>'+val_Cx[i]+'</th>'; 
        document.getElementById("tbody_matriz").innerHTML +='</tr>'; 
    }
    for (let i = 0; i < n_restricciones; i++) {
        document.getElementById("tbody_matriz").innerHTML += '<tr id="tbody_matriz_'+(i+1)+'">';
        document.getElementById('tbody_matriz_'+(i+1)+'').innerHTML +='<th class="table-active">'+val_Xb[i]+'</th>'; 
        document.getElementById("tbody_matriz").innerHTML +='</tr>'; 
    }

    // INSERTANDO LA MATRIZ_FINAL
    let tam_matriz = n_variables+variable_aux;
    for (let i = 0; i < n_restricciones; i++) {
        document.getElementById("tbody_matriz").innerHTML += '<tr id="tbody_matriz_'+(i+1)+'">';
        for (let y = 0; y < tam_matriz; y++) {
            document.getElementById('tbody_matriz_'+(i+1)+'').innerHTML +='<th>'+matriz_final[i][y]+'</th>';            
        }
        document.getElementById("tbody_matriz").innerHTML +='</tr>';  
    }

    // INSERTANDO LOS BI
    for (let i = 0; i < n_restricciones; i++) {
        document.getElementById("tbody_matriz").innerHTML += '<tr id="tbody_matriz_'+(i+1)+'">';
        document.getElementById('tbody_matriz_'+(i+1)+'').innerHTML +='<th>'+B_i[i]+'</th>';
        document.getElementById("tbody_matriz").innerHTML +='</tr>'; 
    }

    // FOTTER DE LA MATRIZ_FINAL -- pendientes bi
    let val_Z = new Array();
    document.getElementById("tfoot_end").innerHTML += '<tr id="tfoot_end_2">';
    for (let i = 0; i <= largo_tabla; i++) {
        if (i==0) {
            document.getElementById("tfoot_end_2").innerHTML +='<th></th>';
        }else if (i==1) {
            document.getElementById("tfoot_end_2").innerHTML +='<th class="table-active">Z=</th>';

        }else if ( i>2 && i<largo_tabla ){   
            if ( objetivo == "Maximizar" ){
                auxiliar = 0;

                if (C_x[i-3].charAt(0) == "R" ) {
                    for (let y = 0; y < n_restricciones; y++) {
                        auxiliar += (matriz_final[y][i-3] * val_Cx[y]);                    
                    }
                    document.getElementById("tfoot_end_2").innerHTML +='<th>'+(auxiliar-1)+'</th>';
                    val_Z.push(auxiliar-1);
                }else{
                    for (let y = 0; y < n_restricciones; y++) {
                        auxiliar += (matriz_final[y][i-3] * val_Cx[y]);                
                    }
                    document.getElementById("tfoot_end_2").innerHTML +='<th>'+auxiliar+'</th>';
                    val_Z.push(auxiliar);
                }
            }else if (objetivo == "Minimizar") {
                auxiliar = 0;
                if (C_x[i-3].charAt(0) == "R" ) {
                    for (let y = 0; y < n_restricciones; y++) {
                        auxiliar += (matriz_final[y][i-3] * val_Cx[y]);                    
                    }
                    document.getElementById("tfoot_end_2").innerHTML +='<th>'+(auxiliar-1)+'</th>';
                    val_Z.push(auxiliar-1);
                }else{
                    for (let y = 0; y < n_restricciones; y++) {
                        auxiliar += (matriz_final[y][i-3] * val_Cx[y]);                
                    }
                    document.getElementById("tfoot_end_2").innerHTML +='<th>'+auxiliar+'</th>';
                    val_Z.push(auxiliar);
                }
            }        
        }else if(i == largo_tabla) {
            auxiliar = 0;
            for (let y = 0; y < n_restricciones; y++) {
                auxiliar += (B_i[y] * val_Cx[y]);      
            } 
            document.getElementById("tfoot_end_2").innerHTML +='<th>'+auxiliar+'</th>';
            val_Z.push(auxiliar);          
            
        }      
    }
    document.getElementById("tfoot_end").innerHTML +='</tr>';


    // Determinar el elemento Pivote
    let columna_pivote = 0;
    let fila_pivote = 0;

    // Determinando el elemento pivote de la matriz
    let tam_mat = tam_matriz -1;
    if ( objetivo == "Maximizar"){
        let auxi = 0;
        for (let i = 0; i < tam_mat; i++) {
            if (val_Z[i] < auxi) {
                auxi = val_Z[i];
                columna_pivote = i;
            }
        }
        let auxiliar_columna_pivote = new Array();
        for (let i = 0; i < n_restricciones; i++) {
            if (matriz_final[i][columna_pivote] == 0) {
                auxiliar_columna_pivote [i] = 0;  
            }else {
                auxiliar_columna_pivote [i] = B_i[i] / matriz_final[i][columna_pivote]; 
            }
        }
        auxi = 1;
        for (let i = 0; i < n_restricciones; i++) {
            if (auxiliar_columna_pivote[i] <= auxi && auxiliar_columna_pivote[i] != 0) {
                auxi = auxiliar_columna_pivote[i];
                fila_pivote = i;
            }
        }
    }else if (objetivo == "Minimizar"){
        let auxi = 0;
        for (let i = 0; i < tam_mat; i++) {
            if (val_Z[i] > auxi) {
                auxi = val_Z[i];
                columna_pivote = i;
            }
        }
        let auxiliar_columna_pivote = new Array();
        for (let i = 0; i < n_restricciones; i++) {
            if (matriz_final[i][columna_pivote] == 0) {
                auxiliar_columna_pivote [i] = 0;  
            }else {
                auxiliar_columna_pivote [i] = B_i[i] / matriz_final[i][columna_pivote]; 
            }
        }
        auxi = 1;
        for (let i = 0; i < n_restricciones; i++) {
            if (auxiliar_columna_pivote[i] <= auxi && auxiliar_columna_pivote[i] != 0) {
                auxi = auxiliar_columna_pivote[i];
                fila_pivote = i;
            }
        }
    }

    // Variables auxiliares para el problema
    let B_i_auxiliar = new Array(n_restricciones-1);
    auxiliar = n_variables+variable_aux;
    let matriz_final_auxiliar = new Array(n_restricciones-1);
    for (let i = 0; i < n_restricciones; i++) {
        matriz_final_auxiliar[i] = new Array(auxiliar);
    }


    let auxi = 0;
    document.getElementById("primera_fase").innerHTML = '';
    
    // PROGRAMANDO LA PRIMERA FASE
    let validacion_max = 1;
    let validacion_min = 1;

    // if ( objetivo == "Maximizar"){
        
        // verificación para la terminación de la primera fase en minimización       
        auxiliar = 0;     
        if ( objetivo == "Maximizar"){
            if (val_Z[val_Z.length-1] >= 0 ) {
                validacion_max = 1;
                document.getElementById("primera_fase").innerHTML += '<p style="font-size: 1.2rem; color: aliceblue;">Se finalizaron las iteraciones de la primera fase y existe alguna solución posible para el problema. </p> <br>'
            }else if (val_Z[val_Z.length-1] < 0) {
                validacion_max = 0;
                if (auxiliar == 0) {
                    document.getElementById("primera_fase").innerHTML += '<p style="font-size: 1.2rem; color: aliceblue;">Ingresa la variable '+C_x[fila_pivote-1]+' y sale de la base la variable '+val_Xb[fila_pivote]+'. El elemento pivote es '+matriz_final[fila_pivote][columna_pivote]+'. </p> <br>'
                }else{
                    document.getElementById("primera_fase").innerHTML += '<p style="font-size: 1.2rem; color: aliceblue;">Ingresa la variable '+C_x[fila_pivote]+' y sale de la base la variable '+val_Xb[fila_pivote]+'. El elemento pivote es '+matriz_final[fila_pivote][columna_pivote]+'. </p> <br>'
                }
            } 
            auxiliar++; 
        }if ( objetivo == "Minimizar"){
            if (val_Z[val_Z.length-1] <= 0 ) {
                validacion_min = 1;
                document.getElementById("primera_fase").innerHTML += '<p style="font-size: 1.2rem; color: aliceblue;">Se finalizaron las iteraciones de la primera fase y existe alguna solución posible para el problema. </p> <br>'
            }else if (val_Z[val_Z.length-1] > 0) {
                validacion_min = 0;
                if (auxiliar == 0) {
                    document.getElementById("primera_fase").innerHTML += '<p style="font-size: 1.2rem; color: aliceblue;">Ingresa la variable '+C_x[fila_pivote-1]+' y sale de la base la variable '+val_Xb[fila_pivote]+'. El elemento pivote es '+matriz_final[fila_pivote][columna_pivote]+'. </p> <br>'
                }else{
                    document.getElementById("primera_fase").innerHTML += '<p style="font-size: 1.2rem; color: aliceblue;">Ingresa la variable '+C_x[fila_pivote]+' y sale de la base la variable '+val_Xb[fila_pivote]+'. El elemento pivote es '+matriz_final[fila_pivote][columna_pivote]+'. </p> <br>'
                }
            }  
            auxiliar++
        }
        console.log("Valores de Cx fuera de ciclo");
        console.log(C_x);
        

        auxiliar = 0;
        while (validacion_max == 0 || validacion_min == 0) {

            console.log("Valores de Z antes (fase 1)");
            console.log(val_Z);
            
            // Titulo tabla
            document.getElementById("primera_fase").innerHTML += '<center> <br> <h5>Iteración Num. '+(auxiliar+1)+'</h5> <br> </center>';
            
            // tabla numerada por cada iteración de 
            document.getElementById("primera_fase").innerHTML += '<table id="tabla_'+(auxiliar+1)+'" class="table table-light" style="table-layout: fixed !important; border-radius: 8px !important; text-align: center !important; width: auto !important; " >';
            document.getElementById("tabla_"+(auxiliar+1)).innerHTML += '<thead id="thead_encab'+(auxiliar+1)+'"> </thead>';
            document.getElementById("tabla_"+(auxiliar+1)).innerHTML += '<tbody id="tbody_mat'+(auxiliar+1)+'"></tbody>';
            document.getElementById("tabla_"+(auxiliar+1)).innerHTML += '<tfoot id="tfoot_fin'+(auxiliar+1)+'"> </tfoot>';
            document.getElementById("primera_fase").innerHTML += '</table>';

            // largo_tabla = C_x.length+2;
            // Agregando encabezado 1 para cada tabla
            document.getElementById("thead_encab"+(auxiliar+1)).innerHTML += '<tr id="encab_'+(auxiliar+1)+'">';
            for (let i = 0; i < largo_tabla; i++) {
                if (i==0) {
                    document.getElementById("encab_"+(auxiliar+1)).innerHTML +='<th class="table-active"></th>';
                }else if (i==1) {
                    document.getElementById("encab_"+(auxiliar+1)).innerHTML +='<th class="table-active">Cj</th>';
                }else if (C_x[i-2].charAt(0) == "R" ) {
                    // Maximizar (-1) y Minimizar (+1)
                    if ( objetivo == "Maximizar"){
                        document.getElementById("encab_"+(auxiliar+1)).innerHTML +='<th>-1</th>';
                    }if ( objetivo == "Minimizar"){
                        document.getElementById("encab_"+(auxiliar+1)).innerHTML +='<th>1</th>';
                    }                    
                } else{
                    document.getElementById("encab_"+(auxiliar+1)).innerHTML +='<th>0</th>';
                }        
            } 
            document.getElementById("thead_encab"+(auxiliar+1)).innerHTML +='</tr>';
            
            // Agregando encabezado 2
            document.getElementById("thead_encab"+(auxiliar+1)).innerHTML +='<tr id="encab_0'+(auxiliar+1)+'" class="table-active">';
            for (let i = 0; i < largo_tabla; i++) {
                if (i==0) {
                    document.getElementById("encab_0"+(auxiliar+1)).innerHTML +='<th class="table-active">Cx</th>';
                }else if (i==1) {
                    document.getElementById("encab_0"+(auxiliar+1)).innerHTML +='<th class="table-active">Xb</th>';
                }else{
                    document.getElementById("encab_0"+(auxiliar+1)).innerHTML +='<th>'+C_x[i-2]+'</th>';
                }
            } 
            document.getElementById("thead_encab"+(auxiliar+1)).innerHTML +='</tr>';

            // BODY - Ingresando la nueva variable y sacando la antigua de la base
            val_Xb[fila_pivote] = C_x[columna_pivote];
            if (val_Xb[fila_pivote].charAt(0) == "R" ) { 
                if ( objetivo == "Maximizar"){
                    val_Cx[fila_pivote] = -1;
                }if ( objetivo == "Minimizar"){
                    val_Cx[fila_pivote] = 1;
                }                
            }else{
                val_Cx[fila_pivote] = 0;
            }
            
            // Ingresando columna C_X y columna de Xb
            for (let i = 0; i < n_restricciones; i++) {
                document.getElementById("tbody_mat"+(auxiliar+1)).innerHTML += '<tr id="tbody_m_'+(i+1)+'_'+(auxiliar+1)+'">';
                document.getElementById('tbody_m_'+(i+1)+'_'+(auxiliar+1)).innerHTML +='<th>'+val_Cx[i]+'</th>'; 
                document.getElementById("tbody_mat"+(auxiliar+1)).innerHTML +='</tr>'; 
            }
            for (let i = 0; i < n_restricciones; i++) {
                document.getElementById("tbody_mat"+(auxiliar+1)).innerHTML += '<tr id="tbody_m_'+(i+1)+'_'+(auxiliar+1)+'">';
                document.getElementById('tbody_m_'+(i+1)+'_'+(auxiliar+1)).innerHTML +='<th class="table-active">'+val_Xb[i]+'</th>'; 
                document.getElementById("tbody_mat"+(auxiliar+1)).innerHTML +='</tr>'; 
            }

            // INSERTANDO LA MATRIZ_FINAL
            tam_matriz = n_variables+variable_aux;
            for (let i = 0; i < n_restricciones; i++) {
                for (let y = 0; y < tam_matriz; y++) {
                    if (i == fila_pivote) {
                        if (matriz_final[i][y] == 0) {
                            matriz_final_auxiliar [i][y] = 0; 
                        }else if(matriz_final[i][y] != 0){ 
                            matriz_final_auxiliar[i][y] = matriz_final[i][y] * (1 / matriz_final[fila_pivote][columna_pivote]);
                        }
                    }
                }       
            }
            for (let i = 0; i < n_restricciones; i++) {
                for (let y = 0; y < tam_matriz; y++) {
                    if (i != fila_pivote) { 
                        if (matriz_final[i][columna_pivote] == 0) {
                            matriz_final_auxiliar[i][y] = (matriz_final_auxiliar[fila_pivote][y] * matriz_final[i][columna_pivote])+ matriz_final[i][y];
                        }else {
                            
                            if ( objetivo == "Maximizar"){
                                matriz_final_auxiliar[i][y] = (matriz_final_auxiliar[fila_pivote][y] * -matriz_final[i][columna_pivote])+ matriz_final[i][y];
                            }if ( objetivo == "Minimizar"){
                                matriz_final_auxiliar[i][y] = (matriz_final_auxiliar[fila_pivote][y] * matriz_final[i][columna_pivote])+ matriz_final[i][y];
                            }
                            
                        }
                    }
                }    
            }
            // INSERTANDO LA MATRIZ_FINAL_AUXILIAR
            for (let i = 0; i < n_restricciones; i++) {
                document.getElementById("tbody_mat"+(auxiliar+1)).innerHTML += '<tr id="tbody_m_'+(i+1)+'_'+(auxiliar+1)+'">';
                for (let y = 0; y < tam_matriz; y++) {
                    if (Number.isInteger(matriz_final_auxiliar[i][y])) {
                        auxi = matriz_final_auxiliar[i][y];
                        document.getElementById('tbody_m_'+(i+1)+'_'+(auxiliar+1)).innerHTML +='<th>'+auxi+'</th>';
                    }else{
                        document.getElementById('tbody_m_'+(i+1)+'_'+(auxiliar+1)).innerHTML +='<th>'+matriz_final_auxiliar[i][y].toFixed(2)+'</th>';
                    }
                }
                document.getElementById("tbody_mat"+(auxiliar+1)).innerHTML +='</tr>';  
            }

            // INSERTANDO LOS BI - primero la fila piv y después las demás
            for (let i = 0; i < n_restricciones; i++) {
                if (i == fila_pivote) {
                    if (B_i[i]== 0) {
                        B_i_auxiliar [i]= 0; 
                    }else if(B_i[i] != 0){ 
                        B_i_auxiliar[i] = B_i[i] * (1 / matriz_final[fila_pivote][columna_pivote]);
                    }
                }
            }
            for (let i = 0; i < n_restricciones; i++) {
                if (i != fila_pivote) { 
                    if (matriz_final[i][columna_pivote] == 0) {
                        B_i_auxiliar[i] = B_i[i];
                    }else {
                        
                    if ( objetivo == "Maximizar"){
                        B_i_auxiliar[i] = parseFloat((B_i_auxiliar[fila_pivote] * -matriz_final[i][columna_pivote]) + B_i[i]) ;
                    }if ( objetivo == "Minimizar"){
                        B_i_auxiliar[i] = parseFloat((B_i_auxiliar[fila_pivote] * matriz_final[i][columna_pivote]) + B_i[i]) ;
                    }
                        
                    }
                }
            }
            console.log("Valores de B_i en primera fase");
            console.log(B_i);
            

            // Insertando los B_i a la tabla
            for (let i = 0; i < n_restricciones; i++) {
                document.getElementById("tbody_mat"+(auxiliar+1)).innerHTML += '<tr id="tbody_m_'+(i+1)+'_'+(auxiliar+1)+'">';
                if (Number.isInteger(B_i_auxiliar[i])) {
                    auxi = B_i_auxiliar[i];
                    document.getElementById('tbody_m_'+(i+1)+'_'+(auxiliar+1)).innerHTML +='<th>'+auxi+'</th>';
                }else{
                    document.getElementById('tbody_m_'+(i+1)+'_'+(auxiliar+1)).innerHTML +='<th>'+B_i_auxiliar[i].toFixed(2)+'</th>';
                }
                document.getElementById("tbody_mat"+(auxiliar+1)).innerHTML +='</tr>'; 
            } 

            // INSERTANDO FOTTER DE PRIMERA FASE
            for (let i = 0; i < n_restricciones; i++) {
                document.getElementById('tfoot_fin'+(auxiliar+1)).innerHTML += '<tr id="tfoot_fin_'+(auxiliar+1)+'">';
                document.getElementById('tfoot_fin'+(auxiliar+1)).innerHTML +='</tr>';
            }   
            for (let i = 0; i <= largo_tabla; i++) {
                if (i==0) {
                    document.getElementById('tfoot_fin_'+(auxiliar+1)).innerHTML +='<th></th>';
                }else if (i==1) {
                    document.getElementById('tfoot_fin_'+(auxiliar+1)).innerHTML +='<th class="table-active">Z=</th>';
                }else if ( i>2 && i<largo_tabla ){   
                    auxi = 0;

                    if (C_x[i-3].charAt(0) == "R" ) {
                        for (let y = 0; y < n_restricciones; y++) {
                            auxi += (matriz_final_auxiliar[y][i-3] * val_Cx[y]);                    
                        }
                        document.getElementById('tfoot_fin_'+(auxiliar+1)).innerHTML +='<th>'+(auxi-1)+'</th>';
                        val_Z[i-3] = auxi;
                    }else{
                        for (let y = 0; y < n_restricciones; y++) {
                            auxi += (matriz_final_auxiliar[y][i-3] * val_Cx[y]);                
                        }
                        document.getElementById('tfoot_fin_'+(auxiliar+1)).innerHTML +='<th>'+auxi+'</th>';
                        val_Z[i-3] = auxi;
                    }    
                }else if(i == largo_tabla) {
                    auxi = 0;
                    for (let y = 0; y < n_restricciones; y++) {
                        auxi += (B_i_auxiliar[y] * val_Cx[y]);      
                    } 
                    document.getElementById('tfoot_fin_'+(auxiliar+1)).innerHTML +='<th>'+auxi+'</th>';
                    val_Z[i-3] = auxi;          
                    
                } 
            }

            // Los valores actuales pasan a ser los valores actiales de la MATRIZ_FINAL
            auxi =  n_variables+variable_aux;;
            for (let i = 0; i < n_restricciones; i++) {
                B_i[i] = B_i_auxiliar[i];
                for (let y = 0; y < tam_matriz; y++) {
                    matriz_final[i][y] = matriz_final_auxiliar[i][y];
                }                
            }
            // let tam_mat = tam_matriz -1;
            // Determinando el nuevo elemento pivote
            if ( objetivo == "Maximizar"){
                let auxi = 0;
                for (let i = 0; i < tam_mat; i++) {
                    if (val_Z[i] < auxi) {
                        auxi = val_Z[i];
                        columna_pivote = i;
                    }
                }
                let auxiliar_columna_pivote = new Array();
                for (let i = 0; i < n_restricciones; i++) {
                    if (matriz_final[i][columna_pivote] == 0) {
                        auxiliar_columna_pivote [i] = 0;  
                    }else {
                        auxiliar_columna_pivote [i] = B_i[i] / matriz_final[i][columna_pivote]; 
                    }
                }
                auxi = 1;
                for (let i = 0; i < n_restricciones; i++) {
                    if (auxiliar_columna_pivote[i] <= auxi && auxiliar_columna_pivote[i] != 0) {
                        auxi = auxiliar_columna_pivote[i];
                        fila_pivote = i;
                    }
                }
        
            }else if (objetivo == "Minimizar"){
                let auxi = 0;
                for (let i = 0; i < tam_mat; i++) {
                    if (val_Z[i] > auxi) {
                        auxi = val_Z[i];
                        columna_pivote = i;
                    }
                }
                let auxiliar_columna_pivote = new Array();
                for (let i = 0; i < n_restricciones; i++) {
                    if (matriz_final[i][columna_pivote] == 0) {
                        auxiliar_columna_pivote [i] = 0;  
                    }else {
                        auxiliar_columna_pivote [i] = B_i[i] / matriz_final[i][columna_pivote]; 
                    }
                }
                auxi = 1;
                for (let i = 0; i < n_restricciones; i++) {
                    if (auxiliar_columna_pivote[i] <= auxi && auxiliar_columna_pivote[i] != 0) {
                        auxi = auxiliar_columna_pivote[i];
                        fila_pivote = i;
                    }
                }
            }

            // Aumentando el número de iteraciones de la fase
            auxiliar++;

            // verificación para la terminación de la primera fase en minimización            
            if ( objetivo == "Maximizar"){
                if (val_Z[val_Z.length-1] >= 0) {
                    validacion_max = 1;
                    document.getElementById("primera_fase").innerHTML += '<p style="font-size: 1.2rem; color: aliceblue;">Se finalizaron las iteraciones de la primera fase y existe alguna solución posible para el problema. </p> <br>'
                }else if (val_Z[val_Z.length-1] < 0) {
                    validacion_max = 0;
                    document.getElementById("primera_fase").innerHTML += '<p style="font-size: 1.2rem; color: aliceblue;">Ingresa la variable '+C_x[fila_pivote]+' y sale de la base la variable '+val_Xb[fila_pivote]+'. El elemento pivote es '+matriz_final[fila_pivote][columna_pivote]+'. </p> <br>'
                }  
            }if ( objetivo == "Minimizar"){
                if (val_Z[val_Z.length-1] <= 0) {
                    validacion_min = 1;
                    document.getElementById("primera_fase").innerHTML += '<p style="font-size: 1.2rem; color: aliceblue;">Se finalizaron las iteraciones de la primera fase y existe alguna solución posible para el problema. </p> <br>'
                }else if (val_Z[val_Z.length-1] > 0) {
                    validacion_min = 0;
                    document.getElementById("primera_fase").innerHTML += '<p style="font-size: 1.2rem; color: aliceblue;">Ingresa la variable '+C_x[fila_pivote]+' y sale de la base la variable '+val_Xb[fila_pivote]+'. El elemento pivote es '+matriz_final[fila_pivote][columna_pivote]+'. </p> <br>'
                }  
            }
                                  
            // }
            
            console.log("Valores de Z después (fase 1)");
            console.log(val_Z);
            console.log("Validación (1:stop  - 0:sigue): "+validacion_max+" -> con z="+val_Z[val_Z.length-1]);
        }
        
    
    
    
    
    // if ( objetivo == "Maximizar"){
        // while
    // }else if (objetivo == "Minimizar") {
        // whille
    // }

    // Tabla matriz_inicial segunda fase para max y min

    // Segunda fase solo para maximizar - nada más 
    
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

