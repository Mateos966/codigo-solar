fetch("data/Graficos de lineas/17 installed-geothermal-capacity.xlsx")
	.then(res => res.arrayBuffer())
	.then(buffer => {
		const workbook = XLSX.read(buffer, { type: "array" });
		const sheet = workbook.Sheets[workbook.SheetNames[0]];
		const rows = XLSX.utils.sheet_to_json(sheet);

		// Países a graficar
		const entidades = ["Chile", "Mexico", "Italy", "United States", "Philippines"];
		const yearMap = {};

		rows.forEach(row => {
			if (entidades.includes(row.Entity) && row.Year && row["Geothermal Capacity"] != null) {
				const year = String(row.Year);
				if (!yearMap[year]) yearMap[year] = { year };
				yearMap[year][row.Entity] = parseFloat(row["Geothermal Capacity"]);
			}
		});

		const chartData = Object.values(yearMap).sort((a, b) => a.year - b.year);

		new Morris.Line({
			element: "geochart",
			data: chartData,
			xkey: "year",
			ykeys: entidades,
			labels: entidades,
			parseTime: false,
			lineColors: ["#e74c3c", "#3498db", "#2ecc71", "#9b59b6", "#f39c12"]
		});
	})
	.catch(err => console.error("❌ Error al cargar el archivo:", err));
