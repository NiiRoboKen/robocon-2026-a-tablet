import { Button, Box, type BoxProps } from "@chakra-ui/react";

const handleMinusButton = () => {
    return;
};
const handlePlusButton = () => {
    return;
};
export function AdjustAcceleration(props: BoxProps) {
    return (
        <Box
            position="absolute"
            display="flex"
            borderWidth="5px"
            gap="20%"
            justifyContent="space-between"
            {...props}
        >
            <Button
                height="100%"
                flexGrow="1"
                flex="1"
                fontSize="6xl"
                onClick={handleMinusButton}
            >
                -
            </Button>
            <Button
                height="100%"
                flexGrow="1"
                flex="1"
                fontSize="6xl"
                onClick={handlePlusButton}
            >
                +
            </Button>
        </Box>
    );
}
