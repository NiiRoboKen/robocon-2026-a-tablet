import { Button, Box, type BoxProps } from "@chakra-ui/react";
import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { useRobotStore } from "@/stores/useRobotStore";
import { buildCommandMessage } from "@/utils/messageBuilder";
import type { Commands } from "@/types";

export function ReloadButtons(props: BoxProps) {
  const { send } = useWebSocketStore();
  const { robotState } = useRobotStore();
  const isDisabled = robotState?.gamepad_used ?? false;
  function sendCommand(command: Commands) {
    send(buildCommandMessage(command));
  }
  return (
    <Box
      position="absolute"
      display="flex"
      gap="5px"
      borderWidth="5px"
      {...props}
    >
      <Button
        height="100%"
        flex="1"
        onClick={() => sendCommand("belt_load")}
        disabled={isDisabled}
        bg={"steelblue"}
      >
        装填開始
      </Button>
      <Button
        height="100%"
        flex="1"
        onClick={() => sendCommand("belt_reload")}
        disabled={isDisabled}
        bg="sandybrown"
        color="black"
      >
        リロード
      </Button>
      <Button
        height="100%"
        flex="1"
        onClick={() => sendCommand("belt_reload_finish")}
        disabled={isDisabled}
        bg="plum"
        color="black"
      >
        リロード完了
      </Button>
    </Box>
  );
}
