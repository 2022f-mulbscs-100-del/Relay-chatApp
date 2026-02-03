import { useUser } from "../../context/UserProvider";
type ChatMessageProps = {
    messageList: {
        fromUserId: number;
        content: string;
    }[];
}

const ChatMessage = ({
    messageList
}: ChatMessageProps) => {
    const { user } = useUser();
    return (
        <>

            {messageList.map((message, index) => {
               const isMyMessage = message.fromUserId === Number(user?.id);
                return (
                    <div key={index} className="flex my-2">
                        <div
                            className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                isMyMessage
                                    ? 'bg-slate-900 text-white ml-auto rounded-br-md'
                                    : 'bg-white text-slate-900 border border-slate-200 rounded-bl-md'
                            }`}
                        >
                            <p>{message.content}</p>
                        </div>
                    </div>
                );
            })}
        </>
    )
};

export default ChatMessage;
