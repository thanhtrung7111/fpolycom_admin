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
const StoreRejectDialog = ({
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

  const handleReject = useMutation({
    mutationFn: ({
      storeCode,
      reason,
    }: {
      storeCode: string | undefined;
      reason: string;
    }) =>
      postData({ storeCode: storeCode, reason: reason }, "/admin/store/reject"),
    onSuccess: (data: StoreListObject) => {
      if (queryClient.getQueryData(["stores"])) {
        queryClient.setQueryData(["stores"], (oldData: StoreListObject[]) => {
          const resultData = data;
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
        description: (
          <span>Đã từ chối duyệt cửa hàng {data.name} thành công!</span>
        ),
      });
      onClose();
    },
  });

  const validationSchema = Yup.object().shape({
    reason: Yup.string().required("Không để trống lý do không duyệt!"),
  });

  useEffect(() => {
    if (item && item.storeCode) {
      handleFetchDetailStore.mutateAsync(item.storeCode);
    }
  }, [item]);

  const handleSubmit = (values: any) => {
    const body = { storeCode: item?.storeCode, reason: values.reason };
    console.log(body);
    handleReject.mutateAsync({
      storeCode: item?.storeCode,
      reason: values.reason,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
      }}
    >
      <DialogContent className="sm:max-w-[800px] flex-col gap-y-0">
        <Formik
          key={"formCreateProvince"}
          initialValues={{ reason: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            // console.log(values);
            handleSubmit(values);
          }}
        >
          {({}) => (
            <Form id="formCreateProduct">
              <DialogTitle className="mb-2">Lý do không duyệt</DialogTitle>
              <div className="flex flex-col gap-y-4 px-1">
                <DialogDescription className="flex flex-col gap-y-3">
                  <TextareaFormikForm
                    name="reason"
                    placeholder="Nhập lý do không duyệt..."
                    row={5}
                    disabled={false}
                    // important={true}
                  ></TextareaFormikForm>
                </DialogDescription>
                <DialogFooter>
                  <div className="flex gap-x-2 justify-end">
                    <ButtonForm
                      type="submit"
                      className="!w-28 !bg-primary"
                      label="Xác nhận"
                    ></ButtonForm>
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
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default StoreRejectDialog;
