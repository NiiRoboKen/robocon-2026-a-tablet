import { Switch, Box, VStack, Text, type BoxProps } from "@chakra-ui/react";
import { HiCheck, HiX } from "react-icons/hi";
import { useRobotStore } from "@/stores/useRobotStore";
import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { buildCommandMessage } from "@/utils/messageBuilder";

const handleChanged = (e: boolean) => {
  console.log("floor harvest changed :" + e);
  useWebSocketStore
    .getState()
    .send(buildCommandMessage(e == true ? "floor_on" : "floor_off"));
  return;
};

export const FloorHarvest = (props: BoxProps) => {
  const { isFloorHarvest } = useRobotStore();
  return (
    <Box pos="absolute" {...props}>
      <VStack gap="2" align="center">
        <Text>床回収</Text>
        <Switch.Root
          size="lg"
          checked={isFloorHarvest}
          onCheckedChange={(e) => handleChanged(e.checked)}
        >
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb>
              <Switch.ThumbIndicator fallback={<HiX color="black" />}>
                <HiCheck />
              </Switch.ThumbIndicator>
            </Switch.Thumb>
          </Switch.Control>
        </Switch.Root>
      </VStack>
    </Box>
  );
};
