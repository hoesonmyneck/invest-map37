<template>
    <div>
        <BaseCard title="Занятые по отраслям" number="F2" @open="visible = true" :show-open-button="true">
            <div class="flex pt-5 justify-center items-center w-full" v-if="loader">
                <a-spin />
            </div>
            <div v-else class="overflow-auto h-[calc(50vh-66px)]">
                <highcharts :options="chartOptions" class="w-full m-auto h-max"></highcharts>
            </div>
        </BaseCard>

        <a-modal v-model:open="visible" :footer="null" class="p-0" width="100%" height="100%" :closable="false"
            :centered="true">
            <BaseCard title="" number="" :show-close-button="true" @close="visible = false">
                <div class="flex pt-5 justify-center items-center w-full" v-if="loader">
                    <a-spin />
                </div>
                <div v-else class="overflow-auto h-[calc(94vh)] grid">
                    <div class="grid grid-cols-1">
                        <div class="max-h-[40vh] overflow-scroll text-white">
                            <div class="head grid grid-cols-[2fr_120px_120px_120px] mb-2 pb-2 border-b border-gray-600">
                                <p>Наименование</p>
                                <p>Количество</p>
                                <p>Прирост</p>
                                <p>Прогноз</p>
                            </div>
                            <div class="mt-1 gap-1 grid grid-cols-[2fr_120px_120px_120px] text-[12px]" v-for="i in list"
                                :key="i.crop_ru">
                                <p class="h-6 w-full  px-3 flex items-center bg-[#252A36] rounded w-full truncate">{{
                                    i.oked }}</p>
                                <p class="h-6 w-full  px-3 flex items-center bg-[#252A36] rounded w-full truncate">{{
                                    Numeral(i.cnt24) }}</p>
                                <p class="h-6 w-full justify-center px-3 flex items-center bg-[#252A36] rounded w-full truncate"
                                    :style="`background-color: ${i.percentage_change_cnt < 0 ? '#FE6A35' : '#109669'}`">
                                    {{
                                    Numeral(i.percentage_change_cnt) }} %</p>
                                <p class="h-6 w-full  px-3 flex items-center bg-[#252A36] rounded w-full truncate">{{
                                    !!i.prirost_2025 ? `${+(i.prirost_2025).toFixed(2)} %` : '' }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="map h-[calc(54vh)] relative">
                        <div v-if="!!currentRegion"
                            class="rounded absolute z-10 top-5 right-5 bg-[#252A36] w-8 h-8 flex items-center justify-center cursor-pointer"
                            @click="currentRegion = ''">
                            <CloseOutlined />
                        </div>
                        <l-map ref="mapRef" :zoom="5" :center="[49.213962, 67.109173]" :options="{ zoomControl: false }"
                            class="w-full" :use-global-leaflet="false">
                            <!-- <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> -->
                            <template>
                                <l-polygon v-for="p in Object.values(regionPolygons.features)" :key="p.parent1_code"
                                    @click="currentRegion = p.properties.parent1_code"
                                    :lat-lngs="reverseCoordinates(p.geometry.coordinates)" color="white" :opacity="1"
                                    :weight="1" :fillOpacity="1" 
                                    :fillColor="getColorFromGradient((groupByRegion[+p.properties.parent1_code]?.cnt24 / maxGroupByRegion * 100) + 10)">
                                    <l-tooltip class="p-0 bg-transparent rounded-md">
                                        <div class="flex items-center gap-2">
                                            <p>Регион:</p>
                                            <p class="font-bold">{{ p.properties.region }}</p>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <p>Количество:</p>
                                            <p class="font-bold">{{ Numeral(groupByRegion[+p.properties.parent1_code]?.cnt24) }}</p>
                                        </div>
                                    </l-tooltip>
                                </l-polygon>
                            </template>
                        </l-map>
                    </div>
                </div>
            </BaseCard>
        </a-modal>
    </div>
</template>
<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import { LMap, LTooltip, LPolygon } from "@vue-leaflet/vue-leaflet";

import { computed, ref } from 'vue';
import BaseCard from '../../../shared/ui/BaseCard/BaseCard.vue';
import { getF2 } from '../../../entities/f/api';
import { Numeral } from '../../../shared/helpers/numeral';
import { useRegionStore } from '../../../entities/region/store';
import { storeToRefs } from 'pinia';
import { reverseCoordinates } from "../../../shared/helpers/reverseCoordinates";
import { CloseOutlined } from "@ant-design/icons-vue";
import { getColorFromGradient } from "../../../shared/helpers/gradientColors";

const loader = ref(true);
const data = ref([]);
const visible = ref(false);
const { regionPolygons } = storeToRefs(useRegionStore());
const currentRegion = ref('');

async function loadF2() {
    data.value = await getF2().finally(() => {
        loader.value = false;
    })
};

const list = computed(() => Object.values(data.value.filter(item => !!currentRegion.value ? item.parent1_code === currentRegion.value : true).reduce((acc, curr) => {
    if (!curr.oked) return acc

    if (!acc[curr.oked]) {
        acc[curr.oked] = { ...curr }
        return acc
    }

    acc[curr.oked].cnt24 += +curr.cnt24
    return acc
}, {})).sort((a, b) => (+b.cnt24 - +a.cnt24)))

const groupByRegion = computed(() => data.value.filter(item => !!currentRegion.value ? item.parent1_code === currentRegion.value : true).reduce((acc, curr) => {
    if (!acc[curr.parent1_code]) {
        acc[curr.parent1_code] = { ...curr }
        return acc
    }

    acc[curr.parent1_code].cnt24 += +curr.cnt24
    return acc
}, {}))

const maxGroupByRegion = computed(() => Object.values(groupByRegion.value).sort((a, b) => b.cnt24 - a.cnt24)[0]?.cnt24)


loadF2()

const chartOptions = computed(() => {
    return {
        chart: {
        type: "bar",
        height: visible.value ? "" : "150%",
        backgroundColor: "transparent",
    },
    title: {
        text: "",
    },
    legend: {
        enabled: false,
    },
    plotOptions: {
        column: {
            grouping: false,
            borderWidth: 0,
        },
        series: {
            borderRadius: 0,
            dataLabels: {
                format: '{point.price}',
                enabled: true,
                style: {
                    color: '#fff'
                }
            },
            showInLegend: true,
        },
    },
    xAxis: {
        categories: list.value.map(item => item.oked),
        tickmarkPlacement: "on",
        labels: {
            style: {
                color: "#fff",
                fontSize: "10px",
            }
        }
    },
    yAxis: {
        title: {
            text: null,
        },
        labels: {
            enabled: false,
            style: {
                color: '#fff'
            }
        }
    },
    series: [
        {
            name: "",
            colorByPoint: true,
            pointWidth: 14,
            borderWidth: 0,
            data: list.value.map(e => ({
              y: e.cnt24,
                color: '#3090E8',
              price: Numeral(e.cnt24)
            }))
        },
    ],
    };
});
</script>