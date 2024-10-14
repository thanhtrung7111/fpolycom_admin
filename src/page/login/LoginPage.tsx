import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginAdmin } from "@/api/authApi";
import { LoginLocationObject } from "@/type/TypeCommon";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import InputFormikForm from "@/component_common/commonForm/InputFormikForm";
import PasswordFormikForm from "@/component_common/commonForm/PasswordFormikForm";
import ButtonForm from "@/component_common/commonForm/ButtonForm";
import { useUserStore } from "@/store/userStore";
import { error } from "console";

const formSchema = Yup.object().shape({
  userLogin: Yup.string().min(
    6,
    "Tên đăng nhập không để trống và có ít nhất 6 kí tự!"
  ),
  password: Yup.string().min(
    6,
    "Mật khẩu không để trống và có ít nhất 6 kí tự!"
  ),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUserStore();
  const handleLoginAdmin = useMutation({
    mutationFn: (body: typeof formSchema) => loginAdmin(body),
    onSuccess: (data) => {
      setCurrentUser(data);
    },
  });

  const submitLogin = async (values: typeof formSchema): Promise<void> => {
    console.log(values);
    const data = await handleLoginAdmin.mutateAsync(values);
  };

  return (
    <div className="w-[600px] h-[500px] justify-center border border-gray-200 shadow-lg">
      <div className="w-full overflow-hidden">
        <div
          className={`pt-11 grid grid-cols-2 w-[200%] transition-transform duration-150`}
        >
          <div className="px-10">
            <Formik
              initialValues={{ userLogin: "", password: "" }}
              validationSchema={formSchema}
              onSubmit={(values: any) => {
                submitLogin(values);
              }}
            >
              {({}) => (
                <Form id="formLogin" className="flex flex-col gap-y-3">
                  <h5 className="text-center text-3xl mb-5 text-primary font-semibold">
                    Đăng nhập
                  </h5>
                  <InputFormikForm
                    label="Tên đăng nhập"
                    name="userLogin"
                    // disabled={loginMutation.isPending}
                    placeholder="Nhập tên đăng nhập..."
                  ></InputFormikForm>
                  <PasswordFormikForm
                    label="Mật khẩu"
                    name="password"
                    // disabled={loginMutation.isPending}
                    placeholder="Nhập mật khẩu..."
                  ></PasswordFormikForm>
                  {handleLoginAdmin.isError && (
                    <span className="text-xs text-red-500">
                      {handleLoginAdmin.error.message}
                    </span>
                  )}
                  <ButtonForm
                    type="submit"
                    label="Đăng nhập"
                    // loading={loginMutation.isPending}
                  ></ButtonForm>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
