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
import { formatCurrencyVND } from "@/lib/helper";
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
import { toast } from "sonner";
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

  const handleLock = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/product/lock"),
    onSuccess: (data: ProductObject) => {
      const resultData = data;
      if (queryClient.getQueryData(["products"])) {
        queryClient.setQueryData(["products"], (oldData: ProductObject[]) => {
          console.log(resultData);
          if (detailProduct) {
            setDetailProduct({ ...detailProduct, status: "lock" });
          }
          return [
            resultData,
            ...oldData.filter(
              (item) => item.productCode != resultData.productCode
            ),
          ];
        });
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "products",
        });
      }
      handleUnLock.reset();
      toast("Thông báo", {
        description: (
          <span>
            Khóa sản phẩm{" "}
            <b>"{resultData.productCode + "-" + resultData.name}"</b> thành
            công!
          </span>
        ),
      });
    },
  });
  const handleUnLock = useMutation({
    mutationFn: (body: { [key: strPing]: any }) =>
      postData(body, "/admin/product/unlock"),
    onSuccess: (data: ProductObject) => {
      const resultData = data;
      if (queryClient.getQueryData(["products"])) {
        queryClient.setQueryData(["products"], (oldData: ProductObject[]) => {
          console.log(resultData);
          if (detailProduct) {
            setDetailProduct({ ...detailProduct, status: "active" });
          }
          return [
            resultData,
            ...oldData.filter(
              (item) => item.productCode != resultData.productCode
            ),
          ];
        });
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "products",
        });
      }
      handleLock.reset();
      toast("Thông báo", {
        description: (
          <span>
            Mở khóa sản phẩm{" "}
            <b>"{resultData.productCode + "-" + resultData.name}"</b> thành
            công!
          </span>
        ),
      });
    },
  });

  useEffect(() => {
    if (item && item.productCode) {
      handleFetchDetailProduct.mutateAsync(item.productCode.toString());
    }
  }, [item]);
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
      }}
    >
      <DialogContent className="sm:max-w-[1000px] px-0">
        <DialogHeader className="px-5">
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
                ? "Đã duyệt"
                : "Đã khóa"}
            </div>
          </div>
        </DialogHeader>
        <DialogDescription className="flex flex-col gap-y-3 px-5 max-h-[500px] overflow-y-scroll custom-scrollbar-wider">
          <div className="grid grid-cols-2 gap-x-4">
            <div className="w-full h-64">
              <img
                src={detailProduct?.image}
                className="w-full h-full object-cover object-center"
                alt=""
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <div>
                <span className="text-gray-700 font-medium">
                  Tên sản phẩm:{" "}
                </span>
                {detailProduct?.name}
              </div>{" "}
              <div>
                <span className="text-gray-700 font-medium">
                  Cửa hàng bán:{" "}
                </span>
                {detailProduct?.storeName}
              </div>{" "}
              <div>
                <span className="text-gray-700 font-medium">Loại hàng: </span>
                {detailProduct?.typeGoodName}
              </div>{" "}
              <div>
                <span className="text-gray-700 font-medium">
                  Giá tối thiểu:{" "}
                </span>
                {detailProduct?.minPrice &&
                  formatCurrencyVND(detailProduct?.minPrice)}
              </div>{" "}
              <div>
                <span className="text-gray-700 font-medium">Giá tối đa: </span>
                {detailProduct?.maxPrice &&
                  formatCurrencyVND(detailProduct?.maxPrice)}
              </div>
              <div>
                <span className="text-gray-700 font-medium">Mô tả ngắn: </span>
                {detailProduct?.shortDescription}
              </div>
              <div>
                <span className="text-gray-700 font-medium">Mô tả: </span>
                {detailProduct?.description}
              </div>
              <div>
                <div className="grid grid-cols-2 gap-x-2">
                  {detailProduct?.productAttrList.map((item) => {
                    return (
                      <div>
                        <span className="text-gray-700 font-medium">
                          {item.typeGoodAttrName}:{" "}
                        </span>
                        {item?.attrValue}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div>
            <span className="text-gray-700 font-medium mt-2 mb-2 block">
              Biến thể{" "}
            </span>
            <div className="grid grid-cols-4 gap-3">
              {detailProduct?.productDetailList &&
                detailProduct?.productDetailList?.map((item) => {
                  return (
                    <div className="flex gap-x-2 flex-col gap-y-1">
                      <img
                        src={item.image}
                        className="w-full h-44 object-cover object-center"
                        alt=""
                      />
                      <div className="flex flex-col gap-y-1">
                        <div>
                          <span className="text-gray-700 font-medium">
                            Tên:{" "}
                          </span>
                          {item.name}
                        </div>
                        <div>
                          <span className="text-gray-700 font-medium">
                            Giá:{" "}
                          </span>
                          {item.price && formatCurrencyVND(item.price)}
                        </div>
                        <div>
                          <span className="text-gray-700 font-medium">
                            Phần trăm giảm:{" "}
                          </span>
                          {item.percentDecrease}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </DialogDescription>
        <DialogFooter className="px-5">
          <div className="flex gap-x-2 justify-end">
            {detailProduct?.status == "pending" && (
              <ButtonForm
                type="submit"
                className="!w-32 !bg-green-500"
                label="Duyệt sản phẩm"
                onClick={() => {
                  if (detailProduct && detailProduct.productCode) {
                    handleUnLock.mutateAsync({
                      productCode: Number.parseInt(detailProduct.productCode),
                    });
                  }
                }}
                loading={handleUnLock.isPending}
              ></ButtonForm>
            )}{" "}
            {detailProduct?.status == "lock" && (
              <ButtonForm
                type="submit"
                className="!w-32 !bg-green-500"
                label="Mở khóa"
                // disabled={false}
                onClick={() => {
                  if (detailProduct && detailProduct.productCode) {
                    handleUnLock.mutateAsync({
                      productCode: Number.parseInt(detailProduct.productCode),
                    });
                  }
                }}
                // loading={handleUpdate.isPending}
              ></ButtonForm>
            )}
            {(detailProduct?.status == "active" ||
              detailProduct?.status == "pending") && (
              <ButtonForm
                type="submit"
                className="!w-28 !bg-primary"
                label="Khóa sản phẩm"
                // disabled={false}
                onClick={() => {
                  if (detailProduct && detailProduct.productCode) {
                    handleLock.mutateAsync({
                      productCode: Number.parseInt(detailProduct.productCode),
                    });
                  }
                }}
                loading={handleLock.isPending}
              ></ButtonForm>
            )}
            <ButtonForm
              type="submit"
              className="!w-20 !bg-red-500"
              label="Hủy"
              // disabled={false}
              onClick={() => {
                onClose();
              }}
            ></ButtonForm>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
