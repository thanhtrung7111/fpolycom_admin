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
import { toast } from "sonner";
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
  const handleLockStore = useMutation({
    mutationFn: (storeCode: string) =>
      postData({ storeCode: storeCode }, "/admin/store/lock"),
    onSuccess: (data: StoreListObject) => {
      if (queryClient.getQueryData(["stores"])) {
        queryClient.setQueryData(["stores"], (oldData: StoreListObject[]) => {
          const resultData = data;
          console.log(resultData);
          setDetailStore({ ...detailStore, status: "lock" });
          return [
            resultData,
            ...oldData.filter((item) => item.storeCode != resultData.storeCode),
          ];
        });
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "stores",
        });
      }
      toast("Thông báo", {
        description: <span>Khóa cửa hàng {data.name} thành công!</span>,
      });
    },
  });
  const handleUnclock = useMutation({
    mutationFn: (storeCode: string) =>
      postData({ storeCode: storeCode }, "/admin/store/approve"),
    onSuccess: (data: StoreListObject) => {
      if (queryClient.getQueryData(["stores"])) {
        queryClient.setQueryData(["stores"], (oldData: StoreListObject[]) => {
          const resultData = data;
          console.log(resultData);
          setDetailStore({ ...detailStore, status: "active" });
          return [
            resultData,
            ...oldData.filter((item) => item.storeCode != resultData.storeCode),
          ];
        });
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "stores",
        });
      }
      toast("Thông báo", {
        description: <span>Mở khóa cửa hàng {data.name} thành công!</span>,
      });
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
        onClose();
      }}
    >
      <DialogContent className="sm:max-w-[800px] flex-col gap-y-0">
        <DialogTitle className="mb-2">Chi tiết cửa hàng</DialogTitle>
        <div className="flex items-center gap-x-1 mb-2">
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

        <div className="flex flex-col gap-y-4 px-1">
          <DialogDescription className="flex flex-col gap-y-3">
            <div className="grid grid-cols-2 gap-x-3">
              <div className="flex flex-col gap-y-2">
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
                <p>
                  <span className="font-medium text-gray-700">Email: </span>
                  {detailStore?.email}
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Số điện thoại:{" "}
                  </span>
                  {detailStore?.phone}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <p>
                  <span className="font-medium text-gray-700">
                    Tỉnh/Thành phố:{" "}
                  </span>
                  {detailStore?.provinceName}
                </p>

                <p>
                  <span className="font-medium text-gray-700">
                    Quận/huyện:{" "}
                  </span>
                  {detailStore?.districtName}
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Phường/Thị xã:{" "}
                  </span>
                  {detailStore?.wardName}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Địa chỉ: </span>
                  {detailStore?.address}
                </p>
              </div>
            </div>
            <div>
              <h5 className="font-medium text-gray-700 mb-1">
                Hình ảnh liên quan
              </h5>
              <div className="flex items-center gap-x-2">
                {detailStore?.documentList &&
                  detailStore?.documentList.map((item) => {
                    return (
                      <div>
                        <img
                          src={item.documentUrl}
                          className="size-40"
                          alt=""
                        />
                      </div>
                    );
                  })}
              </div>
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
                    onClick={() => {
                      if (detailStore.storeRegisterCode) {
                        handleUnclock.mutateAsync(
                          detailStore.storeRegisterCode
                        );
                      }
                    }}

                    // disabled={handlePostDeclined.isPending}
                  ></ButtonForm>
                </>
              )}
              {detailStore?.status == "active" && (
                <>
                  <ButtonForm
                    type="submit"
                    className="!w-28 !bg-primary"
                    label="Khóa cửa hàng"
                    onClick={() => {
                      if (detailStore.storeRegisterCode) {
                        handleLockStore.mutateAsync(
                          detailStore.storeRegisterCode
                        );
                      }
                    }}
                  ></ButtonForm>
                </>
              )}
              <ButtonForm
                type="button"
                className="!w-28 !bg-red-500"
                label="Hủy"
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
      </DialogContent>
    </Dialog>
  );
};

export default StoreDetailDialog;
