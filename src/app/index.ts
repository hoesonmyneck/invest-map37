import { createApp } from "vue";
import { router, pinia } from "./providers";
import { VueQueryPlugin } from "vue-query";
import App from "./App.vue";

import "./index.scss";
import "./styles/tailwind.css";
import "vue3-openlayers/styles.css";

import antd from "./plugins/antd";
import highcharts from "./plugins/highcharts";
import openlayers from "./plugins/openlayers";
import virtual_scroller from "./plugins/virtual_scroller";

export const app = createApp(App)
  .use(pinia)
  .use(VueQueryPlugin)
  .use(antd)
  .use(highcharts)
  .use(openlayers)
  .use(virtual_scroller)
  .use(router);
