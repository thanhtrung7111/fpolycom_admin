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
  DiscountObject,
  DistrictObject,
  PaymentTypeObject,
  ProvinceObject,
  StoreTransactonObject,
} from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { fetchData, postData } from "@/api/commonApi";
import StoreTransactionDetailDialog from "./component/StoreTransactionDetailDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StoreTransactionPage = () => {
  const queryClient = useQueryClient();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<StoreTransactonObject | null>(null);
  const { data, isError, isFetching, error, isSuccess } = useQuery({
    queryKey: ["storeTransactions"],
    queryFn: () => fetchData("/admin/store-transaction/all"),
  });
  const {
    data: dataStatus,
    isError: isErrorStatus,
    isFetching: isFetchingStatus,
    error: errorStatus,
    isSuccess: isSuccessStatus,
  } = useQuery({
    queryKey: ["transactionStatuss"],
    queryFn: () => fetchData("/common/status/transaction"),
  });
  const handleConfirm = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/store-transaction/completed"),
    onSuccess: (data: StoreTransactonObject) => {
      if (queryClient.getQueryData(["storeTransactions"])) {
        queryClient.setQueryData(
          ["storeTransactions"],
          (oldData: StoreTransactonObject[]) => {
            const resultData = data;
            console.log(resultData);
            return [
              resultData,
              ...oldData.filter(
                (item) =>
                  item.storeTransactionCode != resultData.storeTransactionCode
              ),
            ];
          }
        );
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "storeTransactions",
        });
      }
    },
  });

  const breadBrumb = [
    {
      itemName: "Quản lí chung",
    },
    {
      itemName: "Thanh toán",
    },
    {
      itemName: "Giao dịch cửa hàng",
      itemLink: "/payment_type",
    },
  ];
  const columns: ColumnDef<StoreTransactonObject>[] = [
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
      accessorKey: "storeTransactionCode",
      meta: "Mã giao dịch cửa hàng",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mã giao dịch cửa hàng
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("storeTransactionCode")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "storeName",
      meta: "Cửa hàng giao dịch",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Cửa hàng giao dịch
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("storeName")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "bankName",
      meta: "Ngân hàng",
      header: ({ column }) => {
        return (
          <Button
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
        <div className="capitalize">{row.getValue("bankName")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "bankAccountName",
      meta: "Tên TK",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên TK
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("bankAccountName")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "bankAccountNumber",
      meta: "Số TK",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Số TK
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("bankAccountNumber")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "transactionStatus",
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
        <div className="capitalize">
          <span
            className={`${
              row.getValue("transactionStatus") == "pending"
                ? "text-yellow-600"
                : row.getValue("transactionStatus") == "failed"
                ? "text-red-700"
                : "text-green-700"
            } font-semibold`}
          >
            {row.getValue("transactionStatus")}
          </span>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-16 text-end cursor-pointer">
                <i className="ri-menu-line text-xl text-gray-600"></i>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                {row.original.transactionStatus == "pending" && (
                  <>
                    <DropdownMenuItem>
                      <span>Xem chi tiết</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async () => {
                        setOpenSuccess(true);
                        await handleConfirm.mutateAsync({
                          storeTransactionCode:
                            row.original.storeTransactionCode,
                        });
                      }}
                    >
                      <span>Xác nhận</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Từ chối</span>
                    </DropdownMenuItem>
                  </>
                )}
                {(row.original.transactionStatus == "complete" ||
                  row.original.transactionStatus == "failed") && (
                  <>
                    <DropdownMenuItem>
                      <span>Xem chi tiết</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <>
      <Dialog
        open={openSuccess}
        onOpenChange={() => {
          if (!handleConfirm.isPending) {
            setOpenSuccess(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thông báo</DialogTitle>
            <DialogDescription className="py-5 flex items-center gap-x-2 justify-center">
              {handleConfirm.isPending ? (
                <>
                  <SpinnerLoading className="size-5 fill-primary"></SpinnerLoading>
                  <span className="text-gray-700 text-base">
                    Đang xác nhận...
                  </span>
                </>
              ) : (
                <>
                  <i className="ri-checkbox-line text-gray-700 text-xl"></i>{" "}
                  <span className="text-gray-700 text-base">
                    Thêm thành công
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-x-2 justify-end">
              {!handleConfirm.isPending && (
                <ButtonForm
                  type="button"
                  className="!w-28 !bg-red-500"
                  label="Hủy"
                  // disabled={handlePost.isPending || isLoading}
                  onClick={() => {
                    setOpenSuccess(false);
                    setTimeout(() => {
                      handleConfirm.reset();
                    }, 500);
                  }}
                ></ButtonForm>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <StoreTransactionDetailDialog
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        item={selectedItem}
      ></StoreTransactionDetailDialog>
      
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
            Danh sách loại thanh toán
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
                key: "bankAccountNumber",
                name: "số tài khoản",
                type: "text",
              },
              {
                key: "transactionStatus",
                name: "Trạng thái",
                type: "combobox",
                dataKey: "name",
                dataName: "description",
                dataList:
                  isSuccessStatus && dataStatus != undefined ? dataStatus : [],
              },
            ]}
            isLoading={isFetching}
          ></TableCustom>
        </div>
      </div>
    </>
  );
};

export default StoreTransactionPage;
