import { useState } from "react";
import {
  Popper,
  Button,
  Paper,
  Group,
  useMantineTheme,
} from "@mantine/core";
import { Notification } from "../icons";
import "../admin/index.css";

function Popup() {
  const [referenceElement, setReferenceElement] = useState(null);
  const [visible, setVisible] = useState(false);
  const theme = useMantineTheme();

  return (
    <div position="end">
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
        transition="pop-bottom-left"
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
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <p
              style={{
                padding: "0.5rem",
              }}
              key={item}
            >
              Notification
            </p>
          ))}
        </Paper>
      </Popper>
    </div>
  );
}
export default Popup;
