import { useControlStore } from "@/stores/useControleStore";
import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { useRobotStore } from "@/stores/useRobotStore";
import { Flex, Box, type BoxProps, IconButton } from "@chakra-ui/react";
import { buildPositionMessage } from "@/utils/messageBuilder";
import {
    PiArrowArcRightBold,
    PiArrowArcLeftBold,
    PiArrowUpBold,
    PiArrowDownBold,
    PiArrowLeftBold,
    PiArrowRightBold,
    PiStopCircleBold,
} from "react-icons/pi";

export function AdjustPositionDirection(props: BoxProps) {
    const { positionDelta, directionDelta } = useControlStore();
    const { position, robotState } = useRobotStore();
    const { send } = useWebSocketStore();
    const isDisabled = robotState?.gamepad_used ?? false;

    const handleClick = (
        xDelta: number,
        yDelta: number,
        directionDelta: number,
    ) => {
        send(
            buildPositionMessage(
                { x: position.x + xDelta, y: position.y + yDelta },
                position.direction + directionDelta,
            ),
        );
    };
    const handleStop = () => {
        send(
            buildPositionMessage(
                { x: position.x, y: position.y },
                position.direction,
            ),
        );
    };
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
                {/*左回転*/}
                <IconButton
                    height="100%"
                    flexGrow="1"
                    flex="1"
                    size="2xl"
                    onClick={() => handleClick(0, 0, directionDelta)}
                    colorPalette="orange"
                    disabled={isDisabled}
                >
                    <PiArrowArcLeftBold />
                </IconButton>

                {/*上*/}
                <IconButton
                    height="100%"
                    flexGrow="1"
                    flex="1"
                    size="2xl"
                    onClick={() => handleClick(0, positionDelta, 0)}
                    disabled={isDisabled}
                >
                    <PiArrowUpBold />
                </IconButton>

                {/*右回転*/}
                <IconButton
                    height="100%"
                    flexGrow="1"
                    flex="1"
                    size="2xl"
                    onClick={() => handleClick(0, 0, -directionDelta)}
                    colorPalette="orange"
                    disabled={isDisabled}
                >
                    <PiArrowArcRightBold />
                </IconButton>
            </Flex>
            <Flex flex="1" gap="2%">
                {/*左*/}
                <IconButton
                    height="100%"
                    flexGrow="1"
                    flex="1"
                    size="2xl"
                    onClick={() => handleClick(-positionDelta, 0, 0)}
                    disabled={isDisabled}
                >
                    <PiArrowLeftBold />
                </IconButton>

                {/*停止*/}
                <IconButton
                    height="100%"
                    flexGrow="1"
                    flex="1"
                    size="2xl"
                    onClick={handleStop}
                    colorPalette="red"
                    disabled={isDisabled}
                >
                    <PiStopCircleBold />
                </IconButton>

                {/*右*/}
                <IconButton
                    height="100%"
                    flexGrow="1"
                    flex="1"
                    size="2xl"
                    onClick={() => handleClick(positionDelta, 0, 0)}
                    disabled={isDisabled}
                >
                    <PiArrowRightBold />
                </IconButton>
            </Flex>
            <Flex flex="1" gap="2%" justifyContent="space-around">
                {/*下*/}
                <IconButton
                    width="33%"
                    height="100%"
                    size="2xl"
                    onClick={() => handleClick(0, -positionDelta, 0)}
                    disabled={isDisabled}
                >
                    <PiArrowDownBold />
                </IconButton>
            </Flex>
        </Box>
    );
}
