import Controller from "sap/ui/core/mvc/Controller"
import Event from "sap/ui/base/Event"
import P13nTable, { P13nTableState } from "../control/P13nTable"
import ToggleButton from "sap/m/ToggleButton"
import MessageToast from "sap/m/MessageToast"
import { SelectionState } from "sap/m/p13n/SelectionController"

const RANGE_COLUMN_KEY = 'range'

/**
 * @namespace sample.p13n.app.controller
 */
export default class MountainsController extends Controller {
	public  onInit(): void {}

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
			state.Columns.push({key: RANGE_COLUMN_KEY, index: 0})
			MessageToast.show("Range shown")
		}
		p13nTable.applyState(state)
	}
}
