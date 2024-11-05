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
  StoreDetailObject,
  StoreListObject,
  StoreTransactonObject,
} from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
const StoreDetailDialog = ({
  open = false,
  onClose,
  item = null,
}: {
  open: boolean;
  onClose: () => void;
  item: StoreListObject | null;
}) => {
  const queryClient = useQueryClient();
  const [detailStore, setDetailStore] = useState<StoreDetailObject | null>(
    null
  );
  const handleFetchDetailStore = useMutation({
    mutationFn: (storeCode: string) =>
      postData({ storeCode: storeCode }, "/admin/store/detail"),
    onSuccess: (data: StoreDetailObject) => {
      if (data) {
        setDetailStore(data);
      }
    },
  });
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

  useEffect(() => {
    if (item && item.storeCode) {
      handleFetchDetailStore.mutateAsync(item.storeCode);
    }
  }, [item]);

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
      <DialogContent className="sm:max-w-[800px] flex-col gap-y-0">
        <DialogTitle className="mb-2">Chi tiết cửa hàng</DialogTitle>
        <div className="flex items-center gap-x-1">
          <div
            className={`size-3 rounded-full ${
              detailStore?.status == "lock"
                ? "bg-red-500"
                : detailStore?.status == "active"
                ? "bg-green-500"
                : "bg-yellow-500"
            }`}
          ></div>
          <div
            className={`${
              detailStore?.status == "lock"
                ? "text-red-500"
                : detailStore?.status == "active"
                ? "text-green-500"
                : "text-yellow-500"
            }`}
          >
            {detailStore?.status == "pending"
              ? "Chờ duyệt"
              : detailStore?.status == "active"
              ? "Đang hoạt động"
              : "Đang bị khóa"}
          </div>
        </div>

        {!handlePost.isSuccess && !handlePostDeclined.isSuccess ? (
          <div className="flex flex-col gap-y-4 px-1">
            <DialogDescription className="flex flex-col gap-y-3">
              <div>
                <p>
                  <span className="font-medium text-gray-700">
                    Mã cửa hàng:{" "}
                  </span>
                  #{detailStore?.storeRegisterCode}
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Tên cửa hàng:{" "}
                  </span>
                  {detailStore?.name}
                </p>
              </div>
            </DialogDescription>
            <DialogFooter>
              <div className="flex gap-x-2 justify-end">
                {(detailStore?.status == "pending" ||
                  detailStore?.status == "lock") && (
                  <>
                    <ButtonForm
                      type="submit"
                      className="!w-32 !bg-primary"
                      label={
                        detailStore.status == "pending"
                          ? "Duyệt cửa hàng"
                          : "Mở khóa cửa hàng"
                      }
                      loading={handlePost.isPending}
                      //   onClick={() => handleConfirm()}
                      disabled={handlePostDeclined.isPending}
                    ></ButtonForm>
                  </>
                )}
                {detailStore?.status == "active" && (
                  <>
                    <ButtonForm
                      type="submit"
                      className="!w-28 !bg-primary"
                      label="Khóa cửa hàng"
                      loading={handlePost.isPending}
                      //   onClick={() => handleConfirm()}
                      disabled={handlePostDeclined.isPending}
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
                    // setTimeout(() => {
                    //   handlePost.reset();
                    //   handlePostDeclined.reset();
                    // }, 500);
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

export default StoreDetailDialog;
