import Controller from "sap/ui/core/mvc/Controller"
import Event from "sap/ui/base/Event"
import P13nTable, { P13nTableState } from "../control/P13nTable"
import ToggleButton from "sap/m/ToggleButton"
import MessageToast from "sap/m/MessageToast"
import Engine, { State } from "sap/m/p13n/Engine"
import GridList from "sap/f/GridList"
import MetadataHelper, { MetadataObject } from "sap/m/p13n/MetadataHelper"
import SelectionController, { SelectionState } from "sap/m/p13n/SelectionController"
import GridListItem from "sap/f/GridListItem"
import JSONModel from "sap/ui/model/json/JSONModel"
import Control from "sap/ui/core/Control"
import Element from "sap/ui/core/Element"
import Filter from "sap/ui/model/Filter"
import ListBinding from "sap/ui/model/ListBinding"
import ListItemBase from "sap/m/ListItemBase"

const RANGE_COLUMN_KEY = 'container-sample.p13n.app---Mountains--range'

/**
 * @namespace sample.p13n.app.controller
 */
export default class MountainsController extends Controller {

	private engine: Engine

	public onInit(): void {
		this.engine = Engine.getInstance()
		this.initGridFilter()
	}

	private initGridFilter(): void {
		const gridList = this.byId("gridFilter") as GridList
		const filterModel = gridList.getModel("filters") as JSONModel
		const gridListItems: GridListItem[] = gridList.getItems() as GridListItem[]

		const filterMetadata: MetadataObject[] = gridListItems.map((gridListItem: GridListItem, index: number) => {
			return {
				path: "",
				key: gridListItem.getId(),
				label: filterModel.getData().filters[index].label,
			}
		})

		const filterHelper = new MetadataHelper(filterMetadata)

		this.engine.register(gridList, {
			helper: filterHelper,
			controller: {
				Items: new SelectionController({
					control: gridList,
					targetAggregation: "items",
					getKeyForItem: (gridListItem: GridListItem) => {
						const listBinding = this.byId("table").getBinding("items") as ListBinding
						return listBinding.getFilters("Control").some((filter: Filter) => {
							const expression: string[] = gridListItem.getBindingContext("filters").getProperty("expression")
							return filter.getPath() === expression[0]
								&& filter.getValue1() === expression[2]
						})
					}
				})
			}
		})

		this.engine.attachStateChange(this.onP13nStateChange.bind(this))
	}

	private onP13nStateChange(event: Event): void {
		const parameters = event.getParameters() as {
			control: Control,
			state: MountainsControllerState
		}
		const state: MountainsControllerState = parameters.state
		const gridList = this.byId("gridFilter") as GridList

		if (parameters.control === gridList) {
			gridList.getItems().forEach((gridListItem: GridListItem) => {
				gridListItem.setSelected(state.Items.some((selectionState: SelectionState) => {
					return gridListItem.getId() === selectionState.key
				}))
			})

			const filters: Filter[] = []
			let filterText: string
			state.Items.forEach((selectionState: SelectionState) => {
				const item: GridListItem | undefined = Element.getElementById(selectionState.key) as GridListItem | undefined
				if (item) {
					const filterContext = item.getBindingContext("filters")
					const expression: any[] = filterContext.getProperty("expression")
					const description: string = filterContext.getProperty("description")
					filters.push(new Filter(expression[0], expression[1], expression[2]))
					filterText = filterText ? filterText + ", " + description : description
				}
			})
			const table: P13nTable = this.byId("table") as P13nTable
			const tableBinding = table.getBinding("items") as ListBinding
			tableBinding.filter(filters)
			table.setFilterInfoText(filterText)
		}
	}

	public onGridFilterPress(event: Event): void {
		const gridList = this.byId("gridFilter") as GridList
		this.engine.show(gridList, ["Items"], {
			title: "Filter Selection",
			source: event.getSource()
		})
	}

	public onGridFilterSelect(event: Event): void {
		const gridList = this.byId("gridFilter") as GridList
		const parameters = event.getParameters() as {
			listItem : ListItemBase,
			listItems : ListItemBase[],
			selected : boolean,
			selectAll: boolean
		}
		const item = parameters.listItem as GridListItem
		this.engine.retrieveState(gridList).then((state: MountainsControllerState) => {
			const itemId = item.getId()

			const oStateItem = state.Items.find((selectionState: SelectionState) => {
				return selectionState.key == itemId
			})

			if (item.getSelected()) {
				state.Items.push({key: itemId})
			} else {
				oStateItem.visible = false
			}

			this.engine.applyState(gridList, state)
		})
	}

	public onP13nPress(event: Event): void {
		const p13nTable: P13nTable = this.byId("table") as P13nTable
		p13nTable.openP13n(event)
	}

	public async onToggleRange(event: Event): Promise<void> {
		const p13nTable: P13nTable = this.byId("table") as P13nTable
		const pressed = event.getSource<ToggleButton>().getPressed()
		const state: P13nTableState = await p13nTable.retrieveState() as P13nTableState
		const rangeColumnState = state.Columns.find((selectionState: SelectionState) => {
			return selectionState.key == RANGE_COLUMN_KEY
		})
		if (pressed && rangeColumnState) {
			rangeColumnState.visible = false
			MessageToast.show("Range hidden")
		} else {
			state.Columns.push({ key: RANGE_COLUMN_KEY, index: 0 })
			MessageToast.show("Range shown")
		}
		p13nTable.applyState(state)
	}
}

interface MountainsControllerState extends State {
	Items: SelectionState[]
}