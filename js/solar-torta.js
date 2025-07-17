fetch("data/Graficos de torta/15 share-electricity-solar.xlsx")
	.then(res => res.arrayBuffer())
	.then(buffer => {
		const workbook = XLSX.read(buffer, { type: "array" });
		const sheet = workbook.Sheets[workbook.SheetNames[0]];
		const rows = XLSX.utils.sheet_to_json(sheet);

		// Mostrar claves reales en consola
		console.log("🔍 Claves detectadas:", Object.keys(rows[0]));
		console.log("📄 Primeras filas:", rows.slice(0, 5));

		// Detectar columna que contenga "solar"
		const columnaSolar = Object.keys(rows[0]).find(k =>
			k.toLowerCase().includes("solar")
		);

		if (!columnaSolar) {
			alert("No se encontró ninguna columna relacionada con 'Solar'.");
			return;
		}

		const año = 2020;
		const datos = rows.filter(row =>
			row.Year === año &&
			typeof row[columnaSolar] === "number" &&
			row[columnaSolar] > 0
		);

		if (datos.length === 0) {
			alert(`No hay datos válidos para el año ${año} en la columna '${columnaSolar}'`);
			return;
		}

		const top5 = datos
			.sort((a, b) => b[columnaSolar] - a[columnaSolar])
			.slice(0, 5);

		const labels = top5.map(row => row.Entity);
		const values = top5.map(row => row[columnaSolar]);

		const ctx = document.getElementById("pieChartsolar").getContext("2d");
		new Chart(ctx, {
			type: "pie",
			data: {
				labels: labels,
				datasets: [{
					data: values,
					backgroundColor: ["#f39c12", "#e67e22", "#f1c40f", "#ffcc00", "#ff9900"]
				}]
			},
			options: {
				responsive: true,
				plugins: {
					legend: { position: "bottom" },
					title: {
						display: true,
						text: `Top 5 países con mayor electricidad solar en ${año}`
					}
				}
			}
		});
	})
	.catch(err => console.error("❌ Error al cargar el archivo:", err));
