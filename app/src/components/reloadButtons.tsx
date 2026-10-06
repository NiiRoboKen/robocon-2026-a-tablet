import { Button, Box, type BoxProps } from "@chakra-ui/react";
import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { buildCommandMessage } from "@/utils/messageBuilder";
import type { Commands } from "@/types";

export function ReloadButtons(props: BoxProps) {
  const { send } = useWebSocketStore();
  function sendCommand(command: Commands) {
    send(buildCommandMessage(command));
  }
  return (
    <Box
      position="absolute"
      display="flex"
      gap="5px"
      borderWidth="5px"
      {...props}
    >
      <Button height="100%" flex="1" onClick={() => sendCommand("belt_load")}>
        装填開始
      </Button>
      <Button height="100%" flex="1" onClick={() => sendCommand("belt_reload")}>
        リロード
      </Button>
      <Button
        height="100%"
        flex="1"
        onClick={() => sendCommand("belt_reload_finish")}
      >
        リロード完了
      </Button>
    </Box>
  );
}
