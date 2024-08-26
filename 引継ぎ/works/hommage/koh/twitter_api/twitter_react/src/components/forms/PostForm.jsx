import React from "react";

import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { Avatar, CardActions, Grid } from "@mui/material";

import { ImageUploader } from "../ImageUploader.jsx";

export const PostForm = (props) => {
  const {
    navigate,
    user,
    post,
    images,
    setImages,
    handleChange,
    handleSubmit,
  } = props;

  return (
    <form>
      <Card
        variant="outlined"
        sx={{ borderRight: "none", borderLeft: "none", borderRadius: "0%" }}
      >
        <CardContent>
          <Grid container>
            <Grid item xs={1} sx={{ textAlign: "left" }}>
              <CardActions
                onClick={() => {
                  navigate(`/${user.user_name}`);
                }}
              >
                <Avatar
                  sx={{
                    height: "4vh",
                    width: "4vh",
                    "&:hover": {
                      cursor: "pointer",
                      opacity: "0.8",
                    },
                  }}
                  alt={`${user.name}`}
                  src={`${user.profile_image_path}`}
                />
              </CardActions>
            </Grid>
            <Grid item xs={11}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                name="content"
                value={post.content}
                InputLabelProps={{ shrink: true }}
                placeholder="いまどうしてる？"
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                }}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 7 }}>
              <ImageUploader images={images} setImages={setImages} />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "right" }}>
              <Button
                type="submit"
                disabled={post.content.length === 0}
                variant="contained"
                size="large"
                sx={{ borderRadius: 50, fontWeight: "bold" }}
                onClick={handleSubmit}
              >
                ポストする
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};
