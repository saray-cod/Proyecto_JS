// ============================================
// IMPORTACIONES
// ============================================
import {
    buscarUsuario,
    mostrarDatosUsuario,
    registrarTarea,
    limpiarTodasLasTareas,
    cargarTareasDisponibles
} from './js/task_manager.js';

import {
    validarCampoVacio,
    mostrarError,
    limpiarError
} from './js/func_aux.js';

fetch("http://10.5.225.112:3000");


// ============================================
// INICIALIZACIÓN
// ============================================

/**
 * Esperar a que el DOM cargue
 */
document.addEventListener(

    'DOMContentLoaded',

    function () {

        console.log(
            '✅ DOM completamente cargado'
        );

        console.log(
            '📝 Sistema de asignación de tareas iniciado'
        );

        /*
            Configurar eventos
        */
        configurarEventos();
        configurarDropdown();

    }

);


// ============================================
// CONFIGURAR EVENTOS
// ============================================

/**
 * Configurar todos los eventos
 */
function configurarEventos() {

    /*
        Buscar usuario
    */
    document
        .getElementById(
            'formularioBusquedaUsuario'
        )
        .addEventListener(
            'submit',
            manejarBusquedaUsuario
        );

    /*
        Registrar tarea
    */
    document
        .getElementById(
            'formularioTareas'
        )
        .addEventListener(
            'submit',
            async function (evento) {

                evento.preventDefault();

                console.log(
                    '🚀 FORMULARIO DETECTADO');


                await manejarRegistroTarea(evento);

            }
        );

    /*
        Limpiar tareas
    */
    document
        .getElementById(
            'botonLimpiarTareas'
        )
        .addEventListener(
            'click',
            async function () {

                const confirmar =
                    confirm(
                        '¿Deseas eliminar todas las tareas?'
                    );

                if (confirmar) {

                    await limpiarTodasLasTareas();

                }

            }
        );

}


// ============================================
// BUSCAR USUARIO
// ============================================

/**
 * Manejar búsqueda usuario
 * 
 * @param {Event} evento
 */
async function manejarBusquedaUsuario(evento) {

    /*
        Evitar recarga
    */
    evento.preventDefault();

    /*
        Obtener documento
    */
    const documentoUsuario =
        document.getElementById(
            'documentoUsuario'
        ).value.trim();

    /*
        Obtener elemento error
    */
    const elementoError =
        document.getElementById(
            'errorDocumentoUsuario'
        );

    /*
        Validar campo
    */
    if (
        !validarCampoVacio(
            documentoUsuario
        )
    ) {

        mostrarError(
            elementoError,
            'El documento es obligatorio'
        );

        return;

    }

    /*
        Limpiar error
    */
    limpiarError(
        elementoError
    );

    /*
        Buscar usuario
    */
    const usuario =
        await buscarUsuario(
            documentoUsuario
        );

    /*
        Verificar usuario
    */
    if (!usuario) {

        mostrarError(
            elementoError,
            'Usuario no encontrado'
        );

        return;

    }

    /*
        Mostrar usuario
    */
    mostrarDatosUsuario(
        usuario
    );

}


// ============================================
// REGISTRAR TAREA
// ============================================

/**
 * Manejar registro tarea
 * 
 * @param {Event} evento
 */
async function manejarRegistroTarea(evento) {

    /*
        Evitar recarga
    */
    evento.preventDefault();

    /*
        Obtener valores
    */
    const idTarea =
        document.getElementById(
            'selectorTareas'
        ).value;

    const estado =
        document.getElementById(
            'estadoTarea'
        ).value;

    /*
        Elementos error
    */
    const errorTarea =
        document.getElementById(
            'errorSelectorTareas'
        );

    const errorEstado =
        document.getElementById(
            'errorEstadoTarea'
        );

    /*
        Variable validación
    */
    let formularioValido = true;

    /*
        Validar tarea
    */
    if (
        !validarCampoVacio(
            idTarea
        )
    ) {

        mostrarError(
            errorTarea,
            'Selecciona una tarea'
        );

        formularioValido = false;

    } else {

        limpiarError(
            errorTarea
        );

    }

    /*
        Validar estado
    */
    if (
        !validarCampoVacio(
            estado
        )
    ) {

        mostrarError(
            errorEstado,
            'Selecciona un estado'
        );

        formularioValido = false;

    } else {

        limpiarError(
            errorEstado
        );

    }

    /*
        Verificar validación
    */
    if (!formularioValido) {

        return;

    }

    /*
        Registrar tarea
    */
    await registrarTarea({

        idTarea,
        estado

    });

    /*
        Reiniciar formulario
    */
    document
        .getElementById(
            'formularioTareas'
        )
        .reset();

    /*
        Mensaje
    */
    console.log(
        '✅ Tarea asignada correctamente'
    );
    return false;

}

// DROPDOWN PERSONALIZADO
function configurarDropdown() {
    const cabecera = document.getElementById('dropdownCabecera');
    const lista    = document.getElementById('dropdownLista');

    cabecera.addEventListener('click', function (e) {
        e.stopPropagation();
        lista.classList.toggle('abierto');
    });

    document.addEventListener('click', function () {
        lista.classList.remove('abierto');
    });

    lista.addEventListener('click', function (e) {
        e.stopPropagation();
    });
}
// BOTON AGREGAR TAREAS
const boton = document.getElementById('botonAgregarTarea');
boton.addEventListener('click', async () => {
    const titulo = prompt('Ingrese el título de la nueva tarea: ');
    if (!titulo) return;
    const descripcion = prompt('Ingrese la descripción de la nueva tarea: ');
    if (!descripcion) return;

    try {
        const API_URL = `${window.location.protocol}//${window.location.hostname}:3000`;
        const respuesta = await fetch(`${API_URL}/tareasDisponibles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, descripcion })
        });
        if (!respuesta.ok) throw new Error('Error al guardar');

        await cargarTareasDisponibles(); // recarga el dropdown con la nueva tarea
        alert('Tarea agregada correctamente');
    } catch (error) {
        console.error(error);
        alert('Error ha habido al agregar la tarea');
    }
});