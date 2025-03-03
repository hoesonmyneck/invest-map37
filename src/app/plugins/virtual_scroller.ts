import type { App } from "vue";
import VueVirtualScroller from 'vue3-virtual-scroller'

export default {
  install(app: App): void {
    app.use(VueVirtualScroller);
  },
};
