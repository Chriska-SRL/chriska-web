"use client";
import { NextPage } from "next";
import { SideBar, Content, Users } from "@/components";
import { Flex } from "@chakra-ui/react";

const UsersPage: NextPage = () => {
  return (
    <Flex>
      <SideBar currentPage="usuarios" />
      <Content>
        <Users />
      </Content>
    </Flex>
  );
};

export default UsersPage;
