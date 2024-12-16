import BreadcrumbCustom from "@/component_common/breadcrumb/BreadcrumbCustom";
import ButtonForm from "@/component_common/commonForm/ButtonForm";
import TableCustom from "@/component_common/table/TableCustom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { OrderListObject } from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import { fetchData, postData } from "@/api/commonApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import OrderDetailDialog from "./component/OrderDetailDialog";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
// import StoreBannerDeleteDialog from "./component/StoreBannerDeleteDialog";
// import StoreBannerUpdateDialog from "./component/StoreBannerUpdateDialog";
// import StoreBannerCreateDialog from "./component/StoreBannerCreateDialog";
const StoreOrderPage = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useUserStore();
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderListObject | null>(
    null
  );
  const { data, isError, isFetching, error, isSuccess } = useQuery({
    queryKey: ["store_orders"],
    queryFn: () => fetchData("/admin/order/all"),
  });

  const handleConfirmOrder = useMutation({
    mutationFn: (body: number) =>
      postData({ orderCode: body }, "/store/orders/confirm"),
    onSuccess: (data: OrderListObject) => {
      toast.success("Xác nhận đơn hàng thành công!", {
        className: "p-4",
      });
      if (queryClient.getQueryData(["store_orders"])) {
        queryClient.setQueryData(
          ["store_orders"],
          (oldData: OrderListObject[]) => {
            const resultData = data;
            console.log(resultData);
            return [
              resultData,
              ...oldData.filter((item) => item.orderCode != data.orderCode),
            ];
          }
        );
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "store_orders",
        });
      }
    },
  });

  const handlePreparedOrder = useMutation({
    mutationFn: (body: number) =>
      postData({ orderCode: body }, "/store/orders/prepared"),
    onSuccess: (data: OrderListObject) => {
      toast.success("Chuẩn bị hàng thành công, đợi lấy hàng!", {
        className: "p-4",
      });
      if (queryClient.getQueryData(["store_orders"])) {
        queryClient.setQueryData(
          ["store_orders"],
          (oldData: OrderListObject[]) => {
            const resultData = data;
            console.log(resultData);
            return [
              resultData,
              ...oldData.filter((item) => item.orderCode != data.orderCode),
            ];
          }
        );
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "store_orders",
        });
      }
    },
  });

  // const {
  //   data: dataOrderStatus,
  //   isError: isErrorOrderStatus,
  //   isFetching: isFetchingOrderStatus,
  //   error: errorOrderStatus,
  //   isSuccess: isSuccessOrderStatus,
  // } = useQuery({
  //   queryKey: ["orderStatus"],
  //   queryFn: () => fetchDataCommon("/common/status/order"),
  //   enabled: currentStore != null,
  // });
  const breadBrumb = [
    {
      itemName: "Quản lí chung",
    },

    {
      itemName: "Đơn hàng",
      itemLink: "/store/order",
    },
  ];
  const columns: ColumnDef<OrderListObject>[] = [
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
      accessorKey: "orderCode",
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
        <div className="capitalize">#{row.getValue("orderCode")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "orderDate",
      meta: "Ngày đặt hàng",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ngày đặt hàng
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("orderDate")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "finalTotal",
      meta: "Tổng tiền",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tổng tiền
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
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(row.getValue("finalTotal"))}
        </div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "orderStatus",
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
          {row.getValue("orderStatus") == "pending" &&
            "Đang đợi xác nhận từ cửa hàng"}
          {row.getValue("orderStatus") == "prepare" && "Đang chuẩn bị hàng"}
          {row.getValue("orderStatus") == "complete" && "Hoàn thành"}
          {row.getValue("orderStatus") == "delivery" && "Đang giao hàng"}
          {row.getValue("orderStatus") == "pickup" && "Đang lấy hàng"}
          {row.getValue("orderStatus") == "warehouse" && "Hàng nhập kho"}
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
        return (
          <Popover>
            <PopoverTrigger asChild>
              <div className="w-16 text-end cursor-pointer ml-auto pr-5">
                <i className="ri-menu-line text-xl text-gray-600"></i>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-2" align="end">
              <div
                className="px-3 hover:bg-slate-100 cursor-pointer text-sm py-2 text-gray-600 flex gap-x-1"
                onClick={() => {
                  setSelectedItem(row.original);
                  setOpenDetail(true);
                }}
              >
                <span>Xem chi tiết</span>
              </div>
              {row.original.orderStatus == "pending" && (
                <>
                  <div
                    className="px-3 hover:bg-slate-100 cursor-pointer text-sm py-2 text-gray-600 flex gap-x-1"
                    onClick={async () => {
                      if (row.original.orderCode) {
                        handleConfirmOrder.mutateAsync(
                          Number.parseInt(row.original.orderCode)
                        );
                      }
                    }}
                  >
                    <span>Xác nhận</span>
                  </div>
                  <div
                    className="px-3 hover:bg-slate-100 cursor-pointer text-sm py-2 text-gray-600 flex gap-x-1"
                    onClick={async () => {
                      setSelectedItem(row.original);
                    }}
                  >
                    <span>Hủy đơn hàng</span>
                  </div>
                </>
              )}
              {row.original.orderStatus == "prepare" && (
                <>
                  <div
                    className="px-3 hover:bg-slate-100 cursor-pointer text-sm py-2 text-gray-600 flex gap-x-1"
                    onClick={async () => {
                      if (row.original.orderCode) {
                        handlePreparedOrder.mutateAsync(
                          Number.parseInt(row.original.orderCode)
                        );
                      }
                    }}
                  >
                    <span>Chuẩn bị xong</span>
                  </div>{" "}
                </>
              )}
            </PopoverContent>
          </Popover>
        );
      },
    },
  ];
  return (
    <>
      <OrderDetailDialog
        open={openDetail}
        item={selectedItem}
        onClose={() => setOpenDetail(false)}
      ></OrderDetailDialog>
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
            Danh sách đơn hàng
          </h4>
          <div className="flex gap-x-2">
            <ButtonForm
              className="!bg-primary !w-28"
              type="button"
              icon={<i className="ri-download-2-line"></i>}
              label="Xuất excel"
            ></ButtonForm>
          </div>
        </div>

        {/* table */}
        <div className="rounded-md p-5 bg-white border-gray-200 border shadow-md">
          <TableCustom
            data={isSuccess ? data : []}
            columns={columns}
            search={[
              {
                key: "orderCode",
                name: "mã đơn hàng",
                type: "text",
              },
              // {
              //   key: "orderStatus",
              //   name: "Trạng thái đơn hàng",
              //   type: "combobox",
              //   dataList: dataOrderStatus ? dataOrderStatus : [],
              //   dataKey: "name",
              //   dataName: "description",
              // },
            ]}
            isLoading={isFetching}
          ></TableCustom>
        </div>
      </div>
    </>
  );
};

export default StoreOrderPage;
