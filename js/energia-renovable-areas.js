

fetch("data/Graficos de areas/02 modern-renewable-energy-consumption.xlsx")
  .then(res => res.arrayBuffer())
  .then(buffer => {
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const filtered = rows.filter(row =>
      row["Year"] === 2020 &&
      row["Geo Biomass Other - TWh"] != null &&
      !isNaN(row["Geo Biomass Other - TWh"])
    );

    const top10 = filtered.sort((a, b) =>
      b["Geo Biomass Other - TWh"] - a["Geo Biomass Other - TWh"]
    ).slice(0, 10);

    const labels = top10.map(row => row["Entity"]);
    const data = top10.map(row => row["Geo Biomass Other - TWh"]);

    const canvas = document.getElementById("renewableAreaChart2020");
    if (!canvas || !canvas.getContext) {
      console.error("❌ Canvas 'renewableAreaChart2020' no encontrado.");
      return;
    }

    new Chart(canvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "🔋 Geo Biomass Other - TWh (2020)",
          data: data,
          fill: true,
          borderColor: "#27ae60",
          backgroundColor: "rgba(39, 174, 96, 0.3)",
          tension: 0.4,
          pointBackgroundColor: "#2ecc71",
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "🌿 Top 10 países por generación renovable moderna (2020)"
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "TWh" }
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

