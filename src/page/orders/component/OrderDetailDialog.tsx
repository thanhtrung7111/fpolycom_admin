import {
  fetchData,
  // fetchDataCommon,
  postData,
  // postDataStore,
  uploadImage,
} from "@/api/commonApi";
import ButtonForm from "@/component_common/commonForm/ButtonForm";
import DatePickerFormikForm from "@/component_common/commonForm/DatePickerFormikForm";
import InputFormikForm from "@/component_common/commonForm/InputFormikForm";
import NumberFormikForm from "@/component_common/commonForm/NumberFormikForm";
import SelectFormikForm from "@/component_common/commonForm/SelectFormikForm";
import TextareaFormikForm from "@/component_common/commonForm/TextareaFormikForm";
import SpinnerLoading from "@/component_common/loading/SpinnerLoading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  OrderDetailObject,
  OrderInfoObject,
  OrderListObject,
  OrderObject,
  ProvinceObject,
  VoucherObject,
} from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const FILE_SIZE = 1024 * 1024 * 2;

const OrderDetailDialog = ({
  open = false,
  item = null,
  onClose,
}: {
  open: boolean;
  item: OrderListObject | null;
  onClose: () => void;
}) => {
  // const { currentStore } = use();
  const [orderDetail, setOrderDetail] = useState<OrderInfoObject | null>(null);
  const [statusReceive, setStatusReceive] = useState<any | null | undefined>(
    null
  );
  const [statusDelivery, setStatusDelivery] = useState<any | null | undefined>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const validationSchema = Yup.object().shape({
    image: Yup.string().required("Không để trống hình ảnh!"),
    title: Yup.string().required("Không để trống tiêu đề!"),
    bannerPosition: Yup.string().required("Không để trống vị trí!"),
    status: Yup.boolean().required("Không để trống trạng thái!"),
    productCode: Yup.number().required("Không để trống sản phẩm!"),
  });

  const handleFetchOrder = useMutation({
    mutationFn: (body: number) =>
      postData({ orderCode: body }, "/admin/order/get"),
    onSuccess: (data: OrderInfoObject) => {
      console.log(data);
      setOrderDetail(data);
      if (data.receiveDeliveryList) {
        setStatusReceive(
          data.receiveDeliveryList
            ? data.receiveDeliveryList?.find(
                (item: any) => item.typeDelivery == "receive"
              )
            : null
        );
        setStatusDelivery(
          data.receiveDeliveryList
            ? data.receiveDeliveryList?.find(
                (item: any) => item.typeDelivery == "delivery"
              )
            : null
        );
      }
    },
  });

  const handleConfirmOrder = useMutation({
    mutationFn: (body: number) =>
      postData({ orderCode: body }, "/store/orders/confirm"),
    onSuccess: (data: OrderInfoObject) => {
      const cloneItem = orderDetail;
      if (cloneItem) {
        setOrderDetail({
          ...data,
        });
      }
      if (queryClient.getQueryData(["store_orders"])) {
        queryClient.setQueryData(
          ["store_orders"],
          (oldData: OrderListObject[]) => {
            const resultData = data;
            console.log(resultData);
            return [
              resultData,
              ...oldData.filter((item) => item.orderCode != data.orderCode),
            ];
          }
        );
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "store_orders",
        });
      }
      toast.success("Xác nhận đơn hàng thành công!", {
        className: "p-4",
      });
    },
  });

  const handlePreparedOrder = useMutation({
    mutationFn: (body: number) =>
      postData({ orderCode: body }, "/store/orders/prepared"),
    onSuccess: (data: OrderInfoObject) => {
      const cloneItem = orderDetail;
      if (cloneItem) {
        setOrderDetail({
          ...cloneItem,
          orderStatus: "pickup",
          confirmPrepare: true,
        });
      }
      if (queryClient.getQueryData(["store_orders"])) {
        queryClient.setQueryData(
          ["store_orders"],
          (oldData: OrderListObject[]) => {
            const resultData = data;
            console.log(resultData);
            return [
              resultData,
              ...oldData.filter((item) => item.orderCode != data.orderCode),
            ];
          }
        );
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "store_orders",
        });
      }
      toast.success("Đã chuẩn bị hàng xong, đợi shipper lấy hàng!", {
        className: "p-4",
      });
    },
  });

  const handleSubmit = async (values: any): Promise<void> => {};
  useEffect(() => {
    const fetchData = async () => {
      if (item?.orderCode != null) {
        const data = await handleFetchOrder.mutateAsync(
          Number.parseInt(item.orderCode)
        );
        console.log(data);
        if (data) {
          setOrderDetail(data);
        }
      }
    };
    if (item != null) {
      fetchData();
    }
  }, [item]);
  console.log(item);
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!handleFetchOrder.isPending) {
          onClose();
          setTimeout(() => {
            // handlePost.reset();
          }, 500);
        }
      }}
    >
      <DialogContent className="sm:max-w-[1000px] px-0">
        <Formik
          key={"formCratePaymentType"}
          initialValues={{
            // storeCode: currentStore?.storeCode,
            image: "",
            title: "",
            bannerPosition: "",
            status: true,
            productCode: "",
            newImage: null,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
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
            <Form
              id="formCreateProduct"
              className=" max-h-[600px] overflow-y-scroll custom-scrollbar-wider px-8"
            >
              <DialogHeader>
                <DialogTitle className="mb-2">
                  Chi tiết đơn hàng: #{orderDetail?.orderCode}
                  <span
                    className={`font-light ${
                      orderDetail?.paymentSuccess
                        ? "text-green-500"
                        : "text-yellow-600"
                    }`}
                  >
                    (
                    {orderDetail?.paymentSuccess
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                    )
                  </span>
                </DialogTitle>
                {handleFetchOrder.isSuccess && orderDetail != null ? (
                  <div className="flex flex-col gap-y-4 px-1">
                    <DialogDescription>
                      <div
                        className={`flex items-center mb-1 gap-x-2 ${
                          orderDetail?.orderStatus == "complete"
                            ? "text-green-500"
                            : "text-yellow-400"
                        }`}
                      >
                        <div
                          className={`size-3 rounded-full ${
                            orderDetail?.orderStatus == "complete"
                              ? "bg-green-500"
                              : "bg-yellow-400"
                          }`}
                        ></div>
                        {orderDetail?.orderStatus == "complete" && "Hoàn thành"}
                        {orderDetail?.orderStatus == "prepare" &&
                          "Cửa hàng đang chuẩn bị hàng"}
                        {orderDetail?.orderStatus == "pending" &&
                          "Đợi xác nhận từ cửa hàng"}
                        {orderDetail?.orderStatus == "pickup" &&
                          "Đang lấy hàng"}
                      </div>
                      <div className="grid grid-cols-[1fr_2fr] px-5 py-2">
                        <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">
                          <li className="mb-10 ms-6">
                            <span
                              className={`absolute flex items-center justify-center w-8 h-8 ${
                                orderDetail?.confirmOrder
                                  ? "bg-yellow-300"
                                  : "bg-gray-200 border"
                              } rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900`}
                            >
                              {orderDetail?.confirmOrder ? (
                                <i className="ri-check-line text-gray-500"></i>
                              ) : (
                                <i className="ri-store-line text-gray-500"></i>
                              )}
                            </span>
                            <h3 className="font-medium leading-tight mb-1">
                              Xác nhận từ cửa hàng
                            </h3>
                            <p>
                              {orderDetail?.confirmOrder
                                ? "Đã xác nhận đơn hàng"
                                : "Đợi xác nhận đơn hàng"}
                            </p>
                          </li>
                          <li className="mb-10 ms-6">
                            <span
                              className={`absolute flex items-center justify-center w-8 h-8 ${
                                orderDetail?.confirmPrepare
                                  ? "bg-yellow-300"
                                  : "bg-gray-200 border"
                              } rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900`}
                            >
                              {orderDetail?.confirmPrepare ? (
                                <i className="ri-check-line text-gray-500"></i>
                              ) : (
                                <i className="ri-instance-line text-gray-500"></i>
                              )}
                            </span>
                            <h3 className="font-medium leading-tight mb-1">
                              Chuẩn bị hàng
                            </h3>
                            <p>
                              {orderDetail?.confirmPrepare
                                ? "Đã chuẩn bị xong đơn hàng"
                                : "Cửa hàng đang soạn hàng"}
                            </p>
                          </li>
                          <li className="mb-10 ms-6">
                            <span
                              className={`absolute flex items-center justify-center w-8 h-8 ${
                                statusReceive?.statusDelivery == "complete"
                                  ? "bg-yellow-300"
                                  : "bg-gray-200 border"
                              } rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900`}
                            >
                              {orderDetail.receiveDeliveryList?.find(
                                (item) => item.typeDelivery == "receive"
                              )?.statusDelivery == "complete" ? (
                                <i className="ri-check-line text-gray-500"></i>
                              ) : (
                                <i className="ri-instance-line text-gray-500"></i>
                              )}
                            </span>
                            <div>
                              <h3 className="font-medium leading-tight mb-1">
                                Lấy hàng
                              </h3>
                              <p className="mb-1">
                                {statusReceive && (
                                  <span>
                                    {statusReceive?.statusDelivery ==
                                      "taking" && "Đang lấy hàng"}
                                    {statusReceive?.statusDelivery ==
                                      "appoinment" && "Lấy hàng bị hoãn"}
                                    {statusReceive?.statusDelivery ==
                                      "complete" && "Đã lấy hàng"}
                                  </span>
                                )}
                              </p>
                              <p className="text-xs">
                                <span>
                                  {statusReceive &&
                                  statusReceive?.statusDelivery == "complete"
                                    ? "Hoàn thành"
                                    : "Ước tính"}
                                  :{" "}
                                </span>
                                {statusReceive
                                  ? statusReceive?.deliveryDate
                                  : "Chưa có ngày lấy hàng"}
                              </p>
                            </div>
                          </li>
                          <li className="ms-6 !border-transparent">
                            <span
                              className={`absolute flex items-center justify-center w-8 h-8 ${
                                statusDelivery?.statusDelivery == "complete"
                                  ? "bg-yellow-300"
                                  : "bg-gray-200 border"
                              } rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900`}
                            >
                              {orderDetail.receiveDeliveryList?.find(
                                (item) => item.typeDelivery == "delivery"
                              )?.statusDelivery == "complete" ? (
                                <i className="ri-check-line text-gray-500"></i>
                              ) : (
                                <i className="ri-instance-line text-gray-500"></i>
                              )}
                            </span>
                            <div>
                              <h3 className="font-medium leading-tight mb-1">
                                Giao hàng
                              </h3>
                              <p className="mb-1">
                                {statusDelivery && (
                                  <span>
                                    {statusDelivery?.statusDelivery ==
                                      "taking" && "Đang giao hàng"}
                                    {statusDelivery?.statusDelivery ==
                                      "appoinment" && "Giao hàng bị hoãn"}
                                    {statusDelivery?.statusDelivery ==
                                      "complete" && "Đã giao hàng"}
                                  </span>
                                )}
                              </p>
                              <p className="text-xs">
                                <span>
                                  {" "}
                                  {statusDelivery &&
                                  statusDelivery?.statusDelivery == "complete"
                                    ? "Hoàn thành"
                                    : "Ước tính"}
                                  : :{" "}
                                </span>
                                {statusDelivery
                                  ? statusDelivery?.deliveryDate
                                  : "Chưa có ngày giao hàng hàng"}
                              </p>
                            </div>
                          </li>
                        </ol>

                        <div>
                          <h5 className="text-gray-700 font-medium mb-2">
                            Thông tin giao hàng
                          </h5>
                          <div className="flex flex-col gap-y-3">
                            <div>
                              <span>Ngày đặt hàng: </span>
                              <span>{orderDetail.orderDate}</span>
                            </div>
                            <div>
                              <span>Địa chỉ giao hàng: </span>
                              <span>{orderDetail.address}</span>
                            </div>
                            <div>
                              <span>Ghi chú: </span>
                              <span>{orderDetail.noteContent}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        {orderDetail.orderDetailList.map(
                          (orderDetailItem: OrderDetailObject) => {
                            return (
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-x-2">
                                  <img
                                    src={orderDetailItem.image}
                                    alt=""
                                    className="size-28 object-center object-cover"
                                  />
                                  <div className="flex flex-col gap-y-1">
                                    <h5 className="text-gray-700">
                                      {orderDetailItem.productName}{" "}
                                      <span className="text-red-500">
                                        (Giảm {orderDetailItem.percentDecrease}{" "}
                                        %)
                                      </span>
                                    </h5>
                                    <span className="text-gray-700 flex items-center">
                                      {orderDetailItem.productDetailName}{" "}
                                    </span>
                                    <span className="text-gray-700 text-xs">
                                      Giá:{" "}
                                      <span>
                                        {new Intl.NumberFormat("vi-VN", {
                                          style: "currency",
                                          currency: "VND",
                                        }).format(
                                          orderDetailItem.productDetailPrice
                                            ? orderDetailItem.productDetailPrice
                                            : 0
                                        )}
                                      </span>
                                    </span>
                                    <span className="text-gray-700 text-xs">
                                      Số lượng:{" "}
                                      <span>{orderDetailItem.quantity}</span>
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-y-1">
                                  <span>
                                    {new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(orderDetailItem.finalTotal)}
                                  </span>
                                  <span>
                                    ( -
                                    {new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(orderDetailItem.totalDiscount)}
                                    )
                                  </span>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                      <div className="flex flex-col py-2 border-t border-gray-100 gap-2">
                        <div className="flex items-center justify-between">
                          <span>Tổng tiền tạm tính:</span>
                          <span>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(
                              orderDetail?.totalAmount
                                ? orderDetail?.totalAmount
                                : 0
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Tổng tiền giảm giá sản phẩm:</span>
                          <span>
                            -
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(
                              orderDetail?.totalAmountDiscount
                                ? orderDetail?.totalAmountDiscount
                                : 0
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Tổng tiền ship:</span>
                          <span>
                            +
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(
                              orderDetail?.totalAmountShip
                                ? orderDetail?.totalAmountShip
                                : 0
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Tổng tiền voucher giảm:</span>
                          <span>
                            -
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(
                              orderDetail?.totalAmountVoucher
                                ? orderDetail?.totalAmountVoucher
                                : 0
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-t border-gray-100">
                          <span>Tổng tiền:</span>
                          <span>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(
                              orderDetail?.finalTotal
                                ? orderDetail?.finalTotal
                                : 0
                            )}
                          </span>
                        </div>
                      </div>
                    </DialogDescription>
                    <DialogFooter>
                      <div className="flex gap-x-2 justify-end">
                        <ButtonForm
                          type="button"
                          className="!w-28 !bg-red-500"
                          label="Hủy"
                          //   disabled={handlePost.isPending || isLoading}
                          onClick={() => {
                            onClose();
                            setTimeout(() => {
                              //   handlePost.reset();
                              resetForm();
                            }, 500);
                          }}
                        ></ButtonForm>
                      </div>
                    </DialogFooter>
                  </div>
                ) : (
                  <div className="flex gap-x-3 px-1">
                    <SpinnerLoading className="!h-6 !w-6 !fill-primary"></SpinnerLoading>
                    <DialogDescription>
                      <span>Đang tải dữ liệu...</span>
                    </DialogDescription>
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

export default OrderDetailDialog;
