import { Component, OnInit } from "@angular/core";
import Map from "ol/Map";
import Overlay from "ol/Overlay";
import View from "ol/View";
import { toStringHDMS } from "ol/coordinate";
import TileLayer from "ol/layer/Tile";
import { fromLonLat, toLonLat } from "ol/proj";
import OSM from "ol/source/OSM";

declare var $: any;

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
	layer: TileLayer;
	map: Map;
	marker;
	view: View;
	duebi: Overlay;

	ngOnInit() {
		this.layer = new TileLayer({
			source: new OSM()
		});

		this.map = new Map({
			layers: [this.layer],
			target: "map",
			view: new View({
				center: fromLonLat([8.611, 47.391]),
				zoom: 17
			})
		});

		// dübi position
		const pos = fromLonLat([8.611, 47.391]);

		// Dübi marker
		this.marker = new Overlay({
			position: pos,
			positioning: "center-center",
			element: document.getElementById("marker"),
			stopEvent: false
		});
		this.map.addOverlay(this.marker);

		// Vienna label
		this.duebi = new Overlay({
			position: pos,
			element: document.getElementById("dübi")
		});
		this.map.addOverlay(this.duebi);

		// Popup showing the position the user clicked
		const popup = new Overlay({
			element: document.getElementById("popup")
		});
		this.map.addOverlay(popup);

		this.map.on("click", function (evt) {
			const element = popup.getElement();
			const coordinate = evt.coordinate;
			const lonLat = toLonLat(coordinate);
			const hdms = `lat=${lonLat[1]} ,lon=${lonLat[0]}`; // toStringHDMS(toLonLat(coordinate));

			$(element).popover("dispose");
			popup.setPosition(coordinate);
			$(element).popover({
				placement: "top",
				animation: true,
				html: true,
				content:
					"<p>The location you clicked was:</p><code>" +
					hdms +
					"</code>"
			});
			$(element).popover("show");
		});
	}
}
