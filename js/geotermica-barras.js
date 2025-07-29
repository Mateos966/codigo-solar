
fetch("data/Graficos de barras/17 installed-geothermal-capacity.xlsx")
  .then(res => res.arrayBuffer())
  .then(buffer => {
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const data2020 = rows.filter(row =>
      row["Year"] === 2020 &&
      row["Geothermal Capacity"] != null &&
      !isNaN(row["Geothermal Capacity"])
    );

    const sorted = data2020.sort((a, b) =>
      b["Geothermal Capacity"] - a["Geothermal Capacity"]
    ).slice(0, 10);

    const labels = sorted.map(row => row["Entity"]);
    const data = sorted.map(row => row["Geothermal Capacity"]);

    new Chart(document.getElementById("geoTop10Chart"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "🔋 Capacidad geotérmica instalada (MW) - Top 10 (2020)",
          data: data,
          backgroundColor: "#8e44ad"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "🔋 Top 10 países por capacidad geotérmica instalada (2020)"
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "MW"
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
