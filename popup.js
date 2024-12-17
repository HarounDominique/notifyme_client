document.addEventListener('DOMContentLoaded', () => {
    console.log('popup.js cargado correctamente');

    const searchInput = document.getElementById('searchInput');
    const actionButton = document.getElementById('actionButton');
    const resultDiv = document.getElementById('resultDiv');

    if (!searchInput || !actionButton || !resultDiv) {
        console.error('Elementos del DOM faltantes. Verifica el HTML.');
        return;
    }

    // Evento de click en el botón para ejecutar ambas acciones
    actionButton.addEventListener('click', async () => {
        const url = searchInput.value.trim();

        if (!isValidUrl(url)) {
            alert('Por favor, introduce una URL válida.');
            return;
        }

        console.log('Procesando URL:', url);
        resultDiv.innerHTML = '<p>Cargando...</p>'; // Mostrar mensaje de carga

        try {
            // Obtener precio y colores
            const priceData = await fetchPrice(url);

            // Mostrar el precio si está disponible
            resultDiv.innerHTML = '';
            if (priceData.price) {
                const priceElement = document.createElement('p');
                priceElement.textContent = `Precio: ${priceData.price}€`; //TODO: EL PRECIO SE MUESTRA SIN DECIMALES Y TERMINADO EN UNA COMA. PENDIENTE HACER QUE SE RECUPEREN TAMBIÉN LOS DECIMALES EN CASO DE HABERLOS. ADEMÁS, EN OCASIONES EL PRECIO NO ES UN VALOR ÚNICO, SINO UN RANGO; EN CUYO CASO HABRÍA QUE MOSTRARLO.
                resultDiv.appendChild(priceElement);
            } else {
                resultDiv.innerHTML += '<p>Precio no encontrado.</p>';
            }

            // Mostrar las opciones de colores si están disponibles
            if (priceData.colors && priceData.colors.length > 0) {
                const colorsElement = document.createElement('ul');
                colorsElement.textContent = 'Opciones de colores disponibles:';
                priceData.colors.forEach(color => {
                    const li = document.createElement('li');
                    li.textContent = `Haz clic para seleccionar ${color.name}`;

                    // Añadir estado de disponibilidad
                    if (!color.available) {
                        li.textContent += ' NO DISPONIBLE';
                    }

                    colorsElement.appendChild(li);
                });
                resultDiv.appendChild(colorsElement);
            } else {
                resultDiv.innerHTML += '<p>No se encontraron opciones de colores.</p>';
            }
        } catch (error) {
            console.error('Error al obtener información:', error);
            resultDiv.innerHTML = '<p>Hubo un error al procesar la solicitud. Intenta nuevamente más tarde.</p>';
        }
    });

    /**
     * Función para validar si una cadena es una URL válida
     */
    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Función para obtener el precio desde el servidor
     */
    async function fetchPrice(url) {
        const response = await fetch('http://localhost:3000/scrape', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor para obtener el precio');
        }
        return await response.json(); // Procesar respuesta como JSON
    }
});
