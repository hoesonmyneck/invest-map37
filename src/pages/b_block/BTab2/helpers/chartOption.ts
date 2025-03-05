export const chartOptions = (categories: string[], series: any[]) => ({
  chart: {
    type: "column",
    inverted: true,
    polar: true,
    backgroundColor: "transparent",
  },
  title: {
    text: "",
  },
  tooltip: {
    outside: true,
  },
  legend: {
    enabled: false,
  },
  pane: {
    size: "100%",
    innerSize: "70%",
  },
  xAxis: {
    tickInterval: 1,
    labels: {
      enabled: false,
    },
    lineWidth: 0,
    gridLineWidth: 0,
    categories,
  },
  yAxis: {
    labels: {
      enabled: false,
    },
    lineWidth: 0,
    tickInterval: 25,
    reversedStacks: false,
    endOnTick: true,
    showLastLabel: true,
    gridLineWidth: 0,
  },
  plotOptions: {
    column: {
      stacking: "normal",
      borderWidth: 0,
      pointPadding: 0,
      groupPadding: 0.15,
    },
  },
  series,
});