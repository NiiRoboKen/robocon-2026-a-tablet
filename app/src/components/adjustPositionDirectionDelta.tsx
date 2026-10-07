import { useControlStore } from "@/stores/useControleStore";
import {
    Flex,
    Button,
    Box,
    type BoxProps,
    Text,
} from "@chakra-ui/react";

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
            gap="5%"
            {...props}
        >
            <Flex justifyContent="space-between" flex="1" gap="2%">
                <Box
                    flex="1"
                    borderWidth="3px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text textStyle="2xl">{positionDelta} mm</Text>
                </Box>
                <Button
                    height="100%"
                    flexGrow="1"
                    flex="1"
                    fontSize="4xl"
                    onClick={() => adjustPositionDelta(-1)}
                >
                    -
                </Button>
                <Button
                    height="100%"
                    flexGrow="1"
                    flex="1"
                    fontSize="4xl"
                    onClick={() => adjustPositionDelta(1)}
                >
                    +
                </Button>
            </Flex>
            <Flex flex="1" gap="2%">
                <Box
                    flex="1"
                    borderWidth="3px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text textStyle="2xl">{directionDelta} deg</Text>
                </Box>
                <Button
                    height="100%"
                    flexGrow="1"
                    flex="1"
                    fontSize="4xl"
                    onClick={() => adjustDirectionDelta(-1)}
                >
                    -
                </Button>
                <Button
                    height="100%"
                    flexGrow="1"
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
