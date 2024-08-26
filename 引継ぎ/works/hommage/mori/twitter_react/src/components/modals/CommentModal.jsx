import { memo } from "react";
import { Button, Modal } from "react-bootstrap";
import { IoArrowBack } from "react-icons/io5";
import { InputField } from "../atoms/InputField";
import { CommentModalHook } from "../../hooks/modal/CommentModalHook";

export const CommentModal = memo(({ showCommentModal, setShowCommentModal, tweet_id }) => {
    const {
        onChangeComment,
        onClickComment,
        comment
    } = CommentModalHook(
        showCommentModal,
        setShowCommentModal,
        tweet_id
    );


    if (!showCommentModal) return <></>
    return (
        <div className="overlay">
            <div
                className="modal show"
                style={{ display: 'block', position: 'initial' }}
            >
                <Modal.Dialog>
                    <Modal.Header>
                        <IoArrowBack onClick={() => setShowCommentModal(!showCommentModal)} />
                        <Modal.Title>コメント</Modal.Title>
                    </Modal.Header>

                    <form className="comment-form" action="">
                        <Modal.Body>
                            <InputField
                                type='text'
                                name='content'
                                value={comment.content}
                                onChange={onChangeComment}
                                placeholder='コメントを投稿しよう'
                            />
                        </Modal.Body>

                        <Modal.Footer>
                            {comment.content.length > 0 ?
                                <Button onClick={onClickComment}>コメントを投稿する</Button>
                                : <Button disabled>コメントを投稿する</Button>
                            }
                        </Modal.Footer>
                    </form>
                </Modal.Dialog>
            </div>
        </div>
    );
})