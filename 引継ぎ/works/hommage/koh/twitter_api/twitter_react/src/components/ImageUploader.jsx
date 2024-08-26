import React from "react";

import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import ImageIcon from "@mui/icons-material/Image";
import { Grid } from "@mui/material";

export const ImageUploader = (props) => {
  const { images, setImages } = props;

  const inputId = Math.random().toString(32).substring(2);

  const handleAttachImage = async (e) => {
    const addFiles = e.target.files;
    if (!addFiles) return;

    const files = [];
    Object.values(addFiles).forEach((file) => files.push(file));
    setImages([...images, ...files]);

    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <>
      <Grid container spacing={3} columns={12} sx={{ mb: 2 }}>
        {images.map((image, index) => (
          <Grid
            key={`newImage-${index}`}
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              position: "relative",
            }}
          >
            <IconButton
              aria-label="delete image"
              style={{
                position: "absolute",
                top: 10,
                right: 0,
                color: "#aaa",
              }}
              onClick={() => handleRemoveImage(index)}
            >
              <CancelIcon />
            </IconButton>
            <img
              src={URL.createObjectURL(image)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                aspectRatio: "1 / 1",
              }}
              alt=""
            />
          </Grid>
        ))}
      </Grid>
      <div style={{ position: "relative" }}>
        <label htmlFor={inputId}>
          <ImageIcon
            color="primary"
            fontSize="large"
            sx={{
              position: "absolute",
              left: 0,
              bottom: 0,
              "&:hover": {
                cursor: "pointer",
                opacity: "0.8",
              },
            }}
          />
          <input
            id={inputId}
            type="file"
            multiple
            accept="image/*,.png,.jpg,.jpeg,.gif"
            onChange={(e) => handleAttachImage(e)}
            style={{ display: "none" }}
          />
        </label>
      </div>
    </>
  );
};
