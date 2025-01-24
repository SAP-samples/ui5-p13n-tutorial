import Table, { $TableSettings } from "sap/m/Table"
import Engine, { State } from "sap/m/p13n/Engine"
import SelectionController from "sap/m/p13n/SelectionController"
import MetadataHelper, { MetadataObject } from "sap/m/p13n/MetadataHelper"
import Column from "sap/m/Column"
import Text from "sap/m/Text"
import Event from "sap/ui/base/Event"
import Control from "sap/ui/core/Control"
import ColumnListItem from "sap/m/ColumnListItem"
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject"

/**
 * @namespace sample.p13n.app.control
 */
export default class P13nTable extends Table {
	static renderer: string = "sap/m/TableRenderer"

	private initialized: Promise<void>

	private helper: MetadataHelper

	private engine: Engine

	constructor(id?: string, settings?: $TableSettings) {
		super(id, settings)
		this.engine = Engine.getInstance()
		this.initialized = new Promise((resolve: () => void): void => {
			this.attachEventOnce("updateFinished", (): void => {
				this.initP13n()
				resolve()
			}, this)
		})
	}

	private initP13n(): void {
		const columns: Column[] = this.getColumns()
		const columnsMetadata: MetadataObject[] = columns.map((column: Column, index: number) => {
			const columnHeader = column.getHeader() as Text
			const columnListItem: ColumnListItem = this.getItems()[0] as ColumnListItem
			const innerControl = columnListItem.getCells()[index]
			return {
				key: column.data("p13nKey"),
				label: columnHeader.getText(false),
				path: innerControl.getBinding(innerControl.isA("sap.m.ObjectIdentifier") ? "title" : "text").getPath()
			}
		})

		this.helper = new MetadataHelper(columnsMetadata)

		this.engine.register(this, {
			helper: this.helper,
			controller: {
				Columns: new SelectionController({
					control: this,
					targetAggregation: "columns",
					getKeyForItem: (column: Column) => {
						return column.data("p13nKey")
					}
				})
			}
		})

		this.engine.attachStateChange((event: Event) => {
			const parameters = event.getParameters() as any
			if (parameters["control"] === this) {
				this.onStateChange(parameters["state"])
			}
		})
	}

	public onStateChange(state: P13nTableState): void {
		this.getColumns().forEach((column: Column) => {
			// if the column is not in the state, it is not visible
			column.setVisible(state.Columns.some((selectionState: SelectionState) => {
				return column.data("p13nKey") === selectionState.key
			}))
		})

		state.Columns.forEach(this.moveColum, this)
	}

	private moveColum(selectionState: SelectionState, index: number): void {
		const column: Column | undefined = this.getColumns().find((column: Column) => {
			return column.data("p13nKey") === selectionState.key
		})
		if (column === undefined) return
		const oldIndex: number = this.getColumns().indexOf(column)

		if (index != oldIndex) {
			this.removeColumn(column)
			this.insertColumn(column, index)

			const fnMoveCells = (columnListItem: ColumnListItem | undefined) => {
				if (columnListItem?.isA("sap.m.ColumnListItem")) {
					const cell: Control | null = columnListItem.removeCell(oldIndex)
					if (cell != null) columnListItem.insertCell(cell, index)
				}
			}
			const itemsBindingInfo: AggregationBindingInfo = this.getBindingInfo("items") as AggregationBindingInfo
			fnMoveCells(itemsBindingInfo.template as ColumnListItem | undefined)
			this.getItems().forEach((item) => fnMoveCells(item as ColumnListItem))
		}
	}

	public openP13n(event: Event): void {
		this.engine.show(this, ["Columns"], {
			title: "Table Settings",
			source: event.getSource<Control>()
		})
	}

}

export interface ColumnState {
	key: string,
	visible?: boolean,
	position?: number
}

export interface P13nTableState extends State {
	Columns: ColumnState[]
}