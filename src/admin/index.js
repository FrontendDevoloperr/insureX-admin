import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Navbar,
  Text,
  createStyles,
  AppShell,
  Header,
  LoadingOverlay,
} from "@mantine/core";
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
import {
  getAgentsFC,
  getAppraiserCompFC,
  getAppraiserFC,
  getInsuredCompaniesFC,
  getInsuredPersonFC,
  getSdpFC,
  getEventsAndCasesFC,
  cityFC,
  regionFC,
} from "../utils/request";

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
      link: "/insurance-companies",
      label: "INSURANCE COMPANIES",
      element: <InsuredCompanies />,
    },
    { link: "/agents", label: "AGENTS", element: <Agents /> },
    { link: "/persons", label: "INSURED PERSONS", element: <Persons /> },

    {
      link: "/appraisal-companies",
      label: "APPRAISAL COMPANIES",
      element: <AppraiserCompanies />,
    },
    { link: "/appraisers", label: "APPRAISERS", element: <Appraisers /> },
    { link: "/sdp", label: "SDP", element: <Sdp /> },
    { link: "/events", label: "INSURED EVENTS", element: <InsuredEvent /> },
  ],
  insurance_company: [
    {
      link: "/insurance-companies",
      label: "INSURANCE COMPANIES",
      element: <InsuredCompanies />,
    },
    { link: "/agents", label: "AGENTS", element: <Agents /> },
    { link: "/persons", label: "INSURED PERSONS", element: <Persons /> },

    {
      link: "/appraisal-companies",
      label: "APPRAISAL COMPANIES",
      element: <AppraiserCompanies />,
    },
    { link: "/appraisers", label: "APPRAISERS", element: <Appraisers /> },
    { link: "/sdp", label: "SDP", element: <Sdp /> },
    { link: "/events", label: "INSURED EVENTS", element: <InsuredEvent /> },
  ],
  appraisal_company: [
    {
      link: "/appraisal-companies",
      label: "APPRAISAL COMPANIES",
      element: <AppraiserCompanies />,
    },
    { link: "/appraisers", label: "APPRAISERS", element: <Appraisers /> },
    { link: "/events", label: "INSURED EVENTS", element: <InsuredEvent /> },
  ],
};

export default function AdminPanel() {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);
  const loading = useSelector(({ loading }) => loading);
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
    window.location.reload();
  }

  React.useInsertionEffect(() => {
    getInsuredCompaniesFC(dispatch, user, location.pathname);

    getAgentsFC(dispatch, user, location.pathname);
    getInsuredPersonFC(dispatch, user, location.pathname);
    getSdpFC(dispatch, location.pathname);
    getAppraiserFC(dispatch, user, location.pathname);
    getAppraiserCompFC(dispatch, location.pathname);
    getEventsAndCasesFC(dispatch, user, location.pathname);
    console.clear();
    console.log("new version GMT +5 19:00 08/11/2022/year");
  }, [location.pathname, dispatch, user]);

  React.useInsertionEffect(() => {
    cityFC(dispatch);
    regionFC(dispatch);
  }, []);

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
      <LoadingOverlay visible={loading} />
      <Routes>{RootRoutes}</Routes>
    </AppShell>
  );
}
