import BreadcrumbCustom from "@/component_common/breadcrumb/BreadcrumbCustom";
import ButtonForm from "@/component_common/commonForm/ButtonForm";
import InputFormikForm from "@/component_common/commonForm/InputFormikForm";
import SpinnerLoading from "@/component_common/loading/SpinnerLoading";
import TableCustom from "@/component_common/table/TableCustom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BankBranckObject,
  DistrictObject,
  ProvinceObject,
  WardObject,
} from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "@/api/commonApi";
import BankBranchUpdateDialog from "./component/BankBranchUpdateDialog";
import BankBranchDeleteDialog from "./component/BankBranchDeleteDialog";
import BankBranchCreateDialog from "./component/BankBranchCreateDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BankBranchPage = () => {
  const [openNew, setOpenNew] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BankBranckObject | null>(
    null
  );
  const { data, isError, isFetching, error, isSuccess } = useQuery({
    queryKey: ["bankbranchs"],
    queryFn: () => fetchData("/admin/bankbranch/all"),
  });
  const {
    data: dataBank,
    isError: isErrorBank,
    isFetching: isFetchingBank,
    error: errorBank,
    isSuccess: isSuccessBank,
  } = useQuery({
    queryKey: ["banks"],
    queryFn: () => fetchData("/admin/bank/all"),
  });
  const breadBrumb = [
    {
      itemName: "Quản lí chung",
    },
    {
      itemName: "Ngân hàng",
    },
    {
      itemName: "Danh sách chi nhánh",
      itemLink: "/ward",
    },
  ];
  const columns: ColumnDef<BankBranckObject>[] = [
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
      accessorKey: "bankBranchCode",
      meta: "Mã chi nhánh",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mã chi nhánh
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("bankBranchCode")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "name",
      meta: "Tên chi nhánh",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên chi nhánh
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
      accessorKey: "bankCode",
      meta: "Ngân hàng",
      header: ({ column }) => {
        return (
          <Button
            className="hidden"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ngân hàng
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize hidden">{row.getValue("bankCode")}</div>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="ml-auto pr-5">
              <div className="w-16 text-end cursor-pointer">
                <i className="ri-menu-line text-xl text-gray-600"></i>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedItem(row.original);
                    setOpenUpdate(true);
                  }}
                >
                  <span>Xem chi tiết</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    setSelectedItem(row.original);
                    setOpenDelete(true);
                  }}
                >
                  <span>Xóa</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <>
      {/* <BankBranchDeleteDialog
        item={selectedItem}
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      ></BankBranchDeleteDialog> */}
      <BankBranchUpdateDialog
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        item={selectedItem}
      ></BankBranchUpdateDialog>
      <BankBranchCreateDialog
        open={openNew}
        onClose={() => setOpenNew(false)}
      ></BankBranchCreateDialog>
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
            Danh sách chi nhánh ngân hàng
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
              { key: "bankBranchCode", name: "mã chi nhánh", type: "text" },
              { key: "name", name: "tên chi nhánh", type: "text" },
              {
                key: "bankCode",
                name: "Ngân hàng",
                type: "combobox",
                dataKey: "bankCode",
                dataName: "name",
                dataList:
                  isSuccessBank && dataBank != undefined ? dataBank : [],
              },
            ]}
            isLoading={isFetching}
          ></TableCustom>
        </div>
      </div>
    </>
  );
};

export default BankBranchPage;
