import axios from "axios";
import { useUserStore } from "@/store/userStore";
import moment from "moment";
import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const uploadImage = async (file: File, url: string) => {
  if (!file) return;

  // Tạo một reference trong Firebase Storage
  const storageRef = ref(storage, `${url}/${file.name}`);

  // Upload file lên Firebase Storage
  try {
    const snapshot = await uploadBytes(storageRef, file);

    // Lấy URL tải xuống của file sau khi upload
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("File uploaded and available at:", downloadURL);
    return downloadURL; // URL của hình ảnh để bạn có thể sử dụng
  } catch (error) {
    console.error("Upload failed", error);
    throw error;
  }
};

/// Code
export const fetchData = async (enpoint: string) => {
  const response = await axios.get(import.meta.env.VITE_API_URL + enpoint, {
    headers: {
      Authorization: "Bearer " + useUserStore.getState().currentUser?.token,
    },
  });
  if (response.status != 200) {
    throw new Error("Failed to fetch data");
  }
  // Nếu dữ liệu trả về là undefined hoặc null, ném lỗi
  if (!(response.data?.code == "00")) {
    throw new Error("No data found");
  }
  return response.data?.data;
};

/// Code
export const postData = async (
  body: { [key: string]: any },
  enpoint: string
) => {
  const response = await axios.post(
    import.meta.env.VITE_API_URL + enpoint,
    body,
    {
      headers: {
        Authorization: "Bearer " + useUserStore.getState().currentUser?.token,
      },
    }
  );
  if (response.status != 200) {
    throw new Error("Thêm dữ liệu thất bại!");
  }
  // Nếu dữ liệu trả về là undefined hoặc null, ném lỗi
  if (!(response.data?.code == "00")) {
    throw new Error("No data found");
  }
  return response.data?.data;
};
