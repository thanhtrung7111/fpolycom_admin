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
} from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const PaymentTypeUpdateDialog = ({
  open = false,
  onClose,
  item = null,
}: {
  open: boolean;
  onClose: () => void;
  item: PaymentTypeObject | null;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Không để trống tên loại thanh toán!"),
    image: Yup.string().required("Không để trống hình ảnh!"),
  });

  const [initialValues, setInitialValues] = useState<
    PaymentTypeObject & { newImage?: null }
  >({
    name: "",
    image: "",
    paymentTypeCode: "",
    newImage: null,
  });

  const handleUpdate = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/payment-type/update"),
    onSuccess: (data: PaymentTypeObject) => {
      if (queryClient.getQueryData(["paymentTypes"])) {
        queryClient.setQueryData(
          ["paymentTypes"],
          (oldData: PaymentTypeObject[]) => {
            const resultData = data;
            console.log(resultData);
            return [
              resultData,
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

  const handleSubmit = async (values: any): Promise<void> => {
    setIsLoading(true);
    const body = {
      ...values,
    };
    console.log(body);
    if (values.newImage != null) {
      const url = await uploadImage(values.newImage, "common");
      body.image = url;
    }
    console.log(body.image);
    await handleUpdate.mutateAsync(body);
    setIsLoading(false);
  };

  useEffect(() => {
    if (open == true) {
      setInitialValues({
        name: item?.name,
        paymentTypeCode: item?.paymentTypeCode,
        image: item?.image,
      });
    }
  }, [item, open]);
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!handleUpdate.isPending && !isLoading) {
          onClose();
          setTimeout(() => {
            handleUpdate.reset();
          }, 500);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <Formik
          key={"formUpdateDistrict"}
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={(values) => {
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
            <Form>
              <DialogHeader>
                <DialogTitle className="mb-5">
                  Cập nhật loại thanh toán
                </DialogTitle>
                {!handleUpdate.isSuccess ? (
                  <div className="flex flex-col gap-y-4 px-1">
                    <DialogDescription className="flex flex-col gap-y-3">
                      <InputFormikForm
                        label="Tên loại thanh toán"
                        name="name"
                        important={true}
                        placeholder="Nhập tên loại thanh toán..."
                        disabled={handleUpdate.isPending}
                      ></InputFormikForm>

                      <div>
                        <label htmlFor="imageBank" className="mb-1 block">
                          <span className="text-gray-700 font-medium text-sm">
                            Hình ảnh loại thanh toán
                          </span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          className="hidden"
                          id="imageBank"
                          name="newImage"
                          onChange={(e) => {
                            setFieldValue(
                              "newImage",
                              e.target.files && e.target.files.length > 0
                                ? e.target.files[0]
                                : null
                            );
                          }}
                        />
                        <label
                          htmlFor="imageBank"
                          className="h-24 w-32 block border border-gray-300 p-4"
                        >
                          <img
                            src={
                              values.newImage
                                ? URL.createObjectURL(values.newImage)
                                : values.image
                            }
                            alt=""
                            className="h-full w-full object-center object-cover"
                          />
                        </label>
                        {errors.image && (
                          <span className="text-red-500">
                            Không để trống hình ảnh!
                          </span>
                        )}
                      </div>
                    </DialogDescription>
                    <DialogFooter>
                      <div className="flex gap-x-2 justify-end">
                        <ButtonForm
                          type="submit"
                          className="!w-28 !bg-primary"
                          label="Cập nhật"
                          // disabled={false}
                          loading={handleUpdate.isPending || isLoading}
                        ></ButtonForm>
                        <ButtonForm
                          type="button"
                          className="!w-28 !bg-red-500"
                          label="Hủy"
                          disabled={handleUpdate.isPending || isLoading}
                          onClick={() => {
                            onClose();
                            setTimeout(() => {
                              handleUpdate.reset();
                              resetForm();
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
                        Cập nhật thành công
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
                            handleUpdate.reset();
                            resetForm();
                          }, 500);
                        }}
                      ></ButtonForm>
                    </div>
                  </div>
                )}
              </DialogHeader>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentTypeUpdateDialog;
