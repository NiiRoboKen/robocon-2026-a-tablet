import { useControlStore } from "@/stores/useControleStore";
import { Button, Box, type BoxProps, Text } from "@chakra-ui/react";

export function AdjustAcceleration(props: BoxProps) {
    const { selectedBeltAcceleration, adjustSelectedBeltAcceleration } =
        useControlStore();
    return (
        <Box
            position="absolute"
            display="flex"
            borderWidth="5px"
            gap="5%"
            justifyContent="space-between"
            {...props}
        >
            <Button
                height="100%"
                flexGrow="1"
                flex="1"
                fontSize="6xl"
                onClick={() => adjustSelectedBeltAcceleration(-1)}
            >
                -
            </Button>
            <Box flex="1">
                <Text textStyle="4xl">{selectedBeltAcceleration}</Text>
            </Box>
            <Button
                height="100%"
                flexGrow="1"
                flex="1"
                fontSize="6xl"
                onClick={() => adjustSelectedBeltAcceleration(1)}
            >
                +
            </Button>
        </Box>
    );
}
