import { Flex } from "antd";
import React from "react";
import Title from "antd/es/typography/Title";
const Logo: React.FC = () => {
  return (
    <>
      <Flex vertical={false} gap={10} justify="flex-start" align="center">
        <Title
          level={2}
          style={{
            margin: 0,
            lineHeight: 1,
            color: "var(--primary-color)",
            fontWeight: 400,
          }}
        >
          Medhub
        </Title>

        <Title
          level={2}
          style={{
            margin: 0,
            color: "var(--primary-color)",
          }}
        >
          EMR
        </Title>
      </Flex>
    </>
  );
};
export default Logo;
