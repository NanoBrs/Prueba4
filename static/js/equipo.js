const API_URL = 'http://127.0.0.1:8000/api/equipos/';
const API_DT_URL = 'http://127.0.0.1:8000/api/dt/';

document.addEventListener('DOMContentLoaded', function() {
    fetchEquipos();  // Cargar equipos inicialmente
    fetchDTs();  // Cargar directores técnicos inicialmente

    // Manejar el formulario de añadir equipo
    document.getElementById('modalAddEquipo').addEventListener('submit', async function(event) {
        event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

        // Obtener el ID del director técnico seleccionado
        const dtId = document.getElementById('director_tecnico').value;

        // Verificar que se haya seleccionado un director técnico
        if (!dtId) {
            alert("Por favor, selecciona un director técnico para el equipo.");
            return;  // Detener el envío del formulario si no se selecciona un DT
        }

        // Recoger los datos del formulario
        const equipoData = {
            nombre: document.getElementById('nombre').value,
            ciudad: document.getElementById('ciudad').value,
            campeonatos: parseInt(document.getElementById('campeonatos').value),
            conferencia: document.getElementById('conferencia').value,
            estadio: document.getElementById('estadio').value,
            colores: document.getElementById('colores').value,
            liga: document.getElementById('liga').value,
            director_tecnico: parseInt(dtId)  // Enviar el ID del DT seleccionado
        };

        try {
            // Enviar los datos al backend a través de la API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(equipoData),
            });

            if (response.ok) {
                // Si todo sale bien, recargamos la lista de equipos
                fetchEquipos();
                alert("Equipo añadido correctamente");
                // Opcionalmente, puedes cerrar el modal si es necesario
                const modalAddEquipo = bootstrap.Modal.getInstance(document.getElementById('modalAddEquipo'));
                modalAddEquipo.hide();
            } else {
                const errorData = await response.json();
                alert(`Error al agregar el equipo: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Error al agregar el equipo.");
        }
    });

    // Manejar el formulario de editar equipo
    document.getElementById('modalEditEquipo').addEventListener('submit', async function(event) {
        event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

        const equipoId = document.getElementById('editEquipoId').value;

        // Obtener el ID del director técnico seleccionado
        const dtId = document.getElementById('editDirectorTecnico').value;

        // Verificar que se haya seleccionado un director técnico
        if (!dtId) {
            alert("Por favor, selecciona un director técnico para el equipo.");
            return;  // Detener el envío del formulario si no se selecciona un DT
        }

        // Recoger los datos del formulario
        const equipoData = {
            nombre: document.getElementById('editNombre').value,
            ciudad: document.getElementById('editCiudad').value,
            campeonatos: parseInt(document.getElementById('editCampeonatos').value),
            conferencia: document.getElementById('editConferencia').value,
            estadio: document.getElementById('editEstadio').value,
            colores: document.getElementById('editColores').value,
            liga: document.getElementById('editLiga').value,
            director_tecnico: parseInt(dtId)  // Enviar el ID del DT seleccionado
        };

        try {
            const response = await fetch(`${API_URL}${equipoId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(equipoData),
            });

            if (response.ok) {
                fetchEquipos();
                alert("Equipo actualizado correctamente");
                const modalEditEquipo = bootstrap.Modal.getInstance(document.getElementById('modalEditEquipo'));
                modalEditEquipo.hide();
            } else {
                const errorData = await response.json();
                alert(`Error al modificar el equipo: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Error al modificar el equipo.");
        }
    });
});

// Función para cargar los directores técnicos disponibles
async function fetchDTs() {
    const response = await fetch(API_DT_URL);
    const dts = await response.json();

    const dtSelect = document.getElementById('director_tecnico');
    dtSelect.innerHTML = '<option value="">Seleccione un Director Técnico</option>';  // Limpiar opciones anteriores

    dts.forEach(dt => {
        const option = document.createElement('option');
        option.value = dt.id;  // Usar 'id' o el campo correspondiente que representa al DT
        option.textContent = `${dt.nombre} ${dt.apellido}`;  // Mostrar el nombre y apellido del DT
        dtSelect.appendChild(option);
    });

    // Cargar los directores técnicos en el formulario de edición (esto solo se ejecuta una vez)
    const editDtSelect = document.getElementById('editDirectorTecnico');
    editDtSelect.innerHTML = '<option value="">Seleccione un Director Técnico</option>';  // Limpiar opciones anteriores

    dts.forEach(dt => {
        const option = document.createElement('option');
        option.value = dt.id;  // Usar 'id' o el campo correspondiente que representa al DT
        option.textContent = `${dt.nombre} ${dt.apellido}`;  // Mostrar el nombre y apellido del DT
        editDtSelect.appendChild(option);
    });
}

// Función para cargar los equipos
async function fetchEquipos() {
    const response = await fetch(API_URL);
    const equipos = await response.json();
    const equiposTableBody = document.getElementById('equipo-table-body');
    equiposTableBody.innerHTML = '';  // Limpiar tabla

    equipos.forEach(async equipo => {
        let dtNombre = 'Sin DT';
        if (equipo.director_tecnico) {
            const dtResponse = await fetch(`${API_DT_URL}${equipo.director_tecnico}/`);
            if (dtResponse.ok) {
                const dtData = await dtResponse.json();
                dtNombre = `${dtData.nombre} ${dtData.apellido}`;  // Mostrar el nombre del director técnico
            }
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${equipo.id}</td>
            <td>${equipo.nombre}</td>
            <td>${equipo.ciudad}</td>
            <td>${equipo.campeonatos}</td>
            <td>${equipo.conferencia}</td>
            <td>${equipo.estadio}</td>
            <td>${equipo.colores}</td>
            <td>${equipo.liga}</td>
            <td>${dtNombre}</td>  <!-- Mostrar el nombre del DT -->
            <td>
                <button class="btn btn-warning" onclick="editEquipo(${equipo.id})">Editar</button>
                <button class="btn btn-danger" onclick="deleteEquipo(${equipo.id})">Eliminar</button>
            </td>
        `;
        equiposTableBody.appendChild(row);
    });
}

// Función para editar un equipo
async function editEquipo(id) {
    const response = await fetch(`${API_URL}${id}/`);
    const equipo = await response.json();
    
    // Cargar directores técnicos antes de rellenar el formulario
    await fetchDTs();  // Cargar DTs para que estén disponibles en la edición

    // Rellenar el formulario con los datos del equipo

    document.getElementById('editNombre').value = equipo.nombre;
    document.getElementById('editCiudad').value = equipo.ciudad;
    document.getElementById('editCampeonatos').value = equipo.campeonatos;
    document.getElementById('editConferencia').value = equipo.conferencia;
    document.getElementById('editEstadio').value = equipo.estadio;
    document.getElementById('editColores').value = equipo.colores;
    document.getElementById('editLiga').value = equipo.liga;
    
    // Establecer el ID del director técnico
    document.getElementById('editDirectorTecnico').value = equipo.director_tecnico;

    const modalEditEquipo = new bootstrap.Modal(document.getElementById('modalEditEquipo'));
    modalEditEquipo.show();
}

// Función para eliminar un equipo
async function deleteEquipo(id) {
    const response = await fetch(`${API_URL}${id}/`, {
        method: 'DELETE'
    });

    if (response.ok) {
        fetchEquipos();  // Recargar la lista de equipos
        alert("Equipo eliminado");
    } else {
        alert("Error al eliminar el equipo.");
    }
}
