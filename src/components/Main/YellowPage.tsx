import type { TagProps } from "antd";
import { Input, Space, Tag, theme, Tooltip } from "antd";
import type { MouseEventHandler } from "react";
import { useRef } from "react";

interface ItemProps {
    label: React.ReactNode;
    icon?: React.ReactNode;
    link: string;
    description?: string;
    tags?: (string | { color: TagProps["color"]; text: string })[];
    action?: (args: any[]) => void;
}
const { useToken } = theme;
function LinkItem({ label, icon, link, description, tags, action }: ItemProps) {
    const { token } = useToken();
    const aRef = useRef<HTMLAnchorElement>(null);
    const handleClick: MouseEventHandler<HTMLDivElement> = () => {
        aRef.current?.click();
    };
    return (
        <Tooltip title={description}>
            <Space
                onClick={handleClick}
                size={30}
                style={{
                    cursor: "pointer",
                    width: "calc(100% - 16px * 2)",
                    backgroundColor: token.colorBgTextHover,
                    borderRadius: token.borderRadius,
                    padding: "8px 16px",
                    marginBottom: "8px",
                    border: `1px solid ${token.colorBorder}`,
                    transition: "all .3s ease-in-out",
                }}
                onMouseEnter={(event) => {
                    event.currentTarget.style.backgroundColor =
                        token.colorPrimaryBgHover;
                }}
                onMouseLeave={(event) => {
                    event.currentTarget.style.backgroundColor =
                        token.colorBgTextHover;
                }}
            >
                {icon}
                {label}
                <Space size={8} wrap>
                    {tags?.map((tag, index) => (
                        <Tag
                            key={index}
                            color={
                                typeof tag === "string"
                                    ? token.colorBgTextHover
                                    : tag.color
                            }
                        >
                            <span style={{ color: token.colorTextDescription }}>
                                {typeof tag === "string" ? tag : tag.text}
                            </span>
                        </Tag>
                    ))}
                </Space>
                {!!action && (
                    <Input
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                        placeholder="请输入洛谷题号"
                        onPressEnter={(event) => {
                            action(event.currentTarget.value.split(","));
                        }}
                    />
                )}
                <a ref={aRef} href={link} target="_blank" hidden />
            </Space>
        </Tooltip>
    );
}

const Items: ItemProps[] = [
    {
        label: "编程知识速查",
        link: "https://wangchujiang.com/reference/index.html",
        description: "各种语言和编程相关的知识速查网站.",
        tags: ["速查", "知识", "备忘"],
    },
    {
        label: "C++ 语法速查",
        link: "https://www.runoob.com/cplusplus/cpp-tutorial.html",
        description: "c++ 的语法速查网站.",
        tags: ["菜鸟教程", "c++", "知识"],
    },
    {
        label: "洛谷",
        link: "https://www.luogu.com.cn/",
        description: "c++做题网站,提供在线提交代码和检测.",
        tags: ["测试", "c++", "学习"],
        action: (args) => {
            // 判断是否是字符串;
            if (typeof args[0] === "string") {
                if (args[0].startsWith("http")) {
                    window.open(args[0]);
                } else {
                    window.open(`https://www.luogu.com.cn/problem/${args[0]}`);
                }
            }
        },
    },
    {
        label: "ChatGPT",
        link: "https://chatgpt.com/",
        description:
            "著名的AI对话工具, 可以帮助解决各种问题, 包括编程问题. 缺点是需要翻墙",
        tags: [
            "工具",
            "AI",
            "大规模语言模型",
            { color: "warning", text: "需要翻墙" },
        ],
    },
    {
        label: "通义千问",
        link: "https://tongyi.aliyun.com/",
        description:
            "由阿里研发的大语言模型AI对话工具, 国内比较强大的模型之一. 不如ChatGPT效果更好, 但不需要翻墙.",
        tags: ["工具", "AI", "大规模语言模型"],
    },
    {
        label: "秘塔AI搜索",
        link: "https://metaso.cn/",
        description:
            "基于大语言模型的新一代搜索引擎, 更能理解用户意图, 简洁 干净 快速 准确.",
        tags: ["工具", "AI", "大规模语言模型", "搜索引擎"],
    },
    {
        label: "SUNO",
        link: "https://suno.com/",
        description: "AI作曲网站, 快速生成音乐, 快速生成歌词. 效果不错",
        tags: ["工具", "AI", "大规模语言模型", "AI音乐"],
    },
    {
        label: "码云(gitee)",
        link: "https://gitee.com/",
        description:
            "国内类似Github的网站, 支持代码片段分享, 可以创建代码片段给学生分享.",
        tags: ["工具", "远程Git", "云库", "Github Gist"],
    },
    {
        label: "码云代码片段直达(gitee)",
        link: "https://gitee.com/dashboard/codes",
        description: "用于分享代码片段的码云直达链接. 需要账号.",
        tags: [
            "工具",
            "代码片段",
            "Github Gist",
            { color: "warning", text: "需要账号" },
        ],
    },
];

function YellowPage() {
    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            {Items.map((item, index) => (
                <LinkItem key={index} {...item} />
            ))}
        </Space>
    );
}

export default YellowPage;
