<template>
  <div id="MapView"></div>
  <div id="layerchange"><el-button type="切换">切换</el-button></div>
</template>

<script>
import { loadModules } from "esri-loader";
import { onMounted } from "vue";
export default {
  setup() {
    let createView = () => {
      var options = {
        url: "https://js.arcgis.com/4.24/",
        css: "https://js.arcgis.com/4.24/esri/themes/light/main.css",
      };

      loadModules(
        [
          "esri/config",
          "esri/Map",
          "esri/views/MapView",
          "esri/layers/MapImageLayer",
          "esri/widgets/Home",
          "esri/widgets/Legend",
          "esri/widgets/Expand",
          "esri/layers/WebTileLayer",
          "esri/layers/support/TileInfo",
          "esri/geometry/SpatialReference",
        ],
        options
      )
        .then(
          ([
            esriConfig,
            Map,
            MapView,
            MapImageLayer,
            Home,
            Legend,
            Expand,
            WebTileLayer,
            TileInfo,
            SpatialReference,
          ]) => {
            esriConfig.apiKey =
              "AAPK37853f2d8fd242f6ad9df392845bb0855YYrv-aaUh64MrNqmp51tQ6FZBa-YBx9mlRhkoWfEq0QOAMSzDrRbVxMEBBRfVXV";

            const map = new Map({
              basemap: "topo-vector",
            });
            const view = new MapView({
              container: "MapView",
              map: map,
              center: [104.0365288, 30.6859476],
              zoom: 17,
            });
            var pointLayer = new MapImageLayer({
              url: "https://edutrial.geoscene.cn/geoscene/rest/services/C991_locationAllocation_point/MapServer",
              view,
            });
            map.add(pointLayer);
            var maplayer = new MapImageLayer({
              url: "https://edutrial.geoscene.cn/geoscene/rest/services/C991_locationAllocationMap/MapServer",
              view,
              visible: false,
            });
            map.add(maplayer);
            const homeBtn = new Home({
              view: view,
            });
            const legend = new Legend({
              view,
              layerInfos: [
                {
                  layer: pointLayer,
                  title: "临时核酸点选址",
                },
              ],
            });
            const legendExpand = new Expand({
              view: view,
              content: legend,
              expandTooltip: "Expand Legend",
              expanded: true,
            });
            let changeLayer = document.getElementById("layerchange");
            changeLayer.addEventListener("click", async () => {
              if (maplayer.visible == false) {
                maplayer.visible = true;
              }
            });
            view.ui.add(homeBtn, "top-left");
            view.ui.add(legendExpand, "bottom-left");
            view.ui.add([
              {
                component: "layerchange",
                position: "bottom-right",
                index: 1,
              },
            ]);
          }
        )
        .catch((e) => {
          console.log("出现错误" + e.message);
        });
    };
    onMounted(() => {
      createView();
    });
    return {
      createView,
    };
  },
};
</script>
<style  scoped>
#MapView {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>
