import { postData } from "@/api/commonApi";
import ButtonForm from "@/component_common/commonForm/ButtonForm";
import SpinnerLoading from "@/component_common/loading/SpinnerLoading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DiscountObject,
  DistrictObject,
  PaymentTypeObject,
  ProvinceObject,
} from "@/type/TypeCommon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
const PaymentTypeDeleteDialog = ({
  open = false,
  item = null,
  onClose,
}: {
  open: boolean;
  item: PaymentTypeObject | null;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();

  const handleDelete = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/discount/delete"),
    onSuccess: (data: PaymentTypeObject) => {
      if (queryClient.getQueryData(["paymentTypes"])) {
        queryClient.setQueryData(
          ["paymentTypes"],
          (oldData: PaymentTypeObject[]) => {
            const resultData = data;
            console.log(resultData);
            return [
              ...oldData.filter(
                (item) => item.paymentTypeCode != resultData.paymentTypeCode
              ),
            ];
          }
        );
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "paymentTypes",
        });
      }
    },
  });
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!handleDelete.isSuccess && !handleDelete.isPending) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thông báo</DialogTitle>
          <div className="w-full overflow-hidden">
            <div
              className={`${
                handleDelete.isSuccess ? "-translate-x-1/2" : "translate-x-0"
              } w-[200%] grid grid-cols-2 transition-transform`}
            >
              <div className="flex flex-col">
                <DialogDescription className="flex items-center mb-5 justify-center gap-x-2 py-6">
                  {handleDelete.isPending ? (
                    <>
                      <SpinnerLoading className="w-6 h-6 fill-primary"></SpinnerLoading>
                      <span className="text-gray-700 text-base">
                        Đang xóa loại thanh toán...
                      </span>
                    </>
                  ) : (
                    <>
                      <i className="ri-delete-bin-line text-gray-700 text-xl"></i>
                      <span className="text-gray-700 text-base">
                        Bạn có muốn xóa loại thanh toán
                        <b className="text-gray-500"> {item?.name}</b> ?
                      </span>
                    </>
                  )}
                </DialogDescription>
                <div className="flex gap-x-2 justify-end">
                  <ButtonForm
                    type="button"
                    className="!w-28 !bg-primary"
                    label="Xác nhận"
                    loading={handleDelete.isPending}
                    onClick={async () => {
                      await handleDelete.mutateAsync({
                        paymentTypeCode: item?.paymentTypeCode,
                      });
                    }}
                  ></ButtonForm>
                  <ButtonForm
                    disabled={handleDelete.isPending}
                    type="button"
                    className="!w-28 !bg-red-500"
                    label="Hủy"
                    onClick={() => {
                      onClose();
                    }}
                  ></ButtonForm>
                </div>
              </div>
              <div className="flex flex-col">
                <DialogDescription className="flex items-center mb-5 justify-center gap-x-2 py-6">
                  <i className="ri-checkbox-line text-gray-700 text-xl"></i>{" "}
                  <span className="text-gray-700 text-base">
                    Xóa thành công!
                  </span>
                </DialogDescription>
                <div className="flex gap-x-2 justify-end">
                  <ButtonForm
                    type="button"
                    className="!w-28 !bg-red-500"
                    label="Đóng"
                    onClick={() => {
                      onClose();
                    }}
                  ></ButtonForm>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentTypeDeleteDialog;
