import { Dialog } from "@/components/ui/dialog";
import React from "react";

const ProvinceDeleteDialog = ({ open = false,id }: { open: boolean }) => {
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!handleDelete.isSuccess && !handleDelete.isPending) {
          setOpentDialogDelete(false);
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thông báo</DialogTitle>
          <div className="w-full overflow-hidden">
            <div
              className={`${
                handleDelete.isSuccess ? "-translate-x-1/2" : "translate-x-0"
              } w-[200%] grid grid-cols-2 transition-transform`}
            >
              <div className="flex flex-col">
                <DialogDescription className="flex items-center mb-5 justify-center gap-x-2 py-6">
                  {handleDelete.isPending ? (
                    <>
                      <SpinnerLoading className="w-6 h-6 fill-primary"></SpinnerLoading>
                      <span className="text-gray-700 text-base">
                        Đang xóa sản phẩm...
                      </span>
                    </>
                  ) : (
                    <>
                      <i className="ri-delete-bin-line text-gray-700 text-xl"></i>
                      <span className="text-gray-700 text-base">
                        Bạn có muốn xóa quảng cáo{" "}
                        <b className="text-gray-500">
                          {" "}
                          {advertisementDelete?.BANRNAME}
                        </b>{" "}
                        ?
                      </span>
                    </>
                  )}
                </DialogDescription>
                <div className="flex gap-x-2 justify-end">
                  <ButtonForm
                    type="button"
                    className="!w-28 !bg-primary"
                    label="Xác nhận"
                    onClick={async () => {
                      if (advertisementDelete != null)
                        handleDelete.mutateAsync({
                          DCMNCODE: "inpBanner",
                          KEY_CODE: advertisementDelete?.KKKK0000,
                        });
                    }}
                  ></ButtonForm>
                  <ButtonForm
                    type="button"
                    className="!w-28 !bg-red-500"
                    label="Đóng"
                    onClick={() => {
                      setOpentDialogDelete(false);
                    }}
                  ></ButtonForm>
                </div>
              </div>
              <div className="flex flex-col">
                <DialogDescription className="flex items-center mb-5 justify-center gap-x-2 py-6">
                  <i className="ri-checkbox-line text-gray-700 text-xl"></i>{" "}
                  <span className="text-gray-700 text-base">
                    Xóa thành công!
                  </span>
                </DialogDescription>
                <div className="flex gap-x-2 justify-end">
                  <ButtonForm
                    type="button"
                    className="!w-28 !bg-slate-500"
                    label="Danh sách"
                    onClick={() => {
                      navigate("/advertisement");
                    }}
                  ></ButtonForm>
                  <ButtonForm
                    type="button"
                    className="!w-28 !bg-red-500"
                    label="Thêm mới"
                    onClick={() => {
                      navigate("/create_advertisement");
                    }}
                  ></ButtonForm>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ProvinceDeleteDialog;
