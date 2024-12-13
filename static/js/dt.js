const API_URL = 'http://127.0.0.1:8000/api/dt/';

document.addEventListener('DOMContentLoaded', function() {
    fetchDTs();  // Cargar DTs inicialmente

    // Manejar el formulario de añadir DT (similar a como se hizo en el archivo de jugador)
    document.getElementById('modalAddDt').addEventListener('submit', async function(event) {
        event.preventDefault();

        const dtData = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            anios_exp: parseInt(document.getElementById('anios_exp').value),
            campeonatos: parseInt(document.getElementById('campeonatos').value),
            activo: document.getElementById('activo').value === "true",  // Convertir el valor de "activo" a booleano
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dtData),
            });

            if (response.ok) {
                fetchDTs();  // Recargar la lista de DTs
                alert("DT añadido correctamente");
                const modalAddDt = bootstrap.Modal.getInstance(document.getElementById('modalAddDt'));
                modalAddDt.hide();
            } else {
                alert("Error al agregar el DT.");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Error al agregar el DT.");
        }
    });
});

// Función para cargar los DTs
async function fetchDTs() {
    const response = await fetch(API_URL);
    const dts = await response.json();
    const dtTableBody = document.getElementById('dt-table-body');
    dtTableBody.innerHTML = '';  // Limpiar la tabla

    dts.forEach(dt => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${dt.id}</td>
            <td>${dt.nombre}</td>
            <td>${dt.apellido}</td>
            <td>${dt.anios_exp}</td>
            <td>${dt.campeonatos}</td>
            <td>${dt.activo ? 'Sí' : 'No'}</td>
            <td>
                <button class="btn btn-warning" onclick="editDT(${dt.id})" data-bs-toggle="modal" data-bs-target="#modalEditDt">Editar</button>
                <button class="btn btn-danger" onclick="deleteDT(${dt.id})">Eliminar</button>
            </td>
        `;
        dtTableBody.appendChild(row);
    });
}

// Función para editar un DT
async function editDT(id) {
    // Obtener los datos actuales del DT
    const dt = await fetchDTData(id);

    // Rellenar el formulario de edición con los datos del DT
    document.getElementById('editNombre').value = dt.nombre;
    document.getElementById('editApellido').value = dt.apellido;
    document.getElementById('editAniosExp').value = dt.anios_exp;
    document.getElementById('editCampeonatos').value = dt.campeonatos;
    document.getElementById('editActivo').value = dt.activo.toString();

    // Manejar la actualización de los datos
    document.getElementById('editDtForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const updatedDT = {
            nombre: document.getElementById('editNombre').value,
            apellido: document.getElementById('editApellido').value,
            anios_exp: parseInt(document.getElementById('editAniosExp').value),
            campeonatos: parseInt(document.getElementById('editCampeonatos').value),
            activo: document.getElementById('editActivo').value === "true",
        };

        // Hacer la solicitud PUT para actualizar el DT
        const response = await fetch(`${API_URL}${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedDT),
        });

        if (response.ok) {
            fetchDTs();  // Recargar la lista de DTs
            alert("DT actualizado correctamente");
            const modalEditDt = bootstrap.Modal.getInstance(document.getElementById('modalEditDt'));
            modalEditDt.hide();
        } else {
            alert("Error al modificar el DT.");
        }
    });
}

// Función para obtener los datos de un DT por ID
async function fetchDTData(id) {
    const response = await fetch(`${API_URL}${id}/`);
    const dtData = await response.json();
    return dtData;
}

// Función para eliminar un DT
async function deleteDT(id) {
    const response = await fetch(`${API_URL}${id}/`, {
        method: 'DELETE'
    });

    if (response.ok) {
        fetchDTs();  // Recargar la lista de DTs
        alert("DT eliminado");
    } else {
        alert("Error al eliminar el DT.");
    }
}
