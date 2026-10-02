import { Button, Box, type BoxProps } from "@chakra-ui/react";

const handleBucketLowButton = () => {
    return;
};
const handleBucketMiddleButton = () => {
    return;
};
const handleBucketHightButton = () => {
    return;
};
const handleReleaseButton = () => {
    return;
};
export function BucketButtons(props: BoxProps) {
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
                onClick={handleBucketLowButton}
            >
                ブレーキ
            </Button>
            <Button
                height="100%"
                flex="1"
                fontSize="2xl"
                onClick={handleBucketMiddleButton}
            >
                加速開始
            </Button>
            <Button
                height="100%"
                flex="1"
                fontSize="2xl"
                onClick={handleBucketHightButton}
            >
                発射
            </Button>
            <Button
                height="100%"
                flex="1"
                fontSize="2xl"
                onClick={handleReleaseButton}
            >
                リリース
            </Button>
        </Box>
    );
}
