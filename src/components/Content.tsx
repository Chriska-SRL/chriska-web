import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

export const Content = ({ children }: { children: ReactNode }) => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      h="100vh"
      w="100%"
      minW="75rem"
      bg="#f7f7f7"
    >
      <Flex
        flexDir="column"
        p="1.5rem"
        px="1.75rem"
        w="97%"
        h="95%"
        m="1rem"
        bg="white"
        borderRadius="0.5rem"
        border="2px solid"
        borderColor="#f2f2f2"
        gap="1.25rem"
      >
        {children}
      </Flex>
    </Flex>
  );
};
