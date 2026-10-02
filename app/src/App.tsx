import { useWebSocket } from "./hooks/useWebSocket";
import { Konva } from "./components/Konva";
import { ToggleColorMode } from "./components/toggleColorButton";
import "./App.css";
import { SendPositionButton } from "./components/sendPositionButton";
import { SelectedInfoLabel } from "./components/selectedInfoLabel";
import { CursorInfoLabel } from "./components/cursorInfoLabel";
import { Box, Flex } from "@chakra-ui/react";
import { ReloadButtons } from "./components/reloadButtons";

function App() {
  useWebSocket();

  return (
    <Flex>
      <Konva />
      <Box display="absolute" width="70%" height="100%" bg="white">
        <ReloadButtons />
        <SendPositionButton left="50%" />
      </Box>
      <Box width="30%" height="100%" bg="green">
        <ToggleColorMode />
      </Box>
    </Flex>
  );
}

export default App;
