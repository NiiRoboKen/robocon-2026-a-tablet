import { useWebSocket } from "./hooks/useWebSocket";
import { Konva } from "./components/Konva";
import { ToggleColorMode } from "./components/toggleColorButton";
import "./App.css";
import { SendPositionButton } from "./components/sendPositionButton";
import { Box, Flex } from "@chakra-ui/react";
import { ReloadButtons } from "./components/reloadButtons";
import { BeltButtons } from "./components/beltButtons";
import { RollerButtons } from "./components/rollerButtons";
import { FlagButton } from "./components/flagButton";
import { BucketButtons } from "./components/bucketButtons";
import { CursorInfoLabel } from "./components/archive/cursorInfoLabel";
import { SelectedInfoLabel } from "./components/archive/selectedInfoLabel";
import { CurrentPositionInfo } from "./components/currentPositionInfo";
import { ControllerSwitch } from "./components/controllerSwitch";
import { FloorHarvest } from "./components/floorHarvest";
import { AdjustAcceleration } from "./components/adjustAcceleration";

function App() {
    useWebSocket();

    return (
        <Flex w="100vw" h="100vh" overflow="hidden">
            <Konva />

            <Box
                flex="1"
                h="100%"
                pos="relative"
                overflow="hidden"
                bg="white"
                m="5px"
            >
                <ReloadButtons left="20%" width="40%" height="8%" />
                <SendPositionButton
                    top="70%"
                    left="80%"
                    width="10%"
                    height="8%"
                    borderColor="orange"
                />
                <ToggleColorMode left="90%" w="30%" h="10%" />
                <BeltButtons top="10%" width="50%" height="10%" />
                <CurrentPositionInfo top="10%" left="70%" width="30%" />
                <FlagButton top="23%" width="20%" height="10%" />
                <AdjustAcceleration
                    top="23%"
                    left="30%"
                    width="20%"
                    height="7%"
                />
                <RollerButtons top="35%" width="40%" height="10%" />
                <BucketButtons top="70%" width="50%" height="10%" />
                <CursorInfoLabel
                    borderColor="yellow"
                    top="50%"
                    left="50%"
                    width="20%"
                />
                <SelectedInfoLabel
                    borderColor="pink"
                    top="50%"
                    left="75%"
                    width="20%"
                />
                <ControllerSwitch top="90%" left="20%" />
                <FloorHarvest top="90%" left="10%" />
            </Box>
        </Flex>
    );
}

export default App;
