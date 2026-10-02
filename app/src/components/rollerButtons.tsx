import { Button, Box, type BoxProps } from "@chakra-ui/react";

const handleBrakeButton = () => {
    return;
};
const handleStartAccelerationButton = () => {
    return;
};
const handleLaunchButton = () => {
    return;
};
export function RollerButtons(props: BoxProps) {
    return (
        <Box
            p="1"
            position="absolute"
            display="flex"
            borderWidth="5px"
            gap="5px"
            justifyContent="space-between"
            {...props}
        >
            <Button
                height="100%"
                flex="1"
                fontSize="2xl"
                onClick={handleBrakeButton}
            >
                ブレーキ
            </Button>
            <Button
                height="100%"
                flex="1"
                fontSize="2xl"
                onClick={handleStartAccelerationButton}
            >
                加速開始
            </Button>
            <Button
                height="100%"
                flex="1"
                fontSize="2xl"
                onClick={handleLaunchButton}
            >
                発射
            </Button>
        </Box>
    );
}
