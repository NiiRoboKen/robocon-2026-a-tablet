import { useWebSocket } from "./hooks/useWebSocket";
import { Konva } from "./components/Konva";
import { ToggleColorMode } from "./components/toggleColorButton";
import { SendPositionButton } from "./components/sendPositionButton";
import { Box, Flex } from "@chakra-ui/react";
import { ReloadButtons } from "./components/reloadButtons";
import { BeltButtons } from "./components/beltButtons";
import { RollerButtons } from "./components/rollerButtons";
import { FlagButton } from "./components/flagButton";
import { BucketButtons } from "./components/bucketButtons";
import { CurrentPositionInfo } from "./components/currentPositionInfo";
import { ControllerSwitch } from "./components/controllerSwitch";
import { FloorHarvest } from "./components/floorHarvest";
import { AdjustAcceleration } from "./components/adjustAcceleration";
import { BeltLaunchButton } from "./components/beltLaunchButton";
import { AdjustPositionDirectionDelta } from "./components/adjustPositionDirectionDelta";
import { AdjustPositionDirection } from "./components/adjustPositionDirection";

function App() {
    useWebSocket();

    return (
        <Flex w="100vw" h="100vh" overflow="hidden">
            <Konva />

            <Box flex="1" h="100%" pos="relative" bg="white" m="5px">
                <ReloadButtons left="20%" width="40%" height="8%" />
                <ToggleColorMode left="90%" w="30%" h="10%" />
                <BeltButtons top="10%" width="50%" height="10%" />
                <CurrentPositionInfo top="10%" left="70%" width="30%" />
                <FlagButton top="23%" width="15%" height="10%" />
                <AdjustAcceleration
                    top="23%"
                    left="20%"
                    width="30%"
                    height="10%"
                />
                <AdjustPositionDirectionDelta
                    top="30%"
                    left="70%"
                    width="30%"
                    height="15%"
                />
                <BeltLaunchButton
                    top="23%"
                    left="55%"
                    width="10%"
                    height="10%"
                />
                <RollerButtons top="50%" width="40%" height="10%" />
                <BucketButtons top="70%" width="50%" height="10%" />
                <AdjustPositionDirection
                    top="50%"
                    left="60%"
                    width="40%"
                    height="40%"
                />
                <ControllerSwitch top="90%" left="20%" />
                <FloorHarvest top="90%" left="10%" />
                <SendPositionButton
                    top="85%"
                    left="40%"
                    width="10%"
                    height="8%"
                    borderColor="orange"
                />
            </Box>
        </Flex>
    );
}

export default App;
