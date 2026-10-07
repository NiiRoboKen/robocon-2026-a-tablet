import { useWebSocket } from "./hooks/useWebSocket";
import { Konva } from "./components/Konva";
import { ToggleColorMode } from "./components/toggleColorButton";
import { SendPositionButton } from "./components/sendPositionButton";
import { Box, Flex } from "@chakra-ui/react";
import { ReloadButtons } from "./components/reloadButtons";
import { BeltButtons } from "./components/beltButtons";
import { FlagButton } from "./components/flagButton";
import { BucketButtons } from "./components/bucketButtons";
import { CurrentPositionInfo } from "./components/currentPositionInfo";
import { ControllerSwitch } from "./components/controllerSwitch";
import { AdjustAcceleration } from "./components/adjustAcceleration";
import { BeltLaunchButton } from "./components/beltLaunchButton";
import { AdjustPositionDirectionDelta } from "./components/adjustPositionDirectionDelta";
import { AdjustPositionDirection } from "./components/adjustPositionDirection";
import { Label } from "./components/label";
import { StopButton } from "./components/stopButton";
import { RollerButtons } from "./components/rollerButtons";

function App() {
  useWebSocket();

  return (
    <Flex w="100vw" h="100vh" overflow="hidden">
      <Konva />

      <Box flex="1" h="100%" pos="relative" bg="white" m="5px">
        <Label top="2%" left="2%">
          ベルト
        </Label>
        <ReloadButtons left="15%" width="40%" height="8%" />
        <ToggleColorMode left="90%" w="30%" h="10%" />
        <BeltButtons top="10%" width="50%" height="10%" />
        <CurrentPositionInfo top="10%" left="70%" width="30%" />
        <FlagButton top="23%" width="13%" height="10%" />
        <AdjustAcceleration top="23%" left="14%" width="30%" height="10%" />
        <BeltLaunchButton
          top="23%"
          left="45%"
          width="10%"
          height="10%"
          borderColor="orange"
        />
        <AdjustPositionDirectionDelta
          top="30%"
          left="60%"
          width="40%"
          height="15%"
          borderColor="yellow"
        />
        <AdjustPositionDirection
          top="50%"
          left="60%"
          width="40%"
          height="40%"
          borderColor="red"
        />

        <Label top="40%">バケツ回収</Label>
        <RollerButtons top="48%" width="50%" height="10%" />

        <Label top="65%">バケツ回収</Label>
        <BucketButtons top="73%" width="50%" height="10%" />

        <StopButton top="85%" width="10%" height="10%" borderColor="yellow" />
        <ControllerSwitch top="87%" left="20%" />
        <SendPositionButton
          top="85%"
          left="40%"
          width="15%"
          height="10%"
          borderColor="green"
        />
      </Box>
    </Flex>
  );
}

export default App;
