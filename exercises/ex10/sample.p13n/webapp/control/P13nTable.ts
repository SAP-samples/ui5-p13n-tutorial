import Table, { $TableSettings } from "sap/m/Table"
import Engine, { State } from "sap/m/p13n/Engine"
import SelectionController, { SelectionState } from "sap/m/p13n/SelectionController"
import MetadataHelper, { MetadataObject } from "sap/m/p13n/MetadataHelper"
import Column from "sap/m/Column"
import Text from "sap/m/Text"
import Event from "sap/ui/base/Event"
import Control from "sap/ui/core/Control"
import ColumnListItem from "sap/m/ColumnListItem"
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject"
import SortController, { SortState } from "sap/m/p13n/SortController"
import GroupController, { GroupState } from "sap/m/p13n/GroupController"
import Sorter from "sap/ui/model/Sorter"
import ListBinding from "sap/ui/model/ListBinding"
import FilterController, { FilterState, FilterStateItem } from "sap/m/p13n/FilterController"
import Filter from "sap/ui/model/Filter"
import Toolbar from "sap/m/Toolbar"
import OverflowToolbar from "sap/m/OverflowToolbar"
import Label from "sap/m/Label"
import FilterOperator from "sap/ui/model/FilterOperator"

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
				}),
				Sorter: new SortController({
					control: this
				}),
				Groups: new GroupController({
					control: this
				}),
				Filter: new FilterController({
					control: this
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

		const sorters: Sorter[] = []

		state.Groups.forEach((groupState: GroupState) => {
			sorters.push(new Sorter(this.helper.getPath(groupState.key), undefined, true))
		})

		state.Sorter.forEach((sortState: SortState) => {
			sorters.push(new Sorter(this.helper.getPath(sortState.key), sortState.descending))
		})

		const filters: Filter[] = []
		let filterInfoText: string
		Object.keys(state.Filter).forEach((filterKey: string) => {
			const label = (this.helper.getProperty(filterKey) as MetadataObject).label
			filterInfoText = filterInfoText ? filterInfoText + ", " + label : label

			const filterPath = this.helper.getPath(filterKey)
			state.Filter[filterKey].forEach((filterStateItem: FilterStateItem) => {
				const operator = filterStateItem.operator as FilterOperator
				filters.push(new Filter(filterPath, operator, filterStateItem.values[0]))
			})
		})

		const listBinding = this.getBinding("items") as ListBinding
		listBinding?.sort(sorters)
		listBinding?.filter(filters)
		this.setFilterInfoText(filterInfoText)
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
		this.engine.show(this, ["Columns", "Sorter", "Groups", "Filter"], {
			title: "Table Settings",
			source: event.getSource<Control>()
		})
	}

	public setFilterInfoText(filterInfoText: string): void {
		const infoToolbar: Toolbar | undefined = this.getInfoToolbar()
		if (filterInfoText && !infoToolbar) {
			this.setInfoToolbar(new OverflowToolbar({
				design: "Info",
				active: true,
				content: [
					new Text({ text: "Filtered by:" }),
					new Label({ text: filterInfoText })
				]
			}))
		} else if (filterInfoText) {
			const label: Label = infoToolbar.getContent()[1] as Label
			label.setText(filterInfoText)
		} else if (infoToolbar) {
			infoToolbar.destroy()
		}
	}

	public async applyState(state: P13nTableState) {
		await this.initialized
		return this.engine.applyState(this, state)
	}

	public async retrieveState() {
		await this.initialized
		return this.engine.retrieveState(this)
	}
}

export interface P13nTableState extends State {
	Columns: SelectionState[],
	Sorter: SortState[],
	Groups: GroupState[],
	Filter: FilterState
}