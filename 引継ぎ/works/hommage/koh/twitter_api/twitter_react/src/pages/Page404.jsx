import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Page404 = () => {
  const navigate = useNavigate();
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={1}
      sx={{ height: "100vh" }}
    >
      <Typography>このページは存在しません。</Typography>
      <Button
        type="submit"
        variant="contained"
        size="large"
        sx={{ borderRadius: 50, fontWeight: "bold" }}
        onClick={() => {
          navigate("/home");
        }}
      >
        ホームに戻る
      </Button>
    </Stack>
  );
};
