import { Button, Box, type BoxProps } from "@chakra-ui/react";
import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { buildBeltLaunchMessage } from "@/utils/messageBuilder";
import { useControlStore } from "@/stores/useControleStore";

const handleFlagButton = () => {
  const acceleration = useControlStore.getState().selectedBeltAcceleration;
  useWebSocketStore.getState().send(buildBeltLaunchMessage(acceleration));
};

export function BeltLaunchButton(props: BoxProps) {
  return (
    <Box position="absolute" borderWidth="5px" {...props}>
      <Button w="100%" h="100%" fontSize="3xl" onClick={handleFlagButton}>
        発射
      </Button>
    </Box>
  );
}
