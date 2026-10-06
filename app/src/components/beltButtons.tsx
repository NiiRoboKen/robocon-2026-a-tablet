import { Button, Box, type BoxProps } from "@chakra-ui/react";
import { useControlStore } from "@/stores/useControleStore";

export function BeltButtons(props: BoxProps) {
    const { setTargetBeltObject } = useControlStore();
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
                onClick={() => setTargetBeltObject("fix1")}
            >
                固定1
            </Button>
            <Button
                height="100%"
                flexGrow="1"
                flex="1"
                fontSize="2xl"
                onClick={() => setTargetBeltObject("fix2")}
            >
                固定2
            </Button>
            <Button
                height="100%"
                flexGrow="1"
                flex="1"
                fontSize="2xl"
                onClick={() => setTargetBeltObject("fix3")}
            >
                固定3
            </Button>
            <Button
                height="100%"
                flexGrow="1"
                flex="1"
                fontSize="2xl"
                onClick={() => setTargetBeltObject("table")}
            >
                机
            </Button>
        </Box>
    );
}
