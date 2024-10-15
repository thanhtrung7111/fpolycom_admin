import { fetchData, postData, uploadImage } from "@/api/commonApi";
import ButtonForm from "@/component_common/commonForm/ButtonForm";
import InputFormikForm from "@/component_common/commonForm/InputFormikForm";
import SelectFormikForm from "@/component_common/commonForm/SelectFormikForm";
import TextareaFormikForm from "@/component_common/commonForm/TextareaFormikForm";
import ImageComponent from "@/component_common/image_component/ImageComponent";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BankObject, WardObject } from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const BankUpdatePage = ({
  open = false,
  onClose,
  item = null,
}: {
  open: boolean;
  onClose: () => void;
  item: BankObject | null;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Không để trống tên tên ngân hàng!"),
    shortName: Yup.string().required("Không để trống tên viết tắt!"),
    description: Yup.string().required("Không để trống mô tả!"),
  });

  const [initialValues, setInitialValues] = useState<
    BankObject & { newImage: File | null }
  >({
    bankCode: "",
    name: "",
    shortName: "",
    newImage: null,
    image: "",
    description: "",
  });

  const handleUpdate = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/bank/update"),
    onSuccess: (data: BankObject) => {
      if (queryClient.getQueryData(["banks"])) {
        queryClient.setQueryData(["banks"], (oldData: BankObject[]) => {
          const resultData = data;
          console.log(resultData);
          return [
            resultData,
            ...oldData.filter((item) => item.bankCode != resultData.bankCode),
          ];
        });
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "banks",
        });
      }
    },
    onError: (data) => console.log(data),
  });

  const handleSubmit = async (
    values: BankObject & { newImage: File | null }
  ): Promise<void> => {
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
    if (handleUpdate.isError) {
      setIsLoading(false);
    }
  }, [handleUpdate.isError]);

  useEffect(() => {
    if (open == true) {
      setInitialValues({
        bankCode: item?.bankCode,
        name: item?.name,
        shortName: item?.shortName,
        newImage: null,
        image: item?.image,
        description: item?.description,
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
          }, 1000);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <Formik
          key={"formUpdateBank"}
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={(values) => {
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
                <DialogTitle className="mb-5">Cập nhật ngân hàng</DialogTitle>
                {!handleUpdate.isSuccess ? (
                  <div className="flex flex-col gap-y-4 px-1">
                    <DialogDescription className="flex flex-col gap-y-3">
                      <InputFormikForm
                        label="Tên ngân hàng"
                        name="name"
                        important={true}
                        placeholder="Nhập tên ngân hàng..."
                        disabled={handleUpdate.isPending}
                      ></InputFormikForm>
                      <InputFormikForm
                        label="Tên viết tắt"
                        name="shortName"
                        important={true}
                        placeholder="Nhập tên viết tắt..."
                        disabled={handleUpdate.isPending}
                      ></InputFormikForm>
                      <div>
                        <label htmlFor="imageBank" className="mb-1 block">
                          <span className="text-gray-700 font-medium text-sm">
                            Hình ảnh ngân hàng
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
                        <label htmlFor="imageBank" className="h-24 w-24 block">
                          <img
                            src={
                              values.newImage
                                ? URL.createObjectURL(values.newImage)
                                : values.image
                            }
                            alt=""
                            className="h-full w-full object-center object-cover"
                          />
                          {/* <ImageComponent
                            className=""
                            file={values.newImage}
                            id={values.bankCode}
                            url={values.image}
                            type="bank"
                            
                          ></ImageComponent> */}
                        </label>
                        {errors.image && (
                          <span className="text-red-500">
                            Không để trống hình ảnh!
                          </span>
                        )}
                      </div>
                      <TextareaFormikForm
                        label="Mô tả ngân hàng"
                        row={5}
                        name="description"
                        important={true}
                        placeholder="Nhập mô tả ngân hàng..."
                        disabled={handleUpdate.isPending}
                      ></TextareaFormikForm>
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

export default BankUpdatePage;
