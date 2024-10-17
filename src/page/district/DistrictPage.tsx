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
import { DistrictObject, ProvinceObject } from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { fetchData } from "@/api/commonApi";
import DistrictDeleteDialog from "./component/DistrictDeleteDialog";
import DistrictUpdateDialog from "./component/DistrictUpdateDialog";
import DistrictCreateDialog from "./component/DistrictCreateDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DistrictPage = () => {
  const [openNew, setOpenNew] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { data, isError, isFetching, error, isSuccess } = useQuery({
    queryKey: ["districts"],
    queryFn: () => fetchData("/admin/district/all"),
  });
  const {
    data: dataProvince,
    isError: isErrorProvince,
    isFetching: isFetchingProvince,
    error: errorProvince,
    isSuccess: isSuccessProvince,
  } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => fetchData("/admin/province/all"),
  });
  console.log("Hell");
  const breadBrumb = [
    {
      itemName: "Quản lí chung",
    },
    {
      itemName: "Danh sách Phường/Huyện",
      itemLink: "/district",
    },
  ];
  const columns: ColumnDef<DistrictObject>[] = [
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
      accessorKey: "districtCode",
      meta: "Mã Phường/Huyện",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mã Phường/Huyện
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("districtCode")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "name",
      meta: "Tên Phường/Huyện",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên Phường/Huyện
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
      accessorKey: "provinceCode",
      meta: "Tỉnh/Thành phố",
      header: ({ column }) => {
        return (
          <Button
            className="hidden"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Thuộc Tỉnh/Thành Phố
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize hidden">{row.getValue("provinceCode")}</div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "numberOfWards",
      meta: "Số Thị xã/Thị trấn trực thuộc",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Số Thị xã trực thuộc
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("numberOfWards")}</div>
      ),
      enableHiding: true,
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
      <DistrictDeleteDialog
        item={selectedItem}
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      ></DistrictDeleteDialog>
      <DistrictUpdateDialog
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        item={selectedItem}
      ></DistrictUpdateDialog>
      <DistrictCreateDialog
        open={openNew}
        onClose={() => setOpenNew(false)}
      ></DistrictCreateDialog>
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
            Danh sách quảng cáo
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
              { key: "districtCode", name: "mã Phường/Huyện", type: "text" },
              { key: "name", name: "tên Phường/Huyện", type: "text" },
              {
                key: "provinceCode",
                name: "Tỉnh/Thành phố",
                type: "combobox",
                dataKey: "provinceCode",
                dataName: "name",
                dataList:
                  isSuccessProvince && dataProvince != undefined
                    ? dataProvince
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

export default DistrictPage;
