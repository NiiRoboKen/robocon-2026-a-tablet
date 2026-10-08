import { Box, type BoxProps, Button } from "@chakra-ui/react";
import { getConfig } from "../config";
import { useCanvasStore } from "../stores/useCanvasStore";
import { useRobotStore } from "../stores/useRobotStore";
import { ConfirmPopover } from "./confirmPopover";

export function ToggleColorMode(props: BoxProps) {
  const { toggleColorMode, colorMode } = useCanvasStore();
  const { setPosition } = useRobotStore();
  const { robotState } = useRobotStore();
  const isDisabled = robotState?.gamepad_used ?? false;

  function handleClick() {
    toggleColorMode();
    setPosition({
      x: 0,
      y: 0,
      direction: getConfig(colorMode).robot.direction,
    });
  }
  return (
    <Box pos="absolute" {...props}>
      <ConfirmPopover
        title="カラーモードを変更しますか?"
        handleClick={handleClick}
      >
        <Button
          bg="white"
          borderColor={colorMode}
          borderWidth="5px"
          color={colorMode}
          disabled={isDisabled}
        >
          モード
        </Button>
      </ConfirmPopover>
    </Box>
  );
}
