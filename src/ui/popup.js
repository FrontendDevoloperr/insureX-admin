import { useState } from "react";
import {
  Popper,
  Button,
  Paper,
  Center,
  Group,
  useMantineTheme,
} from "@mantine/core";
import { Notification } from "../icons";
import "../admin/index.css";

function Popup() {
  const [referenceElement, setReferenceElement] = useState(null);
  const [visible, setVisible] = useState(true);
  const theme = useMantineTheme();

  return (
    <Group position="end">
      <Button
        className="notification_icon"
        ref={setReferenceElement}
        onClick={() => setVisible((m) => !m)}
      >
        <Notification />
      </Button>

      <Popper
        placement="end"
        arrowSize={5}
        withArrow
        mounted={visible}
        referenceElement={referenceElement}
        transition="pop-top-left"
        transitionDuration={200}
        arrowStyle={{
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[1],
        }}
      >
        <Paper
          style={{
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[1],
          }}
        >
          <Center className="notification_flex" style={{ height: 100, width: 200 }}>
            <p>Notification</p>
            <p>Notification</p>
            <p>Notification</p>
            <p>Notification</p>
          </Center>
        </Paper>
      </Popper>
    </Group>
  );
}
export default Popup;
