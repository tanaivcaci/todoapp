//CONSTANTE API_URL
const API_URL = "https://ctd-todo-api.herokuapp.com/v1";


//Variables Form Registro --> /signup.html
const formRegistro = document.getElementById("formReg");

const inputNombre = document.getElementById("inputNombre");
const errorNombre = document.getElementById("errorNombre");

const inputApellido = document.getElementById("inputApellido");
const errorApellido = document.getElementById("errorApellido");

const inputEmailReg = document.getElementById("inputEmailReg");
const errorEmailReg = document.getElementById("errorEmailRegistro");
const errorEmailVacio = document.getElementById("errorEmailVacio");

const inputPass = document.getElementById("crearPass");
const errorCrearPass = document.getElementById("errorCrearPass");
const validarPassw = document.getElementById("validarPass");

const confirmPass = document.getElementById("confirmarPass");
const errorConfirmPass = document.getElementById("errorConfirmPass");
 

// VALIDACIÓN SIGNUP --> REGISTRO
formRegistro.addEventListener("submit", function (e) {
    e.preventDefault();

    let errores = [];//para guardar errores

    //Llamado de funciones de validación
    validarNombre(errores);

    validarApellido(errores);

    validarEmail(errores);

    let pass = validarPass(errores);

    validarRepetirPass(errores, pass);

    //Recorrer errores y mostrarlos
    if (errores.length !== 0) {
        //mostrar errores
        switchErrores(errores);

    } else {

        let datos = {
            firstName: inputNombre.value,
            lastName: inputApellido.value,
            email: inputEmailReg.value,
            password: inputPass.value
        };

        fetch(`${API_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": sessionStorage.getItem("token"),
            },
            body: JSON.stringify(datos),
        })
            //para enviar la info
            .then(function (response) {
                console.log("Respuesta: ");
                console.log(response);

                if (response.status === 200 || response.status === 201) {
                    return response.json();
                } else {
                    if(response.status === 400) {
                        throw new Error("El usuario ya se encuentra registrado / Alguno de los datos requeridos está incompleto")
                    }
                    
                    if(response.status === 500){
                        throw new Error("Error del servidor")
                    } 
                }
            })
            .then(function (userCreado) {
                console.log("User creado: ");
                console.log(userCreado);
                formRegistro.reset(); 
                // sessionStorage.setItem("token", userCreado.jwt);
                // otra manera es registrar al usuario y redireccionar a las tareas
                window.location.href = "./index.html";
                
            })
    
            console.log("JSON STRINGIFY: " + JSON.stringify(datos));

        //envío del form --->NO NECESITO ESTA LINEA PORQUE LOS DATOS LOS ENVÍO EN EL BODY DEL FETCH
        // formRegistro.submit();
    
    } 
});

//FUNCIONES DE VALIDACIÓN PARA CADA CAMPO
//VALIDAR NOMBRE
function validarNombre(errores) {
    let inputNombreValue = inputNombre.value.trim();

    //validación vacío
    if (inputNombreValue === "" || inputNombreValue.isNull) {
        errores.push({
            input: "nombre",
            mjeError: "Agrega un nombre",
        });
    }
}

//VALIDAR APELLIDO
function validarApellido(errores) {
    let inputApellidoValue = inputApellido.value.trim();

    //validación vacío
    if (inputApellidoValue === "" || inputApellidoValue.isNull) {
        errores.push({
            input: "apellido",
            mjeError: "Agrega tu apellido",
        });
    }
}

//VALIDAR EMAIL
function validarEmail(errores) {
    let inputEmailValue = inputEmailReg.value.trim();
    // console.log(inputEmailValue);

    //validación vacío
    if (inputEmailValue === "") {
        errores.push({
            input: "emailVacio",
            mjeError: "Agrega el email porque es obligatorio\n"
        });
    }

    //validación con Expresión Regular
    if (!inputEmailValue.match(/^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/)) {
        errores.push({
            input: "emailInvalido",
            mjeError: "Agregá un email válido",
        });
    }
}

//VALIDAR CONTRASEÑA
function validarPass(errores) {
    let inputPassValue = inputPass.value.trim();

    if (inputPassValue === "") {
        errores.push({
            input: "pass",
            mjeError: "Agrega una contraseña\n",
        });
    }

    //validación con expresión regular
    if (!inputPassValue.match(/^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/)) {
        errores.push({
            input: "validarPass",
            mjeError: "La contraseña debe tener al entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula, al menos una mayúscula y al menos un caracter no alfanumérico."
        });
    }

    return inputPassValue;
}

//VALIDAR REPETIR CONTRASEÑA
function validarRepetirPass(errores, pass) {
    let repetirPassValue = confirmPass.value;

    if (pass !== repetirPassValue) {
        errores.push({
            input: "confirmarPass",
            mjeError: "Las contraseñas deben ser iguales"
        });
    }

}

//SWITCH ERRORES PARA  LOS FORMULARIOS
function switchErrores(errores) {
    errores.forEach((error) => {
        switch (error.input) {
            case "nombre":
                //error (elemento). mjeError (mje)
                errorNombre.innerText = error.mjeError;
                break;

            case "apellido":
                errorApellido.innerText = error.mjeError;
                break;

            case "emailVacio":
                //porqué me muestra sólo uno de los errores? 
                errorEmailVacio.innerText = error.mjeError;
                // errorEmail.innerHTML = `<small class="error">${error.mjeError}</small>`
                break;

            case "emailInvalido":
                errorEmailReg.innerText = error.mjeError;
                break;

            case "pass":
                errorCrearPass.innerText = error.mjeError;
                break;

            case "validarPass":
                validarPassw.innerText = error.mjeError;
                break;

            case "confirmarPass":
                errorConfirmPass.innerText = error.mjeError;
                break;

            default:
                break;
        }
    });
}








//MEJORITAS --> 

//AGREGAR OJITO PARA VER U OCULTAR CONTARSEÑA
//TEMA OSCURO