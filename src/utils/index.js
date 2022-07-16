import axios from "axios";

export const _URL = "http://3.91.9.208:3002/api";

export const GetRegionName = async (regionId) => {
  if (regionId === false) return false;
  return ".";
};

export const InsuranceCompanyName = (insuranceCompanyId) => {
  axios.get(`${_URL}/insurance-companies/${insuranceCompanyId}`).then((res) => {
    console.log(res?.data?.message?.insurance_company?.title);
    return res?.data?.message?.insurance_company?.title;
  });
};

export const getFormData = (object) => {
  const formData = new FormData();
  Object.keys(object).forEach((key) => formData.append(key, object[key]));
  return formData;
};
