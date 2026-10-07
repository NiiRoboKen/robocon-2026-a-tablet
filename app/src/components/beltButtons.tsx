import { Button, Box, type BoxProps } from "@chakra-ui/react";
import { useControlStore } from "@/stores/useControleStore";
import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { buildCommandMessage } from "@/utils/messageBuilder";
import type { Commands } from "@/types";

export function BeltButtons(props: BoxProps) {
    const { setTargetBeltObject } = useControlStore();
    const { send } = useWebSocketStore();
    function sendCommand(command: Commands) {
        send(buildCommandMessage(command));
    }
    return (
        <Box
            position="absolute"
            display="flex"
            borderWidth="5px"
            gap="5px"
            justifyContent="space-between"
            {...props}
        >
            <Button
                height="100%"
                flexGrow="1"
                flex="1"
                fontSize="2xl"
                onClick={() => {
                    setTargetBeltObject("fix1");
                    sendCommand("belt_bucket_low");
                }}
                bg="skyblue"
            >
                低
            </Button>
            <Button
                height="100%"
                flexGrow="1"
                flex="1"
                fontSize="2xl"
                onClick={() => {
                    setTargetBeltObject("fix2");
                    sendCommand("belt_bucket_middle");
                }}
                bg="blue"
            >
                中
            </Button>
            <Button
                height="100%"
                flexGrow="1"
                flex="1"
                fontSize="2xl"
                onClick={() => {
                    setTargetBeltObject("fix3");
                    sendCommand("belt_bucket_high");
                }}
                bg="teal"
            >
                高
            </Button>
            <Button
                height="100%"
                flexGrow="1"
                flex="1"
                fontSize="2xl"
                onClick={() => {
                    setTargetBeltObject("table");
                    sendCommand("belt_desk");
                }}
                bg="green"
            >
                机
            </Button>
        </Box>
    );
}
