import { Button, Box, type BoxProps } from "@chakra-ui/react";
import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { useRobotStore } from "@/stores/useRobotStore";
import { buildCommandMessage } from "@/utils/messageBuilder";
import { ConfirmPopover } from "./confirmPopover";

export function RebootButton(props: BoxProps) {
  const { robotState } = useRobotStore();
  const isDisabled = robotState?.gamepad_used ?? false;
  const handleClick = () => {
    useWebSocketStore.getState().send(buildCommandMessage("reboot"));
  };
  return (
    <Box position="absolute" borderWidth="5px" {...props}>
      <ConfirmPopover title="再起動します。OK?" handleClick={handleClick}>
        <Button
          w="100%"
          h="100%"
          fontSize="3xl"
          disabled={isDisabled}
          bg="red"
          color="black"
        >
          再起動
        </Button>
      </ConfirmPopover>
    </Box>
  );
}
