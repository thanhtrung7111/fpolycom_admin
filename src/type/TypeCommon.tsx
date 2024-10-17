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

export type ProductObject = {
  ACCERGHT: number;
  COMPCODE: string;
  CURRCODE: string;
  CUSTCODE: string;
  CUSTNAME: string;
  DDDD: string;
  DSCNAMNT: number;
  DSCNRATE: number;
  EXCHQTTY: number;
  JSTFDATE: string;
  KKKK0000: string;
  PRCEDSCN: number;
  PRCESALE: number;
  PRDCBRIF: number;
  PRDCCODE: number;
  PRDCDESC: string;
  PRDCIMGE: string;
  PRDCNAME: string;
  QUOMCODE: number;
  QUOMNAME: string;
  SHOPCODE: string;
  SHOPNAME: string;
  STTEICON: number;
  STTENAME: string;
  STTESIGN: number;
  [key: string]: any;
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
