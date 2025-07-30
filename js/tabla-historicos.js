// tabla-historicos.js

$(document).ready(function () {
  Papa.parse('data/energia_renovable.csv', {
    download: true,
    header: true,
    delimiter: ";", // Separador
    complete: function (results) {
      const data = results.data;
      const tableBody = $('#tabla-historicos tbody');

      data.forEach(row => {
        if (row['Entity'] && row['Year']) {
          const fila = `
            <tr>
              <td>${row['Entity']}</td>
              <td>${row['Code']}</td>
              <td>${row['Year']}</td>
              <td>${row['Solar Generation - TWh'] || '-'}</td>
              <td>${row['Wind Generation - TWh'] || '-'}</td>
              <td>${row['Hydro Generation - TWh'] || '-'}</td>
              <td>${row['Geo Biomass Other - TWh'] || '-'}</td>
            </tr>
          `;
          tableBody.append(fila);
        }
      });

      $('#tabla-historicos').DataTable({
        language: {
          url: '//cdn.datatables.net/plug-ins/1.13.5/i18n/es-ES.json'
        },
        pageLength: 25,
        responsive: true,
        order: [[2, 'desc']] // Ordenar por año descendente
      });
    },
    error: function (err) {
      console.error('Error al cargar CSV:', err);
    }
  });
});