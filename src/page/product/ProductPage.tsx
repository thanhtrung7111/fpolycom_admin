import BreadcrumbCustom from "@/component_common/breadcrumb/BreadcrumbCustom";
import ButtonForm from "@/component_common/commonForm/ButtonForm";
import TableCustom from "@/component_common/table/TableCustom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { ProductObject, ProvinceObject } from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import { fetchData, postData } from "@/api/commonApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ProductDetailDialog from "./component/ProductDetailDialog";
import { toast } from "sonner";
import StatusBadge from "@/component_common/status/StatusBadge";

const ProductPage = () => {
  const queryClient = useQueryClient();
  const [openNew, setOpenNew] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProductObject | null>(null);
  const { data, isError, isFetching, error, isSuccess } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchData("/admin/product/all"),
  });

  const handleLock = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/product/lock"),
    onSuccess: (data: ProductObject) => {
      const resultData = data;
      if (queryClient.getQueryData(["products"])) {
        queryClient.setQueryData(["products"], (oldData: ProductObject[]) => {
          console.log(resultData);
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
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/product/unlock"),
    onSuccess: (data: ProductObject) => {
      const resultData = data;
      if (queryClient.getQueryData(["products"])) {
        queryClient.setQueryData(["products"], (oldData: ProductObject[]) => {
          console.log(resultData);
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

  const {
    data: dataProductStatus,
    isError: isErrorProductStatus,
    isFetching: isFetchingProductStatus,
    error: errorProductStatus,
    isSuccess: isSuccessProductStatus,
  } = useQuery({
    queryKey: ["productStatus"],
    queryFn: () => fetchData("/common/status/product"),
  });

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
  const breadBrumb = [
    {
      itemName: "Quản lí chung",
    },
    {
      itemName: "Sản phẩm",
    },
    {
      itemName: "Danh sách",
      itemLink: "/province",
    },
  ];
  const columns: ColumnDef<ProductObject>[] = [
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
      accessorKey: "productCode",
      meta: "Mã sản phẩm",
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
        <div className="capitalize">{row.getValue("productCode")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "name",
      meta: "Tên sản phẩm",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên sản phẩm
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "typeGoodCode",
      meta: "Mã loại hàng",
      header: ({ column }) => {
        return (
          <Button
            className="hidden"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mã loại hàng
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize hidden">{row.getValue("typeGoodCode")}</div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "typeGoodName",
      meta: "Loại hàng",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Loại hàng
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("typeGoodName")}</div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "status",
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
        <StatusBadge
          item={row.original.status ? row.original.status : ""}
          success="active"
          error="lock"
          warning="pending"
        >
          {" "}
          {row.getValue("status") == "pending" && "Chờ duyệt"}
          {row.getValue("status") == "active" && "Đã duyệt"}
          {row.getValue("status") == "lock" && "Đã khóa"}
        </StatusBadge>
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
          <Popover>
            <PopoverTrigger asChild>
              <div className="w-16 text-end cursor-pointer ml-auto pr-5">
                <i className="ri-menu-line text-xl text-gray-600"></i>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-2" align="end">
              <div
                className="px-3 hover:bg-slate-100 cursor-pointer text-sm py-2 text-gray-600 flex gap-x-1"
                onClick={() => {
                  setSelectedItem(row.original);
                  setOpenUpdate(true);
                }}
              >
                <span>Xem chi tiết</span>
              </div>
              {row.original.status == "pending" && (
                <>
                  <div
                    className="px-3 hover:bg-slate-100 cursor-pointer text-sm py-2 text-gray-600 flex gap-x-1"
                    onClick={async () => {
                      await handleUnLock.mutateAsync({
                        productCode: row.original.productCode,
                      });
                    }}
                  >
                    <span>Duyệt</span>
                  </div>
                  <div
                    className="px-3 hover:bg-slate-100 cursor-pointer text-sm py-2 text-gray-600 flex gap-x-1"
                    onClick={async () => {
                      await handleLock.mutateAsync({
                        productCode: row.original.productCode,
                      });
                    }}
                  >
                    <span>Khóa</span>
                  </div>
                </>
              )}
              {row.original.status == "active" && (
                <div
                  className="px-3 hover:bg-slate-100 cursor-pointer text-sm py-2 text-gray-600 flex gap-x-1"
                  onClick={async () => {
                    await handleLock.mutateAsync({
                      productCode: row.original.productCode,
                    });
                  }}
                >
                  <span>Khóa</span>
                </div>
              )}
              {row.original.status == "lock" && (
                <div
                  className="px-3 hover:bg-slate-100 cursor-pointer text-sm py-2 text-gray-600 flex gap-x-1"
                  onClick={async () => {
                    await handleUnLock.mutateAsync({
                      productCode: row.original.productCode,
                    });
                  }}
                >
                  <span>Mở khóa</span>
                </div>
              )}
            </PopoverContent>
          </Popover>
        );
      },
    },
  ];
  return (
    <>
      <ProductDetailDialog
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        item={selectedItem}
      ></ProductDetailDialog>

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
            Danh sách sản phẩm
          </h4>
          <div className="flex gap-x-2">
            <ButtonForm
              className="!bg-primary !w-28"
              type="button"
              icon={<i className="ri-download-2-line"></i>}
              label="Xuất excel"
            ></ButtonForm>
          </div>
        </div>

        {/* table */}
        <div className="rounded-md p-5 bg-white border-gray-200 border shadow-md">
          <TableCustom
            data={isSuccess ? data : []}
            columns={columns}
            search={[
              { key: "productCode", name: "mã sản phẩm", type: "text" },
              { key: "name", name: "tên sản phẩm", type: "text" },
              {
                key: "typeGoodCode",
                name: "Loại hàng",
                type: "combobox",
                dataKey: "typeGoodCode",
                dataName: "name",
                dataList: dataTypeGood ? dataTypeGood : [],
              },
              {
                key: "status",
                name: "Trạng thái",
                type: "combobox",
                dataKey: "name",
                dataName: "description",
                dataList: dataProductStatus ? dataProductStatus : [],
              },
            ]}
            isLoading={isFetching}
          ></TableCustom>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
