<h2> A Comprehensive Tutorial on How to Get Started with Hasura and Create a Todo Notes App.</h2>

<ins>**Short Note:**</ins> I discovered the Hasura Graphql Engine when I joined an organization earlier this year.  We were about to migrate the microservices architecture we had for our systems into a mono repo and we were looking for something very fast and flexible. Voila, we picked up Hasura!

<ins>**What exactly is Hasura and what makes it very different?**</ins>
Hasura is a very fast Graphql server that gives you an instant and real-time GraphQL APIs. Bascially, the aim is to make application development easy. 
Traditionally, before a frontend app can be created, backend APIs have to be created first which makes the proccess kind of two-dimensional _or more_ and longer, but Hasura solves it in a one-dimensional way where by graphql Apis can be created alongside rendering the UI.

<hr>

**Let us get started:**

The technologies that will be used in creating this app are: 

- Node.js (make sure this is installed)
- ReactJs
- Hasura
- Postgres

Firstly, since we are using the `Hasura Graphql Engine`, we have to create a graphql endpoint through Hasura cloud. Head off to [https://hasura.io/](https://hasura.io/) to create an account, if you don't have one. 

Create a new project and click on `Try with Heroku`(which means that your database will sit on Heroku).  After that, your graphql playground is all set up! Click on `launch console` to view it.

_Copy the graphql url as we will be uisng it during the course of this tutorial._

<hr>

## Step 1:

#### Some tools/libraries need to be installed

- `npx create-react-app todo-app` - to quickly create a new react app into a folder called `todo-app`   and save you from a time-consuming setup and configuration process.
- `npm install react-router-dom -S` - a tool that allows you to handle routing in your react           application.
- `npm install @apollo/client -S` - a state management library that allows you manage both local and    remote data with graphql.
- `npm install graphql -S` - a tool that allows you build a graphql schema and serve queries against that schema.
- `npm install react-icons --save-dev` - a tool that allows you to import and make use of free icons.
- `npm install toasted notes react spring --save-dev` - a tool for rendering alerts and messages.

Once the react application has been created, it automatically installs the basic tools needed to start a new react app. You can check it by using: `npm run start`

## Step 3:

#### Creating basic folders

In the *src* folder, create new folders called: _components_ and _queries_ .

Also, in the already created _components_ folder, create other folders called: _add-notes_, _get-notes_, _get-single-note_, _edit-note_

## Step 4:

#### Set up apollo client in the react app

In the `App.js` file, delete the contents in it and add:

```
import React from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://casual-egret-35.hasura.app/v1/graphql",
});

function App() {
  return (
        <ApolloProvider client={client}>
        </ApolloProvider>
  );
}

export default App;
```

*Note:*

- `ApolloClient`, `InMemoryCache` and `ApolloProvider` are imported from the Apollo client library.
- A new Apollo client contructor is configured and the GraphQL server's URL is added as a property.
- `InMemoryCache` was also added as a property to cache queries. As seen from the docs: _enables     the client to respond to future queries for the same data without sending unnecessary network        requests._
- The component(s) routes will be wrapped in `ApolloProvider` which enables you to access the client from anywhere.

## Step 5:

<h2 align="center">Creating the components</h2>

1. <h4><ins>Creating a note:</ins></h4>

In the _queries_ folder, create a file called `index.js` and add the following code:

```
import { gql } from "@apollo/client";

export const insertNoteMutation = gql`
  mutation ($name: String!, $description: String!, $tag: String!,) {
    insert_notes(objects: {description: $description, name: $name, tag: $tag}) {
      returning {
        id
        name,
        tag,
        description
      }
    }
  }
`;
```

*Note:*

- `gql` is imported from the apollo client used in parsing a string into a document
- the `insertNoteMutation` is a function created to modify the data in the database and return some values using the graphql `mutation query` and the prefix `insert` for the table `notes`

In the _add-notes_ folder, create a file called `addNote.jsx` and add the following code:

```
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, useHistory } from 'react-router-dom';
import { insertNoteMutation } from "../../queries";
import "./addNote.css";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";

export default function CreateNote() {
    const [insertNote] = useMutation(insertNoteMutation);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [tag, setTags] = useState("");

    let history = useHistory();

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            setLoading(true);
            await insertNote({
                variables: { name, description, tag }
            });
            history.push("/notes");
            if (true) toast.notify("Successful")
        } catch (error) {
            setLoading(false);
            if (error) toast.notify("Something went wrong. Please try again later.")
        }
    }

    if (loading) return <p className="load">Loading ...</p>;

    return (
        <>
            <p className="title">A Simple Notes todo app created with<br /> ReactJs, Hasura, Graphql and Postgres</p>
            <div className="container">
                <p className="little-title">Add a Note </p>
                <form onSubmit={handleSubmit} align="center">
                    <input
                        type="text"
                        value={name}
                        placeholder="Add a name"
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <textarea
                        type="text"
                        value={description}
                        placeholder="Add a description"
                        onChange={e => setDescription(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        value={tag}
                        placeholder="Add a tag"
                        onChange={e => setTags(e.target.value)}
                        required
                    />
                    <br />
                    <input type="submit" value="create" className="button" />
                    <Link to={{
                        pathname: `/notes`
                    }}>
                        {" "}
                        <input type="submit" value="all notes" className="button" />
                    </Link>
                </form>
            </div>
        </>
    );
};

```
*Note:*

- the above is a functional component making use of react hooks and apollo client hooks.
_quick-note: hooks allow us to define states without using a class._
- required libraries are imported
- declaration of all the state variables
- a function called `handleSubmit` is created to destructure objects(variables) from the `insertNote` state, remember that the `insertNote` state was already assigned to the imported function `insertNoteMutation`
- `react toast notify` is used in both handling successful and error messages
- finally in order to render the results, a `return` function is declared by creating a form and input boxes that each take in a variable/state and the `onchange` event is used when the value changes.

Create another file called `addNote.css` and add the following code to style the page:

```
.container {
    margin-top: 15%;
    margin: auto;
    width: 30%;
    padding: 50px;
    background-color: white;
    padding-inline-start: 30px;
}

.title {
    font-size: 20px;
    text-align: center;
    color: white;
}

.little-title {
    text-align: center;
    font-size: 20px;
}


input[type=text] {
    width: 100%;
    padding: 12px;
    margin: 1px 0 10px 0;
    border: 1px solid #c75bab;
    background: white;

}

textarea {
    width: 100%;
    padding: 10px;
    margin: 1px 0 10px 0;
    border: 1px solid #c75bab;
    background: white;

}

ul {
    padding-inline-start: 0px;
}

.button {
    color: white;
    text-align: center;
    font-size: 16px;
    cursor: pointer;
    width: 25%;
    padding: 8px;
    border: 1px solid #c75bab;
    border-radius: 10px;
    margin-top: 7%;
    background-color: #c75bab;
}
```

<hr>