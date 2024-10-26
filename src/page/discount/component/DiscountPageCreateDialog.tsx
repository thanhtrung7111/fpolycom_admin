import { fetchData, postData } from "@/api/commonApi";
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
  ProvinceObject,
} from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

const DiscountPageCreateDialog = ({
  open = false,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Không để trống tên discount!"),
    description: Yup.string().required("Không để trống mô tả!"),
    percentDecrease: Yup.number()
      .required("Không để trống mô tả!")
      .min(0, "Giá trị trị min là 1!")
      .max(100, "Giá trị max là 100!"),
    beginDate: Yup.string().required("Không để trống ngày bắt đầu!"),
  });

  const handlePost = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/discount/new"),
    onSuccess: (data: DiscountObject) => {
      if (queryClient.getQueryData(["discounts"])) {
        queryClient.setQueryData(["discounts"], (oldData: DiscountObject[]) => {
          const resultData = data;
          console.log(resultData);
          return [resultData, ...oldData];
        });
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "discounts",
        });
      }
    },
  });

  const handleSubmit = async (values: any): Promise<void> => {
    await handlePost.mutateAsync(values);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!handlePost.isSuccess && !handlePost.isPending) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <Formik
          key={"formCrateDiscount"}
          initialValues={{
            name: "",
            description: "",
            beginDate: "",
            percentDecrease: 0,
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
                <DialogTitle className="mb-5">Thêm mới discount</DialogTitle>

                {!handlePost.isSuccess ? (
                  <div className="flex flex-col gap-y-4 px-1">
                    <DialogDescription className="flex flex-col gap-y-3">
                      <InputFormikForm
                        label="Tên discount"
                        name="name"
                        placeholder="Nhập tên discount..."
                        important={true}
                        disabled={handlePost.isPending}
                      ></InputFormikForm>
                      <DatePickerFormikForm
                        disabled={false}
                        important={true}
                        name="beginDate"
                        label="Thời gian bắt đầu"
                      ></DatePickerFormikForm>
                      <NumberFormikForm
                        disabled={false}
                        important={true}
                        label="Phần trăm giảm"
                        placeholder="Nhập phần trăm giảm..."
                        unit="percentDecrease"
                        name="percentDecrease"
                      ></NumberFormikForm>
                      <TextareaFormikForm
                        label="Mô tả discount"
                        row={5}
                        name="description"
                        important={true}
                        placeholder="Nhập mô tả discount..."
                        disabled={handlePost.isPending}
                      ></TextareaFormikForm>
                    </DialogDescription>
                    <DialogFooter>
                      <div className="flex gap-x-2 justify-end">
                        <ButtonForm
                          type="submit"
                          className="!w-28 !bg-primary"
                          label="Thêm mới"
                          loading={handlePost.isPending}
                          // disabled={false}
                        ></ButtonForm>
                        <ButtonForm
                          type="button"
                          className="!w-28 !bg-red-500"
                          label="Hủy"
                          disabled={handlePost.isPending}
                          onClick={() => {
                            onClose();
                            handlePost.reset();

                            resetForm();
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
                          handlePost.reset();
                          resetForm();
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

export default DiscountPageCreateDialog;
