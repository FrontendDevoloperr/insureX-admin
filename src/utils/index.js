import axios from "axios";

export const _URL = "http://3.91.9.208:3002/api";

export const GetRegionName = async (regionId) => {
  if (regionId === false) return false;
  return ".";
};

export const InsuredPerson = async (insuredPersonId) => {
  return axios.get(`${_URL}/insured_person/${insuredPersonId}`).then((res) => {
    return res?.data?.message?.insured_person;
  });
};

export const getFormData = (object) => {
  const formData = new FormData();
  Object.keys(object).forEach((key) => formData.append(key, object[key]));
  return formData;
};
