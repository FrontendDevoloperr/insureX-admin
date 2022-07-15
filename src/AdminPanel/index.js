import React, { useState } from "react";
import { Navbar, Text, createStyles, AppShell, Table } from "@mantine/core";
import { Link } from "react-router-dom";
import axios from "axios";

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
  account: [
    { link: "/persons", label: "INSURED PERSONS", icon: null },
    { link: "/agents", label: "AGENTS", icon: null },
    { link: "/appraiser-company", label: "Appraisal companies", icon: null },
    { link: "/appraisers", label: "Appraisers", icon: null },
    { link: "/sdp", label: "SDP", icon: null },
    { link: "/events", label: "Insured events", icon: null },
  ],
  general: [
    { link: "", label: "Orders", icon: null },
    { link: "", label: "Receipts", icon: null },
    { link: "", label: "Reviews", icon: null },
    { link: "", label: "Messages", icon: null },
    { link: "", label: "Customers", icon: null },
    { link: "", label: "Refunds", icon: null },
    { link: "", label: "Files", icon: null },
  ],
};
const elements = [
  { position: 6, mass: 12.011, symbol: "C", name: "Carbon" },
  { position: 7, mass: 14.007, symbol: "N", name: "Nitrogen" },
  { position: 39, mass: 88.906, symbol: "Y", name: "Yttrium" },
  { position: 56, mass: 137.33, symbol: "Ba", name: "Barium" },
  { position: 58, mass: 140.12, symbol: "Ce", name: "Cerium" },
];
const ths = (
  <tr>
    <th>Element position</th>
    <th>Element name</th>
    <th>Symbol</th>
    <th>Atomic mass</th>
  </tr>
);

export default function AdminPanel() {
  const { classes, cx } = useStyles();
  const [section, setSection] = useState("account");
  const [active, setActive] = useState("Billing");
  const [insured, setInsuredPerson] = useState([]);

  React.useEffect(() => {
    axios.get("http://3.91.9.208:3002/api/insured-persons").then((res) => {
      setInsuredPerson(res?.data?.message?.insured_persons);
    });
  }, []);

  console.log(insured, "insured");
  const links = tabs[section].map((item) => (
    <Link
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      to={item.link}
      key={item.label}
      onClick={(event) => {
        setActive(item.label);
      }}
    >
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar
          height={"100vh"}
          width={{ sm: 300 }}
          p="md"
          className={classes.navbar}
        >
          <Navbar.Section>
            <Text
              weight={500}
              size="sm"
              className={classes.title}
              color="dimmed"
              mb="xs"
            >
              InsureX Admin Panel
            </Text>
          </Navbar.Section>
          <Navbar.Section mt="xl">{links}</Navbar.Section>
        </Navbar>
      }
      aside={
        <Table highlightOnHover verticalSpacing="xs" fontSize="xs">
          <thead>{ths}</thead>
          <tbody>
            {insured.map((element) => {
              <tr key={element.id}>
                <td>{element?.address}</td>
                <td>{element?.agent_id}</td>
                <td>{element?.city_id}</td>
                <td>{element?.email}..</td>
                <td>{element?.first_name}</td>
                <td>{element?.second_name}</td>
                <td>{element?.id}</td>
                <td>{element?.login_id}</td>
                <td>{element?.phone}</td>
                <td>{element?.region_id}</td>
                <td>{element?.sign_picture}</td>
                <td>{element?.user_id}</td>
              </tr>;
            })}
          </tbody>
        </Table>
      }
    ></AppShell>
  );
}
