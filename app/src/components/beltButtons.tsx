import { Button, Box, type BoxProps } from "@chakra-ui/react";

const handleFix1Button = () => {
    return;
};
const handleFix2Button = () => {
    return;
};
const handleFix3Button = () => {
    return;
};
const handleTableButton = () => {
    return;
};
export function BeltButtons(props: BoxProps) {
    return (
        <Box
            position="absolute"
            display="flex"
            borderWidth="5px"
            gap="5px"
            justifyContent="space-between"
            {...props}
        >
            <Button
                height="100%"
                flexGrow="1"
                flex="1"
                fontSize="2xl"
                onClick={handleFix1Button}
            >
                固定1
            </Button>
            <Button
                height="100%"
                flexGrow="1"
                flex="1"
                fontSize="2xl"
                onClick={handleFix2Button}
            >
                固定2
            </Button>
            <Button
                height="100%"
                flexGrow="1"
                flex="1"
                fontSize="2xl"
                onClick={handleFix3Button}
            >
                固定3
            </Button>
            <Button
                height="100%"
                flexGrow="1"
                flex="1"
                fontSize="2xl"
                onClick={handleTableButton}
            >
                机
            </Button>
        </Box>
    );
}
