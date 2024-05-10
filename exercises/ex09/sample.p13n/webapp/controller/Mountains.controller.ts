import Controller from "sap/ui/core/mvc/Controller"
import Event from "sap/ui/base/Event"
import P13nTable, { P13nTableState } from "../control/P13nTable"
import ToggleButton from "sap/m/ToggleButton"
import MessageToast from "sap/m/MessageToast"
import SelectionController, { SelectionState } from "sap/m/p13n/SelectionController"
import Engine, { State } from "sap/m/p13n/Engine"
import GridList from "sap/f/GridList"
import MetadataHelper, { MetadataObject } from "sap/m/p13n/MetadataHelper"
import GridListItem from "sap/f/GridListItem"
import JSONModel from "sap/ui/model/json/JSONModel"
import Control from "sap/ui/core/Control"

const RANGE_COLUMN_KEY = 'range'

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

		const aFilterMetadata: MetadataObject[] = gridList.getItems().map((gridListItem, index: number) => {
			return {
				path: "",
				key: gridListItem.getId(),
				label: filterModel.getData().filters[index].label
			}
		})

		const filterHelper = new MetadataHelper(aFilterMetadata)

		this.engine.register(gridList, {
			helper: filterHelper,
			controller: {
				Items: new SelectionController({
					control: gridList,
					targetAggregation: "items",
					getKeyForItem: (gridListItem: GridListItem) => {
						return gridListItem.getSelected()
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
		}
	}

	public onGridFilterPress(event: Event): void {
		const gridList = this.byId("gridFilter") as GridList
		this.engine.show(gridList, ["Items"], {
			title: "Filter Selection",
			source: event.getSource()
		})
	}

	public onP13nPress(event: Event): void {
		const p13nTable: P13nTable = this.byId("table") as P13nTable
		p13nTable.openP13n(event)
	}

	public async onToggleRange(event: Event): Promise<void> {
		const p13nTable: P13nTable | undefined = this.byId("table") as P13nTable | undefined
		const pressed = (event.getSource() as ToggleButton).getPressed()
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