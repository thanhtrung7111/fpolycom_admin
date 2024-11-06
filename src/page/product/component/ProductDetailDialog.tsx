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
  ProductDetailObject,
  ProductObject,
  ProvinceObject,
} from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const ProductDetailDialog = ({
  open = false,
  onClose,
  item = null,
}: {
  open: boolean;
  onClose: () => void;
  item: ProductObject | null;
}) => {
  const queryClient = useQueryClient();
  const [detailProduct, setDetailProduct] =
    useState<ProductDetailObject | null>(null);
  const handleFetchDetailProduct = useMutation({
    mutationFn: (productCode: string) =>
      postData({ productCode: productCode }, "/admin/product/detail"),
    onSuccess: (data: ProductDetailObject) => {
      setDetailProduct(data);
    },
  });
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Không để trống tên discount!"),
    description: Yup.string().required("Không để trống mô tả!"),
    discountCode: Yup.string().required("Không để trống mã discount!"),
    percentDecrease: Yup.number()
      .required("Không để trống mô tả!")
      .min(0, "Giá trị trị min là 1!")
      .max(100, "Giá trị max là 100!"),
    beginDate: Yup.string().required("Không để trống ngày bắt đầu!"),
  });

  const [initialValues, setInitialValues] = useState<DiscountObject>({
    name: "",
    description: "",
    discountCode: "",
    percentDecrease: 0,
    beginDate: moment(new Date()).format("yyyy-MM-DD"),
  });

  const handleUpdate = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/discount/update"),
    onSuccess: (data: DiscountObject) => {
      if (queryClient.getQueryData(["discounts"])) {
        queryClient.setQueryData(["discounts"], (oldData: DiscountObject[]) => {
          const resultData = data;
          console.log(resultData);
          return [
            resultData,
            ...oldData.filter(
              (item) => item.discountCode != resultData.discountCode
            ),
          ];
        });
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "discounts",
        });
      }
    },
  });

  const handleSubmit = async (values: any): Promise<void> => {
    await handleUpdate.mutateAsync(values);
  };

  useEffect(() => {
    if (item && item.productCode) {
      handleFetchDetailProduct.mutateAsync(item.productCode.toString());
    }
  }, [item]);
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
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="mb-0">
            Thông tin chi tiết sản phẩm #{detailProduct?.productCode}
          </DialogTitle>
          <div className="flex items-center gap-x-1 mb-2">
            <div
              className={`size-3 rounded-full ${
                detailProduct?.status == "lock"
                  ? "bg-red-500"
                  : detailProduct?.status == "active"
                  ? "bg-green-500"
                  : "bg-yellow-500"
              }`}
            ></div>
            <div
              className={`${
                detailProduct?.status == "lock"
                  ? "text-red-500"
                  : detailProduct?.status == "active"
                  ? "text-green-500"
                  : "text-yellow-500"
              }`}
            >
              {detailProduct?.status == "pending"
                ? "Chờ duyệt"
                : detailProduct?.status == "active"
                ? "Đã uyệt"
                : "Đã khóa"}
            </div>
          </div>
          <DialogDescription className="flex flex-col gap-y-3">
            <div className="flex flex-col gap-y-4 px-1"></div>
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
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
