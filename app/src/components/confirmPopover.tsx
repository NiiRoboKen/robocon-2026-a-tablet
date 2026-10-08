import { Button, Popover, Portal } from "@chakra-ui/react";

export const ConfirmPopover = ({ title, handleClick, children }) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content css={{ "--popover-bg": "lightblue" }}>
            <Popover.Arrow />
            <Popover.Body>
              <Popover.Title fontWeight="medium">{title}</Popover.Title>
            </Popover.Body>
            <Popover.Footer>
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
