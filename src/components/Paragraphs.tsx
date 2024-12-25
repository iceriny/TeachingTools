import { Typography } from "antd";
import { FC } from "react";

interface ParagraphsProps {
    strings: React.ReactNode[];
    style?: React.CSSProperties;
}
const Paragraphs: FC<ParagraphsProps> = ({ strings, style }) => {
    return (
        <>
            {strings.map((str, index) => (
                <Typography.Paragraph key={index} style={style}>
                    {str}
                </Typography.Paragraph>
            ))}
        </>
    );
};

export default Paragraphs;
