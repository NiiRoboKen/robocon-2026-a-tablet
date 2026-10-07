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
    const { position } = useRobotStore();
    const { send } = useWebSocketStore();

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
                >
                    <PiArrowDownBold />
                </IconButton>
            </Flex>
        </Box>
    );
}
