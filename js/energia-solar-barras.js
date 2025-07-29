

fetch("data/Graficos de barras/12 solar-energy-consumption.xlsx")
  .then(res => res.arrayBuffer())
  .then(buffer => {
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const data2020 = rows.filter(row =>
      row["Year"] === 2020 &&
      row["Electricity from solar (TWh)"] != null &&
      !isNaN(row["Electricity from solar (TWh)"])
    );

    const sorted = data2020.sort((a, b) =>
      b["Electricity from solar (TWh)"] - a["Electricity from solar (TWh)"]
    ).slice(0, 10);

    const labels = sorted.map(row => row["Entity"]);
    const data = sorted.map(row => row["Electricity from solar (TWh)"]);

    new Chart(document.getElementById("solarTop10Chart"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "☀️ Consumo de energía solar (TWh) - Top 10 (2020)",
          data: data,
          backgroundColor: "#f39c12"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "☀️ Top 10 países por consumo de energía solar (2020)"
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

