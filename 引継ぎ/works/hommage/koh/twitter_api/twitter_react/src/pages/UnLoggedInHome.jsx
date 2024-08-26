import React from "react";
import { Box, Button, Typography, Stack, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const UnLoggedInHome = () => {
  const navigate = useNavigate();

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Grid
        item
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="pl-3 mb-5">
          <svg
            className="w-[300px] h-[300px] text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              fill="currentColor"
              d="M12.186 8.672 18.743.947h-2.927l-5.005 5.9-4.44-5.9H0l7.434 9.876-6.986 8.23h2.927l5.434-6.4 4.82 6.4H20L12.186 8.672Zm-2.267 2.671L8.544 9.515 3.2 2.42h2.2l4.312 5.719 1.375 1.828 5.731 7.613h-2.2l-4.699-6.237Z"
            />
          </svg>
        </div>
      </Grid>
      <Grid item md={6}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Stack spacing={2}>
            <Typography sx={{ fontWeight: "bold" }} variant="h2" gutterBottom>
              すべての話題が、ここに。
            </Typography>
            <Typography sx={{ fontWeight: "bold" }} variant="h5" gutterBottom>
              今すぐ参加しましょう。
            </Typography>
            <Button
              sx={{ maxWidth: "25%", borderRadius: 50, fontWeight: "bold" }}
              variant="contained"
              onClick={() => {
                navigate("/signup");
              }}
            >
              アカウントを作成
            </Button>
            <Typography variant="subtitle1" gutterBottom>
              アカウントをお持ちの場合
            </Typography>
            <Button
              sx={{ maxWidth: "25%", borderRadius: 50, fontWeight: "bold" }}
              variant="outlined"
              onClick={() => {
                navigate("/login");
              }}
            >
              ログイン
            </Button>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};
