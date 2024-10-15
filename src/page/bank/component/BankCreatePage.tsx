import { fetchData, postData, uploadImage } from "@/api/commonApi";
import ButtonForm from "@/component_common/commonForm/ButtonForm";
import InputFormikForm from "@/component_common/commonForm/InputFormikForm";
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
  BankObject,
  DistrictObject,
  ProvinceObject,
  WardObject,
} from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const FILE_SIZE = 1024 * 1024 * 2;

const BankCreatePage = ({
  open = false,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Không để trống tên tên ngân hàng!"),
    shortName: Yup.string().required("Không để trống tên viết tắt!"),
    image: Yup.mixed()
      .nullable()
      .required("File is required")
      .test("fileSize", "File too large", (value) => {
        return value instanceof File && value.size <= FILE_SIZE;
      }),
    description: Yup.string().required("Không để trống mô tả!"),
  });

  const handlePost = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/bank/new"),
    onSuccess: (data: BankObject) => {
      if (queryClient.getQueryData(["banks"])) {
        queryClient.setQueryData(["banks"], (oldData: BankObject[]) => {
          const resultData = data;
          console.log(resultData);
          return [resultData, ...oldData];
        });
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "banks",
        });
      }
    },
  });

  const handleSubmit = async (values: {
    name: string;
    shortName: string;
    description: string;
    image: null;
    newImage: boolean;
  }): Promise<void> => {
    setIsLoading(true);
    const body = {
      ...values,
      image: "",
    };
    if (values.newImage && values.image != null) {
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
        if (!handlePost.isSuccess && !handlePost.isPending && !isLoading) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <Formik
          key={"formCreateBank"}
          initialValues={{
            name: "",
            shortName: "",
            description: "",
            image: null,
            newImage: false,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
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
                <DialogTitle className="mb-5">Thêm mới ngân hàng</DialogTitle>

                {!handlePost.isSuccess ? (
                  <div className="flex flex-col gap-y-4 px-1">
                    <DialogDescription className="flex flex-col gap-y-3">
                      <InputFormikForm
                        label="Tên ngân hàng"
                        name="name"
                        important={true}
                        placeholder="Nhập tên ngân hàng..."
                        disabled={handlePost.isPending}
                      ></InputFormikForm>
                      <InputFormikForm
                        label="Tên viết tắt"
                        name="shortName"
                        important={true}
                        placeholder="Nhập tên viết tắt..."
                        disabled={handlePost.isPending}
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
                          name="image"
                          onChange={(e) => {
                            setFieldValue(
                              "image",
                              e.target.files && e.target.files.length > 0
                                ? e.target.files[0]
                                : null
                            );
                            setFieldValue("newImage", true);
                          }}
                        />
                        <label htmlFor="imageBank" className="h-24 w-24 block">
                          <img
                            src={
                              values.image
                                ? URL.createObjectURL(values.image)
                                : ""
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
                      <TextareaFormikForm
                        label="Mô tả ngân hàng"
                        row={5}
                        name="description"
                        important={true}
                        placeholder="Nhập mô tả ngân hàng..."
                        disabled={handlePost.isPending}
                      ></TextareaFormikForm>
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

export default BankCreatePage;
