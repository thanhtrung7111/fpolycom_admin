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
import { ProvinceObject, ReceiveOrderObject } from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Form, Formik } from "formik";
import React, { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchData, postData } from "@/api/commonApi";
import StatusBadge from "@/component_common/status/StatusBadge";
import DeliveryOrderDialog from "./component/DeliveryOrderDialog";
const DeliveryOrderPage = () => {
  const queryClient = useQueryClient();
  const [select, setSelected] = useState<any[]>([]);
  const [openNew, setOpenNew] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReceiveOrderObject | null>(
    null
  );
  const { data, isError, isFetching, error, isSuccess } = useQuery({
    queryKey: ["delivery_order"],
    queryFn: () => fetchData("/admin/warehouse/all-delivery"),
  });
  const breadBrumb = [
    {
      itemName: "Quản lí chung",
    },
    {
      itemName: "Danh sách đơn giao",
      itemLink: "/delivery_order",
    },
  ];
  const handleConfirm = useMutation({
    mutationFn: (body: any) =>
      postData(body, "/admin/warehouse/confirmDeliverySuccess"),
    onSuccess: (data: any) => {
      if (queryClient.getQueryData(["delivery_order"])) {
        queryClient.setQueryData(
          ["delivery_order"],
          (oldData: ReceiveOrderObject[]) => {
            const resultData = data;
            const findItem: ReceiveOrderObject | undefined = oldData.find(
              (item) => item.ordersCode == resultData.orderCode
            );
            if (findItem) {
              findItem.paymentSuccess = true;
            }
            console.log(findItem);
            return [
              findItem,
              ...oldData.filter(
                (item) => item.ordersCode != resultData.orderCode
              ),
            ];
          }
        );
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "delivery_order",
        });
      }
    },
  });
  const columns: ColumnDef<ReceiveOrderObject>[] = [
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
      accessorKey: "ordersCode",
      meta: "Mã đơn hàng",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mã đơn hàng
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">#{row.getValue("ordersCode")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "receiveDeliveryCode",
      meta: "Mã đơn lấy hàng",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mã đơn lấy hàng
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">#{row.getValue("receiveDeliveryCode")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "deliveryDate",
      meta: "Ngày lấy hàng",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ngày lấy hàng
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("deliveryDate")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "statusDelivery",
      meta: "Trạng thái",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Trạng thái
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>
          <StatusBadge
            item={row.getValue("statusDelivery")}
            success="complete"
            warning="taking"
            error="Failed"
          >
            {row.getValue("statusDelivery") == "taking"
              ? "Đang lấy hàng"
              : row.getValue("statusDelivery") == "complete"
              ? "Hoàn thành"
              : "Hoãn lấy hàng"}
          </StatusBadge>
        </div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "shipperName",
      meta: "Người lấy hàng",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Người lấy hàng
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("shipperName") == null
            ? "Chưa xác định"
            : row.getValue("shipperName")}
        </div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "typePayment",
      meta: "Loại thanh toán",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Loại thanh toán
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("typePayment")}</div>,
      enableHiding: true,
    },
    {
      accessorKey: "isWarehouse",
      meta: "Xác nhận từ quản lí",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Xác nhận từ quản lí
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>
          <StatusBadge
            item={
              row.original && row.original.paymentSuccess
                ? "confirm"
                : "iconfirm"
            }
            success="confirm"
            warning="iconfirm"
          >
            {row.original && row.original.paymentSuccess
              ? "Đã xác nhận"
              : "Chưa xác nhận"}
          </StatusBadge>
        </div>
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
          <Popover>
            <PopoverTrigger asChild>
              <div className="w-16 text-end cursor-pointer">
                <i className="ri-menu-line text-xl text-gray-600"></i>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end">
              <div
                className="px-3 hover:bg-slate-100 cursor-pointer text-sm py-2 text-gray-600 flex gap-x-1"
                onClick={() => {
                  setSelectedItem(row.original);
                  setOpenUpdate(true);
                }}
              >
                <span>Xem chi tiết</span>
              </div>
              {row.original.shipperCode == null && (
                <div
                  className="px-3 hover:bg-slate-100 cursor-pointer text-sm py-2 text-gray-600 flex gap-x-1"
                  onClick={() => {
                    setSelectedItem(row.original);
                    setOpenUpdate(true);
                  }}
                >
                  <span>Phân công giao hàng</span>
                </div>
              )}
              {row.original.statusDelivery == "complete" &&
                !row.original.paymentSuccess && (
                  <div
                    className="px-3 hover:bg-slate-100 cursor-pointer text-sm py-2 text-gray-600 flex gap-x-1"
                    onClick={() => {
                      handleConfirm.mutateAsync({
                        orderCode: row.original.ordersCode,
                      });
                    }}
                  >
                    <span>Xác nhận lấy hàng</span>
                  </div>
                )}
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
      {/* <ProvinceDeleteDialog
        item={selectedItem}
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      ></ProvinceDeleteDialog> */}
      <DeliveryOrderDialog
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        item={selectedItem}
      ></DeliveryOrderDialog>
      {/* <ProvinceCreateDialog
        open={openNew}
        onClose={() => setOpenNew(false)}
      ></ProvinceCreateDialog>  */}
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
            Danh sách đơn giao
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
              onClick={() => console.log(columns)}
              label="Phân công"
            ></ButtonForm>
          </div>
        </div>

        {/* table */}
        <div className="rounded-md p-5 bg-white border-gray-200 border shadow-md">
          <TableCustom
            data={isSuccess ? data : []}
            columns={columns}
            onSelect={(data) => console.log(data)}
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
            isLoading={isFetching}
          ></TableCustom>
        </div>
      </div>{" "}
    </>
  );
};

export default DeliveryOrderPage;
