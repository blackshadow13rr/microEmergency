<template>
  <div id="list">
    <el-card class="box-card">
      <el-button @click="getOrder">刷新订单</el-button>
      <el-table
        id="odlist"
        :data="tableData"
        style="width: 100%"
        max-height="450"
      >
        <el-table-column prop="Oid" label="订单编号" width="180" />
        <el-table-column prop="Oaddress" label="订单地址" width="250" />
        <el-table-column
          prop="Ostate"
          label="状态"
          width="100"
          :filters="[
            { text: '待处理', value: '待处理' },
            { text: '进行中', value: '进行中' },
            { text: '待分配', value: '待分配' },
          ]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
        </el-table-column>
        <el-table-column label="位置">
          <template #default="scope">
            <el-button type="success" @click="getinfo(scope.row)">
              <el-icon>
                <AddLocation />
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="详情">
          <template #default="scope">
            <el-button type="success" @click="getmoreinfo(scope.row)">
              <el-icon><More /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div id="smallMapView"></div>
    </el-card>
  </div>
  <div id="bigMapView"></div>
  <div id="infoCard" v-show="showbox">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span style="font-size: 18px">订单详情</span>
          <el-button type="info" circle @click="close"
            ><el-icon><CircleClose /></el-icon
          ></el-button>
        </div>
      </template>
      <div id="details">
        <el-table :data="orderlist" style="width: 100%">
          <el-table-column prop="photo" label="图片"
            ><template #default="scope"
              ><img
                :src="scope.row.photo"
                style="width: 70px; height: 70px" /></template
          ></el-table-column>
          <el-table-column prop="title" label="物品名" />
          <el-table-column prop="price" label="单价" width="60px" />
          <el-table-column prop="num" label="数量" width="60px" />
        </el-table>
        <span style="font-size: 18px">总价￥: {{ sum }}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
import { loadModules } from "esri-loader";
import {
  GetOrderPoint,
  GetOrderList,
  GetOrderPointById,
  SetOrder,
} from "@/../api/admin";
import { onMounted, onBeforeMount, reactive, toRefs } from "vue";
import { AddLocation, Edit, More, CircleClose } from "@element-plus/icons-vue";
import Supply from "@/views/supply/Supply.vue";
import { $EleMsgNotifyError, $EleMsgNotifySuccess } from "@/../utils/alert.js";
import Nprogress from "nprogress";
export default {
  name: "Supply",
  components: {
    AddLocation,
    More,
    CircleClose,
  },
  setup() {
    const filterTag = (value, row) => {
      return row.Ostate === value;
    };
    let data = reactive({
      tableData: [],
      orderlist: [],
      Ostate: "",
      Point: [],
      Locationtrigger: false,
      sum: 0,
      showbox: false,
    });
    /* let tableData = []; */
    let getinfo = async (row) => {
      data.Point = await GetOrderPointById(row);
      data.Locationtrigger = true;
    };
    let getmoreinfo = async (row) => {
      data.showbox = true;
      let moreInfo = await GetOrderPointById(row);
      var jsonstr = JSON.parse(moreInfo[0].Odetail);
      jsonstr.cartList.forEach((element) => {
        if (element.title == "土豆") {
          element.photo =
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F02%2F49%2F15%2F59e637e29333d_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663729022&t=53e86373cefc2e55d0badc8fbd5b74f3";
        }
        if (element.title == "猪肉") {
          element.photo =
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.yzcdn.cn%2Fupload_files%2F2018%2F03%2F30%2FFniqU6tadK9H3OmVfQpytRXzcLIg.jpg%3FimageView2%2F2%2Fw%2F580%2Fh%2F580%2Fq%2F75%2Fformat%2Fjpg&refer=http%3A%2F%2Fimg.yzcdn.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663734160&t=130e9202f3478c8f5dcd7faff0cec36f";
        }
        if (element.title == "鸡蛋") {
          element.photo =
            "http://t15.baidu.com/it/u=3053549834,620731021&fm=224&app=112&f=JPEG?w=500&h=500?goods_id=http://item.m.jd.com/product/10032650214220.html?cu=true&utm_source=baidu-juhe&utm_medium=kong&utm_campaign=t_1000151230_juhe";
        }
        if (element.title == "芹菜") {
          element.photo =
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpicnew11.photophoto.cn%2F20170807%2Fxinxianqincaishucaiyuansu-28950133_1.jpg&refer=http%3A%2F%2Fpicnew11.photophoto.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663734332&t=90deb3f79f938959bca9c5885a29833f";
        }
        if (element.title == "大米") {
          element.photo =
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp0.itc.cn%2Fimages01%2F20200606%2F4749e7f5015b4021b7a9232d0826d47a.jpeg&refer=http%3A%2F%2Fp0.itc.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663734358&t=1bf73427f329c7708cd138a3539ce965";
        }
        if (element.title == "猕猴桃") {
          element.photo =
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fphoto.orsoon.com%2F180128%2FFresh_Fruits%2Feo6TpcZV5Z.jpg&refer=http%3A%2F%2Fphoto.orsoon.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663734392&t=66cb432b914db4856370cdd1c9ed18a7";
        }
        if (element.title == "红枣") {
          element.photo =
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg14.360buyimg.com%2Fn0%2Fjfs%2Ft1%2F192487%2F37%2F5112%2F151536%2F60aefcacE1ce741e0%2F136411a41743e85c.jpg&refer=http%3A%2F%2Fimg14.360buyimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663734413&t=21d4c5035b44e9025ae475098593fdd9";
        }
        if (element.title == "梨") {
          element.photo =
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fupload.lcqixing.com%2Fupload%2F202009%2F21%2Ff66ad00d06da6491182c1fb1a5f07eaf.jpg&refer=http%3A%2F%2Fupload.lcqixing.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663734447&t=e85e72322521befa37203c1acdb1d09f";
        }
      });
      data.orderlist = jsonstr.cartList;
      console.log(data.orderlist);
      data.sum = jsonstr.total;
    };
    let close = () => {
      data.showbox = false;
    };
    let getOrder = async () => {
      let Order = await GetOrderList();
      data.tableData = Order;
    };
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
          "esri/layers/FeatureLayer",
          "esri/widgets/Search",
          "esri/geometry/Point",
          "esri/geometry/Circle",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/Graphic",
          "esri/widgets/Expand",
          "esri/layers/GraphicsLayer",
          "esri/widgets/Sketch",
          "esri/widgets/Slider",
          "esri/geometry/geometryEngine",
          "esri/layers/RouteLayer",
          "esri/rest/support/PolygonBarrier",
          "esri/rest/support/FeatureSet",
          "esri/widgets/Legend",
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
            Home,
            FeatureLayer,
            Search,
            Point,
            Circle,
            SimpleMarkerSymbol,
            Graphic,
            Expand,
            GraphicsLayer,
            Sketch,
            Slider,
            geometryEngine,
            RouteLayer,
            PolygonBarrier,
            FeatureSet,
            Legend,
            WebTileLayer,
            TileInfo,
            SpatialReference,
          ]) => {
            esriConfig.apiKey =
              "AAPK37853f2d8fd242f6ad9df392845bb0855YYrv-aaUh64MrNqmp51tQ6FZBa-YBx9mlRhkoWfEq0QOAMSzDrRbVxMEBBRfVXV";
            //地图
            const map = new Map({
              basemap: "topo-vector",
            });
            var view = new MapView({
              container: "smallMapView",
              map: map,
              center: [104.08, 30.68],
              zoom: 13,
            });
            const view2 = new MapView({
              container: "bigMapView",
              map: map,
              center: [104.08, 30.68],
              zoom: 16,
              /* constraints: {
                // Disable zoom snapping to get the best synchronization
                snapToZoom: false,
              }, */
            });
            var orderLayer = new GraphicsLayer();
            view.map.addMany([orderLayer]);
            let addPoint = (PointSet) => {
              orderLayer.removeAll();
              /* let Point = await GetOrderPoint(data); */
              if (PointSet !== []) {
                PointSet.forEach((result, index) => {
                  createPoint(
                    PointSet[index].OPlon,
                    PointSet[index].OPlat,
                    PointSet[index]
                  );
                });
              } else {
                console.log("No order!");
              }
            };
            let createPoint = (lon, lat, data) => {
              var point = new Point({
                latitude: lat,
                longitude: lon,
                spatialReference: view.spatialReference,
              });
              var simpleMarkerSymbol = new SimpleMarkerSymbol({
                style: "square",
                color: "blue",
                size: "8px",
                outline: {
                  width: 1,
                },
              });
              var graphic = new Graphic(point, simpleMarkerSymbol);
              graphic.attributes = data;
              orderLayer.graphics.add(graphic);
            };
            let odlist = document.getElementById("odlist");
            odlist.addEventListener("click", async () => {
              if (data.Locationtrigger == true) {
                addPoint(data.Point);
                AutoQueryFirst(data.Point[0]);
                data.Locationtrigger = false;
              }
            });
            function AutoQueryFirst(order) {
              /* view.goTo(orderLayer.graphics).then(function () { */
              view2.zoom = 16;
              view.center = [order.OPlon, order.OPlat];
              view2.center = [order.OPlon, order.OPlat];
            }
            /* let closeBtn = document.getElementById("close");
            closeBtn.addEventListener("click", async () => {
              
            }); */

            const views = [view, view2];
            let active;
            const sync = (source) => {
              if (!active || !active.viewpoint || active !== source) {
                return;
              }
              for (const view of views) {
                if (view !== active) {
                  view.center = active.center;
                }
              }
            };
            for (const view of views) {
              view.watch(["interacting", "animation"], () => {
                active = view;
                sync(active);
              });
              view.watch("viewpoint", () => sync(view));
            }
            view.ui.remove("attribution");
            view2.ui.remove("attribution");
            view2.ui.add([
              {
                component: "infoCard",
                position: "top-right",
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
      ...toRefs(data),
      getOrder,
      filterTag,
      getinfo,
      createView,
      getmoreinfo,
      close,
    };
  },
};
</script>

<style>
#list {
  padding: 0;
  margin: 0;
  height: 100%;
}
#smallMapView {
  padding: 0;
  margin: 20px auto;
  width: 500px;
  height: 400px;
}
#bigMapView {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
</style>