const API_URL = 'http://127.0.0.1:8000/api/jugadores/';
const API_TEAMS_URL = 'http://127.0.0.1:8000/api/equipos/';

document.addEventListener('DOMContentLoaded', function() {
    fetchTeams();  // Cargar equipos inicialmente
    fetchPlayers();  // Cargar jugadores inicialmente

    // Manejar el formulario de añadir jugador
    document.getElementById('modalAddJugador').addEventListener('submit', async function(event) {
        event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

        // Obtener el ID del equipo seleccionado
        const equipoId = document.getElementById('equipo').value;

        // Verificar que se haya seleccionado un equipo
        if (!equipoId) {
            alert("Por favor, selecciona un equipo para el jugador.");
            return;  // Detener el envío del formulario si no se selecciona un equipo
        }

        // Recoger los datos del formulario
        const jugadorData = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            ppp: parseFloat(document.getElementById('ppp').value),
            eficacia: parseFloat(document.getElementById('eficacia').value),
            posicion: document.getElementById('posicion').value,
            edad: parseInt(document.getElementById('edad').value),
            campeonatos: parseInt(document.getElementById('campeonatos').value),
            // Enviar el ID del equipo seleccionado (no nulo)
            equipo: parseInt(equipoId)
        };

        try {
            // Enviar los datos al backend a través de la API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jugadorData),
            });

            if (response.ok) {
                // Si todo sale bien, recargamos la lista de jugadores
                fetchPlayers();
                alert("Jugador añadido correctamente");
                // Opcionalmente, puedes cerrar el modal si es necesario
                const modalAddJugador = bootstrap.Modal.getInstance(document.getElementById('modalAddJugador'));
                modalAddJugador.hide();
            } else {
                // En caso de error, mostrar el mensaje
                const errorData = await response.json();
                console.log(jugadorData); 
                alert(`Error al agregar el jugador: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            // Manejar errores de red o problemas con la API
            console.error('Error:', error);
            alert("Error al agregar el jugador.");
        }
    });
});

// Función para cargar los equipos disponibles
async function fetchTeams() {
    const response = await fetch(API_TEAMS_URL);
    const teams = await response.json();

    const equipoSelect = document.getElementById('equipo');
    equipoSelect.innerHTML = '<option value="">Seleccione un equipo</option>'; // Limpiar las opciones previas

    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;  // Usar 'id' o el campo correspondiente que representa el equipo
        option.textContent = team.nombre;  // Usar el campo adecuado para el nombre del equipo
        equipoSelect.appendChild(option);
    });

    // Cargar los equipos en el formulario de edición (esto solo se ejecuta una vez)
    const editEquipoSelect = document.getElementById('editEquipo');
    editEquipoSelect.innerHTML = '<option value="">Seleccione un equipo</option>'; // Limpiar las opciones previas

    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;  // Usar 'id' o el campo correspondiente que representa el equipo
        option.textContent = team.nombre;  // Usar el campo adecuado para el nombre del equipo
        editEquipoSelect.appendChild(option);
    });
}

// Función para cargar los jugadores
async function fetchPlayers() {
    const response = await fetch(API_URL);
    const players = await response.json();
    const playersTableBody = document.getElementById('player-table-body');
    playersTableBody.innerHTML = '';  // Limpiar la tabla

    players.forEach(async player => {
        // Si equipo es un ID, hacemos una segunda solicitud para obtener los datos del equipo
        let equipoNombre = 'N/A';
        if (player.equipo) {
            const equipoResponse = await fetch(`http://127.0.0.1:8000/api/equipos/${player.equipo}/`);
            if (equipoResponse.ok) {
                const equipoData = await equipoResponse.json();
                equipoNombre = equipoData.nombre;  // Asumiendo que 'nombre' es la propiedad del equipo
            }
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.id}</td>
            <td>${player.nombre}</td>
            <td>${player.apellido}</td>
            <td>${player.ppp}</td>
            <td>${player.eficacia}</td>
            <td>${player.posicion}</td>
            <td>${player.edad}</td>
            <td>${player.campeonatos}</td>
            <td>${equipoNombre}</td> <!-- Mostramos el nombre del equipo -->
            <td>
                <button class="btn btn-warning" onclick="editPlayer(${player.id})" data-bs-toggle="modal" data-bs-target="#modalEditJugador">Editar</button>
                <button class="btn btn-danger" onclick="deletePlayer(${player.id})">Eliminar</button>
            </td>
        `;
        playersTableBody.appendChild(row);
    });
}
// Función para editar un jugador
async function editPlayer(id) {
    // Esperar la respuesta de fetchPlayerData para obtener los datos reales del jugador
    const player = await fetchPlayerData(id);  // Obtener los datos del jugador

    // Cargar los equipos antes de rellenar el formulario
    await fetchTeams();  // Cargar equipos para que estén disponibles en la edición

    // Rellenar el formulario con los datos del jugador
    document.getElementById('editNombre').value = player.nombre;
    document.getElementById('editApellido').value = player.apellido;
    document.getElementById('editPpp').value = player.ppp;
    document.getElementById('editEficacia').value = player.eficacia;
    document.getElementById('editPosicion').value = player.posicion;
    document.getElementById('editEdad').value = player.edad;
    document.getElementById('editCampeonatos').value = player.campeonatos;

    // Verifica si el jugador tiene un equipo asignado, si lo tiene, selecciona el equipo
    document.getElementById('editEquipo').value = player.equipo ? player.equipo.id : '';  // Asigna el ID del equipo

    // Llamada a la API para actualizar los datos cuando el formulario se envíe
    document.getElementById('editJugadorForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const updatedPlayer = {
            nombre: document.getElementById('editNombre').value,
            apellido: document.getElementById('editApellido').value,
            ppp: parseFloat(document.getElementById('editPpp').value),
            eficacia: parseFloat(document.getElementById('editEficacia').value),
            posicion: document.getElementById('editPosicion').value,
            edad: parseInt(document.getElementById('editEdad').value),
            campeonatos: parseInt(document.getElementById('editCampeonatos').value),
            equipo: document.getElementById('editEquipo').value
        };

        // Hacer el PUT request para actualizar el jugador
        const response = await fetch(`${API_URL}${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPlayer),
        });

        if (response.ok) {
            fetchPlayers();  // Refrescar la lista de jugadores
            alert("Jugador actualizado correctamente");
        } else {
            alert("Error al modificar el jugador.");
        }
    });
}

// Función para eliminar un jugador
async function deletePlayer(id) {
    const response = await fetch(`${API_URL}${id}/`, {
        method: 'DELETE'
    });

    if (response.ok) {
        fetchPlayers();  // Recargar la lista de jugadores
        alert("Jugador eliminado");
    } else {
        alert("Error al eliminar el jugador.");
    }
}

// Simulación de la obtención de datos de un jugador (esto se conectaría a tu API)
async function fetchPlayerData(id) {
    const response = await fetch(`${API_URL}${id}/`);
    const player = await response.json();
    return player;
}
