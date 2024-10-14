import { postData } from "@/api/commonApi";
import ButtonForm from "@/component_common/commonForm/ButtonForm";
import InputFormikForm from "@/component_common/commonForm/InputFormikForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProvinceObject } from "@/type/TypeCommon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

const ProvinceCreateDialog = ({
  open = false,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Không để trống tên tỉnh/thành phố"),
  });

  const handlePostProvince = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/province/new"),
    onSuccess: (data: ProvinceObject) => {
      if (queryClient.getQueryData(["provinces"])) {
        queryClient.setQueryData(["provinces"], (oldData: ProvinceObject[]) => {
          const resultData = data;
          console.log(resultData);
          return [resultData, ...oldData];
        });
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "provinces",
        });
      }
    },
  });

  const handleSubmit = async (
    values: typeof validationSchema
  ): Promise<void> => {
    await handlePostProvince.mutateAsync(values);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!handlePostProvince.isSuccess && !handlePostProvince.isPending) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <Formik
          key={"formCreateProvince"}
          initialValues={{ name: "" }}
          validationSchema={validationSchema}
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
                <DialogTitle className="mb-5">
                  Thêm mới tỉnh/thành phố
                </DialogTitle>
                <div className="w-full overflow-hidden">
                  <div
                    className={`${
                      handlePostProvince.isSuccess
                        ? "-translate-x-1/2"
                        : "translate-x-0"
                    } w-[200%] grid grid-cols-2 transition-transform`}
                  >
                    <div className="flex flex-col gap-y-4 px-1">
                      <DialogDescription>
                        <InputFormikForm
                          label="Tên tỉnh/thành phố"
                          name="name"
                          important={true}
                          disabled={handlePostProvince.isPending}
                        ></InputFormikForm>
                      </DialogDescription>
                      <DialogFooter>
                        <div className="flex gap-x-2 justify-end">
                          <ButtonForm
                            type="submit"
                            className="!w-28 !bg-primary"
                            label="Thêm mới"
                            // disabled={false}
                          ></ButtonForm>
                          <ButtonForm
                            type="button"
                            className="!w-28 !bg-red-500"
                            label="Hủy"
                            onClick={() => {
                              onClose();
                              handlePostProvince.reset();

                              resetForm();
                            }}
                          ></ButtonForm>
                        </div>
                      </DialogFooter>
                    </div>
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
                            handlePostProvince.reset();
                            resetForm();
                          }}
                        ></ButtonForm>
                        <ButtonForm
                          type="button"
                          className="!w-28 !bg-red-500"
                          label="Hủy"
                          onClick={() => {
                            onClose();
                            handlePostProvince.reset();

                            resetForm();
                          }}
                        ></ButtonForm>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogHeader>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ProvinceCreateDialog;
