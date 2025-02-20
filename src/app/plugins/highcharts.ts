import SolidGauge from "highcharts/modules/solid-gauge";
import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more'
import HighchartsVue from "highcharts-vue";
import type { App } from "vue";

highchartsMore(Highcharts)
SolidGauge(Highcharts)

export default {
    install(app: App): void {
        app.use(HighchartsVue, {
            highcharts: Highcharts
        })
    }
}
