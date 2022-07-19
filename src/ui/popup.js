import React, { useState } from "react";
import { Box, Popover, ScrollArea, Text } from "@mantine/core";
import { Notification } from "../icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { oldMessage } from "../redux/reducer";

function Popup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(({ user }) => user);
  const [opened, setOpened] = useState(false);
  const __message =
    user.role === "superadmin"
      ? user?.messages?.filter(
          (_items) =>
            _items?.role === "sdp" ||
            _items?.role === "agent" ||
            _items?.role === "appraiser" ||
            _items?.role === "insured_person"
        )
      : user.role === "insurance_company"
      ? user?.messages?.filter((_items) => _items?.ie_number)
      : user.role === "appraisal_company"
      ? user?.messages?.filter((_items) => _items?.oao_ie_number)
      : [];

  return (
    <Popover
      onClick={() => dispatch(oldMessage())}
      className={user.read_messages ? "popup-notification" : ""}
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
        <ScrollArea
          style={{ height: 250, width: "max-content" }}
          offsetScrollbars
        >
          {!user?.messages?.length && <Box>No message</Box>}

          {__message?.reverse()?.map((message) => (
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
              key={message?.id}
            >
              <Text size="lg">
                {message?.oao_ie_number && message?.appraisal_company_name}
                {message?.ie_number && message?.title}
                {message?.first_name && message?.first_name}
                {message?.second_name && message?.second_name}
              </Text>
            </Box>
          ))}
        </ScrollArea>
      </div>
    </Popover>
  );
}
export default Popup;
