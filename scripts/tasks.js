if (sessionStorage.getItem("token") === null) {
  window.location.href = "./index.html";
}

window.addEventListener("load", function () {
  /* ------------- Captura DOMMMMM --------------------*/
  const API_URL = "https://ctd-todo-api.herokuapp.com/v1";
  const username = document.getElementById("user-name");
  const skeleton = document.getElementById("skeleton");
  const closeApp = document.getElementById("closeApp");
  const formNuevaTarea = document.getElementById("formNuevaTarea");
  const nuevaTarea = document.querySelector("input#nuevaTarea");

  const listadoTareasPendientes = document.querySelector(".tareas-pendientes");
  const listadoTareasTerminadas = document.querySelector(".tareas-terminadas");

  const arrayNotas = [];

  const newTask = {
    description: "Aprender Javascript",
    completed: false,
  };

  let arrayNotasGuardado = "";

  /* 
 ------------------ DECLARACIÓN de FUNCIONES ------------------------
*/

  function obtenerNombreUsuario() {
    fetch(`${API_URL}/users/getMe`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: sessionStorage.getItem("token"),
      },
    })
      .then(function (response) {
        // console.log(response);
        if (response.status === 200) {
          return response.json();
        } else {
          if (response.status === 404) {
            return new Error("Nop. Ese usuario no existe");
          }
          if (response.status === 500) {
            return new Error("Error del servidor");
          }
        }
      })
      .then(function (userCreado) {
        // console.log(userCreado);
        username.innerText = `Hola ${userCreado.firstName}`;
      });
  }

  function cerrarSesion() {
    closeApp.addEventListener("click", function (e) {
      e.preventDefault();
      sessionStorage.clear();
      window.location.href = "./index.html";
    });
  }

  function buscarTareas() {
    fetch(`${API_URL}/tasks`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: sessionStorage.getItem("token"),
      },
    })
      .then(function (response) {
        // console.log(response);

        if (response.status === 200 || response.status === 201) {
          return response.json();
        } else {
          if (response.status === 400) {
            throw new Error("Alguno de los datos requeridos está incompleto");
          }
          if (response.status === 401) {
            throw new Error("Requiere autorización");
          }
          if (response.status === 500) {
            throw new Error("Error del servidor");
          }
        }
      })
      .then(function (misTareas) {
        // console.log(misTareas);

        if (misTareas.length === 0) {
          skeleton.classList.remove("skeleton");
          listadoTareasPendientes.innerHTML =
            "<h2>Todavía no creaste ninguna nota</h2>";
        } else {
          listadoTareasPendientes.innerHTML = "";
          listadoTareasTerminadas.innerHTML = "";

          //imprimo tareas según estén completadas o no
          listarTareas(misTareas);

          //obtengo la tareas para cambiarles el estado de pendiente a completado y viceversa
          toggleEstadoTareas(misTareas);

          //editar la descripción de una tarea
          actualizarTarea(misTareas);

          //eliminarTarea
          eliminarTarea(misTareas);
        }
      })
      .catch(function (error) {
        console.log("F en buscar tareas");
        console.warn(error);
      });
  }




  /* Crear tarea: 
capturar el formulario
prevenir el envío
obtener el input y guardarlo (en un objeto)
*/
  function crearTarea() {
    formNuevaTarea.addEventListener("submit", function (e) {
      e.preventDefault();

      //capturo la descripción de la nota
      newTask.description = nuevaTarea.value;
      newTask.completed = false;

      if (newTask.description !== "") {
        fetch(`${API_URL}/tasks`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: sessionStorage.getItem("token"),
          },
          body: JSON.stringify(newTask),
        })
          .then(function (response) {
            console.log(response);

            if (response.status === 200 || response.status === 201) {
              return response.json();
            } else {
              if (response.status === 400) {
                throw new Error(
                  "Alguno de los datos requeridos está incompleto"
                );
              }
              if (response.status === 401) {
                throw new Error("Requiere autorización");
              }
              if (response.status === 500) {
                throw new Error("Error del servidor");
              }
            }
          })
          .then(function (miTarea) {
            // console.log(miTarea);
            arrayNotas.push(miTarea);

            //para cargar sólo la última tarea
            listarTareas([miTarea]);
            // listarTareas(arrayNotas);

            //para que el input quede vacío
            nuevaTarea.value = "";
            buscarTareas();
          })
          .catch(function (error) {
            console.warn(error);
          });
      } else {
        console.log("No agregue la tarea");
      }
    });
    // buscarTareas();
  }

  
  function eliminarTarea(misTareas) {
    let botonEliminar = document.querySelectorAll("i.eliminar");

    botonEliminar.forEach(function (botonEliminar) {
      botonEliminar.addEventListener("click", function () {
        console.log("clic para eliminar una tarea");

        let tareaId =
          botonEliminar.parentElement.parentElement.parentElement.dataset.tareaid;
        // console.log(tareaId);

        fetch(`${API_URL}/tasks/${tareaId}`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: sessionStorage.getItem("token"),
          }
        });
        console.log("Eliminamos la tarea wii " + tareaId);
        buscarTareas();  
      });
    });
  }

  function actualizarTarea(misTareas) {
    let element = document.querySelectorAll("i.editar");

    element.forEach(function (element) {
      element.addEventListener("click", function () {
        console.log("clic para editar una tarea");

        let tareaId =
          element.parentElement.parentElement.parentElement.dataset.tareaid;
        let descripcion =
          element.parentElement.parentElement.parentElement.dataset.description;
        const nuevaDescripcion = prompt("Descripcion actual: " + descripcion);

        descripcion = nuevaDescripcion;

        // console.log(element.parentElement.parentElement.parentElement.dataset.description);
        // console.log(tareaId);

        fetch(`${API_URL}/tasks/${tareaId}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            description: descripcion,
            completed: false,
            createdAt: new Date(),
          }),
        })
          .then(function (res) {
            console.log(res);
            return res.json();
          })
          .then(function (miTarea) {
            console.log(miTarea);

            //TENÍA QUE LLAMAR A buscarTareas() acá y no fuera del then para que sólo hiciera la petición en caso de cambio (CREO)
            buscarTareas();  
          })
          .catch(function (error) {
            console.warn(error);
          });
        });
      });
      
      //TODO EL TIEMPO ESTÁ HACIENDO PETICIONES
      // buscarTareas(); 
    }
    
  //obtengo la tareas para cambiarles el estado de pendiente a completado y viceversa
  function toggleEstadoTareas(misTareas) {
    //obtengo todos los circulos de las tareas pendientes para luego cambiarles el estado
    let botonesCambioEstado = document.querySelectorAll(".tareas");
    // console.log(botonesCambioEstado);

    botonesCambioEstado.forEach(function (element) {
      element.addEventListener("click", function () {
        // console.log("Se está haciendo un click para cambiar estado de una tarea una tarea");
        //capturamos el padre de element y a través de dataset, el id de la tarea --> lo puse en el template data-tareaid
        let tareaId = element.parentElement.dataset.tareaid;
        let tareaCompleted = element.parentElement.dataset.completed;
        let estadoTarea = element.classList;

        // console.log(element.parentElement);
        // console.log(element.classList)

        if (tareaCompleted === "false") {
          estadoTarea.remove(".not-done");
          estadoTarea.add(".tareas-terminadas");

          //FETCH PARA HACER EL PUT Y CAMBIAR ESTADO DE LA TAREA A COMPLETADO
          fetch(`${API_URL}/tasks/${tareaId}`, {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
              Authorization: sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
              completed: true,
              createdAt: new Date(),
            }),
          })
            .then((res) => res.json())
            .then(function (miTarea){
              // console.log(miTarea);
              buscarTareas();
            })
            .catch(function (error) {
              console.warn(error);
            });
        } else {
          estadoTarea.remove(".tareas-terminadas");
          estadoTarea.add(".not-done");

          //FETCH PARA HACER EL PUT Y CAMBIAR ESTADO DE LA TAREA A PENDIENTE
          fetch(`${API_URL}/tasks/${tareaId}`, {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
              Authorization: sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
              completed: false,
              createdAt: new Date(),
            }),
          })
            .then((res) => res.json())
            .then(function (miTarea) {
              // console.log(miTarea);
              buscarTareas();  
            })
            // buscarTareas();
            .catch(function (error) {
              console.warn(error);
            });
        }
      });
    });
  }

  function listarTareas(arrayNotas) {
    arrayNotas.forEach((tarea) => {
      let fecha = new Date(tarea.createdAt);

      let template = `<li data-tareaId=${tarea.id} data-completed=${
        tarea.completed
      } data-description=${tarea.description} class="tarea">
    <div id="estado" class="not-done tareas"></div>
    <div id="descripcion" class="descripcion">
    <p id="nombreTarea" class="nombre">${tarea.description}</p>
    <p id="timestamp" class="timestamp">${fecha.toLocaleDateString()} ${fecha.getHours()}:${fecha.getMinutes()}</p>
      <div class="botones">
        <i class="fas fa-pen-fancy editar"></i>
        <i class="far fa-trash-alt eliminar"></i>
      </div>
    </div>
    `;

      if (tarea.completed == false) {
        listadoTareasPendientes.innerHTML += template;
      } else {
        listadoTareasTerminadas.innerHTML += template;
      }
    });
    
    skeleton.classList.remove("skeleton");

    //TODO EL TIEMPO ESTÁ HACIENDO PETICIONES pero si lo saco, no re-renderiza los cambios actuales
    // buscarTareas();
  }

  /* 
 ------------------ INVOCACION de FUNCIONES ------------------------
*/

  //Poner el nombre de usuario en el nav
  obtenerNombreUsuario();

  cerrarSesion();

  buscarTareas();

  crearTarea();

  // buscarTareas(); --> lo invoco de manera general para que me traiga las tareas

  //listarTareas();  --> cada vez 

  //toggleEstadoTareas(): --> cambiar estado de tareas

  //actualizarTarea(); --> modificar tareas

  //eliminarTarea(); --> elimina tareas, estén pendientes o terminadas

  //tareas terminadas --> ver clase 22 (justo la de mi cumple)
});
