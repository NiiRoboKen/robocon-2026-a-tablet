import { useCanvasStore } from "@/stores/useCanvasStore";
import { getConfig } from "@/config";
import {
    coordinatesPixelToWorld,
    directionToDisplayDegrees,
    pixelToWorld,
    roundPoint,
} from "@/utils/coordinate";
import { Box, type BoxProps } from "@chakra-ui/react";

export function SelectedInfoLabel(props: BoxProps) {
    const { colorMode, pixelScale, selectedPosition, selectedDirection } =
        useCanvasStore();

    if (!selectedPosition || selectedDirection === null) {
        return (
            <>
                <label>Selected Position: x=null, y=null, dir=null</label>
            </>
        );
    }

    const origin = getConfig(colorMode).robot.originPosition;
    const realPosition = coordinatesPixelToWorld(
        roundPoint(pixelToWorld(selectedPosition, pixelScale)),
        origin,
    );

    return (
        <Box position="absolute" {...props}>
            <label>
                Selected Position: x={realPosition.x}, y={realPosition.y}, dir=
                {Math.round(directionToDisplayDegrees(selectedDirection))}
            </label>
        </Box>
    );
}
