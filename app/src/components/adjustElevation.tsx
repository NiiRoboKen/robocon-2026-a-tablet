import { useControlStore } from "@/stores/useControleStore";
import { useRobotStore } from "@/stores/useRobotStore";
import { Button, Box, type BoxProps, Text } from "@chakra-ui/react";
import { HStack, Slider, Flex, Icon } from "@chakra-ui/react";
import { IoMdSpeedometer } from "react-icons/io";
import { FaWind } from "react-icons/fa6";

const AccelerationMarks = [
  { value: 0, label: "0" },
  { value: 10000, label: "10k" },
  { value: 20000, label: "20k" },
  { value: 30000, label: "30k" },
  { value: 40000, label: "40k" },
  { value: 50000, label: "50k" },
  { value: 60000, label: "60k" },
];

const ElevationSlider = ({ value }: { value: number }) => {
  return (
    <Slider.Root
      width="full"
      maxW="sm"
      size="lg"
      max={65535}
      value={[value]}
      onValueChange={(e) =>
        useControlStore.getState().setSelecredElevation(e.value[0])
      }
    >
      <HStack justify="space-between">
        <Slider.Label>
          <Flex gap="4px" alignItems={"center"}>
            {/*<Icon size="lg">
              <IoMdSpeedometer />
            </Icon>*/}
            <Text>{"Elevation"}</Text>
            {/*<Icon size="lg">
              <FaWind />
            </Icon>*/}
          </Flex>
        </Slider.Label>
        <Text>
          <Slider.ValueText />
          {"  ms"}
        </Text>
      </HStack>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0} rounded="none">
          <Box as={Slider.ValueText} />
        </Slider.Thumb>
        <Slider.Marks marks={AccelerationMarks} />
      </Slider.Control>
    </Slider.Root>
  );
};

export function AdjustElevation(props: BoxProps) {
  const { selectedElevation, adjustSelectedElevation } = useControlStore();
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
        onClick={() => adjustSelectedElevation(-100)}
        disabled={isDisabled}
      >
        -
      </Button>
      {/*<Box
                flex="1"
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Text textStyle="3xl">{selectedBeltAcceleration}</Text>
            </Box>*/}

      <ElevationSlider value={selectedElevation} />
      <Button
        height="100%"
        flexGrow="1"
        flex="1"
        fontSize="6xl"
        onClick={() => adjustSelectedElevation(100)}
        disabled={isDisabled}
      >
        +
      </Button>
    </Box>
  );
}
