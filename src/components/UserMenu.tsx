"use client"; // ¡esto es obligatorio!

import { Flex, Text, Button, Avatar } from "@chakra-ui/react";
import { MdLogout } from "react-icons/md";
import { useRouter } from "next/navigation";

export const UserMenu = () => {
  const router = useRouter();
  // const [user, setUser] = useState<User>();

  // const { username } = user;

  const username = "Martín Pérez";

  const handleSignOut = () => {
    router.push("/iniciar");
  };

  return (
    <Flex flexDir="column" gap="1rem">
      <Flex alignItems="center" gap="0.75rem">
        <Avatar
          w="2rem"
          h="2rem"
          size="sm"
          bg="black"
          color="white"
          name={username}
        />
        <Text fontWeight="bold">{username}</Text>
      </Flex>
      <Button
        bg="#f2f2f2"
        borderRadius="0.5rem"
        color="black"
        fontWeight="semibold"
        justifyContent="start"
        gap="0.25rem"
        px="0.75rem"
        onClick={handleSignOut}
        leftIcon={<MdLogout />}
        _hover={{ color: "black", bg: "#e0dede" }}
      >
        Cerrar sesión
      </Button>
    </Flex>
  );
};
