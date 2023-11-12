

function Limpiar() {
    document.getElementById("tam_variables").value = '';  
    document.getElementById("tam_restricciones").value = '';   
}


function Modelo() {
    let n_variables = document.getElementById("tam_variables").value;  
    let n_restricciones = document.getElementById("tam_restricciones").value;   

    document.getElementById("modelo_metodo").innerHTML = '';
    
    for (let i = 0; i < n_variables; i++) {

        document.getElementById("modelo_metodo").innerHTML +='';
    }

    for (let i = 0; i < tama; i++) {
        document.getElementById("input_esp").innerHTML += '<br><input type="text" class="form-control" name="txt_especificacion[]" placeholder="Escriba la especificación '+ (i+1) +'" required>';  
    }

}
