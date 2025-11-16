import { Row, Col } from "antd";
import Title from "antd/es/typography/Title";

export interface FormContainerProps {
  title?: string;
  subTitle?: string;
  children?: React.ReactNode;
}

const MhFormContainer: React.FC<FormContainerProps> = ({
  title,
  subTitle,
  children,
}) => {
  return (
    <>
      {title && (
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              {title}
            </Title>
            {subTitle && (
              <Title
                level={5}
                style={{ marginBottom: 16, fontSize: "12px", color: "grey" }}
              >
                {subTitle}
              </Title>
            )}
          </Col>
        </Row>
      )}

      <Row>{children}</Row>
    </>
  );
};
export default MhFormContainer;
