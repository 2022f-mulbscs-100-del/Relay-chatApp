import { useEffect, useLayoutEffect, useRef } from "react";
import { useUser } from "../../context/UserProvider";
import { normalizeDate } from "../../utlis/NormalizeDate";
type ChatMessageProps = {
    messageList: {
        fromUserId: number;
        content: string;
        createdAt?: Date;
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


    return (
        <>
            {messageList.map((message, index) => {
                const isMyMessage = message.fromUserId === Number(user?.id);
                return (
                    <div key={index} className="flex my-2">
                        <div
                            className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${isMyMessage
                                ? 'bg-slate-900 text-white ml-auto rounded-br-md'
                                : 'bg-white text-slate-900 border border-slate-200 rounded-bl-md'
                                }`}
                        >
                            <p ref={index === messageList.length - 1 ? lastMessageRef : null}>
                                {message.content}
                            </p>
                            {message.createdAt && (
                                <p className="text-xs text-slate-400">
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
