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
import { ProvinceObject } from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ProvinceCreateDialog from "./component/ProvinceCreateDialog";
import ProvinceUpdateDialog from "./component/ProvinceUpdateDialog";
import { fetchData } from "@/api/commonApi";

const ProvincePage = () => {
  const [openNewProvince, setOpenNewProvince] = useState(false);
  const [openUpdateProvince, setOpenUpdateProvince] = useState(false);
  const [openDeleteProvince, setOpenDeleteProvince] = useState(false);
  const [itemUpdate, setItemUpdate] = useState<any>(null);
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

  const breadBrumb = [
    {
      itemName: "Quản lí chung",
    },
    {
      itemName: "Danh sách quảng cáo",
      itemLink: "/advertisement",
    },
  ];
  const columns: ColumnDef<ProvinceObject>[] = [
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
      accessorKey: "provinceCode",
      meta: "Mã tỉnh/thành phố",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mã tỉnh/thành phố
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("provinceCode")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "name",
      meta: "Tên tỉnh/thành phố",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên tỉnh/thành phố
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
      accessorKey: "numberOfDistricts",
      meta: "Số huyện trực thuộc",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Số huyện trực thuộc
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("numberOfDistricts")}</div>
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
          <div className="flex gap-x-2 justify-end">
            <ButtonForm
              onClick={() => {
                setItemUpdate(row.original);
                setOpenUpdateProvince(true);
              }}
              className="!bg-yellow-500 !w-28 text-sm"
              type="button"
              icon={<i className="ri-error-warning-line"></i>}
              label="Xem chi tiết"
            ></ButtonForm>

            <ButtonForm
              className="!bg-red-500 !w-20  text-sm disabled:!bg-slate-500"
              type="button"
              // disabled={handleDelete.isPending}
              //   loading={
              //     row.original.KKKK0000 == bodyDelete && handleDelete.isPending
              //   }
              //   onClick={async () => {
              //     setAdvertisementDelete(row.original);
              //     setOpentDialogDelete(true);
              //   }}
              icon={<i className="ri-delete-bin-line"></i>}
              label="Xóa"
            ></ButtonForm>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <ProvinceUpdateDialog
        open={openUpdateProvince}
        onClose={() => setOpenUpdateProvince(false)}
        item={itemUpdate}
      ></ProvinceUpdateDialog>
      <ProvinceCreateDialog
        open={openNewProvince}
        onClose={() => setOpenNewProvince(false)}
      ></ProvinceCreateDialog>
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
              onClick={() => setOpenNewProvince(true)}
              label="Thêm mới"
            ></ButtonForm>
          </div>
        </div>

        {/* table */}
        <div className="rounded-md p-5 bg-white border-gray-200 border shadow-md">
          <TableCustom
            data={isSuccessProvince ? dataProvince : []}
            columns={columns}
            search={[
              { key: "provinceCode", name: "mã tỉnh/thành phố", type: "text" },
              { key: "name", name: "tên tỉnh/thành phố", type: "text" },
              //   {
              //     key: "BANRTYPE",
              //     name: "Loại quảng cáo",
              //     type: "combobox",
              //     dataKey: "ITEMCODE",
              //     dataName: "ITEMNAME",
              //     dataList: dataBannerType,
              //   },
            ]}
            isLoading={isFetchingProvince}
          ></TableCustom>
        </div>
      </div>{" "}
    </>
  );
};

export default ProvincePage;
