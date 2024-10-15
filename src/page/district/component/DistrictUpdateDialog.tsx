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
import { DistrictObject, ProvinceObject } from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const DistrictUpdateDialog = ({
  open = false,
  onClose,
  item = null,
}: {
  open: boolean;
  onClose: () => void;
  item: DistrictObject | null;
}) => {
  const {
    data: dataProvince,
    isError: isErrorProvinc,
    isFetching: isFetchingProvince,
    error: errorProvince,
    isSuccess: isSuccessProvince,
  } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => fetchData("/admin/province/all"),
  });
  const queryClient = useQueryClient();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Không để trống tên Phường/Huyện"),
    provinceCode: Yup.string().required("Không để trống Tỉnh/Thành Phố"),
  });

  const [initialValues, setInitialValues] = useState<DistrictObject>({
    name: "",
    provinceCode: "",
    districtCode: "",
  });

  const handleUpdate = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/district/update"),
    onSuccess: (data: DistrictObject) => {
      if (queryClient.getQueryData(["districts"])) {
        queryClient.setQueryData(["districts"], (oldData: DistrictObject[]) => {
          const resultData = data;
          console.log(resultData);
          return [
            resultData,
            ...oldData.filter(
              (item) => item.districtCode != resultData.districtCode
            ),
          ];
        });
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "districts",
        });
      }
    },
  });

  const handleSubmit = async (
    values: typeof validationSchema
  ): Promise<void> => {
    await handleUpdate.mutateAsync(values);
  };

  useEffect(() => {
    if (open == true) {
      setInitialValues({
        name: item?.name,
        districtCode: item?.districtCode,
        provinceCode: item?.provinceCode,
      });
    }
  }, [item, open]);
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
      <DialogContent className="sm:max-w-[500px]">
        <Formik
          key={"formUpdateDistrict"}
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
            <Form>
              <DialogHeader>
                <DialogTitle className="mb-5">
                  Cập nhật Phường/Huyện
                </DialogTitle>
                {!handleUpdate.isSuccess ? (
                  <div className="flex flex-col gap-y-4 px-1">
                    <DialogDescription className="flex flex-col gap-y-3">
                      <InputFormikForm
                        label="Tên Phường/Huyện"
                        name="name"
                        important={true}
                        disabled={handleUpdate.isPending}
                      ></InputFormikForm>
                      <SelectFormikForm
                        options={dataProvince ? dataProvince : []}
                        loading={isFetchingProvince}
                        itemKey={"provinceCode"}
                        itemValue={"name"}
                        important={true}
                        name="provinceCode"
                        label={"Tỉnh/Thành phố"}
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
                            handleUpdate.reset();
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
                          handleUpdate.reset();
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

export default DistrictUpdateDialog;