import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "@/page/home/HomePage";
import AppCommon from "./template/AppCommon";
import AdvertisementPage from "./page/advertisement/AdvertisementPage";
import DashboardProductPage from "./page/dashboard_product/DashboardProductPage";
import DashboardRevenuePage from "./page/dashboard_revenue/DashboardRevenuePage";
import AppLogin from "./template/AppLogin";
import LoginPage from "./page/login/LoginPage";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "./store/userStore";
import SpinnerLoading from "./component_common/loading/SpinnerLoading";
import ProductCreatePage from "./page/create_product/ProductCreatePage";
import { Toaster } from "sonner";
import ProductCreatePageFormik from "./page/create_product/ProductCreatePageFormik";
import MessagesPage from "./page/message/MessagesPage";
import PromotionPage from "./page/promotion/PromotionPage";
import NotifycationComponent from "./page/NotifycationComponent";
import AdvertisementCreatePage from "./page/advertisement/AdvertisementCreatePage";
import AdvertisementUpdatePage from "./page/advertisement/AdvertisementUpdatePage";
import PostPage from "./page/post/PostPage";
import PostCreatePage from "./page/post/PostCreatePage";
import ProvincePage from "./page/province/ProvincePage";
import DistrictPage from "./page/district/DistrictPage";
import WardPage from "./page/ward/WardPage";
import BankPage from "./page/bank/BankPage";
import BankBranchPage from "./page/bank_branch/BankBranchPage";
import TypeGoodPage from "./page/type_good/TypeGoodPage";
import BankUserPage from "./page/bank_user/BankUserPage";
import TypeGoodAttrPage from "./page/type_good_attr/TypeGoodAttrPage";
import DiscountPage from "./page/discount/DiscountPage";
import PaymentTypePage from "./page/payment_type/PaymentTypePage";
import StoreTransactionPage from "./page/store_transaction/StoreTransactionPage";
import ProductPage from "./page/product/ProductPage";
import UserAccountPage from "./page/user_account/UserAccountPage";
import StorePage from "./page/store/StorePage";

function App() {
  const { currentUser } = useUserStore();
  console.log(import.meta.env.VITE_API_URL);
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route
            element={
              !!currentUser ? (
                <AppCommon />
              ) : (
                <Navigate to={"/login"}></Navigate>
              )
            }
          >
            <Route element={<HomePage></HomePage>} path="/"></Route>
            <Route
              element={<DashboardProductPage></DashboardProductPage>}
              path="/dashboard_product"
            ></Route>
            <Route
              element={<DashboardRevenuePage></DashboardRevenuePage>}
              path="/dashboard_revenue"
            ></Route>
            <Route
              element={<ProvincePage></ProvincePage>}
              path="/province"
            ></Route>
            <Route
              element={<DistrictPage></DistrictPage>}
              path="/district"
            ></Route>
            <Route element={<WardPage></WardPage>} path="/ward"></Route>
            <Route element={<BankPage></BankPage>} path="/bank"></Route>
            <Route
              element={<BankBranchPage></BankBranchPage>}
              path="/bank_branch"
            ></Route>
            <Route
              element={<TypeGoodPage></TypeGoodPage>}
              path="/type_good"
            ></Route>
            <Route
              element={<TypeGoodAttrPage></TypeGoodAttrPage>}
              path="/type_good_attr"
            ></Route>
            <Route
              element={<DiscountPage></DiscountPage>}
              path="/discount"
            ></Route>
            <Route
              element={<ProductPage></ProductPage>}
              path="/product"
            ></Route>
            <Route
              element={<PaymentTypePage></PaymentTypePage>}
              path="/payment_type"
            ></Route>
            <Route
              element={<StoreTransactionPage></StoreTransactionPage>}
              path="/store_transaction"
            ></Route>
            <Route
              element={<BankUserPage></BankUserPage>}
              path="/bank_user"
            ></Route>
            <Route
              element={<UserAccountPage></UserAccountPage>}
              path="/user_account"
            ></Route>
            <Route
              element={<StorePage></StorePage>}
              path="/store"
            ></Route>
          </Route>
          <Route
            element={
              currentUser ? <Navigate to={"/"}></Navigate> : <AppLogin />
            }
          >
            <Route path="/login" element={<LoginPage></LoginPage>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
