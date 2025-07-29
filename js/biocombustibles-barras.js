
fetch("data/Graficos de barras/16 biofuel-production.xlsx")
  .then(res => res.arrayBuffer())
  .then(buffer => {
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const data2020 = rows.filter(row =>
      row["Year"] === 2020 &&
      row["Biofuels Production - TWh - Total"] != null &&
      !isNaN(row["Biofuels Production - TWh - Total"])
    );

    const sorted = data2020.sort((a, b) =>
      b["Biofuels Production - TWh - Total"] - a["Biofuels Production - TWh - Total"]
    ).slice(0, 10);

    const labels = sorted.map(row => row["Entity"]);
    const data = sorted.map(row => row["Biofuels Production - TWh - Total"]);

    new Chart(document.getElementById("biofuelTop10Chart"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "🔋 Producción de biocombustibles (TWh) - Top 10 (2020)",
          data: data,
          backgroundColor: "#27ae60"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "🔋 Top 10 países por producción de biocombustibles (2020)"
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "TWh"
            }
          },
          x: {
            title: {
              display: true,
              text: "País"
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      }
    });
  })
  .catch(error => console.error("❌ Error al leer el archivo Excel:", error));
