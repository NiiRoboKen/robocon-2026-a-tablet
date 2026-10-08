import { Button, Box, type BoxProps } from "@chakra-ui/react";
import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { useRobotStore } from "@/stores/useRobotStore";
import { buildCommandMessage } from "@/utils/messageBuilder";
import { ConfirmPopover } from "./confirmPopover";

export function StopButton(props: BoxProps) {
  const { robotState } = useRobotStore();
  const isDisabled = robotState?.gamepad_used ?? false;
  const handleClick = () => {
    useWebSocketStore.getState().send(buildCommandMessage("stop"));
  };
  return (
    <Box position="absolute" borderWidth="5px" {...props}>
      <ConfirmPopover title="停止します。OK?" handleClick={handleClick}>
        <Button
          w="100%"
          h="100%"
          fontSize="3xl"
          disabled={isDisabled}
          bg="red"
          color="black"
        >
          停止
        </Button>
      </ConfirmPopover>
    </Box>
  );
}
