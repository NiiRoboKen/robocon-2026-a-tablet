import { useControlStore } from "@/stores/useControleStore";
import { useRobotStore } from "@/stores/useRobotStore";
import { Button, Box, type BoxProps, Text } from "@chakra-ui/react";

export function AdjustAcceleration(props: BoxProps) {
  const { selectedBeltAcceleration, adjustSelectedBeltAcceleration } =
    useControlStore();
  const { robotState } = useRobotStore();
  const isDisabled = robotState?.gamepad_used ?? false;
  return (
    <Box
      position="absolute"
      display="flex"
      borderWidth="5px"
      gap="5%"
      justifyContent="space-between"
      {...props}
    >
      <Button
        height="100%"
        flexGrow="1"
        flex="1"
        fontSize="6xl"
        onClick={() => adjustSelectedBeltAcceleration(-1)}
        disabled={isDisabled}
      >
        -
      </Button>
      <Box
        flex="1"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Text textStyle="3xl">{selectedBeltAcceleration} mm</Text>
      </Box>
      <Button
        height="100%"
        flexGrow="1"
        flex="1"
        fontSize="6xl"
        onClick={() => adjustSelectedBeltAcceleration(1)}
        disabled={isDisabled}
      >
        +
      </Button>
    </Box>
  );
}
