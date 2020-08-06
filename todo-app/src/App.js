import React from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AddNote from "./components/add-notes/addNote";
import GetNotes from "./components/get-notes/getNotes.jsx";
import GetSingleNote from "./components/get-single-note/getSingleNote";
import UpdateNote from "./components/update-note/updateNote";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://casual-egret-35.hasura.app/v1/graphql",
});

function App() {
  return (
    <Router>
      <Switch>
        <ApolloProvider client={client}>
          <Route exact path="/" component={AddNote} />
          <Route exact path="/notes" component={GetNotes} />
          <Route exact path="/notes/:id" component={GetSingleNote} />
          <Route exact path="/note/:id" component={UpdateNote} />
        </ApolloProvider>
      </Switch>
    </Router>
  );
}

export default App;