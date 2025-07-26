fetch("data/Graficos de lineas/09 cumulative-installed-wind-energy-capacity-gigawatts.xlsx")
	.then(res => res.arrayBuffer())
	.then(buffer => {
		const workbook = XLSX.read(buffer, { type: "array" });
		const sheet = workbook.Sheets[workbook.SheetNames[0]];
		const rows = XLSX.utils.sheet_to_json(sheet);

		// Países a graficar
		const entidades = ["Argentina", "Brazil", "Chile", "Mexico", "Spain"];
		const yearMap = {};

		rows.forEach(row => {
			if (entidades.includes(row.Entity) && row.Year && row["Wind Capacity"] != null) {
				const year = String(row.Year);
				if (!yearMap[year]) yearMap[year] = { year };
				yearMap[year][row.Entity] = parseFloat(row["Wind Capacity"]);
			}
		});

		const chartData = Object.values(yearMap).sort((a, b) => a.year - b.year);

		new Morris.Line({
			element: "windchart",
			data: chartData,
			xkey: "year",
			ykeys: entidades,
			labels: entidades,
			parseTime: false,
			lineColors: ["#1E90FF", "#FFA500", "#2ECC71", "#9B59B6", "#E74C3C"]
		});
	})
	.catch(err => console.error("❌ Error al cargar el archivo:", err));
