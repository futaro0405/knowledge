import React from "react";

import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";

import { useNavigate } from "react-router-dom";

export const FollowCard = (props) => {
  const { notification } = props;
  const navigate = useNavigate();

  return (
    <Card
      variant="outlined"
      sx={{
        textAlign: "center",
        borderRight: "none",
        borderLeft: "none",
        borderRadius: "0%",
        p: 0,
      }}
    >
      <CardContent style={{ paddingTop: "0.2rem", paddingBottom: "0.2rem" }}>
        <Grid container>
          <Grid item xs={1} sx={{ textAlign: "left" }}>
            <PersonIcon
              sx={{
                color: "#1E9BF0",
                height: "4vh",
                width: "4vh",
                ml: 1,
                mt: 1,
              }}
            />
          </Grid>
          <Grid item xs={11}>
            <CardHeader
              sx={{ p: 1 }}
              avatar={
                <CardActions
                  sx={{
                    zIndex: (theme) => theme.zIndex.appBar + 1,
                    p: 0,
                    m: 0,
                  }}
                  disableSpacing
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/${notification.sender.user_name}`);
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
                    alt={`${notification.sender.name}`}
                    src={`${notification.sender.profile_image_path}`}
                  />
                </CardActions>
              }
            />
            <Typography
              variant="body1"
              sx={{
                px: 1,
                textAlign: "left",
                whiteSpace: "pre-line",
              }}
              gutterBottom
            >
              <strong
                style={{
                  fontWeight: "bold",
                  paddingRight: "0.5rem",
                  color: "black",
                }}
              >
                {notification.sender.name}
              </strong>
              さんにフォローされました
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
