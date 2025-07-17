fetch("data/Graficos de torta/11 share-electricity-wind.xlsx")
	.then(res => res.arrayBuffer())
	.then(buffer => {
		const workbook = XLSX.read(buffer, { type: "array" });
		const sheet = workbook.Sheets[workbook.SheetNames[0]];
		const rows = XLSX.utils.sheet_to_json(sheet);

		// Mostrar claves reales en consola
		console.log("🔍 Claves detectadas:", Object.keys(rows[0]));
		console.log("📄 Primeras filas:", rows.slice(0, 5));

		// Detectar columna que contenga "wind"
		const columnaEolica = Object.keys(rows[0]).find(k =>
			k.toLowerCase().includes("wind")
		);

		if (!columnaEolica) {
			alert("No se encontró ninguna columna relacionada con 'Wind'.");
			return;
		}

		const año = 2020;
		const datos = rows.filter(row =>
			row.Year === año &&
			typeof row[columnaEolica] === "number" &&
			row[columnaEolica] > 0
		);

		if (datos.length === 0) {
			alert(`No hay datos válidos para el año ${año} en la columna '${columnaEolica}'`);
			return;
		}

		const top5 = datos
			.sort((a, b) => b[columnaEolica] - a[columnaEolica])
			.slice(0, 5);

		const labels = top5.map(row => row.Entity);
		const values = top5.map(row => row[columnaEolica]);

		const ctx = document.getElementById("pieCharteolica").getContext("2d");
		new Chart(ctx, {
			type: "pie",
			data: {
				labels: labels,
				datasets: [{
					data: values,
					backgroundColor: ["#1abc9c", "#3498db", "#9b59b6", "#f39c12", "#e74c3c"]
				}]
			},
			options: {
				responsive: true,
				plugins: {
					legend: { position: "bottom" },
					title: {
						display: true,
						text: `Top 5 países con mayor electricidad eólica en ${año}`
					}
				}
			}
		});
	})
	.catch(err => console.error("❌ Error al cargar el archivo:", err));
