function Generar_grafico() {

    // let  grafic;
    // if (grafic) grafic.destroy();
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
        matriz[i] = new Array(n_variables + 1);
    }
    //Creando la matriz con los respectivos valores extraídos del modelo
    for (let i = 0; i < n_restricciones; i++) {
        for (let y = 0; y < n_variables; y++) {
            matriz[i][y] = parseFloat(document.getElementById("num_X" + (y + 1) + "_Y" + (i + 1) + "").value);
        }
        matriz[i][n_variables] = parseFloat(document.getElementById("num_X" + (i + 1) + "").value);
    }

    // Creando función con los datos del modelo
    let funcion = new Array(n_variables);
    for (let i = 0; i < n_variables; i++) {
        funcion[i] = parseFloat(document.getElementById("fun_X" + (i + 1)).value);
    }

    //Reiniciando el modelo textual para el método gráfico
    document.getElementById("Fun_objetivo").innerHTML = '';
    document.getElementById("Res_objetivo").innerHTML = '';

    // Agregando la Funcion textual del método gráfico -- TEXTO
    if (objetivo == "Maximizar") {
        document.getElementById("Fun_objetivo").innerHTML += "Maximizar Z = ";
    } else if (objetivo == "Minimizar") {
        document.getElementById("Fun_objetivo").innerHTML += "Minimizar Z = ";
    }
    document.getElementById("Fun_objetivo").innerHTML += funcion[0] + "X";
    if (funcion[1] < 0) {
        document.getElementById("Fun_objetivo").innerHTML += " " + funcion[1] + "Y ";
    } else {
        document.getElementById("Fun_objetivo").innerHTML += " + " + funcion[1] + "Y ";
    }

    let restriccion = new Array();

    // Agregando el modelo de las restricciones textuales del método gráfico
    for (let i = 0; i < n_restricciones; i++) {
        let combo_1 = document.getElementById("variables_adicionales" + (i + 1));
        let rest_1 = combo_1.options[combo_1.selectedIndex].value;
        document.getElementById("Res_objetivo").innerHTML += '<div class="container"></div> <label><h7>Restriccion N° ' + (i + 1) + ': &nbsp&nbsp&nbsp</h7></label>';

        for (let y = 0; y < n_variables; y++) {
            if (y < n_variables - 1) {
                document.getElementById("Res_objetivo").innerHTML += matriz[i][y] + "X ";
            } else {
                if (matriz[i][y] < 0) {
                    document.getElementById("Res_objetivo").innerHTML += " " + matriz[i][y] + "Y ";
                    if (rest_1 == "mayor_igual") {
                        restriccion.push("mayor_igual");
                        document.getElementById("Res_objetivo").innerHTML += " ≥ ";
                        document.getElementById("Res_objetivo").innerHTML += matriz[i][y + 1];

                    } else if (rest_1 == "menor_igual") {
                        restriccion.push("menor_igual");
                        document.getElementById("Res_objetivo").innerHTML += " ≤ ";
                        document.getElementById("Res_objetivo").innerHTML += matriz[i][y + 1];
                    }
                } else {
                    document.getElementById("Res_objetivo").innerHTML += " + " + matriz[i][y] + "Y ";
                    if (rest_1 == "mayor_igual") {
                        restriccion.push("mayor_igual");
                        document.getElementById("Res_objetivo").innerHTML += " ≥ ";
                        document.getElementById("Res_objetivo").innerHTML += matriz[i][y + 1];

                    } else if (rest_1 == "menor_igual") {
                        restriccion.push("menor_igual");
                        document.getElementById("Res_objetivo").innerHTML += " ≤ ";
                        document.getElementById("Res_objetivo").innerHTML += matriz[i][y + 1];
                    }
                }
            }
        }
    }
    document.getElementById("Res_objetivo").innerHTML += "<br> X, Y ≥ 0";
    console.log(restriccion);


    // Extrayendo las coordenadas X y Y de cada una de las restricciones
    let coordenadas_X = new Array();
    let coordenadas_Y = new Array();
    let recta_X = new Array();
    let recta_Y = new Array();

    for (let i = 0; i < n_restricciones; i++) {
        if (matriz[i][0] == 0) {
            recta_X.push(0);
            recta_Y.push(matriz[i][2] / matriz[i][1]);
            console.log("Y cuando X es 0: "+ matriz[i][2] / matriz[i][1]);

        } else if (matriz[i][1] == 0) {
            recta_X.push(matriz[i][2] / matriz[i][0]);
            recta_Y.push(0);
            
            console.log("X cuando Y es 0: "+ matriz[i][2] / matriz[i][0]);

        } else {
            coordenadas_X.push(0);
            coordenadas_Y.push(matriz[i][2] / matriz[i][1]);
            coordenadas_X.push(matriz[i][2] / matriz[i][0]);
            coordenadas_Y.push(0);
        }
    }
    
    // console.log("Puntos_X");
    // console.log(Puntos_X);
    // console.log("Puntos_Y");
    // console.log(Puntos_Y);
    // console.log("Coordenadas X: ");
    // console.log(coordenadas_X);
    // console.log("Coordenadas Y: ");
    // console.log(coordenadas_Y);
    // console.log("recta_X");
    // console.log(recta_X);
    // console.log("recta_Y");
    // console.log(recta_Y);

    /**
    *  0 por 1, 2, 3, 4
    * 1 por 2, 3, 4
    * 2 por 3, 4
    * 3 por 4
    **/
    let Puntos_X = new Array();
    let Puntos_Y = new Array();
    let ec1 = new Array();
    let ec2 = new Array();
    let auxi = n_restricciones;
    let auxiliar;
    // Bucle exterior para el primer número (0 a 3)
    for (let i = 0; i <= auxi; i++) {
        // Bucle interior para el segundo número (i + 1 a 4)
        for (let j = i + 1; j < n_restricciones; j++) {
            // Realizar la multiplicación y mostrar el resultado
            ec1 = [matriz[i][0], matriz[i][1], matriz[i][2]];
            ec2 = [matriz[j][0], matriz[j][1], matriz[j][2]];

            let resultado = SistEcuaciones(ec1, ec2);
            auxiliar = resultado[0] * 1;
            Puntos_X.push(auxiliar);

            auxiliar = resultado[1] * 1;
            Puntos_Y.push(auxiliar);

        }
    }

    let factiblesX = new Array();
    let factiblesY = new Array();

    for (let i = 0; i < coordenadas_X.length; i++) {
        factiblesX.push(coordenadas_X[i]);
        factiblesY.push(coordenadas_Y[i]);        
    }
    for (let i = 0; i < Puntos_X.length; i++) {
        factiblesX.push(Puntos_X[i]);
        factiblesY.push(Puntos_Y[i]);        
    }
    for (let i = 0; i < recta_X.length; i++) {
        factiblesX.push(recta_X[i]);
        factiblesY.push(recta_Y[i]);        
    }

    console.log("Concatenación");
    console.log(factiblesX);
    console.log(factiblesY);

    ValoresZ = new Array();

    for (let i = 0; i < factiblesX.length; i++) {
        ValoresZ.push((funcion[0] * factiblesX[i]) + (funcion[1] * factiblesY[i]));
    }

    console.log("Valores de Z en los puntos");
    console.log(ValoresZ);

    // document.getElementById("cuerpo_grafico").innerHTML = "";

    let Puntos_solucionX = new Array();
    let Puntos_solucionY = new Array();


    let condicion = new Array();
    let aux_solucion ;
    // console.log("antes del ciclo ");
    let lim = 0;
    if (objetivo == "Maximizar") {
        
        if (restriccion[lim] == "menor_igual") {
            
            for (let y = 0; y < factiblesX.length; y++) {
                auxiliar = 0;
                for (let i = 0; i < n_restricciones; i++) {
                    aux_solucion = ( (matriz[i][0] * factiblesX[y]) + (matriz[i][1] * factiblesY[y]) );
                    // console.log("("+matriz[i][0]+"*"+factiblesX[y]+")+("+matriz[i][1]+"*"+factiblesY[y]+")");
                    // console.log("(Valor de la restriccion = "+matriz[i][2]+")");
                    if (aux_solucion <= matriz[i][2] || aux_solucion == 0) {
                        auxiliar++;
                    }
                }
                condicion.push(auxiliar);
            }

            for (let i = 0; i < factiblesX.length; i++) {
                if (condicion[i] == n_restricciones){
                    Puntos_solucionX.push(factiblesX[i]);
                    Puntos_solucionY.push(factiblesY[i]);
                }  
            }
            
        }else if (restriccion[lim] == "menor_igual") {
            
            for (let y = 0; y < factiblesX.length; y++) {
                auxiliar = 0;
                for (let i = 0; i < n_restricciones; i++) {
                    aux_solucion = ( (matriz[i][0] * factiblesX[y]) + (matriz[i][1] * factiblesY[y]) );
                    // console.log("("+matriz[i][0]+"*"+factiblesX[y]+")+("+matriz[i][1]+"*"+factiblesY[y]+")");
                    // console.log("(Valor de la restriccion = "+matriz[i][2]+")");
                    if (aux_solucion <= matriz[i][2] || aux_solucion == 0) {
                        auxiliar++;
                    }
                }
                condicion.push(auxiliar);
            }

            for (let i = 0; i < factiblesX.length; i++) {
                if (condicion[i] == n_restricciones){
                    Puntos_solucionX.push(factiblesX[i]);
                    Puntos_solucionY.push(factiblesY[i]);
                }  
            }
            
        }

        lim++;

    } else if (objetivo == "Minimizar") {
        if (restriccion[lim] == "menor_igual") {
            
            for (let y = 0; y < factiblesX.length; y++) {
                auxiliar = 0;
                for (let i = 0; i < n_restricciones; i++) {
                    aux_solucion = ( (matriz[i][0] * factiblesX[y]) + (matriz[i][1] * factiblesY[y]) );
                    // console.log("("+matriz[i][0]+"*"+factiblesX[y]+")+("+matriz[i][1]+"*"+factiblesY[y]+")");
                    // console.log("(Valor de la restriccion = "+matriz[i][2]+")");
                    if (aux_solucion <= matriz[i][2] || aux_solucion == 0) {
                        auxiliar++;
                    }
                }
                condicion.push(auxiliar);
            }

            for (let i = 0; i < factiblesX.length; i++) {
                if (condicion[i] == n_restricciones){
                    Puntos_solucionX.push(factiblesX[i]);
                    Puntos_solucionY.push(factiblesY[i]);
                }  
            }
            
        }else if (restriccion[lim] == "mayor_igual") {
            
            for (let y = 0; y < factiblesX.length; y++) {
                auxiliar = 0;
                for (let i = 0; i < n_restricciones; i++) {
                    aux_solucion = ( (matriz[i][0] * factiblesX[y]) + (matriz[i][1] * factiblesY[y]) );
                    // console.log("("+matriz[i][0]+"*"+factiblesX[y]+")+("+matriz[i][1]+"*"+factiblesY[y]+")");
                    // console.log("(Valor de la restriccion = "+matriz[i][2]+")");
                    if (aux_solucion <= matriz[i][2] || aux_solucion == 0) {
                        auxiliar++;
                    }
                }
                condicion.push(auxiliar);
            }

            for (let i = 0; i < factiblesX.length; i++) {
                if (condicion[i] == n_restricciones){
                    Puntos_solucionX.push(factiblesX[i]);
                    Puntos_solucionY.push(factiblesY[i]);
                }  
            }
            
        }
    }


    console.log(Puntos_solucionX);
    console.log(Puntos_solucionY);

    // Valores en la tabla del método gráfico 
    let abc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
   

    if (objetivo == "Maximizar") {
        auxiliar = 0;
        for (let i = 0; i < restriccion.length; i++) {
            if (restriccion[i] == "mayor_igual") {
                auxiliar++;
            }            
        }

        if (auxiliar == n_restricciones){
            document.getElementById("solucion_m_grafico").innerHTML += '<p style="font-size: 1.2rem; color: aliceblue;"> La región factible no se encuentra limitada; por lo tanto el problema tiene soluciones ilimitadas no acotadas. </p> <br>'

        }else{

            document.getElementById("cuerpo_grafico").innerHTML = "";
            document.getElementById("cabeza_grafico").innerHTML = "";

            document.getElementById("cabeza_grafico").innerHTML += '<tr class="table-primary"> <th scope="col">Punto <br>...</th>';
            document.getElementById("cabeza_grafico").innerHTML += '<th scope="col">Coordenadas <br> (X,Y)</th> <th scope="col">Valor de la función objetivo <br>Z = X + Y</th> </tr>';

            auxiliar = 0;
            for (let i = 0; i < Puntos_solucionX.length; i++) {
                document.getElementById("cuerpo_grafico").innerHTML += '<tr id= "tr'+i+'">';
        
                auxiliar = ((funcion[0] * Puntos_solucionX[i]) +  (funcion[1] * Puntos_solucionY[i]))
                document.getElementById('tr'+i).innerHTML += "<th>"+abc[i]+"</th>";
                document.getElementById('tr'+i).innerHTML += "<th>("+Puntos_solucionX[i]+" , "+Puntos_solucionY[i]+")</th>";
                document.getElementById('tr'+i).innerHTML += "<th>"+funcion[0]+"("+Puntos_solucionX[i]+") + "+funcion[1]+"("+Puntos_solucionY[i]+") = "+auxiliar+"</th>";
                
                document.getElementById("cuerpo_grafico").innerHTML += "</tr>";
            } 

        }


    }else if (objetivo == "Minimizar") {
        auxiliar = 0;
        for (let i = 0; i < restriccion.length; i++) {
            if (restriccion[i] == "menor_igual") { 
                auxiliar++;
            }  
            
        }

        if (auxiliar == n_restricciones){
            document.getElementById("solucion_m_grafico").innerHTML += '<p style="font-size: 1.2rem; color: aliceblue;"> La región factible no se encuentra limitada; por lo tanto el problema tiene soluciones ilimitadas no acotadas. </p> <br>'

        }else{
            
            document.getElementById("cuerpo_grafico").innerHTML = "";
            document.getElementById("cabeza_grafico").innerHTML = "";

            document.getElementById("cabeza_grafico").innerHTML += '<tr class="table-primary"> <th scope="col">Punto <br>...</th>';
            document.getElementById("cabeza_grafico").innerHTML += '<th scope="col">Coordenadas <br> (X,Y)</th> <th scope="col">Valor de la función objetivo <br>Z = X + Y</th> </tr>';
                                            
            auxiliar = 0;
            for (let i = 0; i < Puntos_solucionX.length; i++) {
                document.getElementById("cuerpo_grafico").innerHTML += '<tr id= "tr'+i+'">';
        
                auxiliar = ((funcion[0] * Puntos_solucionX[i]) +  (funcion[1] * Puntos_solucionY[i]))
                document.getElementById('tr'+i).innerHTML += "<th>"+abc[i]+"</th>";
                document.getElementById('tr'+i).innerHTML += "<th>("+Puntos_solucionX[i]+" , "+Puntos_solucionY[i]+")</th>";
                document.getElementById('tr'+i).innerHTML += "<th>"+funcion[0]+"("+Puntos_solucionX[i]+") + "+funcion[1]+"("+Puntos_solucionY[i]+") = "+auxiliar+"</th>";
                
                document.getElementById("cuerpo_grafico").innerHTML += "</tr>";
            } 
            document.getElementById("solucion_m_grafico").innerHTML += '<p style="font-size: 1.2rem; color: aliceblue;"> La región factible no se encuentra limitada; por lo tanto el problema tiene soluciones ilimitadas no acotadas. </p> <br>'


        }
    }








    // if (grafic) {
    //     grafic.destroy();
    // } 
}


function SistEcuaciones (ecuacion1, ecuacion2){

    let PuntosX =new Array();
    let PuntosY =new Array();
    let aux_x = 0;
    let aux_y = 0;


    if       (ecuacion2[1]!=0 && ecuacion2[0]==0 && ecuacion1[1]!=0 && ecuacion1[0]!=0 ) {
        
        if (ecuacion2[1]==1 && ecuacion1[1]==1) {
            
            aux_y = ecuacion2[2];
            PuntosY.push(aux_y);
            aux_x = (ecuacion1[2] - aux_y) / ecuacion1[0];
            PuntosX.push(aux_x);
            
        }else if (ecuacion2[1]==1 && ecuacion1[1]!=1) {

            aux_y = ecuacion2[2];
            PuntosY.push(aux_y);
            aux_x = (ecuacion1[2] -(aux_y*ecuacion1[1])) / ecuacion1[0];
            PuntosX.push(aux_x);

        }else if (ecuacion2[1]!=1 && ecuacion1[1]==1) {
            
            aux_y = ecuacion2[2] / ecuacion2[0];
            PuntosY.push(aux_y);
            aux_x = (ecuacion1[2] - aux_y) / ecuacion1[0];
            PuntosX.push(aux_x);

        }

    }else if (ecuacion2[1]==0 && ecuacion2[0]!=0 && ecuacion1[1]!=0 && ecuacion1[0]!=0) {

        
        if (ecuacion2[0]==1 && ecuacion1[0]==1) {
            
            aux_x = ecuacion2[2];
            PuntosX.push(aux_x);
            aux_y = (ecuacion1[2] - aux_x) / ecuacion1[1];
            PuntosY.push(aux_y);
            
        }else if (ecuacion2[0]==1 && ecuacion1[0]!=1) {

            aux_x = ecuacion2[2];
            PuntosX.push(aux_x); 
            aux_y = (ecuacion1[2] -(aux_x*ecuacion1[0])) / ecuacion1[1];
            PuntosY.push(aux_y);

        }else if (ecuacion2[0]!=1 && ecuacion1[0]==1) {
            
            aux_x = ecuacion2[2] / ecuacion1[0];
            PuntosX.push(aux_x);
            aux_y = (ecuacion1[2] - aux_x) / ecuacion1[1];
            PuntosY.push(aux_y);
        
        }

    }else if (ecuacion2[1]!=0 && ecuacion2[0]!=0 && ecuacion1[1]!=0 && ecuacion1[0]==0) {

        if (ecuacion2[1]==1 && ecuacion1[1]==1) {
            
            aux_y = ecuacion1[2];
            PuntosY.push(aux_y);
            aux_x = (ecuacion2[2] - aux_y) / ecuacion2[0];
            PuntosX.push(aux_x);
            
        }else if (ecuacion2[1]==1 && ecuacion1[1]!=1) {

            aux_y = ecuacion1[2];
            PuntosY.push(aux_y); 
            aux_x = (ecuacion2[2] -(aux_y*ecuacion2[1])) / ecuacion2[0];
            PuntosX.push(aux_x);

        }else if (ecuacion2[1]!=1 && ecuacion1[1]==1) {
            
            aux_y = ecuacion1[2] / ecuacion2[0];
            PuntosY.push(aux_y);
            aux_x = (ecuacion2[2] - aux_y) / ecuacion2[0];
            PuntosX.push(aux_x);

        }
        
    }else if (ecuacion2[1]!=0 && ecuacion2[0]!=0 && ecuacion1[1]==0 && ecuacion1[0]!=0) {
        
        if (ecuacion2[0]==1 && ecuacion1[0]==1) {
            
            aux_x = ecuacion1[2];
            PuntosX.push(aux_x);
            aux_y = (ecuacion2[2] - aux_x) / ecuacion2[1];
            PuntosY.push(aux_y);
            
        }else if (ecuacion2[0]==1 && ecuacion1[0]!=1) {

            aux_x = ecuacion1[2];
            PuntosX.push(aux_x); 
            aux_y = (ecuacion2[2] -(aux_x*ecuacion2[0])) / ecuacion2[1];
            PuntosY.push(aux_y);

        }else if (ecuacion2[0]!=1 && ecuacion1[0]==1) {
            
            aux_x = ecuacion1[2] / ecuacion2[0];
            PuntosX.push(aux_x);
            aux_y = (ecuacion2[2] - aux_x) / ecuacion2[1];
            PuntosY.push(aux_y);

        }
        
    }else{
        let fun1 = new Array();
        let fun2 = new Array();

        if ((ecuacion1[1] > 0 && ecuacion2[1] > 0) || (ecuacion1[1] < 0 && ecuacion2[1] < 0 )) { // ambos positivos
            
            fun1[0] = ecuacion1[0]*ecuacion2[1];
            fun1[1] = ecuacion1[1]*ecuacion2[1];
            fun1[2] = ecuacion1[2]*ecuacion2[1];

            fun2[0] = ecuacion2[0] * -ecuacion1[1];
            fun2[1] = ecuacion2[1] * -ecuacion1[1];
            fun2[2] = ecuacion2[2] * -ecuacion1[1];

            aux_x = (fun1[2] + fun2[2]) / (fun1[0] + fun2[0]);
            PuntosX.push(aux_x);
            aux_y = (fun1[2] -(fun1[0]*aux_x))/ fun1[1];
            PuntosY.push(aux_y);

        }else if ((ecuacion1[1] > 0 && ecuacion2[1] < 0) || (ecuacion1[1] < 0 && ecuacion2[1] > 0)) { // Y1 positivo, Y2, negativo
            fun1[0] = ecuacion1[0] * ecuacion2[1];
            fun1[1] = ecuacion1[1] * ecuacion2[1];
            fun1[2] = ecuacion1[2] * ecuacion2[1];

            fun2[0] = ecuacion2[0] * -ecuacion1[1];
            fun2[1] = ecuacion2[1] * -ecuacion1[1];
            fun2[2] = ecuacion2[2] * -ecuacion1[1];
            
            aux_x = (fun1[2] + fun2[2]) / (fun1[0] + fun2[0]);
            PuntosX.push(aux_x);
            aux_y = (fun1[2] -(fun1[0]*aux_x))/ fun1[1];
            PuntosY.push(aux_y);

        }
    }
    // console.log("Puntos de X");
    // console.log(PuntosX);
    // console.log("Puntos de Y");
    // console.log(PuntosY);

    let auxiliar = [PuntosX, PuntosY];
    return auxiliar;

}



function PlanoC(){  
    
    
    let numerosAlAzar = [300,500,0]; // X
    let numerosAlAzar1 = [900,500,35]; // Y

    // Combina los dos arreglos
    const todosLosNumeros = [...numerosAlAzar, ...numerosAlAzar1];

    // Encuentra el número máximo
    const mayorNumero = Math.max(...todosLosNumeros);

    console.log("Número mayor");
    console.log(mayorNumero);

    // cada 56px se pone el número del eje del plano 


    const canvas = document.getElementById("m_grafico_op");

    if (canvas.getContext) {
        const contexto = canvas.getContext("2d");


        const maxX = 560;
        const maxY = 560;
        const divisionesX = 12;
        const divisionesY = 12;
        const margenIzquierdo = 30;
        const margenSuperior = 10;
        const rectasX = [300,500,0]; // Valores X de las rectas
        const rectasY = [900,500,35]; // Valores Y de las rectas


   // Configurar el estilo del plano cartesiano
   contexto.strokeStyle = "#ccc";
   contexto.lineWidth = 1;

   // Dibujar ejes X e Y con margen
   contexto.beginPath();
   contexto.moveTo(margenIzquierdo, maxY + margenSuperior);
   contexto.lineTo(600 - margenIzquierdo, maxY + margenSuperior); // 600 es el ancho del canvas
   contexto.moveTo(margenIzquierdo, margenSuperior);
   contexto.lineTo(margenIzquierdo, maxY + margenSuperior);
   contexto.stroke();

   // Dibujar divisiones en el eje X
   const anchoUtilizable = 600 - 2 * margenIzquierdo;
   const pasoX = anchoUtilizable / divisionesX;
   for (let i = 1; i < divisionesX; i++) {
       const x = margenIzquierdo + i * pasoX;
       contexto.beginPath();
       contexto.moveTo(x, maxY + margenSuperior - 5);
       contexto.lineTo(x, maxY + margenSuperior + 5);
       contexto.stroke();

       // Etiquetar las divisiones en el eje X
       contexto.font = "10px Arial";
       contexto.fillStyle = "black";
       contexto.fillText((Math.round(mayorNumero/11 * i)), x - 5, maxY + margenSuperior + 20);
   }

   // Dibujar divisiones en el eje Y
   const altoUtilizable = maxY;
   const pasoY = altoUtilizable / divisionesY;
   for (let i = 1; i < divisionesY; i++) {
       const y = margenSuperior + i * pasoY;
       contexto.beginPath();
       contexto.moveTo(margenIzquierdo - 5, maxY + margenSuperior - y);
       contexto.lineTo(margenIzquierdo + 5, maxY + margenSuperior - y);
       contexto.stroke();

       // Etiquetar las divisiones en el eje Y
       contexto.font = "10px Arial";
       contexto.fillStyle = "black";
       contexto.fillText((Math.round(mayorNumero/11 * i)), margenIzquierdo - 20, maxY + margenSuperior - y + 5);
   }

   // Dibujar las rectas
   contexto.strokeStyle = "blue"; // Color para las rectas
   contexto.lineWidth = 2;

   for (let i = 0; i < rectasX.length; i++) {
       contexto.beginPath();
       contexto.moveTo(rectasX[i - 1] + margenIzquierdo, maxY - rectasY[i - 1] + margenSuperior);
       contexto.lineTo(rectasX[i] + margenIzquierdo, maxY - rectasY[i] + margenSuperior);
       contexto.stroke();
   }

   // Etiquetar los ejes
   contexto.font = "12px Arial";
   contexto.fillStyle = "black";
   contexto.fillText("X", 600 - margenIzquierdo, maxY + margenSuperior + 20);
   contexto.fillText("Y", margenIzquierdo - 20, margenSuperior + 10);

    }
}

function PlanoC1(){  
    
    let numerosAlAzar = [10, 0, 210, 0, 55]; // X
    let numerosAlAzar1 = [0, 85, 0, 44, 0]; // Y

    // Combina los dos arreglos
    const todosLosNumeros = [...numerosAlAzar, ...numerosAlAzar1];

    // Encuentra el número máximo
    const mayorNumero = Math.max(...todosLosNumeros);

    console.log("Número mayor");
    console.log(mayorNumero);

    // cada 56px se pone el número del eje del plano 


    const canvas = document.getElementById("m_grafico_op");

    if (canvas.getContext) {
        const contexto = canvas.getContext("2d");


        const maxX = 560;
        const maxY = 560;
        const divisionesX = 12;
        const divisionesY = 12;
        const margenIzquierdo = 30;
        const margenSuperior = 10;


        // Configurar el estilo del plano cartesiano
        contexto.strokeStyle = "#ccc";
        contexto.lineWidth = 1;

        // Dibujar ejes X e Y con margen
        contexto.beginPath();
        contexto.moveTo(margenIzquierdo, maxY + margenSuperior);
        contexto.lineTo(600 - margenIzquierdo, maxY + margenSuperior); // 600 es el ancho del canvas
        contexto.moveTo(margenIzquierdo, margenSuperior);
        contexto.lineTo(margenIzquierdo, maxY + margenSuperior);
        contexto.stroke();

        // Dibujar divisiones en el eje X
        const anchoUtilizable = 600 - 2 * margenIzquierdo;
        const pasoX = anchoUtilizable / divisionesX;
        for (let i = 1; i < divisionesX; i++) {
            const x = margenIzquierdo + i * pasoX;
            contexto.beginPath();
            contexto.moveTo(x, maxY + margenSuperior - 5);
            contexto.lineTo(x, maxY + margenSuperior + 5);
            contexto.stroke();

            // Etiquetar las divisiones en el eje X
            contexto.font = "10px Arial";
            contexto.fillStyle = "black";
            contexto.fillText((Math.round(mayorNumero/11 * i)), x - 5, maxY + margenSuperior + 20);
        }

        // Dibujar divisiones en el eje Y
        const altoUtilizable = maxY;
        const pasoY = altoUtilizable / divisionesY;
        for (let i = 1; i < divisionesY; i++) {
            const y = margenSuperior + i * pasoY;
            contexto.beginPath();
            contexto.moveTo(margenIzquierdo - 5, maxY + margenSuperior - y);
            contexto.lineTo(margenIzquierdo + 5, maxY + margenSuperior - y);
            contexto.stroke();

            // Etiquetar las divisiones en el eje Y
            contexto.font = "10px Arial";
            contexto.fillStyle = "black";
            contexto.fillText((Math.round(mayorNumero/11 * i)), margenIzquierdo - 20, maxY + margenSuperior - y + 5);
        }

        // Etiquetar los ejes
        contexto.font = "12px Arial";
        contexto.fillStyle = "black";
        contexto.fillText("X", 600 - margenIzquierdo, maxY + margenSuperior + 20);
        contexto.fillText("Y", margenIzquierdo - 20, margenSuperior + 10);







    }
}