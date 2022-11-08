import axios from "axios";
import { getInsuredCompanies } from "../redux/reducer/insuredCompanies";
import { getAgents } from "../redux/reducer/agents";
import { getSdp } from "../redux/reducer/sdp";
import { setEvents } from "../redux/reducer/events";
import { setCases } from "../redux/reducer/cases";
import { getPersons } from "../redux/reducer/insuredPerson";
import { _URL } from "./index";
import { getAppraiser } from "../redux/reducer/appraiser";
import { getAppraiserCompanies } from "../redux/reducer/appraiserComp";
import { getCity } from "../redux/reducer/city";
import { getRegion } from "../redux/reducer/region";
import { setLoader } from "../redux/reducer/loading";

export const getInsuredCompaniesFC = (dispatch, user, pathname) => {
  const isCompany =
    user?.role === "insurance_company" && pathname === "/insurance-companies";
  if (
    [
      "/insurance-companies",
      "/agents",
      "/persons",
      "/appraisal-companies",
      "/appraisers",
      "/sdp",
      "/events",
    ].includes(pathname)
  ) {
    dispatch(setLoader(true));
    axios
      .get(
        `${_URL}/insurance-companies${
          isCompany ? `/${user?.insurance_company?.id}` : "?delete=false"
        }`
      )
      .then(({ data }) => {
        dispatch(
          getInsuredCompanies(
            isCompany
              ? [data?.message?.insurance_company]?.filter((res) => !res.delete)
              : data?.message?.insurance_companies?.filter((res) => !res.delete)
          )
        );
      })
      .catch(() => console.clear())
      .finally(() => dispatch(setLoader(false)));
  }
};

export const getAgentsFC = (dispatch, user, pathname) => {
  const isCompany = user?.role === "insurance_company";
  if (["/agents", "/persons", "/events"].includes(pathname)) {
    dispatch(setLoader(true));
    axios
      .get(
        `${_URL}/agents/select${
          isCompany
            ? `?insurance_company_id=${user?.insurance_company?.id}`
            : "?delete=false"
        }`
      )
      .then(({ data }) => {
        dispatch(
          getAgents(data?.message?.agents?.filter((res) => !res.delete))
        );
      })
      .catch(() => console.clear())
      .finally(() => dispatch(setLoader(false)));
  }
};

export const getInsuredPersonFC = (dispatch, user, pathname) => {
  const isCompany = user?.role === "insurance_company";
  if (["/persons", "/events"].includes(pathname)) {
    dispatch(setLoader(true));
    axios
      .get(
        `${_URL}/insured-persons${
          isCompany
            ? `?insurance_company_persons_id=${user.insurance_company?.id}`
            : "?delete=false"
        }`
      )
      .then(({ data }) => {
        dispatch(getPersons(data?.message?.insured_persons));
      })
      .catch((err) => console.clear())
      .finally(() => dispatch(setLoader(false)));
  }
};

export const getAppraiserCompFC = (dispatch, pathname) => {
  if (["/appraisal-companies", "/appraisers", "/events"].includes(pathname)) {
    dispatch(setLoader(true));
    axios
      .get(`${_URL}/appraisal-companies?delete=false`)
      .then(({ data }) => {
        dispatch(getAppraiserCompanies(data?.message?.appraisal_companies));
      })
      .catch(() => console.clear())
      .finally(() => dispatch(setLoader(false)));
  }
};

export const getAppraiserFC = (dispatch, user, pathname) => {
  const isAppraiserComp = user?.role === "appraisal_company";
  if (["/appraisers", "/events"].includes(pathname)) {
    dispatch(setLoader(true));
    axios
      .get(`${_URL}/appraisers?delete=false`)
      .then(({ data }) => {
        dispatch(
          getAppraiser(
            data?.message?.appraisers?.filter((item) =>
              isAppraiserComp
                ? item?.appraisers_company_id?.includes(
                    user?.appraisal_company?.id
                  )
                : true
            )
          )
        );
      })
      .catch(() => console.clear())
      .finally(() => dispatch(setLoader(false)));
  }
};

export const getSdpFC = (dispatch, pathname) => {
  if (["/sdp", "/events"].includes(pathname)) {
    dispatch(setLoader(true));
    axios
      .get(`${_URL}/sdp?delete=false`)
      .then(({ data }) => {
        dispatch(getSdp(data?.message?.sdp));
      })
      .catch(() => console.clear())
      .finally(() => dispatch(setLoader(false)));
  }
};

export const getEventsAndCasesFC = async (dispatch, user, pathname) => {
  if (["/events"].includes(pathname)) {
    dispatch(setLoader(true));
    await axios.get(`${_URL}/insurance-case?delete=false`).then(({ data }) => {
      dispatch(setCases(data?.message?.insurance_cases));
      axios
        .get(
          `${_URL}/insured-events?delete=false${
            user?.role === "insurance_company"
              ? `&insurance_company_id=${user?.insurance_company?.id}`
              : user?.role === "appraisal_company"
              ? `&appraisal_company_id=${user?.appraisal_company?.id}`
              : user?.role === "superadmin" && ""
          }`
        )
        .then(({ data }) => {
          dispatch(setEvents(data?.message?.insured_events));
        })
        .catch(() => console.clear())
        .finally(() => dispatch(setLoader(false)));
    });
  }
};

export const cityFC = (dispatch) => {
  axios
    .get(`${_URL}/city`)
    .then(({ data }) => {
      dispatch(getCity(data?.message?.cities));
    })
    .catch(() => console.clear())
    .finally(() => dispatch(setLoader(false)));
};

export const regionFC = (dispatch) => {
  axios
    .get(`${_URL}/regions`)
    .then(({ data }) => {
      dispatch(getRegion(data?.message?.regions));
    })
    .catch(() => console.clear())
    .finally(() => dispatch(setLoader(false)));
};
