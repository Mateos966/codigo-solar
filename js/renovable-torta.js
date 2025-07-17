let allRows = [];

fetch("data/Graficos de torta/04 share-electricity-renewables.xlsx")
	.then(res => res.arrayBuffer())
	.then(buffer => {
		const workbook = XLSX.read(buffer, { type: "array" });
		const sheet = workbook.Sheets[workbook.SheetNames[0]];
		const rows = XLSX.utils.sheet_to_json(sheet);

		// Detectar columna que contenga "Renewable"
		const columnas = Object.keys(rows[0]);
		const columnaRenovable = columnas.find(k => k.toLowerCase().includes("renewable"));

		if (!columnaRenovable) {
			alert("No se encontró ninguna columna relacionada con 'Renewables'.");
			return;
		}

		const año = 2020;
		const datos = rows.filter(row =>
			row.Year === año &&
			typeof row[columnaRenovable] === "number" &&
			row[columnaRenovable] > 0
		);

		const top5 = datos
			.sort((a, b) => b[columnaRenovable] - a[columnaRenovable])
			.slice(0, 5);

		const labels = top5.map(row => row.Entity);
		const values = top5.map(row => row[columnaRenovable]);

		const ctx = document.getElementById("pieChart").getContext("2d");
		new Chart(ctx, {
			type: "pie",
			data: {
				labels: labels,
				datasets: [{
					data: values,
					backgroundColor: ["#2ecc71", "#3498db", "#f1c40f", "#e74c3c", "#9b59b6"]
				}]
			},
			options: {
				responsive: true,
				plugins: {
					legend: { position: "bottom" },
					title: {
						display: true,
						text: `Top 5 países con mayor electricidad renovable en ${año}`
					}
				}
			}
		});
	})
	.catch(err => console.error("❌ Error al cargar el archivo:", err));
