import React, { useState } from "react";
import { Box, Popover, ScrollArea, Text } from "@mantine/core";
import { Notification } from "../icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Popup() {
  const navigate = useNavigate();
  const user = useSelector(({ user }) => user);
  const [opened, setOpened] = useState(false);
  return (
    <Popover
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
          {(user.role === "superadmin" || user.role === "insurance_company") &&
            user?.messages
              ?.filter(
                (_items) =>
                  _items?.role === "sdp" ||
                  _items?.role === "agent" ||
                  _items?.role === "appraiser" ||
                  _items?.role === "insured_person"
              )
              .map((message) => (
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
                    {message?.first_name} {message?.second_name}
                  </Text>
                </Box>
              ))}
        </ScrollArea>
      </div>
    </Popover>
  );
}
export default Popup;
