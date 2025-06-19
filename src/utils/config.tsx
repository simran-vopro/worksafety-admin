// export const BASE_URL = "https://work-safety-backend.onrender.com";
// export const IMAGE_URL = "https://work-safety-backend.onrender.com/static";

export const BASE_URL = "http://localhost:3000";
export const IMAGE_URL = "http://localhost:3000/static";


export const API_PATHS = {
  LOGIN: `${BASE_URL}/api/auth/login`,

  CATEGORIES: `${BASE_URL}/api/categories/nested-categories`,
  PRODUCTS: `${BASE_URL}/api/products`,
  GET_PRODUCTS: `${BASE_URL}/api/get-product`,

  TOP_BANNERS: `${BASE_URL}/api/banner`,
  GET_FLOATING_BANNER: `${BASE_URL}/api/banner/getFloatingBanner`,

  TOP_CATEGORIES: `${BASE_URL}/api/categories/top-categories`,
  GET_BRANDS: `${BASE_URL}/api/categories/brands`,

  PLACE_ORDER: `${BASE_URL}/api/order/request-quote`,
  GET_ALL_ORDERS: `${BASE_URL}/api/order/get-all-orders`,
  GET_ORDER: `${BASE_URL}/api/order/get-order`,
  EDIT_ORDER: `${BASE_URL}/api/order/edit-order`,
  SEND_INVOICE : `${BASE_URL}/api/order/send-invoice`,

  GET_QUERIES: `${BASE_URL}/api/query/all-user-query`,

  UPLOAD_PRODUCTS_CSV : `${BASE_URL}/api/products/upload-csv`,
  
};

