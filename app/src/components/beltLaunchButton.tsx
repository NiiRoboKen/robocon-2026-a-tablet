import { Button, Box, type BoxProps } from "@chakra-ui/react";
import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { useRobotStore } from "@/stores/useRobotStore";
import { buildBeltLaunchMessage } from "@/utils/messageBuilder";
import { useControlStore } from "@/stores/useControleStore";

export function BeltLaunchButton(props: BoxProps) {
  const { robotState } = useRobotStore();
  const isDisabled = robotState?.gamepad_used ?? false;
  const handleFlagButton = () => {
    const acceleration = useControlStore.getState().selectedBeltAcceleration;
    useWebSocketStore.getState().send(buildBeltLaunchMessage(acceleration));
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
        発射
      </Button>
    </Box>
  );
}
