fetch("data/Graficos de torta/07 share-electricity-hydro.xlsx")
	.then(res => res.arrayBuffer())
	.then(buffer => {
		const workbook = XLSX.read(buffer, { type: "array" });
		const sheet = workbook.Sheets[workbook.SheetNames[0]];
		const rows = XLSX.utils.sheet_to_json(sheet);

		console.log("🔍 Claves detectadas:", Object.keys(rows[0]));
		console.log("📄 Primeras filas:", rows.slice(0, 5));

		// Intenta detectar columna que contenga "hydro"
		const columnaHidro = Object.keys(rows[0]).find(k =>
			k.toLowerCase().includes("hydro")
		);

		if (!columnaHidro) {
			alert("No se encontró ninguna columna relacionada con 'Hydro'.");
			return;
		}

		const año = 2020;
		const datos = rows.filter(row =>
			row.Year === año &&
			typeof row[columnaHidro] === "number" &&
			row[columnaHidro] > 0
		);

		if (datos.length === 0) {
			alert(`No hay datos válidos para el año ${año} en la columna '${columnaHidro}'`);
			return;
		}

		const top5 = datos
			.sort((a, b) => b[columnaHidro] - a[columnaHidro])
			.slice(0, 5);

		const labels = top5.map(row => row.Entity);
		const values = top5.map(row => row[columnaHidro]);

		const ctx = document.getElementById("hidroelectrico").getContext("2d");
		new Chart(ctx, {
			type: "pie",
			data: {
				labels: labels,
				datasets: [{
					data: values,
					backgroundColor: ["#3498db", "#1abc9c", "#2ecc71", "#f1c40f", "#e67e22"]
				}]
			},
			options: {
				responsive: true,
				plugins: {
					legend: { position: "bottom" },
					title: {
						display: true,
						text: `Top 5 países con mayor electricidad hidroeléctrica en ${año}`
					}
				}
			}
		});
	})
	.catch(err => console.error("❌ Error al cargar el archivo:", err));
