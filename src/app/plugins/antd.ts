import type { App } from "vue";
import Antd from "ant-design-vue";

export default {
  install(app: App): void {
    app.use(Antd);
  },
};
