//para que quede guardado en el localStorage la elección del usuario
let darkMode = localStorage.getItem("darkMode");

//capturo el botón
const darkModeToggle = document.getElementById("dark-mode-toggle");

//verificar si el modo oscuro está activada
//si está activado, desactivarlo
//si está desactivado, activarlo

const enableDarkMode = () => {
    //1. Agregar la clase dark al body
    document.body.classList.add("dark");

    //2. Actualizar el darkMode en el localStorage
    localStorage.setItem("darkMode", "enabled");
};


const disableDarkMode = () => {
    //1. Remover la clase dark del body
    document.body.classList.remove("dark");

    //2. Actualizar el darkMode en el localStorage
    localStorage.setItem("darkMode", null);
};


//VERIFICAMOS si darkMode almacenado en el localStorage está activado --> llamamos a la función para que lo active
if ( darkMode === "enabled") {
    enableDarkMode();
}


//Agregamos el evento al botón
darkModeToggle.addEventListener("click", () => {
    //obtenemos el darkMode Almacenado
    darkMode = localStorage.getItem("darkMode");

    if(darkMode !== "enabled"){
        enableDarkMode();
        console.log(darkMode);
    } else {
        disableDarkMode();
        console.log(darkMode);
    }
})

