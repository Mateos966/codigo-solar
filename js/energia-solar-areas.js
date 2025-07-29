window.onload = function () {
  fetch("data/Graficos de areas/14 solar-share-energy.xlsx")
    .then(res => res.arrayBuffer())
    .then(buffer => {
      const workbook = XLSX.read(buffer, { type: "array" });

      // Validamos que exista al menos una hoja
      if (workbook.SheetNames.length === 0) {
        console.error("❌ El archivo no tiene hojas.");
        return;
      }

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      // Filtrar datos para el año 2020 y valores numéricos válidos
      const filtered = rows.filter(row =>
        row["Year"] === 2020 &&
        row["Solar (% equivalent primary energy)"] != null &&
        !isNaN(row["Solar (% equivalent primary energy)"])
      );

      const top10 = filtered.sort((a, b) =>
        b["Solar (% equivalent primary energy)"] - a["Solar (% equivalent primary energy)"]
      ).slice(0, 10);

      const labels = top10.map(row => row["Entity"]);
      const data = top10.map(row => row["Solar (% equivalent primary energy)"]);

      const canvas = document.getElementById("renewableAreaSolarChart2020");
      if (!canvas || !canvas.getContext) {
        console.error("❌ Canvas 'renewableAreaChart2020' no encontrado.");
        return;
      }

      new Chart(canvas, {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            label: "☀️ Participación Solar (% de energía primaria equivalente)",
            data: data,
            fill: true,
            borderColor: "#f39c12",
            backgroundColor: "rgba(243, 156, 18, 0.3)",
            tension: 0.4,
            pointBackgroundColor: "#f1c40f",
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: "🌞 Top 10 países con mayor participación solar (2020)"
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "%" }
            },
            x: {
              title: { display: true, text: "País" },
              ticks: { maxRotation: 45, minRotation: 45 }
            }
          }
        }
      });
    })
    .catch(error => console.error("❌ Error al cargar el archivo:", error));
};
