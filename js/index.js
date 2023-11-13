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
            document.getElementById("N_restriccion").innerHTML +='&nbsp&nbsp&nbsp<select style="width : 90px; border: 4px solid rgba(0, 0, 0, 0.0);" class="matriz form-select-sm"><option value="1"> ≤ </option> <option value="2"> ≥ </option> <option value="3"> = </option> </select> &nbsp&nbsp&nbsp';
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
    
 
    let matriz = new Array(2);
    matriz[0] = new Array(n_variables+1);
    matriz[1] = new Array(n_restricciones);

    let aux = n_variables-1;

    for (let i = 0; i < n_restricciones; i++) {
        for (let y = 0; y < n_variables; y++) {
            matriz [i][y] = document.getElementById("num_X"+(y+1)+"_Y"+(i+1)+"").value;
        }   
        matriz[i][n_restricciones] = document.getElementById("num_X"+(i+1)+"").value;     
    }
    console.log(matriz)
}

void function test() {
    console.log('test function executed');
};
