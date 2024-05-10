import Table, { $TableSettings } from "sap/m/Table"
import Engine from "sap/m/p13n/Engine"
import SelectionController from "sap/m/p13n/SelectionController"
import MetadataHelper, { MetadataObject } from "sap/m/p13n/MetadataHelper"
import Column from "sap/m/Column"
import Text from "sap/m/Text"
import Event from "sap/ui/base/Event"
import Control from "sap/ui/core/Control"
import ColumnListItem from "sap/m/ColumnListItem"

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
					targetAggregation: "columns"
				})
			}
		})
	}

	public openP13n(event: Event): void {
		this.engine.show(this, ["Columns"], {
			title: "Table Settings",
			source: event.getSource<Control>()
		})
	}

}