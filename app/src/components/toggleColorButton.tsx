import { Box, type BoxProps, Button } from "@chakra-ui/react";
import { getConfig } from "../config";
import { useCanvasStore } from "../stores/useCanvasStore";
import { useRobotStore } from "../stores/useRobotStore";

export function ToggleColorMode(props: BoxProps) {
    const { toggleColorMode, colorMode } = useCanvasStore();
    const { setRobotStatus } = useRobotStore();
    function handleClick() {
        toggleColorMode();
        setRobotStatus({
            position: { x: 0, y: 0 },
            direction: getConfig(colorMode).robot.direction,
        });
    }
    return (
        <Box pos="absolute" {...props}>
            <Button
                onClick={handleClick}
                bg="white"
                borderColor={colorMode}
                borderWidth="5px"
                color={colorMode}
            >
                モード
            </Button>
        </Box>
    );
}
