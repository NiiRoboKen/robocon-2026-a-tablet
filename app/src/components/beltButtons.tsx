import { Flex, Button, Box, type BoxProps, Text } from "@chakra-ui/react";
import { useControlStore } from "@/stores/useControleStore";
import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { useRobotStore } from "@/stores/useRobotStore";
import { buildCommandMessage } from "@/utils/messageBuilder";
import type { Commands } from "@/types";

export function BeltButtons(props: BoxProps) {
  const { setTargetBeltObject } = useControlStore();
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
      flexDirection="column"
      borderWidth="5px"
      gap="3px"
      {...props}
    >
      <Flex flex="1" gap="5px" justifyContent="space-between">
        <Button
          height="100%"
          flexGrow="1"
          flex="1"
          fontSize="lg"
          onClick={() => {
            // sendCommand("belt_bucket_low");
          }}
          // bg="skyblue"
          disabled={isDisabled}
          whiteSpace={"pre-line"}
        >
          {"ロード\nチャンバー"}
        </Button>
        <Button
          height="100%"
          flexGrow="1"
          flex="1"
          fontSize="lg"
          onClick={() => {
            setTargetBeltObject("fix2");
            sendCommand("belt_bucket_middle");
          }}
          // bg="blue"
          disabled={isDisabled}
          whiteSpace={"pre-line"}
        >
          {"アンロード\nチャンバー"}
        </Button>
        <Button
          height="100%"
          flexGrow="1"
          flex="1"
          fontSize="lg"
          onClick={() => {
            setTargetBeltObject("fix3");
            sendCommand("belt_bucket_high");
          }}
          // bg="teal"
          disabled={isDisabled}
          whiteSpace={"pre-line"}
        >
          {"ロード\nマガジン"}
        </Button>
        <Button
          height="100%"
          flexGrow="1"
          flex="1"
          fontSize="lg"
          onClick={() => {
            setTargetBeltObject("table");
            sendCommand("belt_desk");
          }}
          // bg="green"
          disabled={isDisabled}
          whiteSpace={"pre-line"}
        >
          {"アンロード\nマガジン"}
        </Button>
      </Flex>

      <Flex flex="1" gap="5px">
        <Button
          height="100%"
          flexGrow="1"
          flex="1"
          fontSize="2xl"
          onClick={() => {
            setTargetBeltObject("fix1");
            sendCommand("belt_bucket_low");
          }}
          bg="skyblue"
          disabled={isDisabled}
        >
          低
        </Button>
        <Button
          height="100%"
          flexGrow="1"
          flex="1"
          fontSize="2xl"
          onClick={() => {
            setTargetBeltObject("fix2");
            sendCommand("belt_bucket_middle");
          }}
          bg="blue"
          disabled={isDisabled}
        >
          中
        </Button>
        <Button
          height="100%"
          flexGrow="1"
          flex="1"
          fontSize="2xl"
          onClick={() => {
            setTargetBeltObject("fix3");
            sendCommand("belt_bucket_high");
          }}
          bg="teal"
          disabled={isDisabled}
        >
          高
        </Button>
        <Button
          height="100%"
          flexGrow="1"
          flex="1"
          fontSize="2xl"
          onClick={() => {
            setTargetBeltObject("table");
            sendCommand("belt_desk");
          }}
          bg="green"
          disabled={isDisabled}
        >
          机
        </Button>
      </Flex>
    </Box>
  );
}
