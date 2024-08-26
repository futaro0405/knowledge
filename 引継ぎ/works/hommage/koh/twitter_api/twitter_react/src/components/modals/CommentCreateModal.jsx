import React from "react";
import { useRecoilValue } from "recoil";

import {
  Avatar,
  CardHeader,
  Grid,
  IconButton,
  Modal,
  Toolbar,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

import { currentUserState } from "../../globalStates/atoms.js";
import { PostCardHeaderTitle } from "../PostCardHeaderTitle.jsx";
import { useCommentCreate } from "../../hooks/comments/useCommentCreate.jsx";
import { formatDateTime } from "../../lib/utility.js";

export const CommentCreateModal = (props) => {
  const { post, open, setOpen } = props;
  const currentUser = useRecoilValue(currentUserState);

  const { comment, handleChange, handleCreateComment } =
    useCommentCreate(props);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      sx={{ width: "50%", margin: "5vh auto", textAlign: "center" }}
    >
      <form>
        <Card>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpen(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
          {/* コメント先の投稿 */}
          <CardContent>
            <Grid container>
              <Grid item xs={1} sx={{ textAlign: "left" }}>
                <Avatar
                  sx={{
                    height: "4vh",
                    width: "4vh",
                  }}
                  alt={`${post.user.name}`}
                  src={`${post.user.profile_image_path}`}
                />
              </Grid>
              <Grid item xs={11}>
                <CardHeader
                  sx={{ p: 1 }}
                  title={
                    <PostCardHeaderTitle
                      header={post.user.name}
                      subHeader={`@${post.user.user_name}・${formatDateTime(
                        new Date(post.created_at)
                      )}`}
                    />
                  }
                />
                <Typography
                  variant="body1"
                  sx={{ px: 1, textAlign: "left", whiteSpace: "pre-line" }}
                  gutterBottom
                >
                  {post.content}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          {/* コメント投稿欄 */}
          <CardContent>
            <Grid container>
              <Grid item xs={1} sx={{ textAlign: "left" }}>
                <Avatar
                  sx={{ height: "4vh", width: "4vh" }}
                  alt={`${post.user.name}`}
                  src={`${currentUser.profile_image_path}`}
                />
              </Grid>
              <Grid item xs={11}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  name="content"
                  value={comment.content}
                  InputLabelProps={{ shrink: true }}
                  placeholder="コメントを追加"
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  onChange={(e) => handleChange(e)}
                />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "right" }}>
                <Button
                  type="submit"
                  disabled={comment.content.length === 0}
                  variant="contained"
                  size="large"
                  sx={{ borderRadius: 50, fontWeight: "bold" }}
                  onClick={(e) => handleCreateComment(e)}
                >
                  コメントする
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </Modal>
  );
};
