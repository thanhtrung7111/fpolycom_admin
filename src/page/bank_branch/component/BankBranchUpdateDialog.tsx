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
import { BankBranckObject, WardObject } from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const BankBranchUpdateDialog = ({
  open = false,
  onClose,
  item = null,
}: {
  open: boolean;
  onClose: () => void;
  item: BankBranckObject | null;
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
    name: Yup.string().required("Không để trống tên chi nhánh!"),
    bankCode: Yup.string().required("Không để trống ngân hàng!"),
    bankBranchCode: Yup.string().required("Không để trống mã chi nhánh!"),
  });

  const [initialValues, setInitialValues] = useState<BankBranckObject>({
    name: "",
    bankBranchCode: "",
    bankCode: "",
  });

  const handleUpdate = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/bankbranch/update"),
    onSuccess: (data: BankBranckObject) => {
      if (queryClient.getQueryData(["bankbranchs"])) {
        queryClient.setQueryData(
          ["bankbranchs"],
          (oldData: BankBranckObject[]) => {
            const resultData = data;
            console.log(resultData);
            return [
              resultData,
              ...oldData.filter(
                (item) => item.bankBranchCode != resultData.bankBranchCode
              ),
            ];
          }
        );
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "bankbranchs",
        });
      }
    },
    onError: (data) => console.log(data),
  });

  const handleSubmit = async (values: any): Promise<void> => {
    console.log(values);
    await handleUpdate.mutateAsync(values);
  };

  useEffect(() => {
    if (open == true) {
      setInitialValues({
        name: item?.name,
        bankBranchCode: item?.bankBranchCode,
        bankCode: item?.bankCode,
      });
    }
  }, [item, open]);
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!handleUpdate.isPending) {
          onClose();
          setTimeout(() => {
            handleUpdate.reset();
          }, 1000);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <Formik
          key={"formUpdateBankBranch"}
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={(values: any) => {
            console.log(values);
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
                <DialogTitle className="mb-5">Cập nhật chi nhánh</DialogTitle>
                {!handleUpdate.isSuccess ? (
                  <div className="flex flex-col gap-y-4 px-1">
                    <DialogDescription className="flex flex-col gap-y-3">
                      <InputFormikForm
                        label="Tên chi nhánh"
                        name="name"
                        important={true}
                        placeholder="Nhập tên chi nhánh..."
                        disabled={handleUpdate.isPending}
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
                          label="Cập nhật"
                          // disabled={false}
                          loading={handleUpdate.isPending}
                        ></ButtonForm>
                        <ButtonForm
                          type="button"
                          className="!w-28 !bg-red-500"
                          label="Hủy"
                          disabled={handleUpdate.isPending}
                          onClick={() => {
                            onClose();
                            setTimeout(() => {
                              handleUpdate.reset();
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

export default BankBranchUpdateDialog;
