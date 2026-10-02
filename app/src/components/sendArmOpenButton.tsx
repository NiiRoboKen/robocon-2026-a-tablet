import { buildCommandMessage } from "../utils/messageBuilder";
import { useWebSocketStore } from "../stores/useWebSocketStore";
import { Box, type BoxProps } from "@chakra-ui/react";

export function SendArmOpenButton(props: BoxProps) {
    const send = useWebSocketStore((s) => s.send);

    const handleClick = () => {
        send(buildCommandMessage("arm_up"));
    };

    return (
        <Box position="absolute" {...props}>
            <button type="button" onClick={handleClick}>
                アームを開く
            </button>
        </Box>
    );
}
