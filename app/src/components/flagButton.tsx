import { Button, Box, type BoxProps } from "@chakra-ui/react";

const handleFlagButton = () => {
    return;
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
