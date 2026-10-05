import { Switch, Box, VStack, Text, type BoxProps } from "@chakra-ui/react";
import { HiCheck, HiX } from "react-icons/hi";
import { useRobotStore } from "@/stores/useRobotStore";

const handleChanged = (e: boolean) => {
    console.log("floor harvest changed :" + e);
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
                            <Switch.ThumbIndicator
                                fallback={<HiX color="black" />}
                            >
                                <HiCheck />
                            </Switch.ThumbIndicator>
                        </Switch.Thumb>
                    </Switch.Control>
                </Switch.Root>
            </VStack>
        </Box>
    );
};
