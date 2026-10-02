import { Button, Box, Flex } from "@chakra-ui/react";

export function ReloadButtons(ref) {
  return (
    <Box display="flex" position="absolute" ref={ref}>
      <Button>Button1</Button>
      <Button>Button2</Button>
      <Button>Button3</Button>
    </Box>
  );
}
