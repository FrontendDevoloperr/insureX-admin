import axios from "axios";

export const _URL = "http://3.91.9.208:3002/api";

export const GetRegionName = (regionId) => {
  axios.get(`${_URL}/insurance-companies/${regionId}`).then((res) => {
    // console.log(res.data.message);
    return res?.data?.message?.insurance_company.title;
  });
};
