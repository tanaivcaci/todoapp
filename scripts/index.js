//Declaración de Variables y captura


//Variables Login  - /index.html
const formLogin = document.querySelector("form#formLogin");

const inputEmail = document.getElementById('inputEmail');
const errorEmail = document.getElementById('errorEmail');

const inputPass = document.getElementById('inputPassword');
const errorPass = document.getElementById('errorPass');

const API_URL = "https://ctd-todo-api.herokuapp.com/v1";


//VALIDACIÓN LOGIN --> TERMINAR
formLogin.addEventListener("submit", function(e){
    e.preventDefault();

    let errores = [];

    //validacion email
    validarEmail(errores);

    //validacion pass
    const pass = validarPass(errores);


    //recorrer errores y mostrarlo
    if(errores.length !== 0){
        //mostrar errores
        switchErrores(errores);
    } else {

        console.log(pass);
        let datos = {
            "email": inputEmail.value,
            "password": pass
        }

        fetch(`${API_URL}/users/login`, {
            method : "POST", 
            headers : {
                "content-type": "application/json"
                // "authorization": sessionStorage.getItem("token"),
            }, 
            body: JSON.stringify(datos),
        })
        .then(function(response){
            console.log("Respuesta");
            console.log(response);
            
            if(response.status === 200 || response.status === 201){
                return response.json();
            } else {
                if(response.status === 400){
                    throw new Error ("Contraseña incorrecta")
                }
                if(response.status === 404){
                    throw new Error("El usuario no existe")
                }
                if(response.status === 500){
                    throw new Error("Error del servidor")
                }
            }
        })
        .then(function(userCreado){
            // console.log(userCreado);

            //Cuando logueamos se settea el token
            sessionStorage.setItem("token", userCreado.jwt);
            window.location.href = "./mis-tareas.html"
        })
        .catch(function (error) {
            console.log(error)
        })

        console.log(JSON.stringify(datos));

        //reactivo el envío del form
        // formLogin.submit();
    }
});




//valido email
function validarEmail(errores) {
    let inputEmailValue = inputEmail.value.trim();
    // console.log(inputEmailValue);

    //validación vacío
    if(inputEmailValue === ""){
        errores.push({
            input: "email", 
            error: "Agrega el email porque es obligatorio"
        })
    }

    //validación con Expresión Regular
    if(!inputEmailValue.match(/^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/ )
    ){
        errores.push({
            input: "email", 
            error: "Agregá un email válido"
        })
    }
}

//validar pass
function validarPass(errores) {
    let inputPassValue = inputPass.value;
    // console.log(inputPassValue);


    if (inputPassValue === "") {
        errores.push({
            input: "pass",
            error: "Te olvidaste la contraseña",
        });
    }

    return inputPassValue;
}


//SWITCH ERRORES para todos los formularios
function switchErrores(errores) {
    errores.forEach(error => {
        switch (error.input) {
            case "email":
                //1er error elemento -- 2do atributo del objeto
                errorEmail.innerText = error.error; 
                break;
        
            case "pass":
                errorPass.innerText = error.error;
                break;
            default:
                break;
        }
    });
}

const ojito = document.querySelector("i.far");
console.log(ojito);

ojito.addEventListener('click', function () {
    ojito.classList.toggle("fa-eye");
    ojito.classList.toggle("fa-eye-slash");

    if (inputPass.getAttribute('type') === 'password') {
        inputPass.setAttribute('type', 'text');
    } else {
        inputPass.setAttribute('type', 'password');
    }
})
