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
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"
import { useCallback, useEffect, useMemo, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious
} from "@/components/ui/pagination"
import AlertPopup from "./AlertPopup"
import AlertBadge from "./AlertBadge"

type AlertTableProps = {
	maxAlerts?: number
	notableAlertsOnly?: boolean
}

// Renders sort direction indicator (up/down/both arrows) for sortable columns
const SortSymbol = React.memo(
	({ columnName, alertFilter }: { columnName: keyof Alert; alertFilter: AlertFilter }) => {
		const isSorted = alertFilter.orderBy === columnName
		if (!isSorted) return <ArrowUpDown className="ml-2 h-4 w-4" />
		if (alertFilter.order === "asc") return <ArrowUp className="ml-2 h-4 w-4" />
		return <ArrowDown className="ml-2 h-4 w-4" />
	}
)

// Expandable search input with toggle button
const SearchButton = React.memo(
	({ value, onValueChange }: { value: string; onValueChange: (value: string) => void }) => {
		const [isOpen, setIsOpen] = useState(!!value)
		const inputRef = useRef<HTMLInputElement>(null)
		const [inputValue, setInputValue] = useState(value)

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
							value={inputValue}
							onChange={e => {
								setInputValue(e.target.value)
							}}
							onKeyDown={e => {
								if (e.key === "Enter") {
									onValueChange(inputValue)
								}
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

// Table header cell with integrated search functionality
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

// Table cell that highlights search matches in text
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

// Main table component displaying alerts with sorting and searching capabilities
const AlertTable = React.memo(({ notableAlertsOnly = false }: AlertTableProps) => {
	// Add pagination state
	const [currentPage, setCurrentPage] = useState(1)
	const rowsPerPage = 10

	// State to track the selected alert for the popup
	const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)

	// Filter state for sorting, searching, and limiting results
	const [filter, setFilter] = useState<AlertFilter>({
		orderBy: "severity",
		order: "desc",
		offset: (currentPage - 1) * rowsPerPage,
		pageSize: rowsPerPage
	})

	// Function to clear all search filters
	const clearFilters = () => {
		setFilter({
			orderBy: "severity",
			order: "desc",
			offset: 0,
			pageSize: rowsPerPage
		})
		setCurrentPage(1) // Reset to first page
	}

	// Update filter when page changes
	useEffect(() => {
		setFilter(prev => ({
			...prev,
			offset: (currentPage - 1) * rowsPerPage,
			pageSize: rowsPerPage
		}))
	}, [currentPage, rowsPerPage])

	// Handles column sorting when header is clicked
	const clickSorting = useCallback((column: keyof Alert) => {
		setFilter(prev => {
			const columnWasSorted = prev.orderBy === column
			const newOrder = columnWasSorted ? (prev.order === "asc" ? "desc" : "asc") : "desc"
			return { ...prev, orderBy: column, order: newOrder }
		})
	}, [])

	// Update filter and reset page when a search is performed
	const handleSearch = (columnName: SearchableAlertProperty, value: string) => {
		setFilter(prev => ({
			...prev,
			[columnName]: value,
			offset: 0 // Reset offset for new search
		}))
		setCurrentPage(1) // Reset to first page
	}

	// Fetch alerts data with current filter
	const { data: alerts, isLoading, error } = useAlerts(filter, notableAlertsOnly)

	// Prepare alerts data for display, handling loading and error states
	const alertsToUse = useMemo(() => {
		if (isLoading) return []
		if (error) return []
		return alerts || []
	}, [alerts, isLoading, error])

	// Define table columns with their rendering and behavior
	const tableColumns: ColumnDef<Alert>[] = useMemo(
		() => [
			// Severity column with sortable header and badge display
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
					return <AlertBadge severity={row.original.severity} />
				}
			},
			// Alert name column with search functionality
			{
				accessorKey: "alert_name",
				enableResizing: true,
				header: () => (
					<TableHeaderWithSearch
						title="Alert"
						columnName="alert_name"
						filter={filter}
						onSearch={value => handleSearch("alert_name", value)}
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
			// Application column with search functionality
			{
				accessorKey: "application_from",
				enableResizing: true,
				header: () => (
					<TableHeaderWithSearch
						title="Application"
						columnName="application_from"
						filter={filter}
						onSearch={value => handleSearch("application_from", value)}
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
			// Destination column with search functionality
			{
				accessorKey: "destination_domain",
				enableResizing: true,
				header: () => (
					<TableHeaderWithSearch
						title="Destination"
						columnName="destination_domain"
						filter={filter}
						onSearch={value => handleSearch("destination_domain", value)}
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
			// Timestamp column with sortable header
			{
				accessorKey: "timestamp",
				enableResizing: true,
				header: () => {
					return (
						<Button variant="ghost" onClick={() => clickSorting("timestamp")}>
							Time
							<SortSymbol columnName="timestamp" alertFilter={filter} />
						</Button>
					)
				},
				cell: ({ row }) => {
					// Format the timestamp for display
					const timestamp = new Date(row.original.timestamp)
					const formattedTime = timestamp.toLocaleString()
					return <div>{formattedTime}</div>
				}
			}
		],
		[clickSorting, filter, setFilter]
	)

	// Initialize table instance with configuration
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
								{/* Add Clear Filters button in the header row */}
								<TableHead>
									<div className="group relative">
										<Button
											variant="ghost"
											onClick={clearFilters}
											className="border border-input overflow-hidden transition-all duration-300 w-9 group-hover:w-[130px] flex justify-center"
										>
											<X className="h-4 w-4 shrink-0 text-foreground absolute left-1/2 transform -translate-x-1/2 group-hover:left-2 group-hover:translate-x-0" />
											<span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-4">
												Clear Filters
											</span>
										</Button>
									</div>
								</TableHead>
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									onClick={() => setSelectedAlert(row.original)}
									className="cursor-pointer"
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
									colSpan={tableColumns.length + 1}
									className="h-24 text-center"
								>
									Loading...
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell
									colSpan={tableColumns.length + 1}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Only show pagination if we have data */}
			{alertsToUse.length > 0 && (
				<div className="border-t px-2 py-4">
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
									disabled={currentPage === 1}
								/>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink>{currentPage}</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationNext
									onClick={() => setCurrentPage(prev => prev + 1)}
									disabled={alertsToUse.length < rowsPerPage}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}

			{/* Use the new AlertPopup component */}
			<AlertPopup alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
		</div>
	)
})

export default AlertTable
