import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { Button, Box, type BoxProps, Icon } from "@chakra-ui/react";
import { buildCommandMessage } from "@/utils/messageBuilder";
import type { Commands } from "@/types";
import { useRobotStore } from "@/stores/useRobotStore";
import { MdRocketLaunch } from "react-icons/md";

export function RollerButtons(props: BoxProps) {
  const { send } = useWebSocketStore();
  const { robotState } = useRobotStore();
  const isDisabled = robotState?.gamepad_used ?? false;
  function sendCommand(command: Commands) {
    send(buildCommandMessage(command));
  }
  return (
    <Box
      p="1"
      position="absolute"
      display="flex"
      borderWidth="5px"
      gap="5px"
      justifyContent="space-between"
      {...props}
    >
      <Button
        height="100%"
        flex="1"
        fontSize="2xl"
        onClick={() => sendCommand("roller_stop")}
        disabled={isDisabled}
      >
        ブレーキ
      </Button>
      <Button
        height="100%"
        flex="1"
        fontSize="2xl"
        onClick={() => sendCommand("roller_start")}
        disabled={isDisabled}
      >
        加速開始
      </Button>
      <Button
        height="100%"
        flex="1"
        fontSize="2xl"
        onClick={() => sendCommand("roller_launch")}
        borderWidth="5px"
        borderColor="orange"
        disabled={isDisabled}
      >
        発射
        <Icon size="2xl">
          <MdRocketLaunch />
        </Icon>
      </Button>
    </Box>
  );
}
