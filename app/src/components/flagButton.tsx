import { Button, Box, type BoxProps } from "@chakra-ui/react";
import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { buildCommandMessage } from "@/utils/messageBuilder";

const handleFlagButton = () => {
  useWebSocketStore.getState().send(buildCommandMessage("belt_flag"));
};

export function FlagButton(props: BoxProps) {
  return (
    <Box position="absolute" borderWidth="5px" {...props}>
      <Button w="100%" h="100%" fontSize="3xl" onClick={handleFlagButton}>
        旗
      </Button>
    </Box>
  );
}
