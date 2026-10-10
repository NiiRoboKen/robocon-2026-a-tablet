import { Button, Box, type BoxProps, Icon, Text } from "@chakra-ui/react";
import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { useRobotStore } from "@/stores/useRobotStore";
import { buildCommandMessage } from "@/utils/messageBuilder";
import { IoIosFlag } from "react-icons/io";

export function StmReset(props: BoxProps) {
  const { robotState } = useRobotStore();
  const isDisabled = robotState?.gamepad_used ?? false;
  const handleFlagButton = () => {
    useWebSocketStore.getState().send(buildCommandMessage("stm_reset"));
  };
  return (
    <Box position="absolute" borderWidth="5px" {...props}>
      <Button
        w="100%"
        h="100%"
        onClick={handleFlagButton}
        disabled={isDisabled}

        whiteSpace={"pre-line"}
      >
        {"STM \n Reset"}
        {/*<Text fontSize="2xl">STM Reset</Text>*/}
      </Button>
    </Box>
  );
}
