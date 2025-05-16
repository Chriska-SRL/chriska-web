import { Flex } from "@chakra-ui/react";
import { SideBar, Content, WelcomePanel } from "../components";

const HomePage = () => {
  return (
    <Flex bg="#f7f7f7">
      <SideBar />
      <Content>
        <WelcomePanel />
      </Content>
    </Flex>
  );
};

export default HomePage;
