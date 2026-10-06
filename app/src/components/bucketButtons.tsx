import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { Button, Box, type BoxProps } from "@chakra-ui/react";
import type { Commands } from "@/types";
import { buildCommandMessage } from "@/utils/messageBuilder";

export function BucketButtons(props: BoxProps) {
    const { send } = useWebSocketStore();
    function sendCommand(command: Commands) {
        send(buildCommandMessage(command));
    }
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
                fontSize="2xl"
                onClick={() => sendCommand("bucket_low")}
            >
                低
            </Button>
            <Button
                height="100%"
                flex="1"
                fontSize="2xl"
                onClick={() => sendCommand("bucket_middle")}
            >
                中
            </Button>
            <Button
                height="100%"
                flex="1"
                fontSize="2xl"
                onClick={() => sendCommand("bucket_high")}
            >
                高
            </Button>
            <Button
                height="100%"
                flex="1"
                fontSize="2xl"
                onClick={() => sendCommand("bucket_release")}
            >
                リリース
            </Button>
        </Box>
    );
}
