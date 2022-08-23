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
          "esri/widgets/Home",
          "esri/widgets/ScaleBar",
          "esri/widgets/LayerList",
          "esri/widgets/Legend",
          "esri/widgets/Expand",
          "esri/widgets/Compass",
          "esri/geometry/Extent",
          "esri/layers/MapImageLayer",
          "esri/layers/FeatureLayer",
          "esri/widgets/LayerList/LayerListViewModel",
          "esri/layers/WebTileLayer",
          "esri/layers/support/TileInfo",
          "esri/geometry/SpatialReference",
        ],
        options
      ).then(
        ([
          esriConfig,
          Map,
          MapView,
          Home,
          ScaleBar,
          LayerList,
          Legend,
          Expand,
          Compass,
          Extent,
          MapImageLayer,
          FeatureLayer,
          LayerListViewModel,
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
            center: [104.08, 30.68],
            zoom: 12,
          });

          var cluster1 = new FeatureLayer({
            url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/C991_DensityBasedClustering/FeatureServer/0",
            blendMode: "darken",
            title: "活动轨迹聚类",
            visible: true,
          });
          map.add(cluster1);
          var cluster2 = new FeatureLayer({
            url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/cluster/FeatureServer/0",
            blendMode: "darken",
            title: "医疗设施点多元聚类",
            visible: false,
          });
          map.add(cluster2);
          var cluster3 = new FeatureLayer({
            url: "https://edutrial.geoscene.cn/geoscene/rest/services/Hosted/cluster/FeatureServer/1",
            blendMode: "darken",
            title: "医疗设施点聚类和异常值分析",
            visible: false,
          });
          map.add(cluster3);
          const homeBtn = new Home({
            view: view,
          });
          const layerList = new LayerList({
            view: view,
          });
          let changeLayer = document.getElementById("layerchange");
          changeLayer.addEventListener("click", async () => {
            if (cluster1.visible == true) {
              cluster1.visible = false;
              cluster2.visible = true;
              cluster3.visible = false;
              return;
            }
            if (cluster2.visible == true) {
              cluster1.visible = false;
              cluster2.visible = false;
              cluster3.visible = true;
              return;
            }
            if (cluster3.visible == true) {
              cluster1.visible = true;
              cluster2.visible = false;
              cluster3.visible = false;
              return;
            }
          });
          const layerListExpand = new Expand({
            view: view,
            content: layerList,
            expanded: false,
            expandTooltip: "Expand LayerList",
          });
          const compass = new Compass({
            view: view,
            visible: false,
          });
          view.ui.add(homeBtn, "top-left");
          view.ui.add(layerListExpand, "top-right");
          view.ui.add(compass, "top-left");
          view.ui.add([
            {
              component: "layerchange",
              position: "bottom-right",
              index: 1,
            },
          ]);
          /* hospitalscale.when(() => {
            const initialExtent = Extent.fromJSON(
              hospitalscale.sourceJSON.initialExtent
            );
            view.goTo(initialExtent);
          }); */
          // load the Compass only when the view is rotated
          view.watch("rotation", function (rotation) {
            if (rotation && !compass.visible) {
              compass.visible = true;
            }
          });
        }
      );
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
