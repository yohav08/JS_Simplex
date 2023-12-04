


function Generar_simplex(){

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
    let auxi = 0;

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
            if (Number.isInteger(matriz_final[i][y])) {
                auxi = matriz_final[i][y];
                document.getElementById('tbody_matriz_'+(i+1)+'').innerHTML +='<th>'+auxi+'</th>'; 
            }else{
                document.getElementById('tbody_2F_'+(i+1)+'').innerHTML +='<th>'+matriz_final[i][y].toFixed(2)+'</th>';
            }
                       
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
            if (val_Z[i] < auxi && val_Z[i]!=0) {
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
            if (val_Z[i] > auxi && val_Z[i]!=0) {
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

    document.getElementById("primera_fase").innerHTML = '';
    
    // PROGRAMANDO LA PRIMERA FASE
    let validacion_max = 1;
    let validacion_min = 1;

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
    // console.log("Valores de Cx fuera de ciclo");
    console.log(C_x);
    
    auxi = 0, auxiliar = 0;
    console.log("----ITERACIONES DE SIMPLEX EN SU PRIMERA FASE----");
    while (validacion_max == 0 || validacion_min == 0) {

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
        // console.log("Valores de B_i en primera fase");
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
                    if (Number.isInteger(auxi)) {
                        document.getElementById('tfoot_fin_'+(auxiliar+1)).innerHTML +='<th>'+(auxi-1)+'</th>';
                    }else{
                        document.getElementById('tfoot_fin_'+(auxiliar+1)).innerHTML +='<th>'+(auxi-1).toFixed(2)+'</th>';
                    }  
                    
                    val_Z[i-3] = auxi;
                }else{
                    for (let y = 0; y < n_restricciones; y++) {
                        auxi += (matriz_final_auxiliar[y][i-3] * val_Cx[y]);                
                    }
                    if (Number.isInteger(auxi)) {
                        document.getElementById('tfoot_fin_'+(auxiliar+1)).innerHTML +='<th>'+auxi+'</th>';
                    }else{
                        document.getElementById('tfoot_fin_'+(auxiliar+1)).innerHTML +='<th>'+auxi.toFixed(2)+'</th>';
                    }  
                    val_Z[i-3] = auxi;
                }    
            }else if(i == largo_tabla) {
                auxi = 0;
                for (let y = 0; y < n_restricciones; y++) {
                    auxi += (B_i_auxiliar[y] * val_Cx[y]);      
                } 
                if (Number.isInteger(auxi)) {
                    document.getElementById('tfoot_fin_'+(auxiliar+1)).innerHTML +='<th>'+auxi+'</th>';
                }else{
                    document.getElementById('tfoot_fin_'+(auxiliar+1)).innerHTML +='<th>'+auxi.toFixed(2)+'</th>';
                }                
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
            auxi = 0;
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
            auxi = 0;
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
        
        // console.log("Valores de Z después (fase 1)");
        console.log(val_Z);
        console.log("Validación (1:stop  - 0:sigue): "+validacion_max+" -> con z="+val_Z[val_Z.length-1]);

    
    }

    // MATRIZ INICIAL SEGUNDA FASE 
    console.log("----INICIAL DE SIMPLEX EN SU SEGUNDA FASE----");
    // Titulo tabla
    document.getElementById("mat_segunda").innerHTML = '';
    document.getElementById("mat_segunda").innerHTML += '<center> <h5>Matriz Inicial <u>Segunda fase</u></h5> <br> </center>';
    document.getElementById("mat_segunda").innerHTML += '<table id="tabla_2F" class="table table-light" style="table-layout: fixed !important; border-radius: 8px !important; text-align: center !important; width: auto !important; " >';
    document.getElementById("tabla_2F").innerHTML += '<thead id="thead_encab_2F"> </thead>';
    document.getElementById("tabla_2F").innerHTML += '<tbody id="tbody_mat_2F"></tbody>';
    document.getElementById("tabla_2F").innerHTML += '<tfoot id="tfoot_fin_2F"> </tfoot>';
    document.getElementById("mat_segunda").innerHTML += '</table>';
    
    // Creando función con los datos del modelo
    auxi = largo_tabla-(n_variables+variable_r);
    let funcion = new Array(auxi);
    for (let i = 0; i < auxi; i++) {
        if (i < n_variables){
            funcion [i] = parseFloat(document.getElementById("fun_X"+(i+1)).value) ;
        }else {
            funcion [i] = 0;
        }   
    }
    // ELIMINANDO LOS VALORES DE LA MATRIZ DONDE HAYA COLUMNAS CON R
    tam_matriz = n_variables+variable_aux;
    for (let i = 0; i < n_restricciones; i++) { 
        for (let y = tam_matriz-1; y >= 0; y--) {   
            if (C_x[y].charAt(0) == 'R' ) {
                matriz_final[i].splice(y, 1);
            }
        }
    }
    // console.log("MATRIZ INICIAL SEGUNDA FASE");
    console.log(matriz_final);

    // ELIMINANDO LOS Ri DEL ARREGLO
    for (let i = C_x.length-1; i >= 0; i--) {
        if (C_x[i].charAt(0) == 'R' ) {
            C_x.splice(i, 1);
        }
    }

    // Encabezado eliminando las R's
    auxi = largo_tabla-variable_r;
    document.getElementById("thead_encab_2F").innerHTML += '<tr id="en_1">';
    for (let i = 0; i <= auxi; i++) {
        if (i==0) {
            document.getElementById("en_1").innerHTML +='<th class="table-active"></th>';
        }else if (i==1) {
            document.getElementById("en_1").innerHTML +='<th class="table-active">Cj</th>';
        }else if ( i<auxi && i>1 ) {
            document.getElementById("en_1").innerHTML +='<th>'+funcion[i-2]+'</th>';
        }          
    } 
    document.getElementById("thead_encab_2F").innerHTML +='</tr>';
    document.getElementById("thead_encab_2F").innerHTML +='<tr id="en_2" class="table-active">';
    for (let i = 0; i < auxi; i++) {
        if (i==0) {
            document.getElementById("en_2").innerHTML +='<th class="table-active">Cx</th>';
        }else if (i==1) {
            document.getElementById("en_2").innerHTML +='<th class="table-active">Xb</th>';
        }else{
            document.getElementById("en_2").innerHTML +='<th>'+C_x[i-2]+'</th>';
        }
    } 
    document.getElementById("thead_encab_2F").innerHTML +='</tr>';

    // reemplazando los valores de la columna C_X
    auxiliar = 0;
    for (let i = 0; i < n_restricciones; i++) {
        if (val_Xb[i] == "X"+(auxiliar+1) ) { 
            for (let y = 0; y < C_x.length; y++) {
                if (C_x[y] == val_Xb[i] ) {
                    val_Cx[i] = funcion[auxiliar];
                }
            } 
            auxiliar ++;
        }        
    }

    // BODY - COLUMNA DE LOS Cx y los xb
    for (let i = 0; i < n_restricciones; i++) {
        document.getElementById("tbody_mat_2F").innerHTML += '<tr id="tbody_2F_'+(i+1)+'">';
        document.getElementById('tbody_2F_'+(i+1)+'').innerHTML +='<th>'+val_Cx[i]+'</th>'; 
        document.getElementById("tbody_mat_2F").innerHTML +='</tr>'; 
    }
    for (let i = 0; i < n_restricciones; i++) {
        document.getElementById("tbody_mat_2F").innerHTML += '<tr id="tbody_2F_'+(i+1)+'">';
        document.getElementById('tbody_2F_'+(i+1)+'').innerHTML +='<th class="table-active">'+val_Xb[i]+'</th>'; 
        document.getElementById("tbody_mat_2F").innerHTML +='</tr>'; 
    }

    // INSERTANDO LA MATRIZ_FINAL
    tam_matriz = n_variables+variable_aux-variable_r;
    for (let i = 0; i < n_restricciones; i++) {
        document.getElementById("tbody_mat_2F").innerHTML += '<tr id="tbody_2F_'+(i+1)+'">';
        for (let y = 0; y < tam_matriz; y++) {
            if (Number.isInteger(matriz_final[i][y])) {
                auxi = matriz_final[i][y];
                document.getElementById('tbody_2F_'+(i+1)+'').innerHTML +='<th>'+auxi+'</th>';
            }else{
                document.getElementById('tbody_2F_'+(i+1)+'').innerHTML +='<th>'+matriz_final[i][y].toFixed(2)+'</th>';
            }
        }
        document.getElementById("tbody_mat_2F").innerHTML +='</tr>';  
    }

    // INSERTANDO LOS BI
    for (let i = 0; i < n_restricciones; i++) {
        document.getElementById("tbody_mat_2F").innerHTML += '<tr id="tbody_2F_'+(i+1)+'">';
        if (Number.isInteger(B_i[i])) {
            document.getElementById('tbody_2F_'+(i+1)+'').innerHTML +='<th>'+B_i[i]+'</th>';
        }else{
            document.getElementById('tbody_2F_'+(i+1)+'').innerHTML +='<th>'+B_i[i].toFixed(2)+'</th>';
        }
        document.getElementById("tbody_mat_2F").innerHTML +='</tr>'; 
    }

    // FOTTER DE LA MATRIZ_FINAL -- pendientes bi
    for (let i = 0; i < variable_r; i++) {
        val_Z.pop();
    }
    // hallando los nuevos valores de Z
    for (let i = 0; i <= tam_matriz; i++) {
        if (i<tam_matriz ){ 
            auxiliar = 0;
            for (let y = 0; y < n_restricciones; y++) {
                auxiliar += (matriz_final[y][i] * val_Cx[y]);                    
            }
            val_Z[i] = auxiliar-funcion[i];      
        } else if(i == tam_matriz) {
            auxiliar = 0;
            for (let y = 0; y < n_restricciones; y++) {
                auxiliar += (B_i[y] * val_Cx[y]);      
            } 
            val_Z[i] = auxiliar;  
        }   
    }  
    document.getElementById("tfoot_fin_2F").innerHTML += '<tr id="tfoot__2F">'; 
        document.getElementById("tfoot__2F").innerHTML +='<th></th>';
        document.getElementById("tfoot__2F").innerHTML +='<th class="table-active">Z=</th>';
        for (let i = 0; i <= tam_matriz; i++) {
            if (Number.isInteger(val_Z[i])) {
                document.getElementById("tfoot__2F").innerHTML +='<th>'+val_Z[i]+'</th>';   
            }else{
                document.getElementById("tfoot__2F").innerHTML +='<th>'+val_Z[i].toFixed(2)+'</th>';    
            }
        }
    document.getElementById("tfoot_fin_2F").innerHTML +='</tr>';
    
    // vaciando la matriz auxiliar 
    tam_mat = n_variables+variable_aux;
    for (let i = 0; i < n_restricciones; i++) {
        for (let y = 0; y < auxiliar; y++) {
            matriz_final_auxiliar[i].shift();;    
        }
    }
    tam_mat = n_variables+variable_aux-variable_r;
    // Asignando los valores de la matriz  final a la matriz auxiliar
    for (let i = 0; i < n_restricciones; i++) {
        for (let y = 0; y < auxiliar; y++) {
            matriz_final_auxiliar[i][y] = matriz_final[i][y];    
        }
    }

    console.log ("Valores (Z, Cx, Xb, val_cx)");
    console.log (C_x);
    console.log (val_Z);
    console.log (val_Xb);
    console.log (val_Cx);

    // Verificar la fila y columna pivote 
    tam_mat = n_variables+variable_aux-variable_r-1;
    if ( objetivo == "Maximizar"){
        let auxi = 0;
        for (let i = 0; i < tam_mat; i++) {
            if (val_Z[i] < auxi &&  val_Z[i] != 0) {
                auxi = val_Z[i];
                columna_pivote = i;
            }
        }
        let auxiliar_columna_pivote = new Array();
        for (let i = 0; i < n_restricciones; i++) {
            if (matriz_final[i][columna_pivote] == 0) {
                auxiliar_columna_pivote [i] = 0;  
            }else {
                // auxiliar_columna_pivote [i] = B_i[i] / matriz_final[i][columna_pivote].toFixed(2); 
                auxiliar_columna_pivote [i] = (B_i[i] / matriz_final[i][columna_pivote]);
                // console.log("aux: "+auxiliar_columna_pivote[i]);
            }
        }
        auxi = 0;
        for (let i = n_restricciones; i >=0; i--) {
            if (auxiliar_columna_pivote[i] > auxi) {
                auxi = auxiliar_columna_pivote[i];
                fila_pivote = i;

            }
        }
    }
    
    validacion_max = 1;

    // verificación para la terminación de la segunda fase en maximización 
    // solucion_textual += '<p style="font-size: 1.2rem; color: aliceblue;">';
    auxiliar = 0;
    if ( objetivo == "Maximizar"){
        for (let i = 0; i < val_Z.length; i++) {
            if (val_Z[i] >= 0 ) {
                validacion_max = 1;
            }else if (val_Z[i] < 0) {
                validacion_max = 0;
                break;
            } 
        }
    }
    let solucion_textual = '';
    

    // Validando 
    if ( objetivo == "Maximizar"){
        if (validacion_max == 1 ) {
            document.getElementById("mat_segunda").innerHTML += '<p style="font-size: 1.2rem; color: aliceblue;"> La solución óptima es Z = '+val_Z[val_Z.length-1]+' <br>( -';
            for (let i = 0; i < val_Z.length; i++) {
                solucion_textual += val_Z[i]+ ' = ' + funcion[i] + '-';
            }
            document.getElementById("mat_segunda").innerHTML += solucion_textual+')</p> <br>'
        }else if (validacion_max == 0) {
            // if (auxiliar == 0) {
                document.getElementById("mat_segunda").innerHTML += '<p style="font-size: 1.2rem; color: aliceblue;">Ingresa la variable '+C_x[fila_pivote]+' y sale de la base la variable '+val_Xb[fila_pivote]+'. El elemento pivote es '+matriz_final[fila_pivote][columna_pivote]+'. </p> <br>'
            // }else{
            //     document.getElementById("mat_segunda").innerHTML += '<p style="font-size: 1.2rem; color: aliceblue;">Ingresa la variable '+C_x[fila_pivote]+' y sale de la base la variable '+val_Xb[fila_pivote]+'. El elemento pivote es '+matriz_final[fila_pivote][columna_pivote]+'. </p> <br>'
            // }
        } 
        console.log (C_x[fila_pivote-1])
    }
    // Determinar Fila pivote y columna pivote nuevamente

    document.getElementById("segunda_fase").innerHTML = '';

    // PROGRAMANDO LA SEGUNDA FASE 

    let matriz_final_auxiliar_2 = new Array(n_restricciones);
    for (let i = 0; i < n_restricciones; i++) {
        matriz_final_auxiliar_2[i] = new Array(tam_matriz);
    }
    for (let i = 0; i < n_restricciones; i++) {
        for (let y = 0; y < tam_matriz; y++) {
            matriz_final_auxiliar_2[i][y] = matriz_final[i][y];
        }
    }
    
    console.log(matriz_final);    
    console.log(C_x);

    console.log("----ITERACIONES DE SIMPLEX EN SU _SEGUNDA_ FASE----");

    
    // console.log("Valores de Cx fuera de ciclo");


    auxi = 0, auxiliar = 0;
    while (validacion_max == 0) {
        console.log(val_Z);
        
        
        // Titulo tabla
        document.getElementById("segunda_fase").innerHTML += '<center> <br> <h5>Iteración Num. '+(auxiliar+1)+'</h5> <br> </center>';
        
        // tabla numerada por cada iteración de 
        document.getElementById("segunda_fase").innerHTML += '<table id="tabla_2f_'+(auxiliar+1)+'" class="table table-light" style="table-layout: fixed !important; border-radius: 8px !important; text-align: center !important; width: auto !important; " >';
        document.getElementById("tabla_2f_"+(auxiliar+1)).innerHTML += '<thead id="thead2F_en'+(auxiliar+1)+'"> </thead>';
        document.getElementById("tabla_2f_"+(auxiliar+1)).innerHTML += '<tbody id="tbody2F_sim'+(auxiliar+1)+'"></tbody>';
        document.getElementById("tabla_2f_"+(auxiliar+1)).innerHTML += '<tfoot id="tfoot2F_fin'+(auxiliar+1)+'"> </tfoot>';
        document.getElementById("segunda_fase").innerHTML += '</table>';


        // Primer encabezado
        
        tam_mat = n_variables+variable_aux-variable_r+3;
        document.getElementById("thead2F_en"+(auxiliar+1)).innerHTML += '<tr id="1encab_'+(auxiliar+1)+'">';
        for (let i = 0; i < tam_mat; i++) {
            if (i==0) {
                document.getElementById("1encab_"+(auxiliar+1)).innerHTML +='<th class="table-active"></th>';
            }else if (i==1) {
                document.getElementById("1encab_"+(auxiliar+1)).innerHTML +='<th class="table-active">Cj</th>';
            }else {
                document.getElementById("1encab_"+(auxiliar+1)).innerHTML +='<th>'+funcion[i-2]+'</th>';
            }     
        } 
        document.getElementById("thead2F_en"+(auxiliar+1)).innerHTML +='</tr>';
        // Agregando encabezado 2
        document.getElementById("thead2F_en"+(auxiliar+1)).innerHTML +='<tr id="2encab_'+(auxiliar+1)+'" class="table-active">';
        for (let i = 0; i < tam_mat; i++) {
            if (i==0) {
                document.getElementById("2encab_"+(auxiliar+1)).innerHTML +='<th class="table-active">Cx</th>';
            }else if (i==1) {
                document.getElementById("2encab_"+(auxiliar+1)).innerHTML +='<th class="table-active">Xb</th>';
            }else{
                document.getElementById("2encab_"+(auxiliar+1)).innerHTML +='<th>'+C_x[i-2]+'</th>';
            }
        } 
        document.getElementById("thead2F_en"+(auxiliar+1)).innerHTML +='</tr>';

        // BODY - Ingresando la nueva variable y sacando la antigua de la base
        val_Xb[fila_pivote] = C_x[columna_pivote];
        val_Cx[fila_pivote] = funcion[columna_pivote];        

        for (let i = 0; i < n_restricciones; i++) {
            if (val_Xb[i] == "X"+(auxi+1) ) { 
                for (let y = 0; y < C_x.length; y++) {
                    if (C_x[y] == val_Xb[i] ) {
                        val_Cx[i] = funcion[auxi];
                    }
                } 
                auxi ++;
            }        
        }
    
        // BODY - COLUMNA DE LOS Cx y los xb
        for (let i = 0; i < n_restricciones; i++) {
            document.getElementById("tbody2F_sim"+(auxiliar+1)).innerHTML += '<tr id="tbody_sim2F_'+(i+1)+'_'+(auxiliar+1)+'">';
            document.getElementById('tbody_sim2F_'+(i+1)+'_'+(auxiliar+1)).innerHTML +='<th>'+val_Cx[i]+'</th>'; 
            document.getElementById("tbody2F_sim"+(auxiliar+1)).innerHTML +='</tr>'; 
        }
        for (let i = 0; i < n_restricciones; i++) {
            document.getElementById("tbody2F_sim"+(auxiliar+1)).innerHTML += '<tr id="tbody_sim2F_'+(i+1)+'_'+(auxiliar+1)+'">';
            document.getElementById('tbody_sim2F_'+(i+1)+'_'+(auxiliar+1)).innerHTML +='<th class="table-active">'+val_Xb[i]+'</th>'; 
            document.getElementById("tbody2F_sim"+(auxiliar+1)).innerHTML +='</tr>'; 
        }

        // INSERTANDO LA MATRIZ_FINAL
        tam_mat = n_variables+variable_aux-variable_r;
        matriz_final[fila_pivote][columna_pivote] = 1;
        for (let i = 0; i < n_restricciones; i++) {
            for (let y = 0; y < tam_mat; y++) {
                if (i == fila_pivote) {
                    if (matriz_final[i][y] == 0) {
                        matriz_final_auxiliar_2[i][y] = 0; 
                        
                    }else if(matriz_final[i][y] != 0){ 
                        matriz_final_auxiliar_2[i][y] = matriz_final[i][y] * (1 / matriz_final[fila_pivote][columna_pivote]);
                        // console.log(matriz_final[i][y]+" * (1/"+ matriz_final[fila_pivote][columna_pivote]+"");
                    }
                }
            }       
        }
        for (let i = 0; i < n_restricciones; i++) {
            for (let y = 0; y < tam_mat; y++) {
                if (i != fila_pivote) { 
                    if (matriz_final[i][columna_pivote] == 0) {
                        matriz_final_auxiliar_2[i][y] = (matriz_final_auxiliar_2[fila_pivote][y] * matriz_final[i][columna_pivote])+ matriz_final[i][y];
                    }else {
                        matriz_final_auxiliar_2[i][y] = (matriz_final_auxiliar_2[fila_pivote][y] * -matriz_final[i][columna_pivote])+ matriz_final[i][y];
                    }
                }
            }    
        }
        // INSERTANDO LA MATRIZ_FINAL_AUXILIAR
        for (let i = 0; i < n_restricciones; i++) {
            document.getElementById("tbody2F_sim"+(auxiliar+1)).innerHTML += '<tr id="tbody_sim2F_'+(i+1)+'_'+(auxiliar+1)+'">';
            for (let y = 0; y < tam_mat; y++) {
                if (Number.isInteger(matriz_final_auxiliar_2[i][y])) {
                    auxi = matriz_final_auxiliar_2[i][y];
                    document.getElementById('tbody_sim2F_'+(i+1)+'_'+(auxiliar+1)).innerHTML +='<th>'+auxi+'</th>';
                }else{
                    document.getElementById('tbody_sim2F_'+(i+1)+'_'+(auxiliar+1)).innerHTML +='<th>'+matriz_final_auxiliar_2[i][y].toFixed(2)+'</th>';
                }
            }
            document.getElementById("tbody2F_sim"+(auxiliar+1)).innerHTML +='</tr>';  
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
        

        tam_mat = n_variables+variable_aux-variable_r  
        for (let i = 0; i < n_restricciones; i++) {
            for (let y = 0; y < tam_mat; y++) {
                matriz_final[i][y] = matriz_final_auxiliar[i][y];
            }                
            B_i[i] = B_i_auxiliar[i];
        }

        // console.log("Valores de B_i en segunda fase");
        console.log(B_i);
        
        // Insertando los B_i a la tabla
        for (let i = 0; i < n_restricciones; i++) {
            document.getElementById("tbody2F_sim"+(auxiliar+1)).innerHTML += '<tr id="tbody_sim2F_'+(i+1)+'_'+(auxiliar+1)+'">';
            if (Number.isInteger(B_i_auxiliar[i])) {
                auxi = B_i_auxiliar[i];
                document.getElementById('tbody_sim2F_'+(i+1)+'_'+(auxiliar+1)).innerHTML +='<th>'+auxi+'</th>';
            }else{
                document.getElementById('tbody_sim2F_'+(i+1)+'_'+(auxiliar+1)).innerHTML +='<th>'+B_i_auxiliar[i].toFixed(2)+'</th>';
            }
            document.getElementById("tbody2F_sim"+(auxiliar+1)).innerHTML +='</tr>'; 
        } 

        tam_mat = n_variables+variable_aux-variable_r;
        for (let i = 0; i <= tam_mat; i++) {
            if (i<tam_mat ){   
                auxi = 0;
                for (let y = 0; y < n_restricciones; y++) {
                    auxi += (matriz_final_auxiliar[y][i] * val_Cx[y]);                
                }
                val_Z[i] = auxi  -(funcion[i]);
                    
            }else if(i == tam_mat) {
                auxi = 0;
                for (let y = 0; y < n_restricciones; y++) {
                    auxi += (B_i_auxiliar[y] * val_Cx[y]);      
                }                
                val_Z[i-2] = auxi;
            } 
        }

        tam_mat = n_variables+variable_aux-variable_r+2;
           
        largo_tabla = C_x.length+2;
        document.getElementById('tfoot2F_fin'+(auxiliar+1)).innerHTML += '<tr id="tfootF_fin'+(auxiliar+1)+'">';
        for (let i = 0; i <= largo_tabla; i++) {
            if (i==0) {
                document.getElementById('tfootF_fin'+(auxiliar+1)).innerHTML +='<th></th>';
            }else if (i==1) {
                document.getElementById('tfootF_fin'+(auxiliar+1)).innerHTML +='<th class="table-active">Z=</th>';
            }else if ( i>2 && i<largo_tabla ){   
                auxi = 0;

                for (let y = 0; y < n_restricciones; y++) {
                    auxi += (matriz_final_auxiliar[y][i-3] * val_Cx[y]); 
                    console.log ("auxi ("+auxi+") = "+matriz_final_auxiliar[y][i-3]+" * "+val_Cx[y])               
                }
                auxi = auxi - funcion[i];
                if (Number.isInteger(auxi)) {
                    document.getElementById('tfootF_fin'+(auxiliar+1)).innerHTML +='<th>'+auxi+'</th>';
                }else{
                    document.getElementById('tfootF_fin'+(auxiliar+1)).innerHTML +='<th>'+auxi.toFixed(2)+'</th>';
                }  
                console.log ("z= "+auxi+" - "+funcion[i-3])
                val_Z[i-3] = auxi - funcion[i-3];
    
            }else if(i == largo_tabla) {
                auxi = 0;
                for (let y = 0; y < n_restricciones; y++) {
                    auxi += (B_i_auxiliar[y] * val_Cx[y]);      
                } 
                if (Number.isInteger(auxi)) {
                    document.getElementById('tfootF_fin'+(auxiliar+1)).innerHTML +='<th>'+auxi+'</th>';
                }else{
                    document.getElementById('tfootF_fin'+(auxiliar+1)).innerHTML +='<th>'+auxi.toFixed(2)+'</th>';
                }                
                val_Z[i-3] = auxi;
            } 
        }
        document.getElementById('tfoot2F_fin'+(auxiliar+1)).innerHTML +='</tr>';


        // Los valores actuales pasan a ser los valores actiales de la MATRIZ_FINAL


        tam_mat = n_variables+variable_aux-variable_r;
        if ( objetivo == "Maximizar"){
            auxi = 0;
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
    
        }

        // verificando continuidad del ciclo
        for (let i = 0; i < val_Z.length; i++) {
            if (val_Z[i] >= 0 ) {
                validacion_max = 1;
            }else if (val_Z[i] < 0) {
                validacion_max = 0;
                break;
            } 
        }
        
        auxiliar++;

        if (validacion_max == 1 ) {
            document.getElementById("primera_fase").innerHTML += '<p style="font-size: 1.2rem; color: aliceblue;">Se finalizaron las iteraciones de la primera fase y existe alguna solución posible para el problema. </p> <br>'
            
        }else if (validacion_max == 0) {
            document.getElementById("primera_fase").innerHTML += '<p style="font-size: 1.2rem; color: aliceblue;">Ingresa la variable '+C_x[fila_pivote]+' y sale de la base la variable '+val_Xb[fila_pivote]+'. El elemento pivote es '+matriz_final[fila_pivote][columna_pivote]+'. </p> <br>'
            
        } 
            
        // console.log("Valores de Z después (fase 1)");
        console.log(val_Z);
        console.log("Validación (1:stop  - 0:sigue): "+validacion_max+" -> con z="+val_Z[val_Z.length-1]);
        
    }

    



    
}
