


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

    // Modificando si hay un -1 las variables 
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
    
    //Creando matriz_final para el modelo completo - matriz auxiliar para el problema en primera fase 
    auxiliar = n_variables+variable_aux;
    let matriz_final = new Array(n_restricciones-1);
    let matriz_final_auxiliar = new Array(n_restricciones-1);

    for (let i = 0; i < n_restricciones; i++) {
        matriz_final[i] = new Array(auxiliar);
        matriz_final_auxiliar[i] = new Array(auxiliar);
    }

    //Creando la matriz_inicial con los respectivos valores extraídos del modelo 
    //Creando la matriz_final completa sin Bi
    for (let i = 0; i < n_restricciones; i++) {
        for (let y = 0; y <n_variables; y++) {
            matriz_final [i][y] = matriz_inicial [i][y];
            matriz_final_auxiliar[i][y] = matriz_inicial [i][y];
        }    
    }
    for (let i = 0; i < n_restricciones; i++) {
        for (let y = n_variables; y < auxiliar; y++) {
            matriz_final [i][y] = matriz_aux [i][y-n_variables];
            matriz_final_auxiliar[i][y] = matriz_aux [i][y-n_variables];
        }
    }
    console.log(matriz_aux);

    // ENCABEZADO DE LA MATRIZ_FINAL
    // INSERTANDO LA MATRIZ_FINAL
    // INSERTANDO LOS BI
    // FOTTER DE LA MATRIZ_FINAL


    let tam_matriz = n_variables+variable_r+variable_s+variable_h;

    // Determinar el elemento Pivote
    let columna_pivote = 0;
    let fila_pivote = 0;

    // Variables auxiliares para el problema en primera fase 
    let B_i_auxiliar = new Array(n_restricciones-1);

    for (let i = 0; i < B_i_auxiliar.length; i++) {
        B_i_auxiliar[i] = B_i[i];        
    }
    auxiliar = n_variables+variable_aux;

    console.log("Matriz final");
    console.log(matriz_final);
    console.log("Matriz final auxiliar");
    console.log(matriz_final_auxiliar);
    console.log("Matriz final");
    console.log(matriz_final);

    // limpiando el modelo antes del ciclo en su primera fase 
    document.getElementById("primera_fase").innerHTML = '';
    
    // PROGRAMANDO LA PRIMERA FASE
    let validacion_max = 0;
    let validacion_min = 0;

    // console.log("Valores de Cx fuera de ciclo");
    console.log(C_x);
    let val_Z = new Array();
    
    
    if ( objetivo == "Maximizar"){
        validacion_min == 1;

    }else if (objetivo == "Minimizar"){
        validacion_max == 1;
    }
    auxi = 0, auxiliar = 0;
    console.log("----MATRIZ INCIAL E ITERACIONES DE SIMPLEX EN SU PRIMERA FASE----");

    // while (auxiliar < 3) {
    while (validacion_max == 0 || validacion_min == 0) {
    
        console.log('Ingresa al Ciclo de Primera fase');
        // Titulo tabla
        if (auxiliar == 0) {
            document.getElementById("primera_fase").innerHTML += '<center> <h5>Matriz Inicial <u>Primera fase</u></h5> <br> </center>';
        }else{
            document.getElementById("primera_fase").innerHTML += '<center> <br> <h5>Iteración Num. '+(auxiliar)+'</h5> <br> </center>';
        }

       
        // tabla numerada por cada iteración de 
        document.getElementById("primera_fase").innerHTML += '<table id="tabla_'+(auxiliar+1)+'" class="table table-light" style="table-layout: fixed !important; border-radius: 8px !important; text-align: center !important; width: auto !important; " >';
        document.getElementById("tabla_"+(auxiliar+1)).innerHTML += '<thead id="thead_encab'+(auxiliar+1)+'"> </thead>';
        document.getElementById("tabla_"+(auxiliar+1)).innerHTML += '<tbody id="tbody_mat'+(auxiliar+1)+'"></tbody>';
        document.getElementById("tabla_"+(auxiliar+1)).innerHTML += '<tfoot id="tfoot_fin'+(auxiliar+1)+'"> </tfoot>';
        document.getElementById("primera_fase").innerHTML += '</table>';

        let largo_tabla = C_x.length+2;
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
        if (auxiliar >= 1) {
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

        // Realizando operaciones sobre la MATRIZ_FINAL para almacenar en la MATRIZ AUXILIAR
        if (auxiliar >= 1) {
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
        }

        // INSERTANDO LA MATRIZ_FINAL_AUXILIAR
        if (auxiliar >= 1) {
            tam_matriz = n_variables+variable_aux;
        }else if(auxiliar == 0){

            tam_matriz = n_variables+variable_aux;
        }
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
        // console.log("Valores de B_i en primera fase");
        console.log("B_i en su primera fase");
        console.log(B_i);

        // INSERTANDO LOS BI - primero la fila piv y después las demás en el caso de 1 sino se mantienen
        if(auxiliar == 0){
            for (let i = 0; i < B_i.length; i++) {
                B_i_auxiliar[i] = B_i[i];
                
            }
        }else if (auxiliar >= 1){
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
        }
        

        if(auxiliar == 0){
            for (let i = 0; i < n_restricciones; i++) {
                document.getElementById("tbody_mat"+(auxiliar+1)).innerHTML += '<tr id="tbody_m_'+(i+1)+'_'+(auxiliar+1)+'">';

                    document.getElementById('tbody_m_'+(i+1)+'_'+(auxiliar+1)).innerHTML +='<th>'+B_i_auxiliar[i]+'</th>';
                
                document.getElementById("tbody_mat"+(auxiliar+1)).innerHTML +='</tr>'; 
            } 

        }else if (auxiliar >= 1){
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
        let tam_mat = tam_matriz -1;

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

        // verificación para la terminación de la primera fase en minimización   y maximización          
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

        
        // console.log("Valores de Z después (fase 1)");
        console.log(val_Z);
        if( objetivo == "Maximizar"){
            console.log("Valid (1:stop  - 0): "+validacion_max+" -> con z="+val_Z[val_Z.length-1]);
            validacion_min = 1;
        }else if( objetivo == "Minimizar"){
            console.log("Valid(1:stop  - 0): "+validacion_min+" -> con z="+val_Z[val_Z.length-1]);
            validacion_max = 1;
        }
        
    
    }
    
    console.log(matriz_final);    
    console.log(C_x);

    
}
