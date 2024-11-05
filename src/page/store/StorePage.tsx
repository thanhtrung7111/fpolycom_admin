import BreadcrumbCustom from "@/component_common/breadcrumb/BreadcrumbCustom";
import ButtonForm from "@/component_common/commonForm/ButtonForm";
import TableCustom from "@/component_common/table/TableCustom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StoreListObject, WardObject } from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import { fetchData, postData } from "@/api/commonApi";
// import WardDeletePage from "./component/WardDeletePage";
// import WardUpdatePage from "./component/WardUpdatePage";
// import WardCreatePage from "./component/WardCreatePage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import StatusBadge from "@/component_common/status/StatusBadge";
import StoreDetailDialog from "./component.tsx/StoreDetailDialog";

const StorePage = () => {
  const queryClient = useQueryClient();
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StoreListObject | null>(
    null
  );
  const { data, isError, isFetching, error, isSuccess } = useQuery({
    queryKey: ["stores"],
    queryFn: () => fetchData("/admin/store/all"),
  });

  const handleFetchStatusStore = useQuery({
    queryKey: ["status_stores"],
    queryFn: () => fetchData("/common/status/store"),
  });

  const handleLockStore = useMutation({
    mutationFn: (storeCode: string) =>
      postData({ storeCode: storeCode }, "/admin/store/lock"),
    onSuccess: (data: StoreListObject) => {
      if (queryClient.getQueryData(["stores"])) {
        queryClient.setQueryData(["stores"], (oldData: StoreListObject[]) => {
          const resultData = data;
          console.log(resultData);
          return [
            resultData,
            ...oldData.filter((item) => item.storeCode != resultData.storeCode),
          ];
        });
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "stores",
        });
      }
      toast("Thông báo", {
        description: <span>Khóa cửa hàng {data.name} thành công!</span>,
      });
    },
  });
  const handleUnclock = useMutation({
    mutationFn: (storeCode: string) =>
      postData({ storeCode: storeCode }, "/admin/store/approve"),
    onSuccess: (data: StoreListObject) => {
      if (queryClient.getQueryData(["stores"])) {
        queryClient.setQueryData(["stores"], (oldData: StoreListObject[]) => {
          const resultData = data;
          console.log(resultData);
          return [
            resultData,
            ...oldData.filter((item) => item.storeCode != resultData.storeCode),
          ];
        });
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "stores",
        });
      }
      toast("Thông báo", {
        description: <span>Duyệt cửa hàng {data.name} thành công!</span>,
      });
    },
  });
  // const {
  //   data: dataDistricts,
  //   isError: isErrorDistricts,
  //   isFetching: isFetchingDistricts,
  //   error: errorDistricts,
  //   isSuccess: isSuccessDistricts,
  // } = useQuery({
  //   queryKey: ["stores"],
  //   queryFn: () => fetchData("/admin/store/all"),
  // });
  const breadBrumb = [
    {
      itemName: "Quản lí chung",
    },
    {
      itemName: "Danh sách cửa hàng",
      itemLink: "/store",
    },
  ];
  const columns: ColumnDef<StoreListObject>[] = [
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
      accessorKey: "storeCode",
      meta: "Mã cửa hàng",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mã cửa hàng
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("storeCode")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "name",
      meta: "Tên cửa hàng",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên cửa hàng
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
      accessorKey: "phone",
      meta: "Số điện thoại",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Số điện thoại
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("phone")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "email",
      meta: "Email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("email")}</div>
      ),
      enableHiding: true,
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
        <div className="capitalize">
          <StatusBadge
            item={row.original.status ? row.original.status : ""}
            success="active"
            error="lock"
            warning="pending"
          >
            {row.getValue("status") == "pending" && "Chờ duyệt"}
            {row.getValue("status") == "rejected" && "Từ chối"}
            {row.getValue("status") == "active" && "Đang hoạt động"}
            {row.getValue("status") == "lock" && "Ngừng hoạt động"}
          </StatusBadge>
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
              {row.original.status == "active" && (
                <div
                  className="px-3 hover:bg-slate-100 cursor-pointer text-sm py-2 text-gray-600 flex gap-x-1"
                  onClick={async () => {
                    if (row.original.storeCode) {
                      handleLockStore.mutateAsync(row.original.storeCode);
                    }
                  }}
                >
                  <span>Khóa cửa hàng</span>
                </div>
              )}
              {(row.original.status == "pending" ||
                row.original.status == "lock") && (
                <div
                  className="px-3 hover:bg-slate-100 cursor-pointer text-sm py-2 text-gray-600 flex gap-x-1"
                  onClick={async () => {
                    if (row.original.storeCode) {
                      await handleUnclock.mutateAsync(row.original.storeCode);
                    }
                  }}
                >
                  <span>
                    {row.original.status == "pending"
                      ? "Duyệt cửa hàng"
                      : "Mở cửa hàng"}
                  </span>
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
      {/* <WardDeletePage
      item={selectedItem}
      open={openDelete}
      onClose={() => setOpenDelete(false)}
    ></WardDeletePage>
    <WardUpdatePage
      open={openUpdate}
      onClose={() => setOpenUpdate(false)}
      item={selectedItem}
    ></WardUpdatePage>*/}
      <StoreDetailDialog
        item={selectedItem}
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
      ></StoreDetailDialog>
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
            Danh sách cửa hàng
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
              { key: "storeCode", name: "mã cửa hàng", type: "text" },
              { key: "name", name: "tên cửa hàng", type: "text" },
              { key: "phone", name: "số điện thoại", type: "text" },
              { key: "email", name: "email", type: "text" },
              {
                key: "status",
                name: "Trạng thái",
                type: "combobox",
                dataKey: "name",
                dataName: "description",
                dataList:
                  handleFetchStatusStore.isSuccess &&
                  handleFetchStatusStore.data
                    ? handleFetchStatusStore.data
                    : [],
              },
            ]}
            isLoading={isFetching}
          ></TableCustom>
        </div>
      </div>
    </>
  );
};

export default StorePage;
