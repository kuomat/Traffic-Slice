import React from "react"
import { useAlerts } from "@/hooks/useAlerts"
import { Alert, AlertFilter, SearchableAlertProperty } from "@/types/alerts"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"
import {
	ColumnDef,
	useReactTable,
	getCoreRowModel,
	flexRender,
	ColumnGrouping
} from "@tanstack/react-table"
import { useCallback, useEffect, useMemo, useState, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type AlertTableProps = {
	maxAlerts?: number
}

const RenderSeverity = React.memo(({ severity }: { severity: number }) => {
	return (
		<Badge
			variant={
				severity === 5
					? "destructive"
					: severity === 4
						? "outline"
						: severity === 3
							? "outline"
							: severity === 2
								? "outline"
								: "outline"
			}
		>
			{severity}
		</Badge>
	)
})

const SortSymbol = React.memo(
	({ columnName, alertFilter }: { columnName: keyof Alert; alertFilter: AlertFilter }) => {
		const isSorted = alertFilter.orderBy === columnName
		if (!isSorted) return <ArrowUpDown className="ml-2 h-4 w-4" />
		if (alertFilter.order === "asc") return <ArrowUp className="ml-2 h-4 w-4" />
		return <ArrowDown className="ml-2 h-4 w-4" />
	}
)

const SearchButton = React.memo(
	({ value, onValueChange }: { value: string; onValueChange: (value: string) => void }) => {
		const [isOpen, setIsOpen] = useState(!!value)
		const inputRef = useRef<HTMLInputElement>(null)

		useEffect(() => {
			if (isOpen) {
				inputRef.current?.focus()
			}
		}, [isOpen])

		return (
			<div className="flex items-center">
				<div
					className={`
						relative
						overflow-hidden
						transition-all duration-300 ease-in-out
						${isOpen ? "w-[200px] opacity-100" : "w-0 opacity-0"}
					`}
				>
					<div className="flex items-center p-1">
						<Input
							ref={inputRef}
							value={value}
							onChange={e => {
								onValueChange(e.target.value)
							}}
							onBlur={() => {
								if (value === "") {
									setIsOpen(false)
								}
							}}
							className="ml-2 w-full"
							placeholder="Search..."
						/>
					</div>
				</div>
				<Search
					className="ml-2 h-4 w-4 cursor-pointer"
					onClick={() => {
						if (isOpen && value) {
							onValueChange("")
						}
						setIsOpen(!isOpen)
					}}
				/>
			</div>
		)
	}
)

const TableHeaderWithSearch = React.memo(
	({
		className,
		title,
		columnName,
		filter,
		onSearch
	}: {
		className?: string
		title: string
		columnName: SearchableAlertProperty
		filter: AlertFilter
		onSearch: (value: string) => void
	}) => {
		const value = filter[columnName] as string
		return (
			<div className={cn("flex items-center", className)}>
				{title}
				<SearchButton value={value} onValueChange={onSearch} />
			</div>
		)
	}
)

const SearchableCell = React.memo(
	({
		value,
		filter,
		columnName
	}: {
		value: string
		filter: AlertFilter
		columnName: SearchableAlertProperty
	}) => {
		const filterValue = filter[columnName]
		const isFiltered = !!filterValue
		if (isFiltered) {
			const regex = new RegExp(`(${filterValue})`, "gi")
			const parts = value.split(regex)
			return parts.map((part, index) => (
				<span
					key={index}
					className={
						part.toLowerCase() === (filterValue as string).toLowerCase()
							? "bg-primary"
							: ""
					}
				>
					{part}
				</span>
			))
		}
		return <div>{value}</div>
	}
)

const AlertTable = React.memo(({ maxAlerts }: AlertTableProps) => {
	console.log("=== Component Render Start ===")

	const [filter, setFilter] = useState<AlertFilter>({
		limit: maxAlerts,
		orderBy: "severity",
		order: "desc"
	})

	const clickSorting = useCallback((column: keyof Alert) => {
		setFilter(prev => {
			const columnWasSorted = prev.orderBy === column
			const newOrder = columnWasSorted ? (prev.order === "asc" ? "desc" : "asc") : "desc"
			const newFilter: AlertFilter = { ...prev, orderBy: column, order: newOrder }
			return newFilter
		})
	}, [])

	const { data: alerts, isLoading, error } = useAlerts(filter)

	const alertsToUse = useMemo(() => {
		if (isLoading) return []
		if (error) return []
		return alerts || []
	}, [alerts, isLoading, error])

	const tableColumns: ColumnDef<Alert>[] = useMemo(
		() => [
			{
				accessorKey: "severity",
				enableResizing: true,
				header: () => {
					return (
						<Button variant="ghost" onClick={() => clickSorting("severity")}>
							Severity
							<SortSymbol columnName="severity" alertFilter={filter} />
						</Button>
					)
				},
				cell: ({ row }) => {
					return <RenderSeverity severity={row.original.severity} />
				}
			},
			{
				accessorKey: "type",
				enableResizing: true,
				header: () => (
					<TableHeaderWithSearch
						title="Type"
						columnName="type"
						filter={filter}
						onSearch={value => {
							setFilter(prev => ({ ...prev, type: value }))
						}}
					/>
				),
				cell: ({ row }) => {
					return (
						<SearchableCell
							value={row.original.type}
							filter={filter}
							columnName="type"
						/>
					)
				}
			},
			{
				accessorKey: "alert_name",
				enableResizing: true,
				header: () => (
					<TableHeaderWithSearch
						title="Alert"
						columnName="alert_name"
						filter={filter}
						onSearch={value => {
							setFilter(prev => ({ ...prev, alert_name: value }))
						}}
					/>
				),
				cell: ({ row }) => {
					return (
						<SearchableCell
							value={row.original.alert_name}
							filter={filter}
							columnName="alert_name"
						/>
					)
				}
			},
			{
				accessorKey: "message",
				enableResizing: true,
				header: () => (
					<TableHeaderWithSearch
						title="Message"
						columnName="message"
						filter={filter}
						onSearch={value => {
							setFilter(prev => ({ ...prev, message: value }))
						}}
					/>
				),
				cell: ({ row }) => {
					return (
						<SearchableCell
							value={row.original.message}
							filter={filter}
							columnName="message"
						/>
					)
				}
			},
			{
				accessorKey: "application_from",
				enableResizing: true,
				header: () => (
					<TableHeaderWithSearch
						title="Application"
						columnName="application_from"
						filter={filter}
						onSearch={value => {
							setFilter(prev => ({ ...prev, application_from: value }))
						}}
					/>
				),
				cell: ({ row }) => {
					return (
						<SearchableCell
							value={row.original.application_from}
							filter={filter}
							columnName="application_from"
						/>
					)
				}
			},
			{
				accessorKey: "destination_domain",
				enableResizing: true,
				header: () => (
					<TableHeaderWithSearch
						title="Destination"
						columnName="destination_domain"
						filter={filter}
						onSearch={value => {
							setFilter(prev => ({ ...prev, destination_domain: value }))
						}}
					/>
				),
				cell: ({ row }) => {
					return (
						<SearchableCell
							value={row.original.destination_domain}
							filter={filter}
							columnName="destination_domain"
						/>
					)
				}
			},
			{
				accessorKey: "timestamp",
				enableResizing: true,
				header: () => {
					return (
						<Button variant="ghost" onClick={() => clickSorting("timestamp")}>
							Timestamp
							<SortSymbol columnName="timestamp" alertFilter={filter} />
						</Button>
					)
				}
			}
		],
		[clickSorting, filter]
	)

	const table = useReactTable({
		data: alertsToUse,
		columns: tableColumns,
		defaultColumn: {
			minSize: 100,
			maxSize: 300
		},
		getCoreRowModel: getCoreRowModel(),
		columnResizeMode: "onChange"
	})

	if (error) return <div>Error: {error.message}</div>

	return (
		<div className="rounded-md border">
			<div className="overflow-x-auto">
				<Table className="relative w-full">
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : isLoading ? (
							<TableRow>
								<TableCell
									colSpan={tableColumns.length}
									className="h-24 text-center"
								>
									Loading...
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell
									colSpan={tableColumns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
})

export default AlertTable
