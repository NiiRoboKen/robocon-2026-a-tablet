import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { Button, Box, type BoxProps, Icon } from "@chakra-ui/react";
import {
  buildElevationUpMessage,
  buildElevationDownMessage,
} from "@/utils/messageBuilder";
import { useRobotStore } from "@/stores/useRobotStore";
import { useControlStore } from "@/stores/useControleStore";

export function ElevationButtons(props: BoxProps) {
  const { send } = useWebSocketStore();
  const { robotState } = useRobotStore();
  const { selectedElevation } = useControlStore();
  const isDisabled = robotState?.gamepad_used ?? false;

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
        fontSize="lg"
        onClick={() => send(buildElevationUpMessage(selectedElevation))}
        disabled={isDisabled}
      >
        {"アップ"}
      </Button>

      <Button
        height="100%"
        flex="1"
        fontSize="lg"
        onClick={() => send(buildElevationDownMessage(selectedElevation))}
        disabled={isDisabled}
      >
        ダウン
      </Button>
    </Box>
  );
}
