"use client";
import { NextPage } from "next";
import { SideBar, Content, Roles } from "@/components";
import { Flex } from "@chakra-ui/react";

const RolesPage: NextPage = () => {
  return (
    <Flex>
      <SideBar currentPage="roles" />
      <Content>
        <Roles />
      </Content>
    </Flex>
  );
};

export default RolesPage;
