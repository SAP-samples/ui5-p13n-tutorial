import Table, { $TableSettings } from "sap/m/Table"

/**
 * @namespace sample.p13n.app.control
 */
export default class P13nTable extends Table {
	static renderer: string = "sap/m/TableRenderer"

	constructor(id?: string, settings?: $TableSettings) {
		super(id, settings)
	}

}