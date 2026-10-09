import { Button, Box, type BoxProps } from "@chakra-ui/react";
import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { useRobotStore } from "@/stores/useRobotStore";
import { buildPositionMessage } from "@/utils/messageBuilder";
import { distance } from "@/utils/coordinate";
import { useControlStore } from "@/stores/useControleStore";
import { getConfig } from "@/config";
import { useCanvasStore } from "@/stores/useCanvasStore";

export function FirstActionButton(props: BoxProps) {
  const { send } = useWebSocketStore();
  const { firstActionUsed, setFirstActionUsed } = useControlStore();
  const { colorMode } = useCanvasStore();
  const config = getConfig(colorMode);
  const handleClick = () => {
    send(
      buildPositionMessage(
        { x: config.firstActionPosition.x, y: config.firstActionPosition.y },
        config.firstActionPosition.direction,
      ),
    );
    setFirstActionUsed();
    const intervalID = setInterval(() => {
      const position = useRobotStore.getState().position;
      const dist = distance(position, config.firstActionPosition);
      console.log("first action position checked", position, dist);
      if (dist <= 100) {
        clearInterval(intervalID);
        console.log("最初の目標座標到着");
        send(
          buildPositionMessage(
            {
              x: 0,
              y: 0,
            },
            0,
          ),
        );
      }
    }, 100);
  };

  return (
    <Box position="absolute" borderWidth="5px" {...props}>
      <Button
        w="100%"
        h="100%"
        fontSize="3xl"
        onClick={handleClick}
        disabled={firstActionUsed}
      >
        書道
      </Button>
    </Box>
  );
}
