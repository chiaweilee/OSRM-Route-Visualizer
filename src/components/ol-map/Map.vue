<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { propsType } from "./constant";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { parsePoint } from "./util";
import { createPoints } from "./sources/points";
import { createRoute } from "./sources/route";
import { toLonLat } from "ol/proj";
import { style } from "./style";
import olms from "ol-mapbox-style";
import "ol/ol.css";

const mapRef = ref(undefined);
const mapInstance = ref(null);

const props = defineProps(propsType);
const theme = props.theme;
const mapPadding = props.padding;
const route = props.route;
const pointsData = props.points?.map(parsePoint);

let fitView = () => {};
const initMap = () => {
  olms(
    mapRef.value,
    `https://api.maptiler.com/maps/${theme}/style.json?key=${
      import.meta.env.VITE_MAP_KEY
    }`
  ).then((map) => {
    mapInstance.value = map;

    // View
    const view = map.getView();

    // Vector
    const vectorSource = new VectorSource();
    createPoints(vectorSource, pointsData);
    createRoute(vectorSource, route);

    // Layer
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style,
      zIndex: 10,
    });

    map.addLayer(vectorLayer);

    fitView = () => {
      const extent = vectorSource.getExtent();
      view.fit(extent, {
        padding: mapPadding,
        maxZoom: 15,
        duration: 0,
      });
    };

    // Fit view
    if (pointsData.length > 0) {
      fitView();
    }

    map.on("click", async (event) => {
      {
        const [lon, lat] = toLonLat(event.coordinate);
        alert(`${lon},${lat}`);
      }
    });
  });
};

onMounted(() => {
  initMap();
});

onBeforeUnmount(() => {
  if (mapInstance.value) {
    mapInstance.value.setTarget(null);
    mapInstance.value = null;
  }
});
</script>

<template>
  <div ref="mapRef" class="map-container" />
</template>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
