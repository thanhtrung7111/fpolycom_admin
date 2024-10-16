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
import { TypeGoodAttrObject, WardObject } from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const TypeGoodAttrUpdateDialog = ({
  open = false,
  onClose,
  item = null,
}: {
  open: boolean;
  onClose: () => void;
  item: TypeGoodAttrObject | null;
}) => {
  const {
    data: dataTypeGood,
    isError: isErrorTypeGood,
    isFetching: isFetchingTypeGood,
    error: errorTypeGood,
    isSuccess: isSuccessTypeGood,
  } = useQuery({
    queryKey: ["typeGoods"],
    queryFn: () => fetchData("/admin/typegood/all"),
  });
  const queryClient = useQueryClient();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Không để trống tên thuộc tính!"),
    typeGoodAttrCode: Yup.string().required("Không để trống mã thuộc tính!"),
    typeGoodCode: Yup.string().required("Không để trống loại thuộc tính!"),
  });

  const [initialValues, setInitialValues] = useState<TypeGoodAttrObject>({
    name: "",
    typeGoodAttrCode: "",
    typeGoodCode: "",
  });

  const handleUpdate = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/typegoodattr/update"),
    onSuccess: (data: TypeGoodAttrObject) => {
      if (queryClient.getQueryData(["typeGoodAttrs"])) {
        queryClient.setQueryData(
          ["typeGoodAttrs"],
          (oldData: TypeGoodAttrObject[]) => {
            const resultData = data;
            console.log(resultData);
            return [
              resultData,
              ...oldData.filter(
                (item) => item.typeGoodAttrCode != resultData.typeGoodAttrCode
              ),
            ];
          }
        );
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "typeGoodAttrs",
        });
      }
    },
    onError: (data) => console.log(data),
  });

  const handleSubmit = async (values: any): Promise<void> => {
    await handleUpdate.mutateAsync(values);
  };

  useEffect(() => {
    if (open == true) {
      setInitialValues({
        name: item?.name,
        typeGoodAttrCode: item?.typeGoodAttrCode,
        typeGoodCode: item?.typeGoodCode,
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
          }, 500);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <Formik
          key={"formUpdateWard"}
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
                <DialogTitle className="mb-5">Cập nhật thuộc tính</DialogTitle>
                {!handleUpdate.isSuccess ? (
                  <div className="flex flex-col gap-y-4 px-1">
                    <DialogDescription className="flex flex-col gap-y-3">
                      <InputFormikForm
                        label="Tên thuộc tính"
                        name="name"
                        important={true}
                        placeholder="Nhập tên thuộc tính..."
                        disabled={handleUpdate.isPending}
                      ></InputFormikForm>
                      <SelectFormikForm
                        options={dataTypeGood ? dataTypeGood : []}
                        loading={isFetchingTypeGood}
                        itemKey={"typeGoodCode"}
                        itemValue={"name"}
                        important={true}
                        name="typeGoodCode"
                        label={"Loại hàng"}
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

export default TypeGoodAttrUpdateDialog;
