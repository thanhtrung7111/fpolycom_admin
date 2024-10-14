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
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const ProvinceUpdateDialog = ({
  open = false,
  onClose,
  item = null,
}: {
  open: boolean;
  onClose: () => void;
  item: any;
}) => {
  const queryClient = useQueryClient();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Không để trống tên tỉnh/thành phố"),
  });

  const [initialValues, setInitialValues] = useState<any>({
    name: "",
    provinceCode: "",
  });

  const handleUpdateProvince = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/province/update"),
    onSuccess: (data: ProvinceObject) => {
      if (queryClient.getQueryData(["provinces"])) {
        queryClient.setQueryData(["provinces"], (oldData: ProvinceObject[]) => {
          const resultData = data;
          console.log(resultData);
          return [
            resultData,
            ...oldData.filter(
              (item) => item.provinceCode != resultData.provinceCode
            ),
          ];
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
    await handleUpdateProvince.mutateAsync(values);
  };

  useEffect(() => {
    if (open == true) {
      setInitialValues({ name: item.name, provinceCode: item.provinceCode });
    }
  }, [item, open]);
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!handleUpdateProvince.isPending) {
          handleUpdateProvince.reset();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <Formik
          key={"formCreateProvince"}
          initialValues={initialValues}
          enableReinitialize={true}
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
                  Cập nhật tỉnh/thành phố
                </DialogTitle>
                <div className="w-full overflow-hidden">
                  <div
                    className={`${
                      handleUpdateProvince.isSuccess
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
                          disabled={handleUpdateProvince.isPending}
                        ></InputFormikForm>
                      </DialogDescription>
                      <DialogFooter>
                        <div className="flex gap-x-2 justify-end">
                          <ButtonForm
                            type="submit"
                            className="!w-28 !bg-primary"
                            label="Cập nhật"
                            // disabled={false}
                          ></ButtonForm>
                          <ButtonForm
                            type="button"
                            className="!w-28 !bg-red-500"
                            label="Hủy"
                            onClick={() => {
                              onClose();
                              handleUpdateProvince.reset();

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
                            handleUpdateProvince.reset();

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

export default ProvinceUpdateDialog;
