import {
    Switch,
    Box,
    VStack,
    Text,
    type BoxProps,
    Flex,
    Icon,
} from "@chakra-ui/react";
import { HiCheck, HiX } from "react-icons/hi";
import { useRobotStore } from "@/stores/useRobotStore";
import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { buildCommandMessage } from "@/utils/messageBuilder";
import { IoGameController } from "react-icons/io5";

const handleChanged = (e: boolean) => {
    useWebSocketStore
        .getState()
        .send(buildCommandMessage(e ? "gamepad_use" : "tablet_use"));
};

export const ControllerSwitch = (props: BoxProps) => {
    const { robotState } = useRobotStore();
    return (
        <Box pos="absolute" {...props}>
            <VStack gap="2" align="center">
                <Flex gap="5px">
                    <Text fontSize="xl">Game Pad</Text>
                    <Icon size="2xl">
                        <IoGameController />
                    </Icon>
                </Flex>
                <Switch.Root
                    size="lg"
                    checked={robotState?.gamepad_used ?? false}
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
