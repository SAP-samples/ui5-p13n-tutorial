# Filtering & Info Toolbar

This exercise shows how to introduce some filters and how their selection can be made part of the personalization and managed by the `FilterController`. Furthermore it might be helfpul for users to actually have an overview of which filters are applied. In this exercise an info toolbar is added to the Table.

## Add Filtering

First add the new dependencies:
````ts
import FilterController, { FilterState, FilterStateItem } from "sap/m/p13n/FilterController"
import Filter from "sap/ui/model/Filter"
import FilterOperator from "sap/ui/model/FilterOperator"
````

Then add the FilterController to the `Engine` registration:

````ts
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
````

Again update the `P13nTable#openP13n` and add the `Filter` panel:

````ts
public openP13n(event: Event): void {
	this.engine.show(this, ["Columns", "Sorter", "Groups", "Filter"], {
		title: "Table Settings",
		source: event.getSource<Control>()
	})
}
````

Like before the dialog will display an additional tab.
Now update the binding of the `P13nTable` by adopting the `onStateChange` method:

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

	const filters: Filter[] = []
	Object.keys(state.Filter).forEach((filterKey: string) => {
		const filterPath = this.helper.getPath(filterKey)
		state.Filter[filterKey].forEach((filterStateItem: FilterStateItem) => {
			const operator = filterStateItem.operator as FilterOperator
			filters.push(new Filter(filterPath, operator, filterStateItem.values[0]))
		})
	})

	const listBinding = this.getBinding("items") as ListBinding
	listBinding?.sort(sorters)
	listBinding?.filter(filters)
}
````

You'll notice that `state.Filter` is marked as a TypeScript error, we have to adopt the `P13nTableState` aswell:

````ts
export interface P13nTableState extends State {
	Columns: SelectionState[],
	Sorter: SortState[],
	Groups: GroupState[],
	Filter: FilterState
}
````

Now the filtering should work on the `P13nTable`, we also want to display a information on the toolbar.

## Set Text on InfoToolbar

Add dependencies:

````ts
import Toolbar from "sap/m/Toolbar"
import OverflowToolbar from "sap/m/OverflowToolbar"
import Label from "sap/m/Label"
````
As the `P13nTable` extends the `sap.m.Table` we can use the `infoToolbar` aggregation to display the information. Implement new method `setFilterInfoText`:

````ts
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
````

Finally, use the newly implemented method inside the `onStateChange` when we create the filters:

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
````

## Summary
You've learned how to implement filtering on the table using the `FilterController`. You should be able to see, how the table is being filtered in the running application. In the next step you will learn how to change the state of the table by yourself. Please proceed with [Exercise 7](../ex07/).
