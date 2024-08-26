import React from "react";
import { useUserEdit } from "../../hooks/users/useUserEdit.jsx";

import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import {
  Avatar,
  CardMedia,
  IconButton,
  Modal,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";

export const UserEditModal = (props) => {
  const { open } = props;
  const {
    userEditFields,
    user,
    headerImage,
    setHeaderImage,
    profileImage,
    setProfileImage,
    handleClose,
    handleChange,
    handleAttachImage,
    handleSubmit,
  } = useUserEdit(props);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{ width: "50%", margin: "5vh auto", textAlign: "center" }}
    >
      <form>
        <Card>
          {/* ヘッダー */}
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography
              sx={{ ml: 2, flex: 1, fontWeight: "bold", textAlign: "left" }}
              variant="h6"
              component="div"
            >
              プロフィールを編集する
            </Typography>
            <Button
              variant="contained"
              color="black"
              onClick={handleSubmit}
              sx={{
                borderRadius: 50,
                fontWeight: "bold",
              }}
            >
              保存
            </Button>
          </Toolbar>
          {/* 背景画像 */}
          <div style={{ position: "relative" }}>
            <CardMedia
              component="img"
              sx={{ height: "10vh", margin: "0 auto" }}
              // 初期描画時はuserに格納されたurlを使用。
              // 新たに添付された場合その画像からURLを生成して表示する。
              src={
                headerImage
                  ? URL.createObjectURL(headerImage)
                  : user.header_image_path
              }
              alt="背景画像"
            />
            <IconButton
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                margin: "auto",
                height: "4vh",
                width: "4vh",
                background: "grey",
                opacity: "0.7",
                "&:hover": {
                  background: "grey",
                  cursor: "pointer",
                  opacity: "0.6",
                },
              }}
            >
              <label
                htmlFor={user.header_image_path}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AddAPhotoOutlinedIcon
                  color="secondary"
                  sx={{
                    textAlign: "center",
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                />
                <input
                  id={user.header_image_path}
                  type="file"
                  accept="image/*,.png,.jpg,.jpeg,.gif"
                  onChange={(e) => handleAttachImage(e, setHeaderImage)}
                  style={{ display: "none" }}
                />
              </label>
            </IconButton>
          </div>
          {/* プロフィール画像 */}
          <div
            style={{ height: "8vh", width: "8vh", position: "relative", m: 1 }}
          >
            <Avatar
              sx={{ height: "8vh", width: "8vh" }}
              alt={`${user.name}`}
              src={
                profileImage
                  ? URL.createObjectURL(profileImage)
                  : user.profile_image_path
              }
            />
            <IconButton
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                margin: "auto",
                height: "4vh",
                width: "4vh",
                background: "grey",
                opacity: "0.7",
                "&:hover": {
                  background: "grey",
                  cursor: "pointer",
                  opacity: "0.6",
                },
              }}
            >
              <label
                htmlFor={user.profile_image_path}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AddAPhotoOutlinedIcon
                  color="secondary"
                  sx={{
                    textAlign: "center",
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                />
                <input
                  id={user.profile_image_path}
                  type="file"
                  accept="image/*,.png,.jpg,.jpeg,.gif"
                  onChange={(e) => handleAttachImage(e, setProfileImage)}
                  style={{ display: "none" }}
                />
              </label>
            </IconButton>
          </div>
          {/* テキスト項目 */}
          <CardContent>
            {userEditFields.map((field) => (
              <TextField
                key={field.label}
                required={field.required}
                fullWidth
                multiline={field.multiline}
                rows={field.rows}
                type={field.type}
                label={field.label}
                name={field.name}
                value={user[field.name]}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                helperText={field.helperText}
                onChange={handleChange}
              />
            ))}
          </CardContent>
        </Card>
      </form>
    </Modal>
  );
};
