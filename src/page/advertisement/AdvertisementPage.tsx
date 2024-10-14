import { deleteData, fetchCategory, fetchDataCondition } from "@/api/commonApi";
import BreadcrumbCustom from "@/component_common/breadcrumb/BreadcrumbCustom";
import ButtonForm from "@/component_common/commonForm/ButtonForm";
import TableCustom from "@/component_common/table/TableCustom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AdvertisementObject,
  CategoryObject,
  ProductObject,
} from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { any } from "zod";
import DialogCreateAdvertisement from "./component/DialogCreateAdvertisement";
import SpinnerLoading from "@/component_common/loading/SpinnerLoading";

const AdvertisementPage = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const breadBrumb = [
    {
      itemName: "Quản lí chung",
    },
    {
      itemName: "Danh sách quảng cáo",
      itemLink: "/advertisement",
    },
  ];

  const [detailBanner, setDetailBanner] = useState(null);
  const [openDetailBanner, setOpenDetailBanner] = useState(false);
  const [bannerID, setBannerID] = useState<string>("");
  const [bodyDelete, setBodyDelete] = useState<string>("");
  const [openDialogDelete, setOpentDialogDelete] = useState(false);
  const [advertisementDelete, setAdvertisementDelete] =
    useState<AdvertisementObject | null>(null);

  const dataListStatus: any[] = [
    { ITEMCODE: 0, ITEMNAME: "Ngừng hoạt động" },
    { ITEMCODE: 1, ITEMNAME: "Đang chạy" },
  ];
  const {
    data: dataAdvertisement,
    isFetching: isFetchingAdvertisement,
    isError: isErrorAdvertisement,
    isSuccess: isSuccessAdvertisement,
  } = useQuery({
    queryKey: ["advertisements"],
    queryFn: () =>
      fetchDataCondition({
        DCMNCODE: "inpBanner",
        PAGELINE: "0",
        PAGENUMB: "1",
      }),
  });

  const {
    data: dataBannerType,
    isFetching: isFetchingBannerType,
    isError: isErrorBannerType,
    isSuccess: isSuccessBannerType,
  } = useQuery({
    queryKey: ["lstBannerType"],
    queryFn: () => fetchCategory("lstBannerType"),
  });

  const {
    data: dataBannerDataType,
    isFetching: isFetchingBannerDataType,
    isError: isErrorBannerDataType,
    isSuccess: isSuccessBannerDataType,
  } = useQuery({
    queryKey: ["lstBannerDataType"],
    queryFn: () => fetchCategory("lstBannerDataType"),
  });

  const handleDelete = useMutation({
    mutationFn: (body: { [key: string]: any }) => deleteData(body),
    onSuccess: async (data: AdvertisementObject[], body) => {
      if (queryClient.getQueryData(["advertisements"])) {
        queryClient.setQueryData(
          ["advertisements"],
          (oldData: AdvertisementObject[]) => {
            if (!oldData) return [];
            const resultData = data[0];
            console.log(body);
            console.log(
              oldData.filter((item) => item.KKKK0000 !== resultData.KKKK0000)
            );
            return oldData.filter((item) => item.KKKK0000 !== body.KEY_CODE);
          }
        );
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const columns: ColumnDef<AdvertisementObject>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "BANRCODE",
      meta: "Mã quảng cáo",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mã sản phẩm
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("BANRCODE")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "BANRNAME",
      meta: "Tên quảng cáo",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên quảng cáo
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("BANRNAME")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "BANRTYPE",
      meta: "Loại quảng cáo",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Loại quảng cáo
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">
          {dataBannerType
            ? dataBannerType.find(
                (item: CategoryObject) =>
                  item.ITEMCODE == row.getValue("BANRTYPE")
              )?.ITEMNAME
            : ""}
        </div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "OBJCCODE",
      meta: "Mã đối tượng quảng cáo",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mã đối tượng quảng cáo
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("OBJCCODE")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "OBJCTYPE",
      meta: "Loại đối tượng",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Loại đối tượng
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">
          {dataBannerDataType
            ? dataBannerDataType.find(
                (item: CategoryObject) =>
                  item.ITEMCODE == row.getValue("OBJCTYPE")
              )?.ITEMNAME
            : ""}
        </div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "BANR_RUN",
      meta: "Trạng thái",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Trạng thái
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("BANR_RUN") == 1 ? (
            <div className="text-sm text-green-500 px-3 w-fit py-2 rounded-md flex items-center justify-center">
              Đang chạy
            </div>
          ) : (
            <div className="text-sm text-red-500 px-3 w-fit py-2 rounded-md flex items-center justify-center">
              Không hoạt động
            </div>
          )}
        </div>
      ),
      enableHiding: true,
    },
    {
      id: "actions",
      header: () => {
        return <div className="flex justify-end">Tác vụ</div>;
      },
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <div className="flex gap-x-2 justify-end">
            <ButtonForm
              onClick={() => {
                console.log(row.original.KKKK0000, "Payment");
                navigate("/update_advertisement/" + row.original.KKKK0000);
              }}
              className="!bg-yellow-500 !w-28 text-sm"
              type="button"
              icon={<i className="ri-error-warning-line"></i>}
              label="Xem chi tiết"
            ></ButtonForm>

            <ButtonForm
              className="!bg-red-500 !w-20  text-sm disabled:!bg-slate-500"
              type="button"
              // disabled={handleDelete.isPending}
              loading={
                row.original.KKKK0000 == bodyDelete && handleDelete.isPending
              }
              onClick={async () => {
                setAdvertisementDelete(row.original);
                setOpentDialogDelete(true);
              }}
              icon={<i className="ri-delete-bin-line"></i>}
              label="Xóa"
            ></ButtonForm>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-y-2">
        <div className="mb-3">
          <BreadcrumbCustom
            linkList={breadBrumb}
            itemName={"itemName"}
            itemLink={"itemLink"}
          ></BreadcrumbCustom>
        </div>

        {/* Action  */}
        <div className="flex justify-between items-center">
          <h4 className="text-xl font-medium text-gray-600">
            Danh sách quảng cáo
          </h4>
          <div className="flex gap-x-2">
            <ButtonForm
              className="!bg-primary !w-28"
              type="button"
              icon={<i className="ri-download-2-line"></i>}
              label="Xuất excel"
            ></ButtonForm>
            <ButtonForm
              className="!bg-secondary !w-28"
              type="button"
              icon={<i className="ri-file-add-line"></i>}
              onClick={() => navigate("/create_advertisement")}
              label="Thêm mới"
            ></ButtonForm>
          </div>
        </div>

        {/* table */}
        <div className="rounded-md p-5 bg-white border-gray-200 border shadow-md">
          <TableCustom
            data={isSuccessAdvertisement ? dataAdvertisement : []}
            columns={columns}
            search={[
              { key: "BANRCODE", name: "mã quảng cáo", type: "text" },
              { key: "BANRNAME", name: "tên quảng cáo", type: "text" },
              {
                key: "BANRTYPE",
                name: "Loại quảng cáo",
                type: "combobox",
                dataKey: "ITEMCODE",
                dataName: "ITEMNAME",
                dataList: dataBannerType,
              },
              {
                key: "OBJCTYPE",
                name: "Loại đối tượng",
                type: "combobox",
                dataKey: "ITEMCODE",
                dataName: "ITEMNAME",
                dataList: dataBannerDataType,
              },
              {
                key: "BANR_RUN",
                name: "Trạng thái",
                type: "combobox",
                dataKey: "ITEMCODE",
                dataName: "ITEMNAME",
                dataList: dataListStatus,
              },
            ]}
            isLoading={isFetchingAdvertisement}
          ></TableCustom>
        </div>
      </div>{" "}
    </>
  );
};

export default AdvertisementPage;
