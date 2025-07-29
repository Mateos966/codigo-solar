
fetch("data/Graficos de barras/05 hydropower-consumption.xlsx")
  .then(res => res.arrayBuffer())
  .then(buffer => {
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const data2021 = rows.filter(row =>
      row["Year"] === 2021 &&
      row["Electricity from hydro (TWh)"] != null &&
      !isNaN(row["Electricity from hydro (TWh)"])
    );

    const sorted = data2021.sort((a, b) =>
      b["Electricity from hydro (TWh)"] - a["Electricity from hydro (TWh)"]
    ).slice(0, 10);

    const labels = sorted.map(row => row["Entity"]);
    const data = sorted.map(row => row["Electricity from hydro (TWh)"]);

    new Chart(document.getElementById("hydroTop10Chart"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "🔷 Consumo de energía hidroeléctrica (TWh) - Top 10 (2021)",
          data: data,
          backgroundColor: "#3498DB"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "🔷 Top 10 países por consumo de energía hidroeléctrica (2021)"
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

