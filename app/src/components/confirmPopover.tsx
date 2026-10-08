import { Button, Popover, Portal } from "@chakra-ui/react";

export const ConfirmPopover = ({ title, handleClick, children }) => {
  return (
    <Popover.Root size="xs">
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content width="2xs" css={{ "--popover-bg": "lightblue" }}>
            <Popover.Arrow />
            <Popover.Body>
              <Popover.Title
                display="flex"
                justifyContent="center"
                fontWeight="medium"
              >
                {title}
              </Popover.Title>
            </Popover.Body>
            <Popover.Footer
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Popover.CloseTrigger>
                <Button onClick={handleClick}>実行</Button>
              </Popover.CloseTrigger>
            </Popover.Footer>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};
