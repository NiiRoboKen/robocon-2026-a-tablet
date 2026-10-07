import { useControlStore } from "@/stores/useControleStore";
import { useRobotStore } from "@/stores/useRobotStore";
import { Flex, Button, Box, type BoxProps, Text } from "@chakra-ui/react";

import { HStack, Slider } from "@chakra-ui/react";

const positionMarks = [
  { value: 0, label: "0" },
  { value: 100, label: "100" },
  { value: 200, label: "200" },
  { value: 300, label: "300" },
  { value: 400, label: "400" },
  { value: 500, label: "500" },
];
const directionMarks = [
  { value: 0, label: "0" },
  { value: 45, label: "45" },
  { value: 90, label: "90" },
  { value: 135, label: "135" },
  { value: 180, label: "180" },
];

const PositionDletaSlider = ({ value }: { value: number }) => {
  return (
    <Slider.Root
      width="full"
      maxW="sm"
      size="lg"
      max={500}
      value={[value]}
      onValueChange={(e) =>
        useControlStore.getState().setPositionDelta(e.value[0])
      }
    >
      <HStack justify="space-between">
        <Slider.Label>Posotion</Slider.Label>
        mm
      </HStack>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0} rounded="none">
          <Box as={Slider.ValueText} />
        </Slider.Thumb>
        <Slider.Marks marks={positionMarks} />
      </Slider.Control>
    </Slider.Root>
  );
};
const DirectionDletaSlider = ({ value }: { value: number }) => {
  return (
    <Slider.Root
      width="full"
      maxW="sm"
      size="lg"
      max={180}
      value={[value]}
      onValueChange={(e) =>
        useControlStore.getState().setDirectionDelta(e.value[0])
      }
    >
      <HStack justify="space-between">
        <Slider.Label>Direction</Slider.Label>
        deg
      </HStack>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0} rounded="none">
          <Box as={Slider.ValueText} />
        </Slider.Thumb>
        <Slider.Marks marks={directionMarks} />
      </Slider.Control>
    </Slider.Root>
  );
};

export function AdjustPositionDirectionDelta(props: BoxProps) {
  const {
    positionDelta,
    directionDelta,
    adjustPositionDelta,
    adjustDirectionDelta,
  } = useControlStore();
  const { robotState } = useRobotStore();
  const isDisabled = robotState?.gamepad_used ?? false;
  return (
    <Box
      position="absolute"
      display="flex"
      flexDirection="column"
      borderWidth="5px"
      gap="7%"
      {...props}
    >
      <Flex justifyContent="space-between" flex="1" gap="5%">
        <Button
          height="100%"
          flex="1"
          fontSize="4xl"
          onClick={() => adjustPositionDelta(-1)}
          disabled={isDisabled}
        >
          -
        </Button>
        <PositionDletaSlider value={positionDelta} />
        <Button
          height="100%"
          flex="1"
          fontSize="4xl"
          onClick={() => adjustPositionDelta(1)}
          disabled={isDisabled}
        >
          +
        </Button>
      </Flex>
      <Flex flex="1" gap="5%">
        <Button
          height="100%"
          flex="1"
          fontSize="4xl"
          onClick={() => adjustDirectionDelta(-1)}
          disabled={isDisabled}
        >
          -
        </Button>
        <DirectionDletaSlider value={directionDelta} />
        <Button
          height="100%"
          flex="1"
          fontSize="4xl"
          onClick={() => adjustDirectionDelta(1)}
          disabled={isDisabled}
        >
          +
        </Button>
      </Flex>
    </Box>
  );
}
