import { useControlStore } from "@/stores/useControleStore";
import { Flex, Button, Box, type BoxProps, Text, Icon } from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { GiAnticlockwiseRotation } from "react-icons/gi";
import { GiClockwiseRotation } from "react-icons/gi";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
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
                <Slider.Label>
                    <Flex gap="5px">
                        <Icon size="md">
                            <FaArrowRightArrowLeft />
                        </Icon>
                        {"Posotion"}
                        <Icon size="md">
                            <FaMapMarkerAlt />
                        </Icon>
                    </Flex>
                </Slider.Label>
                <Text>
                    <Slider.ValueText /> mm
                </Text>
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
                <Slider.Label>
                    <Flex gap="3px">
                        <Icon size="md">
                            <GiAnticlockwiseRotation />
                        </Icon>
                        {"Direction"}
                        <Icon size="md">
                            <GiClockwiseRotation />
                        </Icon>
                    </Flex>
                </Slider.Label>
                <Text>
                    <Slider.ValueText /> deg
                </Text>
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
                >
                    -
                </Button>
                <PositionDletaSlider value={positionDelta} />
                <Button
                    height="100%"
                    flex="1"
                    fontSize="4xl"
                    onClick={() => adjustPositionDelta(1)}
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
                >
                    -
                </Button>
                <DirectionDletaSlider value={directionDelta} />
                <Button
                    height="100%"
                    flex="1"
                    fontSize="4xl"
                    onClick={() => adjustDirectionDelta(1)}
                >
                    +
                </Button>
            </Flex>
        </Box>
    );
}
