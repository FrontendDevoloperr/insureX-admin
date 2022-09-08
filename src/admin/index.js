import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navbar, Text, createStyles, AppShell, Header } from "@mantine/core";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import Persons from "./persons";
import Agents from "./agents";
import AppraiserCompanies from "./appraiserCompanies";
import InsuredCompanies from "./insuranceCompanies";
import Appraisers from "./appraisers";
import Sdp from "./sdp";
import InsuredEvent from "./insuredEvents";
import "./index.css";
import { LogoutIcon } from "../icons";
import Logo from "../icons/logo.svg";
import Popup from "../ui/popup";
import { logout } from "../redux/reducer";
import { getInsuredCompanies } from "../redux/reducer/insuredCompanies";
import { getCity } from "../redux/reducer/city";
import { getRegion } from "../redux/reducer/region";
import { getAgents } from "../redux/reducer/agents";
import { getSdp } from "../redux/reducer/sdp";
import { setEvents } from "../redux/reducer/events";
import { setCases } from "../redux/reducer/cases";
import { getPersons } from "../redux/reducer/insuredPerson";
import axios from "axios";
import { _URL } from "../utils";
import { getAppraiser } from "../redux/reducer/appraiser";
import { getAppraiserCompanies } from "../redux/reducer/appraiserComp";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");

  return {
    navbar: {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    },

    title: {
      textTransform: "uppercase",
      letterSpacing: -0.25,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
            : theme.colors[theme.primaryColor][0],
        color:
          theme.colors[theme.primaryColor][
            theme.colorScheme === "dark" ? 4 : 7
          ],
        [`& .${icon}`]: {
          color:
            theme.colors[theme.primaryColor][
              theme.colorScheme === "dark" ? 4 : 7
            ],
        },
      },
    },

    footer: {
      borderTop: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
      paddingTop: theme.spacing.md,
    },
  };
});

const tabs = {
  superadmin: [
    {
      link: "/insurance-company",
      label: "INSURANCE COMPANIES",
      element: <InsuredCompanies />,
    },
    { link: "/agents", label: "AGENTS", element: <Agents /> },
    { link: "/persons", label: "INSURED PERSONS", element: <Persons /> },

    {
      link: "/appraiser-company",
      label: "APPRAISER COMPANIES",
      element: <AppraiserCompanies />,
    },
    { link: "/appraisers", label: "APPRAISERS", element: <Appraisers /> },
    { link: "/sdp", label: "SDP", element: <Sdp /> },
    { link: "/events", label: "INSURED EVENTS", element: <InsuredEvent /> },
  ],
  insurance_company: [
    {
      link: "/insurance-company",
      label: "INSURANCE COMPANIES",
      element: <InsuredCompanies />,
    },
    { link: "/agents", label: "AGENTS", element: <Agents /> },
    { link: "/persons", label: "INSURED PERSONS", element: <Persons /> },

    {
      link: "/appraiser-company",
      label: "APPRAISER COMPANIES",
      element: <AppraiserCompanies />,
    },
    { link: "/appraisers", label: "APPRAISERS", element: <Appraisers /> },
    { link: "/sdp", label: "SDP", element: <Sdp /> },
    { link: "/events", label: "INSURED EVENTS", element: <InsuredEvent /> },
  ],
  appraisal_company: [
    {
      link: "/appraiser-company",
      label: "APPRAISER COMPANIES",
      element: <AppraiserCompanies />,
    },
    { link: "/appraisers", label: "APPRAISERS", element: <Appraisers /> },
    // { link: "/persons", label: "INSURED PERSONS", element: <Persons /> },
    { link: "/events", label: "INSURED EVENTS", element: <InsuredEvent /> },
  ],
};

export const getSdpFC = (dispatch) => {
  axios
    .get(`${_URL}/sdp`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
        } `,
      },
    })
    .then(({ data }) => {
      dispatch(getSdp(data?.message?.sdp?.filter((item) => !item?.delete)));
    });
};

export const getInsuredPersonFC = (dispatch) => {
  axios
    .get(`${_URL}/insured-persons`)
    .then(({ data }) => {
      dispatch(
        getPersons(
          data?.message?.insured_persons?.filter((item) => !item?.delete)
        )
      );
    })
    .catch((err) => {});
};

export default function AdminPanel() {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);
  const { classes, cx } = useStyles();
  const links = tabs[user?.role].map((item) => (
    <NavLink className={cx(classes.link)} to={item.link} key={item.label}>
      <span>{item.label}</span>
    </NavLink>
  ));

  const RootRoutes = tabs[user?.role].map((item, i) => (
    <Route key={i} path={item?.link} element={item?.element} />
  ));

  function Logout() {
    dispatch(logout());
    localStorage.removeItem("admin-panel-token-insure-x");
  }

  const getInsuredCompaniesFC = () => {
    axios
      .get(`${_URL}/insurance-companies`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
          } `,
        },
      })
      .then(({ data }) => {
        dispatch(
          getInsuredCompanies(
            data?.message?.insurance_companies?.filter((item) => !item?.delete)
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const cityFC = () => {
    axios
      .get(`${_URL}/city`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
          } `,
        },
      })
      .then(({ data }) => {
        dispatch(getCity(data?.message?.cities));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const regionFC = () => {
    axios
      .get(`${_URL}/regions`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
          } `,
        },
      })
      .then(({ data }) => {
        dispatch(getRegion(data?.message?.regions));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const agentsFC = () => {
    axios
      .get(`${_URL}/agents/select`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
          } `,
        },
      })
      .then(({ data }) => {
        dispatch(
          getAgents(data?.message?.agents?.filter((item) => !item?.delete))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getEventsAndCasesFC = async () => {
    await axios.get(`${_URL}/insurance-case`).then(({ data }) => {
      dispatch(setCases(data?.message?.insurance_cases));
      axios
        .get(
          `${_URL}/insured-events${
            user.role === "insurance_company"
              ? `?insurance_company_id=${user.insurance_company.id}`
              : user.role === "appraisal_company"
              ? `?appraisal_company_id=${user.appraisal_company.id}`
              : user.role === "superadmin" && ""
          }`
        )
        .then(({ data }) => {
          dispatch(setEvents(data?.message?.insured_events));
        });
    });
  };

  const getAppraiserFC = () => {
    axios
      .get(`${_URL}/appraisers`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
          } `,
        },
      })
      .then(({ data }) => {
        dispatch(
          getAppraiser(
            data?.message?.appraisers?.filter((item) => !item?.delete)
          )
        );
      });
  };

  const getAppraiserCompFC = () => {
    axios.get(`${_URL}/appraisal-companies`).then(({ data }) => {
      dispatch(
        getAppraiserCompanies(
          data?.message?.appraisal_companies?.filter((item) => !item?.delete)
        )
      );
      console.log(
        data?.message?.appraisal_companies?.filter((item) => !item?.delete),
        "data?.message?.appraisal_companies?.filter((item) => !item?.delete)"
      );
    });
  };

  React.useEffect(() => {
    getInsuredCompaniesFC();
    cityFC();
    regionFC();
    agentsFC();
    getInsuredPersonFC(dispatch);
    getSdpFC(dispatch);
    getAppraiserFC();
    getAppraiserCompFC();
    getEventsAndCasesFC();
  }, [location.pathname]);

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          height={"calc(100vh - 75px)"}
          width={{ sm: 300 }}
          p="md"
          className={classes.navbar}
        >
          <Navbar.Section>
            <Text
              weight={600}
              size="sm"
              className={classes.title}
              color="dimmed"
              mb="xs"
              style={{ marginBottom: "-10px", padding: " 0 10px" }}
            >
              InsureX Admin Panel <br /> this : {user.role}
            </Text>
          </Navbar.Section>
          <Navbar.Section mt="xl">{links}</Navbar.Section>
        </Navbar>
      }
      header={
        <Header className="header" height={60} p="xs">
          <div className="header_logo">
            <img src={Logo} alt="..." />
          </div>
          <div className="header_icons">
            <div className="header_notification">
              <Popup />
              <p>Notifications</p>
            </div>
            <div
              title="Logout"
              className="header_logout"
              onClick={() => {
                Logout();
              }}
            >
              <LogoutIcon />
            </div>
          </div>
        </Header>
      }
    >
      <Routes>{RootRoutes}</Routes>
    </AppShell>
  );
}
