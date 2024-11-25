am5.ready(function() {
    // Crear la instancia del mapa
    var root = am5.Root.new("chartdiv");

    // Aplicar el tema de animación
    root.setThemes([am5themes_Animated.new(root)]);

    // Crear el mapa
    var chart = root.container.children.push(am5map.MapChart.new(root, {
        projection: am5map.geoOrthographic(),
        panX: "rotateX",
        panY: "rotateY",
        rotateX: 50,
        rotateY: 50,
        zoomLevel: 1.05,
        background: am5.Rectangle.new(root, {
            fill: am5.color(0x1E90FF) // Fondo azul mar
        }),
        paddingBottom: 20,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20
    }));

    // Añadir la serie de mapas
    var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow
    }));

    // Configurar los polígonos
    polygonSeries.mapPolygons.template.setAll({
        tooltipText: "{name}",
        toggleKey: "active",
        interactive: true,
        fill: am5.color(0x32CD32), // Color de los continentes verde hierba
        stroke: am5.color(0x000000), // Color del borde negro
        strokeWidth: 1
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
        fill: root.interfaceColors.get("primaryButtonHover")
    });

    polygonSeries.mapPolygons.template.states.create("active", {
        fill: root.interfaceColors.get("primaryButtonHover")
    });

    // Crear serie para el relleno de fondo
    var backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
    backgroundSeries.mapPolygons.template.setAll({
        fill: root.interfaceColors.get("alternativeBackground"),
        fillOpacity: 0.1,
        strokeOpacity: 0
    });
    backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180)
    });

    var graticuleSeries = chart.series.unshift(
        am5map.GraticuleSeries.new(root, {
            step: 10
        })
    );

    graticuleSeries.mapLines.template.set("strokeOpacity", 0.1);

    // Hacer que el mapa sea interactivo
    chart.chartContainer.wheelable = true;

    // Configurar eventos
    var previousPolygon;
    var clickedCountry = null; // Variable to store the clicked country

    polygonSeries.mapPolygons.template.on("active", function(active, target) {
        if (previousPolygon && previousPolygon != target) {
            previousPolygon.set("active", false);
        }
        if (target.get("active")) {
            selectCountry(target.dataItem.get("id"));
            clickedCountry = target.dataItem.dataContext.name; // Correctly retrieve the name property
            var centroid = target.geoCentroid();
            console.log("Clicked country:", clickedCountry); // Print the clicked country
            console.log("Coordinates: Latitude", centroid.latitude, "Longitude", centroid.longitude); // Print the coordinates
            setCoordinates(centroid.latitude, centroid.longitude);
            localStorage.setItem('clickedCountry', clickedCountry);
            localStorage.setItem('centered', 'center');
            localStorage.setItem('color', 'black');
        }
        previousPolygon = target;
    });

    function selectCountry(id) {
        var dataItem = polygonSeries.getDataItemById(id);
        var target = dataItem.get("mapPolygon");
        if (target) {
            var centroid = target.geoCentroid();
            if (centroid) {
                chart.animate({ key: "rotationX", to: -centroid.longitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
                chart.animate({ key: "rotationY", to: -centroid.latitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
            }
        }
    }

    function loadSettings() {
        const savedCountry = localStorage.getItem('clickedCountry');
        if (savedCountry) {
            // Logic to select the saved country on the map
            polygonSeries.mapPolygons.each(function(polygon) {
                if (polygon.dataItem.dataContext.name === savedCountry) {
                    polygon.set("active", true);
                }
            });
        }
    }

    // Esperar a que el mapa esté completamente inicializado
    chart.events.on("datavalidated", function() {
        console.log("Mapa validado y listo para interactuar."); // Confirmación de que el mapa está listo

        // Verificar si los datos de geoJSON están cargados
        console.log("Datos de geoJSON:", polygonSeries.dataItems.length);

        // Imprimir los países
        if (polygonSeries.dataItems.length > 0) {
            polygonSeries.dataItems.each(function(dataItem) {
                console.log(dataItem.get("name"));
            });
        } else {
            console.error("No se encontraron datos de países.");
        }

        // Manejar el evento de clic en el mapa
        chart.chartContainer.events.on("click", function(ev) {
            console.log("Mapa clicado"); // Confirmación de que el evento de clic se ha registrado
            var point = chart.seriesContainer.toLocal(ev.point);
            console.log(`Clicked point: x=${point.x}, y=${point.y}`); // Log the clicked point

            if (chart.projection) {
                try {
                    var geoPoint = chart.projection.invert({ x: point.x, y: point.y });
                    console.log(`Geo point: Latitude ${geoPoint.latitude}, Longitude ${geoPoint.longitude}`); // Log the geo point

                    var timezone = tzlookup(geoPoint.latitude, geoPoint.longitude);
                    console.log(`Timezone: ${timezone}`); // Log the timezone

                    updateClocks(timezone);
                } catch (error) {
                    console.error("Error al invertir la proyección:", error);
                }
            } else {
                console.error("Proyección no definida.");
            }
        });
    });

    // Hacer que el mapa aparezca con animación al cargar
    loadSettings();
    chart.appear(1000, 100);
});