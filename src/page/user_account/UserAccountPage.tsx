import BreadcrumbCustom from "@/component_common/breadcrumb/BreadcrumbCustom";
import ButtonForm from "@/component_common/commonForm/ButtonForm";
import TableCustom from "@/component_common/table/TableCustom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  ProductObject,
  ProvinceObject,
  UserAccountObject,
} from "@/type/TypeCommon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import { fetchData, postData } from "@/api/commonApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

const UserAccountPage = () => {
  const queryClient = useQueryClient();
  const [openNew, setOpenNew] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { data, isError, isFetching, error, isSuccess } = useQuery({
    queryKey: ["userAccounts"],
    queryFn: () => fetchData("/admin/user-account/all"),
  });

  const handleLock = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/user-account/lock"),
    onSuccess: (data: UserAccountObject) => {
      const resultData = data;
      if (queryClient.getQueryData(["userAccounts"])) {
        queryClient.setQueryData(
          ["userAccounts"],
          (oldData: UserAccountObject[]) => {
            console.log(resultData);
            return [
              resultData,
              ...oldData.filter(
                (item) => item.userAccountID != resultData.userAccountID
              ),
            ];
          }
        );
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "userAccounts",
        });
      }
      handleUnLock.reset();
      toast("Thông báo", {
        description: (
          <span>
            Khóa tài khoản <b>"{resultData.userLogin}"</b> thành công!
          </span>
        ),
      });
    },
  });
  const handleUnLock = useMutation({
    mutationFn: (body: { [key: string]: any }) =>
      postData(body, "/admin/user-account/unlock"),
    onSuccess: (data: UserAccountObject) => {
      const resultData = data;
      if (queryClient.getQueryData(["userAccounts"])) {
        queryClient.setQueryData(
          ["userAccounts"],
          (oldData: UserAccountObject[]) => {
            console.log(resultData);
            return [
              resultData,
              ...oldData.filter(
                (item) => item.userAccountID != resultData.userAccountID
              ),
            ];
          }
        );
      } else {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "userAccounts",
        });
      }
      handleLock.reset();
      toast("Thông báo", {
        description: (
          <span>
            Mở khóa tài khoản <b>"{resultData.userLogin}"</b> thành công!
          </span>
        ),
      });
    },
  });

  const {
    data: dataUserStatus,
    isError: isErrorUserStatus,
    isFetching: isFetchingUserStatus,
    error: errorUserStatus,
    isSuccess: isSuccessUserStatus,
  } = useQuery({
    queryKey: ["userStatus"],
    queryFn: () => fetchData("/common/user-status"),
  });

  const breadBrumb = [
    {
      itemName: "Quản lí chung",
    },
    {
      itemName: "Tài khoản người dùng",
      itemLink: "/user_account",
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
      accessorKey: "userAccountID",
      meta: "Mã người dùng",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mã người dùng
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("userAccountID")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "userLogin",
      meta: "Tên đăng nhập",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên đăng nhập
            {column.getIsSorted() === "asc" ? (
              <i className="ri-arrow-up-line"></i>
            ) : (
              <i className="ri-arrow-down-line"></i>
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("userLogin")}</div>
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
      accessorKey: "userStatus",
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
        <div
          className={`capitalize font-medium ${
            row.getValue("userStatus") == "pending"
              ? "text-yellow-600"
              : row.getValue("userStatus") == "active"
              ? "text-green-700"
              : "text-red-500"
          }`}
        >
          {row.getValue("userStatus")}
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
            <PopoverContent className="w-44" align="end">
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
      {/* <ProductDetailDialog
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        item={selectedItem}
      ></ProductDetailDialog> */}

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
            Danh sách tài khoản người dùng
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
              onClick={() => setOpenNew(true)}
              label="Thêm mới"
            ></ButtonForm>
          </div>
        </div>

        {/* table */}
        <div className="rounded-md p-5 bg-white border-gray-200 border shadow-md">
          <TableCustom
            data={isSuccess ? data : []}
            columns={columns}
            search={[
              { key: "userAccountID", name: "mã người dùng", type: "text" },
              { key: "userLogin", name: "tên đăng nhập", type: "text" },
              {
                key: "status",
                name: "Trạng thái",
                type: "combobox",
                dataKey: "name",
                dataName: "description",
                dataList: dataUserStatus ? dataUserStatus : [],
              },
            ]}
            isLoading={isFetching}
          ></TableCustom>
        </div>
      </div>
    </>
  );
};

export default UserAccountPage;
