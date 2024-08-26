import { memo } from "react";
import { MessageAreaHook } from "../../hooks/organisms/MessageAreaHook";
import { InputField } from "../atoms/InputField";
import { Button } from "../atoms/Button";
import "../../style/organisms/group/MessageArea.scss";

export const MessageArea = memo(({ currentUserData }) => {
    const {
        messages,
        anotherUser,
        submitMessage,
        message,
        onChangeMessage
    } = MessageAreaHook();

    return (
        <div className="message-area">
            <div className="header">
                <h4>{anotherUser.name}</h4>
            </div>
            {messages.map((message, i) => (
                <div className="messages" key={`messages-${i}`}>
                    <p
                        className={(currentUserData.data.id === message.user_id) ? "my-message" : "opponent-message"}
                    >
                        {message.message}
                    </p>
                </div>
            ))}
            <form className="form" onSubmit={submitMessage}>
                <InputField
                    type='text'
                    name='message'
                    value={message.message}
                    onChange={onChangeMessage}
                />
                <Button>Send</Button>
            </form>
        </div>
    );
})