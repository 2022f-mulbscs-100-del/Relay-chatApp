import { useEffect, useLayoutEffect, useRef } from "react";
import { useUser } from "../../context/UserProvider";
import { normalizeDate } from "../../utlis/NormalizeDate";
type ChatMessageProps = {
    messageList: {
        fromUserId: number;
        content: string;
        createdAt?: Date | string;
        ImageUrl?: string | null
    }[];
}

const ChatMessage = ({
    messageList
}: ChatMessageProps) => {
    const { user } = useUser();
    const lastMessageRef = useRef<HTMLDivElement | null>(null);
    const hasMountedRef = useRef(false);
    const InitialScrollRef = useRef(false);

    useLayoutEffect(() => {
        if (!lastMessageRef.current) return;
        if (!hasMountedRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "auto", block: "end" });
            hasMountedRef.current = true;
            InitialScrollRef.current = true;
            lastMessageRef.current.scrollIntoView({ behavior: "auto", block: "end" });
            return;
        }
    }, [messageList]);

    useEffect(() => {
        if (!lastMessageRef.current) return;
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messageList.length]);

    console.log("000",messageList);

    return (
        <>
            {messageList.map((message, index) => {
                const isMyMessage = message.fromUserId === Number(user?.id);
                return (
                    <div key={index} className="flex my-2">
                        <div
                            className={`max-w-[70%] h-full px-3 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${isMyMessage
                                ? 'bg-slate-900 text-white ml-auto rounded-br-md'
                                : 'bg-white text-slate-900 border border-slate-200 rounded-bl-md'
                                }`}
                        >
                            {message.ImageUrl && (
                                <img
                                    src={message.ImageUrl}
                                    alt="Sent image"
                                    className="mb-2 max-h-60 w-auto rounded-lg border border-slate-200 object-cover shadow-sm"
                                />
                            )}
                            <p className=" max-w-[500px] h-full   wrap-break-word" ref={index === messageList.length - 1 ? lastMessageRef : null}>
                                {message.content}
                            </p>
                            {message.createdAt && (
                                <p className="text-xs text-slate-400 ">
                                    {normalizeDate(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    )
};

export default ChatMessage;
