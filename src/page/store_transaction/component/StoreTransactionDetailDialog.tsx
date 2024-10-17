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
import React, { useState } from "react";
import * as Yup from "yup";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const FILE_SIZE = 1024 * 1024 * 2;
const StoreTransactionDetailDialog = ({
  open = false,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Không để trống tên loại thanh toán!"),
    image: Yup.mixed()
      .nullable()
      .required("File is required")
      .test("fileSize", "File too large", (value) => {
        return value instanceof File && value.size <= FILE_SIZE;
      }),
  });

  const handlePost = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/payment-type/new"),
    onSuccess: (data: PaymentTypeObject) => {
      if (queryClient.getQueryData(["paymentTypes"])) {
        queryClient.setQueryData(
          ["paymentTypes"],
          (oldData: PaymentTypeObject[]) => {
            const resultData = data;
            console.log(resultData);
            return [resultData, ...oldData];
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
      image: "",
    };
    if (values.image != null) {
      const url = await uploadImage(values.image, "common");
      body.image = url != undefined ? url : "";
    }
    await handlePost.mutateAsync(body);
    setIsLoading(false);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!handlePost.isPending && !isLoading) {
          onClose();
          setTimeout(() => {
            handlePost.reset();
          }, 500);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <Formik
          key={"formCratePaymentType"}
          initialValues={{
            name: "",
            image: null,
          }}
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
            <Form id="formCreateProduct">
              <DialogHeader>
                <DialogTitle className="mb-5">
                  Thêm mới loại thanh toán
                </DialogTitle>

                {!handlePost.isSuccess ? (
                  <div className="flex flex-col gap-y-4 px-1">
                    <DialogDescription className="flex flex-col gap-y-3">
                      <InputFormikForm
                        label="Tên loại thanh toán"
                        name="name"
                        important={true}
                        placeholder="Nhập tên loại thanh toán..."
                        disabled={handlePost.isPending}
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
                          name="image"
                          onChange={(e) => {
                            setFieldValue(
                              "image",
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
                              values.image
                                ? URL.createObjectURL(values.image)
                                : "https://static.vecteezy.com/system/resources/thumbnails/050/140/627/small/add-image-icon-isolated-vector.jpg"
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
                          label="Thêm mới"
                          loading={handlePost.isPending || isLoading}
                          // disabled={false}
                        ></ButtonForm>
                        <ButtonForm
                          type="button"
                          className="!w-28 !bg-red-500"
                          label="Hủy"
                          disabled={handlePost.isPending || isLoading}
                          onClick={() => {
                            onClose();
                            setTimeout(() => {
                              handlePost.reset();
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
                        Thêm thành công
                      </span>
                    </DialogDescription>
                    <div className="flex gap-x-2 justify-end">
                      <ButtonForm
                        type="button"
                        className="!w-28 !bg-primary"
                        label="Thêm mới"
                        onClick={() => {
                          handlePost.reset();
                          resetForm();
                        }}
                      ></ButtonForm>
                      <ButtonForm
                        type="button"
                        className="!w-28 !bg-red-500"
                        label="Hủy"
                        onClick={() => {
                          onClose();
                          setTimeout(() => {
                            handlePost.reset();
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

export default StoreTransactionDetailDialog;
