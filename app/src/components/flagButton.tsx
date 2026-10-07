import { Button, Box, type BoxProps } from "@chakra-ui/react";
import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { useRobotStore } from "@/stores/useRobotStore";
import { buildCommandMessage } from "@/utils/messageBuilder";

export function FlagButton(props: BoxProps) {
  const { robotState } = useRobotStore();
  const isDisabled = robotState?.gamepad_used ?? false;
  const handleFlagButton = () => {
    useWebSocketStore.getState().send(buildCommandMessage("belt_flag"));
  };
  return (
    <Box position="absolute" borderWidth="5px" {...props}>
      <Button
        w="100%"
        h="100%"
        fontSize="3xl"
        onClick={handleFlagButton}
        disabled={isDisabled}
      >
        旗
      </Button>
    </Box>
  );
}
