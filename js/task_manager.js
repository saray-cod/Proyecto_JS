// ============================================
// IMPORTACIONES
// ============================================

import {

    mostrarError,
    limpiarError

} from './func_aux.js';


// ============================================
// URL DEL SERVIDOR
// ============================================

const API_URL = `${window.location.protocol}//${window.location.hostname}:3000`;


// ============================================
// USUARIO ACTUAL
// ============================================

let usuarioActual = null;


// ============================================
// BUSCAR USUARIO
// ============================================

/**
 * Buscar usuario por documento
 * 
 * @param {string} documentoUsuario
 * @returns {Object|null}
 */
export async function buscarUsuario(documentoUsuario) {

    try {

        /*
            Petición al servidor
        */
        const respuesta =
            await fetch(
                `${API_URL}/usuarios`
            );

        /*
            Convertimos respuesta
        */
        const usuarios =
            await respuesta.json();

        /*
            Buscar usuario
        */
        const usuarioEncontrado =
            usuarios.find(
                usuario =>
                    usuario.id.toString() ===
                    documentoUsuario
            );

        /*
            Retornar usuario
        */
        return usuarioEncontrado || null;

    } catch (error) {

        console.error(
            'Error al buscar usuario:',
            error
        );

        return null;

    }

}


// ============================================
// MOSTRAR DATOS USUARIO
// ============================================

/**
 * Mostrar datos del usuario
 * 
 * @param {Object} usuario
 */
export function mostrarDatosUsuario(usuario) {

    /*
        Guardar usuario actual
    */
    usuarioActual = usuario;

    /*
        Mostrar datos
    */
    document.getElementById(
        'nombreUsuario'
    ).textContent = usuario.name;

    document.getElementById(
        'correoUsuario'
    ).textContent = usuario.email;

    /*
        Mostrar secciones
    */
    document.getElementById(
        'seccionDatosUsuario'
    ).classList.remove('hidden');

    document.getElementById(
        'seccionFormularioTareas'
    ).classList.remove('hidden');

    /*document.getElementById(
        'botonLimpiarTareas'
    ).classList.remove('hidden');*/

    /*
        Cargar tareas disponibles
    */
    cargarTareasDisponibles();

    /*
        Cargar tareas usuario
    */
    cargarTareasUsuario(
        usuario.id
    );

}


// ============================================
// CARGAR TAREAS DISPONIBLES
// ============================================

/**
 * Cargar tareas en selector
 */
export async function cargarTareasDisponibles() {

    try {

        /*
            Petición
        */
        const respuesta =
            await fetch(
                `${API_URL}/tareasDisponibles`
            );

        /*
            Convertir respuesta
        */
        const tareas =
            await respuesta.json();

        /*
            Obtener selector
        */
        const selector =
            document.getElementById(
                'selectorTareas'
            );

        /*
            Limpiar selector
        */
        selector.innerHTML = `
            <option value="">
                -- Selecciona una tarea --
            </option>
        `;

        /*
            Agregar tareas
        */
        tareas.forEach(tarea => {

            const opcion =
                document.createElement(
                    'option'
                );

            opcion.value =
                tarea.id;

            opcion.textContent =
                tarea.titulo;

            selector.appendChild(
                opcion
            );

        });

    } catch (error) {

        console.error(
            'Error al cargar tareas:',
            error
        );

    }

}


// ============================================
// CARGAR TAREAS USUARIO
// ============================================

/**
 * Cargar tareas asignadas
 * 
 * @param {number} usuarioId
 */
export async function cargarTareasUsuario(usuarioId) {

    try {

        /*
            Petición
        */
        const respuesta =
            await fetch(
                `${API_URL}/tareasAsignadas?usuarioId=${usuarioId.toString()}`
            );

        /*
            Convertir respuesta
        */
        const tareas =
            await respuesta.json();

        console.log(
            'Tareas encontradas:',
            tareas
        );

        /*
            Renderizar tabla
        */
        renderizarTareas(
            tareas
        );

    } catch (error) {

        console.error(
            'Error:',
            error
        );

    }

}
// ============================================
// RENDERIZAR TAREAS
// ============================================

/**
 * Mostrar tareas en tabla
 * 
 * @param {Array} tareas
 */
function renderizarTareas(tareas) {

    const cuerpoTabla =
        document.getElementById(
            'cuerpoTablaTareas'
        );

    const tabla =
        document.getElementById(
            'tablaTareas'
        );

    const mensaje =
        document.getElementById(
            'mensajeSinTareas'
        );

    /*
        Limpiar tabla
    */
    cuerpoTabla.innerHTML = '';

    /*
        Verificar tareas
    */
    if (tareas.length === 0) {

        tabla.classList.add(
            'hidden'
        );

        mensaje.classList.remove(
            'hidden'
        );

        tabla.style.display = 'table';

        return;

    }

    /*
        Mostrar tabla
    */
    tabla.classList.remove(
        'hidden'
    );

    mensaje.classList.add(
        'hidden'
    );

    mensaje.style.display = 'none';

    /*
        Recorrer tareas
    */
    tareas.forEach(tarea => {

        /*
            Crear fila
        */
        const fila =
            document.createElement(
                'tr'
            );

        fila.innerHTML = `

        <td>
            ${tarea.titulo}
        </td>

        <td>
            ${tarea.descripcion}
        </td>

        <td>
            ${tarea.estado}
        </td>

        <td>
            ${new Date(
            tarea.fechaAsignacion
        ).toLocaleDateString()}
        </td>

        <td>
            ${tarea.usuarioNombre}
        </td>

        <td>

            <button
                class="boton-eliminar"
                data-id="${tarea.id}"
            >

                Eliminar

            </button>

        </td>
    `;

        /*
            Agregar fila
        */
        cuerpoTabla.appendChild(
            fila
        );

    });

    /*
        Eventos eliminar
    */
    document
        .querySelectorAll(
            '.boton-eliminar'
        )
        .forEach(boton => {

            boton.addEventListener(
                'click',
                async (evento) => {

                    const id =
                        evento.target.getAttribute(
                            'data-id'
                        );

                    await eliminarTarea(
                        id
                    );

                }
            );

        });

}


// ============================================
// REGISTRAR TAREA
// ============================================

/**
 * Asignar tarea
 * 
 * @param {Object} datosTarea
 */
export async function registrarTarea(datosTarea) {

    try {

        /*
            =====================================
            1. OBTENER TAREAS DISPONIBLES
            =====================================
        */
        const respuestaTareas =
            await fetch(
                `${API_URL}/tareasDisponibles`
            );

        /*
            Convertir respuesta JSON
        */
        const tareasDisponibles =
            await respuestaTareas.json();

        /*
            =====================================
            2. BUSCAR LA TAREA SELECCIONADA
            =====================================
        */
        const tareaSeleccionada =
            tareasDisponibles.find(

                tarea =>

                    tarea.id ===
                    datosTarea.idTarea

            );


        /*
            =====================================
            3. CREAR REGISTRO DE ASIGNACIÓN
            =====================================

            NO estamos creando una tarea nueva.

            Solo estamos relacionando:
            - usuario
            - tarea existente
            - estado
        */
        const tareaAsignada = {

            usuarioId:
                usuarioActual.id.toString(),

            usuarioNombre:
                usuarioActual.name,

            tareaId:
                tareaSeleccionada.id,

            titulo:
                tareaSeleccionada.titulo,

            descripcion:
                tareaSeleccionada.descripcion,

            estado:
                datosTarea.estado,

            fechaAsignacion:
                new Date().toISOString()

        };

        /*
            =====================================
            4. GUARDAR ASIGNACIÓN
            =====================================
        */
        const respuesta =
            await fetch(

                `${API_URL}/tareasAsignadas`,

                {

                    method: 'POST',

                    headers: {

                        'Content-Type':
                            'application/json'

                    },

                    body: JSON.stringify(
                        tareaAsignada
                    )

                }

            );

        /*
            Validar respuesta
        */
        if (!respuesta.ok) {

            throw new Error(
                'Error al asignar tarea'
            );

        }

        /*
            =====================================
            5. RECARGAR TABLA
            =====================================
        */
        await cargarTareasUsuario(
            usuarioActual.id
        );

    } catch (error) {

        console.error(
            'Error al registrar tarea:',
            error
        );

        alert(
            'Ocurrió un error al asignar la tarea'
        );

    }

}
// ============================================
// ELIMINAR TAREA
// ============================================

/*
 * Eliminar tarea
 * 
 * @param {number} idTarea*/
 /*
async function eliminarTarea(idTarea) {

    try {

        /*
            Petición eliminar
        
        await fetch(
            `${API_URL}/tareasAsignadas/${idTarea}`,
            {
                method: 'DELETE'
            }
        );

        /*
            Recargar tareas
        
        cargarTareasUsuario(
            usuarioActual.id
        );

    } catch (error) {

        console.error(
            'Error:',
            error
        );

    }

}*/ 
// ============================================
// ELIMINAR TAREA
// ============================================

/**
 * Eliminar tarea
 * * @param {number} idTarea
 */
async function eliminarTarea(idTarea) {

    try {

        const deAcuerdo = confirm("¿Estás seguro de que deseas eliminar esta asignación de tarea?");

        if (!deAcuerdo) {
            return;
        }

        const respuesta = await fetch(
            `${API_URL}/tareasAsignadas/${idTarea}`,
            {
                method: 'DELETE'
            }
        );

        if (respuesta.ok) {
            alert("¡Asignación eliminada con éxito!");
        } else {
            alert("No se pudo eliminar la asignación en el servidor.");
        }

        cargarTareasUsuario(
            usuarioActual.id
        );

    } catch (error) {

        console.error(
            'Error:',
            error
        );
        alert("Ocurrió un error de red al intentar eliminar.");

    }

}


// ============================================
// LIMPIAR TODAS LAS TAREAS
// ============================================

/**
 * Eliminar todas las tareas
 */
export async function limpiarTodasLasTareas() {

    try {

        /*
            Obtener tareas
        */
        const respuesta =
            await fetch(
                `${API_URL}/tareasAsignadas?usuarioId=${usuarioActual.id}`
            );

        /*
            Convertir respuesta
        */
        const tareas =
            await respuesta.json();

        /*
            Eliminar una por una
        */
        for (const tarea of tareas) {

            await fetch(
                `${API_URL}/tareasAsignadas/${tarea.id}`,
                {
                    method: 'DELETE'
                }
            );

        }

        /*
            Recargar tabla
        */
        cargarTareasUsuario(
            usuarioActual.id
        );

    } catch (error) {

        console.error(
            'Error:',
            error
        );

    }

}