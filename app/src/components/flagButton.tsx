import { Button, Box, type BoxProps, Icon, Text } from "@chakra-ui/react";
import { useWebSocketStore } from "@/stores/useWebSocketStore";
import { useRobotStore } from "@/stores/useRobotStore";
import { buildCommandMessage } from "@/utils/messageBuilder";
import { IoIosFlag } from "react-icons/io";

export function FlagButton(props: BoxProps) {
    const { robotState } = useRobotStore();
    const isDisabled = robotState?.gamepad_used ?? false;
    const handleFlagButton = () => {
        useWebSocketStore.getState().send(buildCommandMessage("belt_flag"));
    };
    return (
        <Box position="absolute" borderWidth="5px" {...props}>
            <Button
                w="100%"
                h="100%"
                onClick={handleFlagButton}
                disabled={isDisabled}
                bgGradient="to-r"
                gradientFrom="yellow"
                gradientTo="pink.500"
                color="black"
            >
                <Box display="flex" gap="5px" alignItems="center">
                    <Icon size="2xl" color="red">
                        <IoIosFlag />
                    </Icon>
                    <Text fontSize="2xl">旗</Text>
                    <Icon size="2xl" color="blue">
                        <IoIosFlag />
                    </Icon>
                </Box>
            </Button>
        </Box>
    );
}
