import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { Button, Box, type BoxProps } from "@chakra-ui/react";
import type { Commands } from "@/types";
import { buildCommandMessage } from "@/utils/messageBuilder";
import { useRobotStore } from "@/stores/useRobotStore";

export function BucketButtons(props: BoxProps) {
    const { send } = useWebSocketStore();
    const { robotState } = useRobotStore();
    const isDisabled = robotState?.gamepad_used ?? false;

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
                bg="skyblue"
                disabled={isDisabled}
            >
                低
            </Button>
            <Button
                height="100%"
                flex="1"
                fontSize="2xl"
                onClick={() => sendCommand("bucket_middle")}
                bg="blue"
                disabled={isDisabled}
            >
                中
            </Button>
            <Button
                height="100%"
                flex="1"
                fontSize="2xl"
                onClick={() => sendCommand("bucket_high")}
                bg="teal"
                disabled={isDisabled}
            >
                高
            </Button>
            <Button
                height="100%"
                flex="1"
                fontSize="2xl"
                onClick={() => sendCommand("bucket_release")}
                bg="green"
                disabled={isDisabled}
            >
                リリース
            </Button>
            <Button
                height="100%"
                flex="1"
                fontSize="2xl"
                // onClick={() => sendCommand("")}
                bg="plum"
                disabled={isDisabled}
                color="black"
            >
                前に展開
            </Button>
        </Box>
    );
}
