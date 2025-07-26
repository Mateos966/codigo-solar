fetch("data/Graficos de lineas/13 installed-solar-PV-capacity.xlsx")
	.then(res => res.arrayBuffer())
	.then(buffer => {
		const workbook = XLSX.read(buffer, { type: "array" });
		const sheet = workbook.Sheets[workbook.SheetNames[0]];
		const rows = XLSX.utils.sheet_to_json(sheet);

		// Países a graficar
		const entidades = ["Argentina", "Brazil", "Chile", "Mexico", "Spain"];
		const yearMap = {};

		rows.forEach(row => {
			if (entidades.includes(row.Entity) && row.Year && row["Solar Capacity"] != null) {
				const year = String(row.Year);
				if (!yearMap[year]) yearMap[year] = { year };
				yearMap[year][row.Entity] = parseFloat(row["Solar Capacity"]);
			}
		});

		const chartData = Object.values(yearMap).sort((a, b) => a.year - b.year);

		new Morris.Line({
			element: "solarchart",
			data: chartData,
			xkey: "year",
			ykeys: entidades,
			labels: entidades,
			parseTime: false,
			lineColors: ["#FFD700", "#FF8C00", "#FF4500", "#DAA520", "#FFA07A"]
		});
	})
	.catch(err => console.error("❌ Error al cargar el archivo:", err));
