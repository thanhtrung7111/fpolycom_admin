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
import { DistrictObject, ProvinceObject, WardObject } from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { fetchData } from "@/api/commonApi";
import WardDeletePage from "./component/WardDeletePage";
import WardUpdatePage from "./component/WardUpdatePage";
import WardCreatePage from "./component/WardCreatePage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const WardPage = () => {
  const [openNew, setOpenNew] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WardObject | null>(null);
  const { data, isError, isFetching, error, isSuccess } = useQuery({
    queryKey: ["wards"],
    queryFn: () => fetchData("/admin/ward/all"),
  });
  const {
    data: dataDistricts,
    isError: isErrorDistricts,
    isFetching: isFetchingDistricts,
    error: errorDistricts,
    isSuccess: isSuccessDistricts,
  } = useQuery({
    queryKey: ["districts"],
    queryFn: () => fetchData("/admin/district/all"),
  });
  console.log("Hell");
  const breadBrumb = [
    {
      itemName: "Quản lí chung",
    },
    {
      itemName: "Danh sách Thị xã/Thị trấn",
      itemLink: "/ward",
    },
  ];
  const columns: ColumnDef<WardObject>[] = [
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
      accessorKey: "wardCode",
      meta: "Mã Thị xã/Thị trấn",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mã Thị xã/Thị trấn
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("wardCode")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "name",
      meta: "Tên Thị xã/Thị trấn",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên Thị xã/Thị trấn
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
      accessorKey: "districtCode",
      meta: "Phường/Huyện",
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
        <div className="capitalize hidden">{row.getValue("districtCode")}</div>
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
      <WardDeletePage
        item={selectedItem}
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      ></WardDeletePage>
      <WardUpdatePage
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        item={selectedItem}
      ></WardUpdatePage>
      <WardCreatePage
        open={openNew}
        onClose={() => setOpenNew(false)}
      ></WardCreatePage>
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
            Danh sách Thị xã/Thị trấn
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
              { key: "wardCode", name: "mã Thị xã/Thị trấn", type: "text" },
              { key: "name", name: "tên Thị xã/Thị trấn", type: "text" },
              {
                key: "districtCode",
                name: "Phường/Huyện",
                type: "combobox",
                dataKey: "districtCode",
                dataName: "name",
                dataList:
                  isSuccessDistricts && dataDistricts != undefined
                    ? dataDistricts
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

export default WardPage;
