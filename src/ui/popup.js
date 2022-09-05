import React, { useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { Box, Center, Popover, ScrollArea, Text } from "@mantine/core";
import { NoMessage, Notification } from "../icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { _URL } from "./../utils";
import { toast, useToasterStore } from "react-hot-toast";
import moment from "moment";

const socket = io("wss://api.insurextest.link", { reconnect: true });
function Popup() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  const { toasts } = useToasterStore();

  React.useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= 1)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  React.useEffect(() => {
    if (user?.auth) {
      socket.on("message-send", (msg) => {
        if (msg.admin_type) {
          console.log(msg);
          if (user.role === "superadmin") {
            setMessages([...messages, msg]);
            setNewMessage(true);
            toast.success("New message received");
          }
          if (
            user.role === "insurance_company" &&
            Number(user.insurance_company.id) ===
              Number(msg.insurance_company_id)
          ) {
            setMessages([...messages, msg]);
            setNewMessage(true);
            toast.success("New message received");
          }
          if (
            user.role === "appraisal_company" &&
            Number(user.appraisal_company.id) ===
              Number(msg.appraisal_company_id)
          ) {
            setMessages([...messages, msg]);
            setNewMessage(true);
            toast.success("New message received");
          }
        }
      });
    }
  }, [user?.auth]);

  React.useEffect(() => {
    if (user?.auth) {
      axios
        .get(`${_URL}/push/messages`, {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                .token
            } `,
          },
        })
        .then(({ data }) => {
          if (user?.role === "superadmin") {
            setMessages(data?.messages?.filter((res) => res.admin_type));
          }
          if (user?.role === "insurance_company") {
            setMessages(
              data?.filter(
                (res) =>
                  Number(res?.insurance_company_id) ===
                    Number(user?.insurance_company?.id) && res?.admin_type
              )
            );
          }
          if (user?.role === "appraisal_company") {
            setMessages(
              data?.filter(
                (res) =>
                  Number(res?.appraisal_company_id) ===
                    Number(user?.appraisal_company?.id) && res?.admin_type
              )
            );
          }
        });
    }
  }, [user?.auth, user?.role]);

  console.log(messages, "-----------------------");

  return (
    <Popover
      onClick={() => setNewMessage(false)}
      className={`${newMessage ? "popup-notification" : ""}`}
      style={{ width: "max-content" }}
      opened={opened}
      onClose={() => setOpened(false)}
      target={
        <Notification
          style={{ cursor: "pointer" }}
          onClick={() => setOpened((o) => !o)}
        />
      }
      position="bottom"
      withArrow
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        {messages?.length > 0 ? (
          <ScrollArea
            style={{
              height: 250,
              width: "max-content",
            }}
            offsetScrollbars
          >
            {!messages?.length && (
              <Box
                sx={(theme) => ({
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[6]
                      : theme.colors.gray[0],
                  textAlign: "center",
                  padding: theme.spacing.sm,
                  borderRadius: theme.radius.md,
                  marginBottom: theme.spacing.sm,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[5]
                        : theme.colors.gray[1],
                  },
                })}
              >
                <Center>
                  <NoMessage />
                  <Text> No message</Text>
                </Center>
              </Box>
            )}

            <div style={{ display: "flex", flexDirection: "column-reverse" }}>
              {messages?.sort(function (a, b) {
                return (
                  moment(b.date_time).format("X") -
                  moment(a.date_time).format("X")
                );
              })?.map((message, i) => (
                <React.Fragment key={message?.id + i}>
                  <Box
                    title={message?.user_type}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (message?.is_create_case) {
                        navigate(`/events`);
                        setOpened(false);
                      }
                      if (message?.user_type === "persons") {
                        navigate(`/persons#${message?.user_id ?? "users"}`);
                        setOpened(false);
                      }
                      if (message?.user_type === "sdp") {
                        navigate(`/sdp`);
                        setOpened(false);
                      }
                      if (message?.user_type === "agent") {
                        navigate(`/agents`);
                        setOpened(false);
                      }
                      if (message?.user_type === "appraiser") {
                        navigate(`/appraisers`);
                        setOpened(false);
                      }
                      if (
                        message?.user_type ===
                        ("appraisal_company" || "event_create")
                      ) {
                        navigate(`/appraiser-company`);
                        setOpened(false);
                      }
                      if (
                        message?.user_type ===
                        ("insurance_company" || "event_create")
                      ) {
                        navigate(`/insurance-company`);
                        setOpened(false);
                      }
                    }}
                    sx={(theme) => ({
                      backgroundColor:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[6]
                          : theme.colors.gray[0],
                      textAlign: "center",
                      padding: theme.spacing.sm,
                      borderRadius: theme.radius.md,
                      marginBottom: theme.spacing.sm,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor:
                          theme.colorScheme === "dark"
                            ? theme.colors.dark[5]
                            : theme.colors.gray[1],
                      },
                    })}
                  >
                    <div>
                      <Text>{message?.user_name}</Text>
                      <Text size="xs" color="dimmed">
                        {message?.user_type}
                      </Text>
                    </div>
                  </Box>
                </React.Fragment>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <Center>
            <NoMessage />
            <Text> No message</Text>
          </Center>
        )}
      </div>
    </Popover>
  );
}
export default Popup;
