import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { Chart, IChartProps } from "./Chart";
import * as React from "react";
import { DataRow, EGroups, IProductProperty } from "./interfaces";

export class ChartPCF
  implements ComponentFramework.ReactControl<IInputs, IOutputs>
{
  private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
  private notifyOutputChanged: () => void;
  private _chartType: string;
  private _context: ComponentFramework.Context<IInputs>;

  private readonly _backgroundColors: Array<string> = new Array<string>(
    "#edc9514d",
    "#cc333f61",
    "#00a0b061",
    "#024f8c9c",
    "#673ab79e",
    "#8bc34aad",
    "#9e9e9eb8",
    "#795548a6"
  );

  private readonly _borderColors: Array<string> = new Array<string>(
    "#EDC951",
    "#CC333F",
    "#00A0B0",
    "#024f8c",
    "#673ab7",
    "#8bc34a",
    "#9e9e9e",
    "#795548"
  );

  /**
   * Empty constructor.
   */
  constructor() {}

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary
  ): void {
    this.notifyOutputChanged = notifyOutputChanged;
    this._chartType;
    this._context = context;
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   * @returns ReactElement root react element for the control
   */
  public updateView(
    context: ComponentFramework.Context<IInputs>
  ): React.ReactElement {
    this._context = context;
    this._chartType = this._context.parameters.chartType.raw;

    const dataset = this._context.parameters.itemsDataSet;

    let allRows = new Array<DataRow>();
    let allColumns = Array<string>();

    dataset.sortedRecordIds.forEach((recordId, index) => {
      let productItem: DataRow = {
        id: "",
        properties: [],
      };
      productItem["id"] = recordId;

      let item = dataset.records[recordId];
      dataset.columns.forEach((column) => {
        allColumns.push(column.displayName);

        // Add the column value to the each Item based on the column name
        let productProperty: IProductProperty = {
          alias: column.alias,
          displayName: column.displayName,
          value: item.getFormattedValue(column.name) as string,
          type: column.dataType,
        };
        productItem.properties.push(productProperty);
      });
      allRows.push(productItem);
    });

    const props: IChartProps = {
      chartType: this._chartType,
      groupFilter: EGroups["Dynamics 365"],
      dataRows: allRows,
      propertiesAsChartAxis:
        (this._context.parameters.propertiesAsChartAxis.raw as "1") || "2",
      borderColors: this._backgroundColors,
      backgroundColors: this._borderColors,
    };
    return React.createElement(Chart, props);
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    return {};
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}
