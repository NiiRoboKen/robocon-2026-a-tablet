import { useCanvasStore } from "@/stores/useCanvasStore";
import { getConfig } from "@/config";
import {
    coordinatesPixelToWorld,
    directionToDisplayDegrees,
    pixelToWorld,
    roundPoint,
} from "@/utils/coordinate";
import { Box, type BoxProps } from "@chakra-ui/react";

export function CursorInfoLabel(props: BoxProps) {
    const { colorMode, pixelScale, cursorDirection, cursorPosition } =
        useCanvasStore();

    if (!cursorPosition || cursorDirection === null) {
        return (
            <>
                <label>Cursor Position: x=null, y=null, dir=null</label>
            </>
        );
    }

    const origin = getConfig(colorMode).robot.originPosition;
    const realPosition = coordinatesPixelToWorld(
        roundPoint(pixelToWorld(cursorPosition, pixelScale)),
        origin,
    );

    return (
        <Box pos="absolute" {...props}>
            <label>
                Cursor Position: x={realPosition.x}, y={realPosition.y}, dir=
                {Math.round(directionToDisplayDegrees(cursorDirection))}
            </label>
        </Box>
    );
}
