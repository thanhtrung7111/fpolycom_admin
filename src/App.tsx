import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "@/page/home/HomePage";
import AppCommon from "./template/AppCommon";
import ProductPage from "./page/product/ProductPage";
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

function App() {
  const { currentUser, tokenInitial, setTokenInitial } = useUserStore();
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
