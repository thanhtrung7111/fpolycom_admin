export type MenuItemObject = {
  [key: string]: any;
};

export type BreadcrumbItemObject = {
  [key: string]: any;
};

export type LoginObject = {
  APP_CODE: string;
  USERLGIN: string;
  PASSWORD: string;
  LGINTYPE: string;
  SYSTCHAR: string;
  INPTCHAR: string;
  PHONNAME: string;
  TKENDEVC: string;
};

export type LoginLocationObject = {
  COMPCODE: string;
  LCTNCODE: string;
};

export type LctnCodeObject = {
  LCTNCODE: string;
  LCTNNAME: string;
};

export type CompcodeObject = {
  COMPCODE: string;
  COMPNAME: string;
  IMGELIST: string[];
  LCTNLIST: LctnCodeObject[];
};

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export type CommonObject = {
  [key: string]: any;
};

export type SearchObjectProduct = {
  key: string;
  name: string;
  type: "text" | "combobox";
  dataList?: CommonObject[];
  dataKey?: keyof CommonObject;
  dataName?: keyof CommonObject;
};

export type CategoryObject = {
  ITEMATTR: string;
  ITEMCODE: string;
  ITEMNAME: string;
  ITEMODER: string;
  ITEMSRCH: string;
  ITEMTREE: string;
  ITEM_KEY: string;
  KEY_CODE: string;
  LISTCODE: string;
};

export type DataExcelPatternObject = {
  header: string;
  id: string;
  type: "list" | "single";
  dataKey?: string;
  dataName?: string;
  dataDemo?: string | number;
  data?: any[];
};

export type DataExcelObject = {
  header: string;
  id: string;
};

export type AdvertisementObject = {
  COMPCODE: string;
  LCTNCODE: string;
  BANRCODE: string;
  BANRNAME: string;
  BANRTYPE: string;
  OBJCTYPE: string;
  OBJCCODE: string;
  BANR_RUN: number;
  DDDD: string;
  ACCERGHT: number;
  STTESIGN: number;
  STTENAME: string;
  KKKK0000: string;
  DCMNFILE: { [key: string]: any }[];
};

export type AdvertisementUpdateObject = {
  KKKK0000: string;
  COMPCODE: string;
  LCTNCODE: string;
  BANRCODE: string;
  BANRNAME: string;
  BANRTYPE: string;
  OBJCCODE: string;
  OBJCTYPE: string;
  BANR_RUN: number;
  IMAGE_BANR: string;
};

export type ProvinceObject = {
  name: string | null;
  provinceCode: string | null;
  numberOfDistricts: number | null;
};

export type DistrictObject = {
  name: string | undefined;
  districtCode: string | undefined;
  provinceCode: string | undefined;
  numberOfWards?: number | undefined;
};

export type WardObject = {
  wardCode: string | undefined;
  name: string | undefined;
  districtCode: string | undefined;
};

export type BankObject = {
  name: string | undefined;
  shortName: string | undefined;
  bankCode?: string | undefined;
  description: string | undefined;
  image: string | undefined;
  numberOfBankBranch?: number | undefined;
};

export type BankBranckObject = {
  bankBranchCode: string | undefined;
  name: string | undefined;
  bankCode: string | undefined;
};

export type TypeGoodObject = {
  name?: string | undefined | null;
  image?: string | undefined | null;
  typeGoodCode?: string | undefined | null;
  numberOfProduct?: number | undefined;
  numberOfAttr?: number | undefined;
};

export type BankUserObject = {
  userLogin?: string | undefined | null;
  bankUserCode?: number | undefined | null;
  accountNumber?: string | undefined | null;
  accountName?: string | undefined | null;
  bankName?: string | undefined | null;
  bankCode?: number | undefined | null;
  bankBranchCode?: number | undefined | null;
  bankBranchName?: string | undefined | null;
  bankImage?: string | undefined | null;
  bankStatus?: string | undefined | null;
};

export type TypeGoodAttrObject = {
  name?: string | undefined | null;
  typeGoodCode?: string | undefined | null;
  typeGoodAttrCode?: string | undefined | null;
  numberOfProductAttr?: number | undefined | null;
};

export type DiscountObject = {
  discountCode?: string | undefined | null;
  name?: string | undefined | null;
  description?: string | undefined | null;
  beginDate?: string | undefined | null;
  percentDecrease?: number | undefined | null;
  numberOfOrderDetail?: number | undefined | null;
  numberOfProductDetail?: number | undefined | null;
};

export type PaymentTypeObject = {
  paymentTypeCode?: string | undefined | null;
  name?: string | undefined | null;
  image?: string | undefined;
};

export type StoreTransactonObject = {
  totalAmount?: number | undefined | null;
  storeCode?: number | undefined | null;
  storeName?: string | undefined | null;
  storeTransactionCode?: number | undefined | null;
  content?: string | undefined | null;
  bankBranchName?: string | undefined | null;
  bankName?: string | undefined | null;
  bankStoreCode?: string | undefined | null;
  transactionStatus?: string | undefined | null;
  bankAccountName?: string | undefined | null;
  bankAccountNumber?: string | undefined | null;
  typeTransaction?: string | undefined | null;
};

export type ProductObject = {
  productCode?: number | undefined | null;
  name?: string | undefined | null;
  image?: string | undefined | null;
  status?: string | undefined | null;
  typeGoodName?: string | undefined | null;
  typeGoodCode?: string | undefined | null;
  numberOfLikes?: number | undefined | null;
  numberOfEvaluates?: number | undefined | null;
  pointEvaluate?: number | undefined | null;
  minPrice?: number | undefined | null;
  maxPrice?: number | undefined | null;
};

export type UserAccountObject = {
  userAccountID?: string | undefined | null;
  name?: string | undefined | null;
  phone?: string | undefined | null;
  addressDetail?: string | undefined | null;
  address?: string | undefined | null;
  image?: string | undefined | null;
  bannerImage?: string | undefined | null;
  email?: string | undefined | null;
  userStatus?: string | undefined | null;
  dateOfBirth?: string | undefined | null;
  gender?: string | undefined | null;
  provinceName?: string | undefined | null;
  districtName?: string | undefined | null;
  wardName?: string | undefined | null;
  userLogin?: string | undefined | null;
};

export type StoreListObject = {
  storeCode?: string;
  image?: string;
  name?: string;
  addressDetail?: string;
  address?: string;
  phone?: string;
  status?: string;
  bannerImage?: string;
  email?: string;
  userRegister?: string;
  provinceName?: string;
  districtName?: string;
  wardName?: string;
  numberOfFollowed?: string;
  numberOfLiked?: string;
};

export type StoreDetailObject = {
  storeRegisterCode?: string;
  image?: string;
  name?: string;
  addressDetail?: string;
  address?: string;
  status?: string;
  phone?: string;
  bannerImage?: string;
  email?: string;
  userRegister?: string;
  provinceCode?: number;
  districtCode?: number;
  provinceName?: string;
  districtName?: string;
  wardName?: string;
  wardCode?: number;
  documentList?:
    | {
        documentUrl?: string;
        documentType?: string;
        documentCode?: number;
      }[]
    | [];
};

export type UserAccountListObject = {
  userAccountID?: string;
  name?: string;
  phone?: string;
  addressDetail?: string;
  userLogin?: string;
  address?: string;
  image?: string;
  bannerImage?: string;
  email?: string;
  userStatus?: string;
  dateOfBirth?: string;
  gender?: string;
  provinceName?: string;
  districtName?: string;
  wardName?: string;
};

export type ProductDetailObject = {
  productCode?: string;
  name?: string;
  description?: string;
  shortDescription?: string;
  image?: string;
  status?: string;
  typeGoodName?: string;
  typeGoodCode?: string;
  numberOfLikes?: number;
  numberOfEvaluates?: number;
  pointEvaluate?: number;
  minPrice?: number;
  maxPrice?: number;
  liked?: string;
  storeCode?: string;
  storeName?: string;
  productDetailList?: {
    productDetailCod?: string;
    name?: string;
    price?: number;
    image?: string;
    quantity?: number;
    discountCode?: string;
    percentDecrease?: string;
  }[];
  productAttrList: {
    attrValue?: string;
    typeGoodAttrCode?: string;
    typeGoodAttrName?: string;
    productCode?: string;
    productAttrCode?: string;
  }[];
};

export type ReceiveOrderObject = {
  receiveDeliveryCode?: number;
  image?: string;
  deliveryDate?: string;
  typeDelivery?: string;
  statusDelivery?: string;
  shipperCode?: number;
  shipperName?: string;
  ordersCode?: number;
  isWarehouse?: boolean;
  paymentSuccess?: boolean;
  typePayment?: string;
  warehouse?: ImportOrderObject[];
};
export type ImportOrderObject = {
  warehouseAddressDetail?: string;
  warehouseCode?: number;
  ordersCode?: number;
  typeImportExportOrders?: number;
  date?: string;
};

export type OrderInfoObject = {
  orderStatus?: string;
  orderCode?: string;
  totalAmount?: number;
  totalAmountVoucher?: number;
  totalAmountShip?: number;
  totalAmountDiscount?: number;
  provinceStoreCode?: string;
  paymentSuccess?: boolean;
  confirmOrder?: boolean;
  confirmPrepare?: boolean;
  orderDate?: string;
  confirmDelivery?: boolean;
  confirmPickup?: boolean;
  finalTotal?: number;
  orderBillCode?: string;
  noteContent?: string;
  addressDetail?: string;
  address?: string;
  shippingFeeCode?: number;
  storeCode?: number;
  storeName?: string;
  paymentTypeCode?: number;
  provinceCode?: number;
  districtCode?: number;
  wardCode?: number;
  deliveryTypeCode?: number;
  orderDetailList: OrderDetailObject[];
  voucherList?: VoucherObject[];
  receiveDeliveryList?: ReceiveDeliveryObject[];
};

export type OrderObject = {
  userLogin?: string;
  totalAmount?: number;
  totalAmountVoucher?: number;
  totalAmountShip?: number;
  totalAmountDiscount?: number;
  provinceStoreCode?: string;
  finalTotal?: number;
  orderBillCode?: string;
  noteContent?: string;
  addressDetail?: string;
  address?: string;
  shippingFeeCode?: number;
  storeCode?: number;
  storeName?: string;
  paymentTypeCode?: number;
  provinceCode?: number;
  districtCode?: number;
  wardCode?: number;
  deliveryTypeCode?: number;
  orderDetailList: OrderDetailObject[];
  voucherList?: VoucherObject[];
};
export type ReceiveDeliveryObject = {
  receiveDeliveryCode?: number;
  image?: string;
  deliveryDate?: string;
  typeDelivery?: string;
  statusDelivery?: string;
  shipperCode?: number;
  shipperName?: string;
  ordersCode?: number;
};

export type OrderDetailObject = {
  totalAmount: number;
  totalDiscount: number;
  checked: boolean;
  finalTotal: number;
  quantity: number;
  productDetailCode: number;
  discountCode: number;
  productDetailPrice: number;
  percentDecrease: number;
  image: string;
  productName: string;
  productDetailName: string;
  price: number;
};

export type VoucherObject = {
  storeCode: number | null | undefined;
  voucherCode?: number | null | undefined;
  amount: number | null | undefined;
  name: string | null | undefined;
  priceApply: number | null | undefined;
  percentDecrease: number | null | undefined;
  voucherType: string | null | undefined;
  beginDate: string | null | undefined;
  endDate: string | null | undefined;
};

export type OrderListObject = {
  orderCode: string;
  storeName: string;
  storeImage: string;
  orderStatus: string;
  confirmOrder: boolean;
  confirmDelivery: boolean;
  confirmPickup: boolean;
  pickupDate: string;
  deliveryDate: string;
  totalAmount: number;
  paymentTypeName: string;
  totalAmountVoucher: number;
  totalAmountShip: number;
  finalTotal: number;
  deliveryType: string;
  paymentSuccess: boolean;
};
