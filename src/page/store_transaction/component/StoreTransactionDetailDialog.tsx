import { fetchData, postData, uploadImage } from "@/api/commonApi";
import ButtonForm from "@/component_common/commonForm/ButtonForm";
import DatePickerFormikForm from "@/component_common/commonForm/DatePickerFormikForm";
import InputFormikForm from "@/component_common/commonForm/InputFormikForm";
import NumberFormikForm from "@/component_common/commonForm/NumberFormikForm";
import SelectFormikForm from "@/component_common/commonForm/SelectFormikForm";
import TextareaFormikForm from "@/component_common/commonForm/TextareaFormikForm";
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
import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const FILE_SIZE = 1024 * 1024 * 2;
const StoreTransactionDetailDialog = ({
  open = false,
  onClose,
  item = null,
}: {
  open: boolean;
  onClose: () => void;
  item: StoreTransactonObject | null;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handlePost = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/store-transaction/completed"),
    onSuccess: (data: StoreTransactonObject) => {
      if (queryClient.getQueryData(["storeTransactions"])) {
        queryClient.setQueryData(
          ["storeTransactions"],
          (oldData: StoreTransactonObject[]) => {
            const resultData = data;
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

  const handlePostDeclined = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/store-transaction/declined"),
    onSuccess: (data: StoreTransactonObject) => {
      if (queryClient.getQueryData(["storeTransactions"])) {
        queryClient.setQueryData(
          ["storeTransactions"],
          (oldData: StoreTransactonObject[]) => {
            const resultData = data;
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

  const handleDeclined = async (): Promise<void> => {
    await handlePostDeclined.mutateAsync({
      storeTransactionCode: item?.storeTransactionCode,
      content: "Thông tin giao dịch sai!",
    });
  };

  const handleConfirm = async (): Promise<void> => {
    await handlePost.mutateAsync({
      storeTransactionCode: item?.storeTransactionCode,
    });
  };
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!handlePost.isPending && !handlePostDeclined.isPending) {
          onClose();
          setTimeout(() => {
            handlePostDeclined.reset();
            handlePost.reset();
          }, 500);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogTitle className="mb-5">Chi tiết giao dịch</DialogTitle>

        {!handlePost.isSuccess && !handlePostDeclined.isSuccess ? (
          <div className="flex flex-col gap-y-4 px-1">
            <DialogDescription className="flex flex-col gap-y-3">
              <div className="grid grid-cols-2 gap-x-3">
                <div className="text-gray-700">
                  <span className="font-semibold">Tên tài khoản: </span>
                  {item?.bankAccountName}
                </div>
                <div className="text-gray-700">
                  <span className="font-semibold">Số tài khoản: </span>
                  {item?.bankAccountNumber}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-3">
                <div className="text-gray-700">
                  <span className="font-semibold">Ngân hàng: </span>
                  {item?.bankName}
                </div>
                <div className="text-gray-700">
                  <span className="font-semibold">Tổng tiền: </span>
                  {Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item?.totalAmount ? item?.totalAmount : 0)}
                </div>
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">Chi nhánh: </span>
                {item?.bankBranchName}
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">Cửa hàng giao dịch: </span>
                {item?.storeName}
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">Mã cửa hàng giao dịch: </span>
                {item?.storeCode}
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">Trạng thái giao dịch: </span>
                {item?.transactionStatus}
              </div>
            </DialogDescription>
            <DialogFooter>
              <div className="flex gap-x-2 justify-end">
                {item?.transactionStatus == "pending" && (
                  <>
                    <ButtonForm
                      type="submit"
                      className="!w-28 !bg-primary"
                      label="Đã thanh toán"
                      loading={handlePost.isPending}
                      onClick={() => handleConfirm()}
                      disabled={handlePostDeclined.isPending}
                    ></ButtonForm>
                    <ButtonForm
                      type="button"
                      className="!w-28 !bg-gray-500"
                      label="Từ chối"
                      loading={handlePostDeclined.isPending}
                      onClick={() => handleDeclined()}
                      disabled={handlePost.isPending}
                    ></ButtonForm>
                  </>
                )}
                <ButtonForm
                  type="button"
                  className="!w-28 !bg-red-500"
                  label="Hủy"
                  disabled={
                    handlePost.isPending || handlePostDeclined.isPending
                  }
                  onClick={() => {
                    onClose();
                    setTimeout(() => {
                      handlePost.reset();
                      handlePostDeclined.reset();
                    }, 500);
                  }}
                ></ButtonForm>
              </div>
            </DialogFooter>
          </div>
        ) : (
          <div className="flex flex-col px-1">
            <DialogDescription className="flex items-center mb-5 justify-center gap-x-2 py-6">
              <i className="ri-checkbox-line text-gray-700 text-xl"></i>{" "}
              <span className="text-gray-700 text-base">
                {handlePost.isSuccess && "Xác nhận thành công!"}
                {handlePostDeclined.isSuccess && "Từ chối thành công!"}
              </span>
            </DialogDescription>
            <div className="flex gap-x-2 justify-end">
              <ButtonForm
                type="button"
                className="!w-28 !bg-red-500"
                label="Hủy"
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    handlePost.reset();
                    handlePostDeclined.reset();
                  }, 500);
                }}
              ></ButtonForm>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StoreTransactionDetailDialog;
