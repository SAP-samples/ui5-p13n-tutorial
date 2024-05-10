import Controller from "sap/ui/core/mvc/Controller"
import Event from "sap/ui/base/Event"
import P13nTable from "../control/P13nTable"

/**
 * @namespace sample.p13n.app.controller
 */
export default class MountainsController extends Controller {
	public  onInit(): void {
	}

	public onP13nPress(event: Event): void {
		const p13nTable: P13nTable = this.byId("table") as P13nTable
		p13nTable.openP13n(event)
	}
}
