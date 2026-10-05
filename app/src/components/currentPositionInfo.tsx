import { useRobotStore } from "@/stores/useRobotStore";
import { Card, Box, type BoxProps, Text, HStack, Icon } from "@chakra-ui/react";
import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { CiCircleCheck } from "react-icons/ci";
import { MdErrorOutline } from "react-icons/md";

export function CurrentPositionInfo(props: BoxProps) {
    const { robotStatus } = useRobotStore();
    const { isConnected } = useWebSocketStore();

    const text = `x: ${robotStatus.position.x}, y: ${robotStatus.position.y}, dir: ${robotStatus.direction}`;

    return (
        <Box pos="absolute" borderWidth="5px" {...props}>
            <Card.Root width="100%" height="100%">
                <Card.Body>
                    <Card.Title>Current Position</Card.Title>
                    <Card.Description>{text}</Card.Description>

                    <HStack mt="2" gap="1">
                        <Icon
                            as={isConnected ? CiCircleCheck : MdErrorOutline}
                            color={isConnected ? "green.500" : "red.500"}
                            boxSize="5"
                        />
                        <Text
                            fontSize="sm"
                            color={isConnected ? "green.600" : "red.600"}
                        >
                            {isConnected
                                ? "WebSocket: Connected"
                                : "WebSocket: Disconnected"}
                        </Text>
                    </HStack>
                </Card.Body>
            </Card.Root>
        </Box>
    );
}
