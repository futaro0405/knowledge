import "./App.css";
import { RecoilRoot } from "recoil";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material";
import { blue } from "@mui/material/colors";

import { SignUp } from "./containers/SignUp.jsx";
import { LogIn } from "./containers/LogIn";
import { PostsIndex } from "./containers/PostsIndex";
import { PostsShow } from "./containers/PostsShow";
import { UsersShow } from "./containers/UsersShow";
import { Page404 } from "./pages/Page404";
import { NotificationsIndex } from "./containers/NotificationsIndex.jsx";
import { MessagesIndex } from "./containers/MessagesIndex.jsx";

import { Layout } from "./layouts/Layout";
import { ToastMessage } from "./components/utils/ToastMessage";
import { Spinner } from "./components/utils/Spinner";
import { ConfirmationDialog } from "./components/utils/ConfirmationDialog.jsx";
import { GroupsIndex } from "./containers/GroupsIndex.jsx";
import { BookmarkingPostsIndex } from "./containers/BookmarkingPostsIndex.jsx";

const theme = createTheme({
  palette: {
    primary: blue,
    secondary: {
      main: "#526471",
      contrastText: "#FFFFFF",
    },
    black: {
      main: "#0E1419",
      contrastText: "#FFFFFF",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <Router>
          <Routes>
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/login" element={<LogIn />} />
            <Route path="/" element={<Layout />}>
              <Route exact path="/home" element={<PostsIndex />} />
              <Route exact path="/not_found" element={<Page404 />} />
              <Route
                exact
                path="/notifications"
                element={<NotificationsIndex />}
              />
              <Route exact path="/messages" element={<GroupsIndex />} />
              <Route path="/messages/:group_id" element={<MessagesIndex />} />
              <Route
                exact
                path="/bookmarks"
                element={<BookmarkingPostsIndex />}
              />
              <Route exact path="/:user_name/:id" element={<PostsShow />} />
              <Route path="/:user_name" element={<UsersShow />} />
              <Route path="*" element={<Page404 />} />
            </Route>
          </Routes>
        </Router>
        <ToastMessage />
        <Spinner />
        <ConfirmationDialog />
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default App;
