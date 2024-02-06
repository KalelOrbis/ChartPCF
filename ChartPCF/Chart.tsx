import * as React from "react";
import { Label } from "@fluentui/react";
import { Chart as ChartRender } from "chart.js";
import { DataRow, EGroups, IChartData } from "./interfaces";
import { useEffect } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

export interface IChartProps {
  chartType: string;
  groupFilter: EGroups;
  dataRows: DataRow[];
  propertiesAsChartAxis: "1" | "2";
  borderColors: string[];
  backgroundColors: string[];
}

export const Chart = React.memo(function Chart({
  chartType,
  groupFilter,
  dataRows,
  propertiesAsChartAxis,
  borderColors: _borderColors,
  backgroundColors: _backgroundColors,
}: IChartProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [_groupFilter, setGroupFilter] = React.useState<string>(
    EGroups[groupFilter]
  );

  useEffect(() => {
    ChartJS.register(
      RadialLinearScale,
      PointElement,
      LineElement,
      Filler,
      Tooltip,
      Legend
    );
  }, []);

  let chartLabels: string[] = [];

  const setValuesToChart = (dataRows: DataRow[]): Array<IChartData> => {
    let allRecords = Array<IChartData>();
    let fillLabels = chartLabels.length == 0;

    // if (propertiesAsChartAxis.raw == "1") {
    //   dataRows.forEach((row, index) => {
    //     let productChartData: IChartData = {
    //       label: "",
    //       backgroundColor:
    //         this._backgroundColors.length > index
    //           ? this._backgroundColors[index]
    //           : "",
    //       pointBorderColor:
    //         this._borderColors.length > index ? this._borderColors[index] : "",
    //       data: Array<Number>(),
    //     };
    //     row.properties.forEach((element, i) => {
    //       switch (element.alias) {
    //         // Legend of the line
    //         case "titlePropertySet":
    //           productChartData.label = element.value.toString();
    //           break;
    //         case `number${i + 1}PropertySet`:
    //           productChartData.data.push(element.value as number);
    //           if (
    //             fillLabels &&
    //             !this.chartLabels.find((p) => p == element.displayName)
    //           )
    //             this.chartLabels.push(element.displayName);
    //           break;
    //         default:
    //           break;
    //       }
    //     });
    //     allRecords.push(productChartData);
    //   });
    // } else if (propertiesAsChartAxis.raw == "2") {
    ["Use Decimal", "Potential Decimal"].forEach((label, i) => {
      let productChartData: IChartData = {
        label: label,
        backgroundColor:
          _backgroundColors.length > i ? _backgroundColors[i] : "",
        pointBorderColor: _borderColors.length > i ? _borderColors[i] : "",
        data: Array<Number>(),
        borderWidth: 1,
      };
      const filteredArray = dataRows.filter((obj) =>
        obj.properties.some((prop) => prop.value === groupFilter)
      );

      filteredArray.forEach((row, j) => {
        row.properties.forEach((element, i) => {
          if (element.displayName == label) {
            productChartData.data.push(element.value as number);
          }
          if (
            fillLabels &&
            !chartLabels.find((p) => p == element.displayName) &&
            element.alias == "text1PropertySet"
          )
            chartLabels.push(element.value as string);
        });
      });
      fillLabels = false;
      allRecords.push(productChartData);
    });
    // }
    return allRecords;
  };

  let marksData: { labels: string[]; datasets: IChartData[] } = {
    labels: [],
    datasets: [],
  };

  useEffect(() => {
    marksData = {
      datasets: setValuesToChart(dataRows),
      labels: chartLabels,
    };
  }, [groupFilter]);

  // useEffect(() => {
  //   if (canvasRef.current) {
  //     new ChartRender(
  //       document.getElementById("marksChart") as HTMLCanvasElement,
  //       {
  //         type: chartType,
  //         data: marksData as any,
  //         options: {
  //           legend: {
  //             labels: {
  //               fontSize: 20,
  //             },
  //           },
  //           tooltips: {
  //             enabled: true,
  //             callbacks: {
  //               label: function (tooltipItem, data) {
  //                 return (
  //                   data.datasets![tooltipItem.datasetIndex!].label +
  //                   " : " +
  //                   data.datasets![tooltipItem.datasetIndex!].data![
  //                     tooltipItem.index!
  //                   ]
  //                 );
  //               },
  //             },
  //           },
  //         },
  //       }
  //     );
  //   }
  // }, [chartType, marksData]);

  return (
    <div className="modalContainer">
      <select
        value={_groupFilter}
        onChange={(e) => setGroupFilter(e.target.selectedOptions[0].value)}
      >
        {Object.entries(EGroups).map((element) => (
          <option key={element[0]} value={element[0]}>
            {element[1]}
          </option>
        ))}
      </select>
      <Radar data={marksData}></Radar>
    </div>
  );
});
