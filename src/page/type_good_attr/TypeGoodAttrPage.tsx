import BreadcrumbCustom from "@/component_common/breadcrumb/BreadcrumbCustom";
import ButtonForm from "@/component_common/commonForm/ButtonForm";
import TableCustom from "@/component_common/table/TableCustom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TypeGoodAttrObject } from "@/type/TypeCommon";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import { fetchData } from "@/api/commonApi";
import TypeGoodAttrDeleteDialog from "./component/TypeGoodAttrDeleteDialog";
import TypeGoodAttrUpdateDialog from "./component/TypeGoodAttrUpdateDialog";
import TypeGoodAttrCreateDialog from "./component/TypeGoodAttrCreateDialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TypeGoodAttrPage = () => {
  const [openNew, setOpenNew] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TypeGoodAttrObject | null>(
    null
  );
  const { data, isError, isFetching, error, isSuccess } = useQuery({
    queryKey: ["typeGoodAttrs"],
    queryFn: () => fetchData("/admin/typegoodattr/all"),
  });
  const {
    data: dataTypeGood,
    isError: isErrorTypeGood,
    isFetching: isFetchingTypeGood,
    error: errorTypeGood,
    isSuccess: isSuccessTypeGood,
  } = useQuery({
    queryKey: ["districts"],
    queryFn: () => fetchData("/admin/typegood/all"),
  });
  const breadBrumb = [
    {
      itemName: "Quản lí chung",
    },
    {
      itemName: "Sản phẩm",
    },
    {
      itemName: "Danh sách thuộc tính loại hàng",
      itemLink: "/ward",
    },
  ];
  const columns: ColumnDef<TypeGoodAttrObject>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "typeGoodAttrCode",
      meta: "Mã thuộc tính",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mã thuộc tính
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("typeGoodAttrCode")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "name",
      meta: "Tên thuộc tính",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên thuộc tính
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "numberOfProductAttr",
      meta: "Tổng sản phẩm",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tổng sản phẩm
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("numberOfProductAttr")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "typeGoodCode",
      meta: "Loại hàng",
      header: ({ column }) => {
        return (
          <Button
            className="hidden"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Loại hàng
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize hidden">{row.getValue("typeGoodCode")}</div>
      ),
      enableHiding: false,
    },
    {
      id: "actions",
      header: () => {
        return <div className="flex justify-end">Tác vụ</div>;
      },
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <Popover>
            <PopoverTrigger asChild>
            <div className="w-16 text-end cursor-pointer ml-auto pr-5">
                <i className="ri-menu-line text-xl text-gray-600"></i>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-44" align="end">
              <div
                className="px-3 hover:bg-slate-100 cursor-pointer text-sm py-2 text-gray-600 flex gap-x-1"
                onClick={() => {
                  setSelectedItem(row.original);
                  setOpenUpdate(true);
                }}
              >
                <span>Xem chi tiết</span>
              </div>
              <div
                className="px-3 hover:bg-slate-100 cursor-pointer text-sm py-2 text-gray-600 flex gap-x-1"
                onClick={async () => {
                  setSelectedItem(row.original);
                  setOpenDelete(true);
                }}
              >
                <span>Xóa</span>
              </div>
            </PopoverContent>
          </Popover>
        );
      },
    },
  ];
  return (
    <>
      <TypeGoodAttrDeleteDialog
        item={selectedItem}
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      ></TypeGoodAttrDeleteDialog>
      <TypeGoodAttrUpdateDialog
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        item={selectedItem}
      ></TypeGoodAttrUpdateDialog>
      <TypeGoodAttrCreateDialog
        open={openNew}
        onClose={() => setOpenNew(false)}
      ></TypeGoodAttrCreateDialog>
      <div className="flex flex-col gap-y-2">
        <div className="mb-3">
          <BreadcrumbCustom
            linkList={breadBrumb}
            itemName={"itemName"}
            itemLink={"itemLink"}
          ></BreadcrumbCustom>
        </div>

        {/* Action  */}
        <div className="flex justify-between items-center">
          <h4 className="text-xl font-medium text-gray-600">
            Danh sách thuộc tính loại hàng
          </h4>
          <div className="flex gap-x-2">
            <ButtonForm
              className="!bg-primary !w-28"
              type="button"
              icon={<i className="ri-download-2-line"></i>}
              label="Xuất excel"
            ></ButtonForm>
            <ButtonForm
              className="!bg-secondary !w-28"
              type="button"
              icon={<i className="ri-file-add-line"></i>}
              onClick={() => setOpenNew(true)}
              label="Thêm mới"
            ></ButtonForm>
          </div>
        </div>

        {/* table */}
        <div className="rounded-md p-5 bg-white border-gray-200 border shadow-md">
          <TableCustom
            data={isSuccess ? data : []}
            columns={columns}
            search={[
              { key: "typeGoodAttrCode", name: "mã loại hàng", type: "text" },
              { key: "name", name: "tên loại hàng", type: "text" },
              {
                key: "typeGoodCode",
                name: "Loại hàng",
                type: "combobox",
                dataKey: "typeGoodCode",
                dataName: "name",
                dataList:
                  isSuccessTypeGood && dataTypeGood != undefined
                    ? dataTypeGood
                    : [],
              },
            ]}
            isLoading={isFetching}
          ></TableCustom>
        </div>
      </div>
    </>
  );
};

export default TypeGoodAttrPage;
