import { useWebSocket } from "./hooks/useWebSocket";
import { Konva } from "./components/Konva";
import { ToggleColorMode } from "./components/toggleColorButton";
import { SendPositionButton } from "./components/sendPositionButton";
import { Box, Flex } from "@chakra-ui/react";
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
import { RebootButton } from "./components/rebootButton";
import { FirstActionButton } from "./components/firstActionButton";

function App() {
  useWebSocket();

  return (
    <Flex w="100vw" h="100vh" overflow="hidden">
      <Konva />

      <Box flex="1" h="100%" pos="relative" bg="white" m="5px">
        <Label top="2%" left="2%" borderColor="lightsalmon">
          ベルト
        </Label>

        <ToggleColorMode left="90%" w="30%" h="10%" />
        <ControllerSwitch left="70%" />

        <BeltButtons top="10%" width="50%" height="20%" />
        <BeltLaunchButton
          top="10%"
          left="55%"
          width="10%"
          height="10%"
          borderColor="black"
        />

        <CurrentPositionInfo
          top="10%"
          left="70%"
          width="30%"
          borderColor="green"
        />
        <FlagButton top="31%" width="13%" height="10%" />
        <AdjustAcceleration
          top="31%"
          left="14%"
          width="36%"
          height="10%"
          borderColor="lightblue"
        />
        <AdjustPositionDirectionDelta
          top="30%"
          left="60%"
          width="40%"
          height="20%"
          borderColor="yellow"
        />
        <AdjustPositionDirection
          top="55%"
          left="60%"
          width="40%"
          height="40%"
          borderColor="red"
        />

        <Label top="45%" borderColor={"lightsalmon"}>
          ローラー
        </Label>
        <RollerButtons
          top="53%"
          width="50%"
          height="10%"
          borderColor={"yellowgreen"}
        />

        <Label top="65%" borderColor="lightsalmon">
          バケツ回収
        </Label>
        <BucketButtons top="73%" width="50%" height="10%" />

        <StopButton top="85%" width="10%" height="10%" borderColor="yellow" />
        <RebootButton
          top="85%"
          left="12%"
          width="10%"
          height="10%"
          borderColor="blue"
        />
        <FirstActionButton
          top="85%"
          left="24%"
          width="10%"
          height="10%"
          borderColor="blue"
        />
        <SendPositionButton
          top="85%"
          left="37%"
          width="13%"
          height="10%"
          borderColor="green"
        />
      </Box>
    </Flex>
  );
}

export default App;
