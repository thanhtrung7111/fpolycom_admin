import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationCustom from "../pagination/PaginationCustom";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchObjectProduct } from "@/type/TypeCommon";
import SpinnerLoading from "../loading/SpinnerLoading";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { any } from "zod";
import ComboboxCustom from "../common_form/ComboboxCustom";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  search: SearchObjectProduct[];
  isLoading?: boolean;
}
const pageSize = 20;
const TableCustom = <TData, TValue>({
  columns,
  data,
  search,
  isLoading = false,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageIndex, setPageIndex] = useState<number>(0);
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      pagination: {
        pageIndex: pageIndex,
        pageSize: pageSize,
      },
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  return (
    <div className="w-full">
      <div className="flex justify-between mb-3">
        <div className="flex gap-x-2 items-center">
          <Popover>
            <PopoverTrigger>
              <Button
                className="flex items-center gap-x-2"
                variant={"outline"}
                type="submit"
                size={"sm"}
              >
                <span className="text-gray-600">Lọc</span>
                <div className="rotate-0 transition-transform duration-500 cursor-pointer">
                  <i className="ri-filter-line text-gray-600"></i>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="grid grid-cols-2 gap-2 w-[600px]"
              align="start"
            >
              {search.map((item: SearchObjectProduct) => {
                return item.type == "text" ? (
                  <input
                    placeholder={`Nhập ${item.name} tìm kiếm...`}
                    className="outline-none rounded-md border border-gray-300 text-sm py-2 px-3"
                    onChange={(e) => {
                      table
                        .getColumn(`${item.key}`)
                        ?.setFilterValue(e.target.value);

                      setPageIndex(0);
                    }}
                  ></input>
                ) : (
                  <ComboboxCustom
                    dataList={
                      item.dataList && item.dataList?.length > 1
                        ? item.dataList
                        : []
                    }
                    dataKey={item.dataKey ? item.dataKey : ""}
                    dataName={item.dataName ? item.dataName : ""}
                    placeholder={item.name}
                    onChange={(value) => {
                      table.getColumn(`${item.key}`)?.setFilterValue(value);
                      setPageIndex(0);
                    }}
                  ></ComboboxCustom>
                );
              })}
            </PopoverContent>
          </Popover>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="group flex items-center gap-x-2"
                  size={"sm"}
                  onClick={() => {
                    table.resetColumnFilters();
                    table.toggleAllRowsSelected(false);
                    table.resetColumnVisibility();
                    table.resetPageIndex();
                    table.resetSorting();
                    setPageIndex(0);
                  }}
                  variant={"outline"}
                >
                  <span className="text-gray-600">Làm mới</span>
                  <div className="rotate-0 group-hover:rotate-90 transition-transform duration-500 cursor-pointer">
                    <i className="ri-refresh-line text-xl text-gray-600"></i>
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-x-2 items-center">
          <div className="flex-1 text-sm text-muted-foreground">
            ({pageIndex * pageSize} -{" "}
            {pageIndex * pageSize + pageSize >=
            table.getCoreRowModel().rows.length
              ? table.getCoreRowModel().rows.length
              : pageIndex * pageSize + pageSize}
            ) trên {table.getCoreRowModel().rows.length} danh mục
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto text-gray-600 focus:!ring-0 focus:!ring-transparent text-xs"
                size={"sm"}
              >
                Hiển thị cột <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.columnDef.meta as string}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Table id="table" className="bg-white relative z-0">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="hover:bg-white" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="p-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <div className="py-5 flex items-center gap-x-3">
              <SpinnerLoading className="w-6 h-6 fill-primary"></SpinnerLoading>{" "}
              <span className="text-gray-500">Đang tải dữ liệu...</span>
            </div>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="border-r-0 border-l-0"
                key={row.id}

                // data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="!text-gray-600 !p-2 !w-fit"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-20 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {table.getFilteredRowModel().rows.length > pageSize && (
        <div className="flex items-center justify-center space-x-2 py-4 mt-5">
          <PaginationCustom
            size={table.getFilteredRowModel().rows.length}
            pageIndex={pageIndex + 1}
            pageSize={pageSize}
            onPageChange={(value) => {
              setPageIndex(value - 1);
              // window.scrollTo("table");
            }}
          ></PaginationCustom>
        </div>
      )}
    </div>
  );
};

export default TableCustom;
