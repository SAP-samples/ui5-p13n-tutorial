# Sorting and Grouping Capabilities
For additional features you can enhance your table with Sorting and Grouping. This requires the `SortController` and `GroupController` as well as their proper registration. Furthermore you need a `sap.ui.model.Sorter`, so that the actual sorting can be applied to the binding.

## Enhance the custom Control with flexibility Controllers

To start using the controllers, you need to add the modules to our `P13nTable` control:
````ts
import SortController, { SortState } from "sap/m/p13n/SortController"
import GroupController, { GroupState } from "sap/m/p13n/GroupController"
import Sorter from "sap/ui/model/Sorter"
import ListBinding from "sap/ui/model/ListBinding"
````

The [`sap.m.p13n.SortController`](https://openui5nightly.hana.ondemand.com/api/sap.m.p13n.SortController) and
the [`sap.m.p13n.GroupController`](https://openui5nightly.hana.ondemand.com/api/sap.m.p13n.GroupController) offer specific personalization UIs using the [`Engine#show`](https://openui5nightly.hana.ondemand.com/api/sap.m.p13n.Engine#methods/show) method. In addition the processed state includes sorting and grouping specific information, as soon as they are registered.

Once the modules have been required, you can extend the registration by the new controllers. Chose `Sorter` and `Groups` as names in the `P13nTable#initP13n` method, equivalent to `Columns` for the `SelectionController`.

````ts
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
			}),
			Sorter: new SortController({
				control: this
			}),
			Groups: new GroupController({
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
````

Once you restart the application and open the personalization again, you notice that the personalization dialog does not yet include any additional functionality compared to before. To change this, add the new controllers to the `P13nTable#openP13n` method (**Note:** You could also consider to add seperate buttons for the different functionalities and call the method individually with the corresponding arguments)

````ts
public openP13n(event: Event): void {
	this.engine.show(this, ["Columns", "Sorter", "Groups"], {
		title: "Table Settings",
		source: event.getSource<Control>()
	})
}
````

Once you added the according entries `Sorter` and `Groups` to the panel key configuration, you can see that the dialog displays additional tabs:

![`Dialog changes`](screenshots/ex05_1.png)

## Implement the Behaviour
The state handling event includes two more entries for `Sorter` and `Groups` whenever changes occur to these personalization controllers. In order to react on grouping and sorting, you need to enhance the state change event handling. This time, create a `sap.ui.model.Sorter` whenever there are entries in the `Sorter` and `Groups` arrays of the `state` parameter:

````ts
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

	const listBinding = this.getBinding("items") as ListBinding
	listBinding?.sort(sorters)
}
````

Add `GroupState` and `SortState` to the `P13nTableState` interface:
````ts
export interface P13nTableState extends State {
	Columns: SelectionState[],
	Sorter: SortState[],
	Groups: GroupState[]
}
````

Now open the personalization Dialog again and trigger a grouping for `Countries`:
![`Grouping demo`](screenshots/ex05_2.png)

## Summary
Hooray! Now you can not only add and remove columns from the table, but also sort or group the displayed data. Please proceed with [Exercise 6](../ex06/).
