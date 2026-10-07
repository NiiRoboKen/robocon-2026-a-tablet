import { Text, Box, type BoxProps } from "@chakra-ui/react";

export function Label({ children, ...props }: BoxProps) {
    return (
        <Box position="absolute" borderWidth="5px" {...props}>
            <Text fontSize="3xl">{children}</Text>
        </Box>
    );
}
