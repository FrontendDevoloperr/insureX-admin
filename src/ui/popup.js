import { useState } from "react";
import { Popover, Text } from "@mantine/core";
import { Notification } from "../icons";

function Popup() {
  const [opened, setOpened] = useState(false);
  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      target={
        <Notification
          style={{ cursor: "pointer" }}
          onClick={() => setOpened((o) => !o)}
        />
      }
      width={200}
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
        <Text size="sm">Notifications</Text>
        <Text size="sm">Notifications</Text>
        <Text size="sm">Notifications</Text>
        <Text size="sm">Notifications</Text>
        <Text size="sm">Notifications</Text>
      </div>
    </Popover>
  );
}
export default Popup;
