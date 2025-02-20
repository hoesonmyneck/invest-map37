import type { App } from "vue";
import OpenLayersMap from "vue3-openlayers";

export default {
  install(app: App): void {
    app.use(OpenLayersMap);
  },
};
