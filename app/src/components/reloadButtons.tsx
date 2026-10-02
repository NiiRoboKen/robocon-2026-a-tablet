import { Button, Box, type BoxProps } from "@chakra-ui/react";

function handleLoadStartButton() {
    return;
}
function handleReloadButton() {
    return;
}
function handleReloadFinish() {
    return;
}
export function ReloadButtons(props: BoxProps) {
    return (
        <Box
            position="absolute"
            display="flex"
            gap="5px"
            borderWidth="5px"
            {...props}
        >
            <Button height="100%" flex="1" onClick={handleLoadStartButton}>
                装填開始
            </Button>
            <Button height="100%" flex="1" onClick={handleReloadButton}>
                リロード
            </Button>
            <Button height="100%" flex="1" onClick={handleReloadFinish}>
                リロード完了
            </Button>
        </Box>
    );
}
