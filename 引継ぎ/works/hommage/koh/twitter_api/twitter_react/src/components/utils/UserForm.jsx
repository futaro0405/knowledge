import React from "react";

import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";

export const UserForm = (props) => {
  const { title, buttonName, fields, user, handleChange, handleSubmit } = props;

  return (
    <form>
      <Card sx={{ width: "50%", margin: "3rem auto", textAlign: "center" }}>
        <CardHeader title={title} />
        <CardContent>
          {fields.map((field) => (
            <TextField
              key={field.label}
              required
              fullWidth
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
          <Button
            type="submit"
            variant="contained"
            size="large"
            margin="normal"
            sx={{ borderRadius: 50, fontWeight: "bold" }}
            onClick={handleSubmit}
          >
            {buttonName}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};
