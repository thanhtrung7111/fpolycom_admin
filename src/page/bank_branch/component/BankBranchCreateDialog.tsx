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
import {
  BankBranckObject,
  DistrictObject,
  ProvinceObject,
  WardObject,
} from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

const BankBranchCreateDialog = ({
  open = false,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const {
    data: dataBank,
    isError: isErrorBank,
    isFetching: isFetchingBank,
    error: errorBank,
    isSuccess: isSuccessBank,
  } = useQuery({
    queryKey: ["banks"],
    queryFn: () => fetchData("/admin/bank/all"),
  });
  const queryClient = useQueryClient();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Không để trống tên chi nhánh"),
    // bankBranchCode: Yup.string().required("Không để bankCod"),
    bankCode: Yup.string().required("Không để trống ngân hàng"),
  });

  const handlePost = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/bankbranch/new"),
    onSuccess: (data: BankBranckObject) => {
      if (queryClient.getQueryData(["bankbranchs"])) {
        queryClient.setQueryData(
          ["bankbranchs"],
          (oldData: BankBranckObject[]) => {
            const resultData = data;
            console.log(resultData);
            return [resultData, ...oldData];
          }
        );
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "bankbranchs",
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
          setTimeout(() => {
            handlePost.reset();
          }, 1000);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <Formik
          key={"formCreateWard"}
          initialValues={{ name: "", bankCode: "" }}
          validationSchema={validationSchema}
          onSubmit={(values: any) => {
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
                <DialogTitle className="mb-5">Thêm mới chi nhánh</DialogTitle>

                {!handlePost.isSuccess ? (
                  <div className="flex flex-col gap-y-4 px-1">
                    <DialogDescription className="flex flex-col gap-y-3">
                      <InputFormikForm
                        label="Tên chi nhánh"
                        name="name"
                        important={true}
                        placeholder="Nhập tên chi nhánh..."
                        disabled={handlePost.isPending}
                      ></InputFormikForm>
                      <SelectFormikForm
                        options={dataBank ? dataBank : []}
                        loading={isFetchingBank}
                        itemKey={"bankCode"}
                        itemValue={"name"}
                        important={true}
                        name="bankCode"
                        label={"Ngân hàng"}
                      ></SelectFormikForm>
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
                            setTimeout(() => {
                              handlePost.reset();
                              resetForm();
                            }, 1000);
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
                          }, 1000);
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

export default BankBranchCreateDialog;
