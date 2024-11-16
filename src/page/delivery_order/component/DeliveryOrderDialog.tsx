import { fetchData, postData } from "@/api/commonApi";
import ButtonForm from "@/component_common/commonForm/ButtonForm";
import InputFormikForm from "@/component_common/commonForm/InputFormikForm";
import SelectFormikForm from "@/component_common/commonForm/SelectFormikForm";
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
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

const DeliveryOrderDialog = ({
  open = false,
  onClose,
  item = null,
}: {
  open: boolean;
  onClose: () => void;
  item: ReceiveOrderObject | null;
}) => {
  const { data, isError, isFetching, error, isSuccess } = useQuery({
    queryKey: ["shippers"],
    queryFn: () => fetchData("/admin/shipper/all"),
  });
  const queryClient = useQueryClient();

  const [initialValues, setInitialValues] = useState<any>({
    name: "",
    provinceCode: "",
  });

  const handleUpdate = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/warehouse/add-delivery"),
    onSuccess: (data: ReceiveOrderObject[]) => {
      const resultData = data[0];
      if (queryClient.getQueryData(["delivery_order"])) {
        queryClient.setQueryData(
          ["delivery_order"],
          (oldData: ReceiveOrderObject[]) => {
            console.log(resultData);
            return [
              resultData,
              ...oldData.filter(
                (item) =>
                  item.receiveDeliveryCode != resultData.receiveDeliveryCode
              ),
            ];
          }
        );
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "delivery_order",
        });
      }
      toast("Thông báo", {
        description: (
          <span>
            Đã phân công{" "}
            <b>
              "
              {resultData.shipperName +
                " giao đơn hàng " +
                resultData.ordersCode}
              "
            </b>{" "}
            thành công!
          </span>
        ),
      });
      onClose();
    },
  });

  const handleSubmit = async (values: any): Promise<void> => {
    const body: any = {
      shipperCode: values.shipperCode,
      receiveCodes: [item?.receiveDeliveryCode],
    };
    await handleUpdate.mutateAsync(body);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!handleUpdate.isPending) {
          handleUpdate.reset();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px] sm:max-h-96 ">
        <Formik
          key={"formCreateProvince"}
          initialValues={{ shipperCode: "", receiveCodes: [] }}
          enableReinitialize={true}
          //   validationSchema={validationSchema}
          onSubmit={(values: any) => {
            console.log("Hello");
            handleSubmit(values);
          }}
        >
          {({
            setFieldValue,
            handleChange,
            values,
            errors,
            touched,
            resetForm,
          }) => (
            <Form id="formCreateProduct">
              <DialogHeader>
                <DialogTitle className="mb-5">Phân công giao hàng</DialogTitle>

                <div className="flex flex-col gap-y-4 px-1">
                  <DialogDescription>
                    <SelectFormikForm
                      options={data ? data : []}
                      loading={isFetching}
                      itemKey={"shipperCode"}
                      itemValue={"name"}
                      important={true}
                      name="shipperCode"
                      label={"Shipper"}
                    ></SelectFormikForm>
                  </DialogDescription>
                  <DialogFooter>
                    <div className="flex gap-x-2 justify-end">
                      <ButtonForm
                        type="submit"
                        className="!w-28 !bg-primary"
                        label="Phân công"
                        // disabled={false}
                      ></ButtonForm>
                      <ButtonForm
                        type="button"
                        className="!w-28 !bg-red-500"
                        label="Hủy"
                        onClick={() => {
                          onClose();
                          handleUpdate.reset();

                          resetForm();
                        }}
                      ></ButtonForm>
                    </div>
                  </DialogFooter>
                </div>
              </DialogHeader>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryOrderDialog;
