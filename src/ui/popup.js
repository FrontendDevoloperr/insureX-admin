import React, { useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { Box, Center, Popover, ScrollArea, Text } from "@mantine/core";
import { NoMessage, Notification } from "../icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { _URL } from "./../utils";
import { toast, useToasterStore } from "react-hot-toast";

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
        console.log(msg);
        if (user.role === "superadmin") {
          setNewMessage(true);
        }
        if (
          user.role === "insurance_company" &&
          Number(user.insurance_company.id) === Number(msg.insurance_company_id)
        ) {
          setNewMessage(true);
          toast.success("New message received");
        }
        if (
          user.role === "appraisal_company" &&
          Number(user.appraisal_company.id) === Number(msg.appraisal_company_id)
        ) {
          setNewMessage(true);
          toast.success("New message received");
        }
        axios
          .get(`${_URL}/push/messages`, {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                  .token
              } `,
            },
          })
          .then((res) => {
            setMessages(
              res?.data?.messages?.filter((__message) =>
                user.role === "superadmin"
                  ? __message?.role ||
                    __message?.ie_number ||
                    __message?.oao_ie_number
                  : user.role === "insurance_company"
                  ? __message?.ie_number ||
                    Number(__message?.insurance_company_id) ===
                      Number(user.insurance_company.id)
                  : user.role === "appraisal_company"
                  ? __message?.oao_ie_number ||
                    Number(__message?.appraisal_company_id) ===
                      Number(user.appraisal_company.id)
                  : false
              )
            );
          });
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
        .then((res) => {
          setMessages(
            res?.data?.messages?.filter((__message) =>
              user.role === "superadmin"
                ? __message?.role ||
                  __message?.ie_number ||
                  __message?.oao_ie_number
                : user.role === "insurance_company"
                ? __message?.ie_number ||
                  Number(__message?.insurance_company_id) ===
                    Number(user.insurance_company.id)
                : user.role === "appraisal_company"
                ? __message?.oao_ie_number ||
                  Number(__message?.appraisal_company_id) ===
                    Number(user.appraisal_company.id)
                : false
            )
          );
        });
    }
  }, [user?.auth]);

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

            {console.log(messages, "messages")}

            <div style={{ display: "flex", flexDirection: "column-reverse" }}>
              {messages?.map((message, i) => (
                <React.Fragment key={message?.id + Math.random()}>
                  {i <= 5 && (
                    <Box
                      title={message?.role}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (message?.role === "insured_person") {
                          navigate(`/persons`);
                          setOpened(false);
                        }
                        if (message?.role === "sdp") {
                          navigate(`/sdp`);
                          setOpened(false);
                        }
                        if (message?.role === "agent") {
                          navigate(`/agent`);
                          setOpened(false);
                        }
                        if (message?.role === "appraiser") {
                          navigate(`/appraisers`);
                          setOpened(false);
                        }
                        if (message?.oao_ie_number) {
                          navigate(`/appraiser-company`);
                          setOpened(false);
                        }
                        if (message?.ie_number) {
                          navigate(`/insurance-company`);
                          setOpened(false);
                        }
                        if (
                          message?.appraisal_company_id &&
                          !message?.first_name
                        ) {
                          navigate(`/events`);
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
                        <Text>
                          {message?.oao_ie_number &&
                            message?.appraisal_company_name}
                          {message?.ie_number && message?.title}
                          {message?.first_name && message?.first_name + " "}
                          {message?.second_name && message?.second_name}
                          {message?.appraisal_company_id &&
                            !message?.first_name &&
                            "Insured Event"}
                        </Text>
                        <Text size="xs" color="dimmed">
                          {message.role ||
                            (message?.ie_number && "insurance_company") ||
                            (message?.oao_ie_number && "appraisal_company")}
                          {message?.appraisal_company_id &&
                            !message?.first_name &&
                            "New Created"}
                        </Text>
                      </div>
                    </Box>
                  )}
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
