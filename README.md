<h2> A Comprehensive Tutorial on How to Get Started with Hasura GraphQl and Create a Todo Notes App.</h2>

<h3> Table of Contents</h3>

1. [Overview](#Overview)
    1. [Short Note](#note)
    2. [About Hasura](#reason)
    3. [A Little Bit About GraphQl](#graphql)
2. [Technologies](#Technologies)
    1. [Technologies used](#tech)
    2. [Creating a GraphQl endpoint](#gql)
    3. [Schema creation](#schema)
3. [Tools that Need to be Installed](#tools)
4. [Folder Structure](#folder)
5. [Configure the Apollo Client](#config)
6. [Creating the Components](#components)
   1. [Create a Note](#add-note)
       1. [Create the Mutation for creating a note](#add-note-query)
       2. [Create the `CreateNote` functional component](#add-note-jsx)
       3. [Styling the `CreateNote` page](#add-note-css)
   2. [Getting all Notes](#get-notes)
       1. [Create the Query for getting all notes](#get-notes-query)
       2. [Create the Mutation Query for deleting a note](#delete-note-query)
       3. [Create the `GetNotes` functional component](#get-notes-jsx)
       4. [Styling the `GetNotes` page](#get-notes-css)
   3. [Getting a Note](#get-single-note)
       1. [Create the Query for getting a single note](#get-single-note-query)
       2. [Create the `GetSingleNote` functional component](#get-single-note-jsx)
       3. [Styling the `GetSingleNotes` page](#get-single-note-css)
   4. [Update a Note](#update-note)
       1. [Create the Query for updating a note](#update-note-query)
       2. [Update the `UpdateNote` functional component](#update-note-jsx)
7. [Adding the overall style in `index.css`](#index-css)
8. [Adding the routes functionality](#routes)


### Overview

#### <ins>Short Note:</ins> <a name="note"></a>
I discovered the Hasura Graphql Engine when I joined an organization earlier this year.  We were about to migrate the microservices architecture we had for our systems into a mono repo and we were looking for something very fast and flexible. Voila, we picked up Hasura!

#### <ins>What exactly is Hasura and what makes it very different?</ins> <a name="reason"></a>
Hasura is a very fast Graphql server that gives you an instant and real-time GraphQL APIs. Basically, the aim is to make application development easy. 
Traditionally, before a frontend app can be created, backend APIs have to be created first which makes the process kind of two-dimensional _or more_ and longer, but Hasura solves it in a one-dimensional way whereby Apis can be created alongside rendering the UI and data can be stored in one environment coupled with the ease of using GraphQl for its API architecture flexibility.

#### <ins>Understanding Core GraphQl Concepts that will be used during the course of this tutorial:</ins> <a name="graphql"></a>
##### <ins>The Schema Definition Language (SDL):</ins>  
This concept is used to define the schema of an API; for example - a simple type `Person`

```
type Person {
  name: String!
  age: Int!
}
```

##### <ins>A fixed endpoint:</ins>
GraphQl uses a fixed endpoint unlike how the Rest API architecture is structured in a way that a _specific _ set of information is meant to be returned from a/some _specific_ endpoint(s). The structure of the data that is returned from a GraphQl API is not fixed. It is flexible and the client can decide exactly what data is needed.

##### <ins>Queries:</ins>
an example is:
```
type Query {
  notes {
    title
  }
}
```
- `notes` represent the root of a query while the `title` represent a query's payload. Most times, the root of the query represents a db table.
- `query` allows a client to fetch data in a request.

##### <ins>Mutations:</ins>
an example is:
```
type Mutation {
  notes(title: String!)
}
```
- `mutation` modifies the data in the data store and returns a value.
- In the code above, it takes in an argument `title` recognized as a string.

<hr>

**Let us get started:**

### Technologies

The technologies that will be used in creating this app are: <a name="tech"></a>

- Node.js (make sure this is installed)
- ReactJs
- Hasura
- Postgres

Create GraphQl endpoint <a name="gql"></a>

Firstly, since we are using the `Hasura Graphql Engine`, we have to create a graphql endpoint through Hasura cloud. Head off to [https://hasura.io/](https://hasura.io/) to create an account, if you don't have one. 

Create a new project and click on `Try with Heroku`(which means that your database will sit on Heroku). After that, your graphql playground is all set up! Click on `launch console` to view it.

Create your schema like below: <a name="schema"></a>


_Copy the graphql url as we will be using it during the course of this tutorial._

<hr>

## Step 1: <a name="tools"></a>

#### Some tools/libraries need to be installed 

- `npx create-react-app todo-app` - to quickly create a new react app into a folder called `todo-app`   and save you from a time-consuming setup and configuration process.
- `npm install react-router-dom -S` - a tool that allows you to handle routing in your react application.
- `npm install @apollo/client -S` - a state management library that allows you manage both local and remote data with graphql.
- `npm install graphql -S` - a tool that allows you build a graphql schema and serve queries against that schema.
- `npm install react-icons --save-dev` - a tool that allows you to import and make use of free icons.
- `npm install toasted notes react spring --save-dev` - a tool for rendering alerts and messages.

Once the react application has been created, it automatically installs the basic tools needed to start a new react app. You can check it by using: `npm run start`

## Step 2: <a name="folder"></a>

#### Creating basic folders 

In the *src* folder, create new folders called: _components_ and _queries_ .

Also, in the already created _components_ folder, create other folders called: _add-notes_, _get-notes_, _get-single-note_, _update-note_

## Step 3: <a name="config"></a>

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
  uri: "https://casual-egret-35.hasura.app/v1/graphql", // you can use your own `uri` if you like!
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
- `InMemoryCache` was also added as a property to cache queries. As seen from the docs: _enables the client to respond to future queries for the same data without sending unnecessary network requests._
- The component(s) routes will be wrapped in `ApolloProvider` which enables you to access the client from anywhere.

## Step 4:

### Creating the components <a name="components"></a>

1. #### <ins>Creating a note:</ins> <a name="add-note"></a>

In the _queries_ folder, create a file called `index.js` and add the following code: 

##### A query to add a note <a name="add-note-query"></a>

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

- `gql` is imported from the apollo client used in parsing a string into a document.
- The `insertNoteMutation` is a function created to create/modify the data in the database and return some values using the graphql `mutation query` and the prefix `insert` for the table `notes`.

In the _add-notes_ folder, create a file called `addNote.jsx` and add the following code: <a name="add-note-jsx"></a>

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

- The above is a functional component making use of react hooks and apollo client hooks.
_quick-note: hooks allow us to define states without writing a class._
- Some required libraries are imported.
- The declaration of all the state variables.
- A function called `handleSubmit` is created to destructure objects(variables) from the `insertNote` state, remember that the `insertNote` state was already assigned to the imported function `insertNoteMutation`.
- `react toast notify` is used in both handling successful and error messages,
- Finally, in order to render the results, a `return` function is declared by creating a form and input boxes that each take in a variable/state and the `onchange` event is used when the value changes.

Create another file called `addNote.css` and add the following code to style the page: <a name="add-note-css"></a>

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

2. #### <ins>Getting all notes:</ins> <a name="get-notes"></a> 

In the file called `index.js` in the _queries_ folder, add the following code: 

##### A query to get all notes <a name="get-notes-query"></a>

```
export const getNotesQuery = gql`
query {
  notes(order_by: { createdOn: desc }) {
    id
    name
  }
}
`;
```

*Note:*

- The `getNotesQuery` is a function created to retrieve the data of the specified variables in the database using the graphql `query`.


##### A query to delete a note <a name="delete-note-query"></a>

```
export const deleteNoteMutation = gql`
mutation($id: Int!) {
  delete_notes (
      where: {id: {_eq: $id}}
  ){
     affected_rows
  }
} 
`;
```

*Note:*

- the `deleteNoteMutation` is a function created to remove the specified data(id) in the database using the graphql `mutation query`

In the _get-notes_ folder, create a file called `getNotes.jsx` and add the following code: <a name="get-notes-jsx"></a>

```
import React from "react";
import { Link } from "react-router-dom";
import { getNotesQuery } from "../../queries/index";
import { useQuery, useMutation } from "@apollo/client";
import { FaRegEdit, FaExternalLinkAlt } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { deleteNoteMutation } from "../../queries";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import "./getNotes.css";

export default function GetNotes(props) {
    const [deleteNote] = useMutation(deleteNoteMutation);
    const { error, loading, data }
        = useQuery(getNotesQuery)
    if (loading) {
        return <p className="load">Loading...</p>;
    }
    if (error) {
        return toast.notify("An error occured!");
    }

    const deleteNoteId = async (id) => {
        await deleteNote({
            variables: { id }
        });
        props.history.push("/notes");
        window.location.reload();
    }

    return (
        <div >
            <p className="title">All notes.</p>
            {data.notes.map((item) =>
                <div key={item.id} className="list-head">
                    <ul className="list-items">
                        <Link className="item-link"
                            to={{
                                pathname:
                                    `/notes/${item.id}`
                            }} ><FaExternalLinkAlt className="external-link" />
                        </Link>
                        <li className="item-name">{item.name}</li>
                        <li>{item.description}</li>
                        <li className="item-tag">{item.tag}</li>
                        <li className="item-link">
                            <Link className="item-link"
                                to={{
                                    pathname:
                                        `/note/${item.id}`
                                }} >
                                <FaRegEdit />
                            </Link>
                            <MdDeleteForever className="item-link" onClick={(e) => { const r = window.confirm("Do you really want to delete this resource?"); if (r == true) deleteNoteId(item.id) }} />
                        </li>
                    </ul>
                </div>)}
        </div>
    );
}
```
*Note:*

- Some required libraries are imported.
- Declare the state for `deleteNote` assigned to the `deleteNoteMutation`.
- Required objects were de-structured from the `getNotesQuery` query.
- A function `deleteNoteId` is created to handle the id from the variable gotten from the `deleteNote` state for deletion.
- Finally, in order to render the results, a `return` function is declared by creating a list and the values rendered as mini cards.

Create another file called `getNotes.css` and add the following code to style the page: <a name="get-notes-css"></a>

```
.external-link {
    float: right;
}

a {
    color: #FFF;
}

a:hover {
    color: #000
}

.list-head {
    color: #d9d4d4;
    margin: 0 2.5%;
    float: left;
    width: 20%;
}

.list-items {
    text-align: center;
    border: 1px solid black;
    list-style: none;
    margin: 8px -16px;
    background-color: #3b3c40;
}


.item-name {
    font-size: 20px;
}

.item-tag {
    font-size: 12px;
    margin-top: 8%;
}

@media screen and (max-width: 900px) {
    .list-head {
        width: 40%;
        margin-left: 6%;
    }
}

@media screen and (max-width: 600px) {
    .list-head {
        width: 90%;
        margin-left: 5%;
    }
}
```

<hr>

3. #### <ins>Getting a single note:</ins> <a name="get-single-note"></a>

In the file called `index.js` in the _queries_ folder, add the following code:

##### A query to get a single note <a name="get-single-note-query"></a>

```
export const getSingleNoteQuery = gql`
query ($id: Int!){
  notes_by_pk(id: $id) {
    id
    name
    description
    tag
    createdOn
  }
}
`;
```

*Note:*

- The `getSingleNoteQuery` is a function created to retrieve a specific data(id) of the specified variables in the database using the graphql `query`.

In the _get-single-note_ folder, create a file called `getSingleNote.jsx` and add the following code: <a name="get-single-note-jsx"></a>

```
import React from "react";
import { getSingleNoteQuery } from "../../queries/index";
import { useQuery } from "@apollo/client";
import "./getSingleNote.css";

export default function GetSingleNote(props) {

    const {
        match: {
            params: { id },
        },
    } = props;
    const { error, loading, data }
        = useQuery(getSingleNoteQuery, { variables: { id } })
    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>An Error Occured.</p>;
    }
    const { name, description, tag } = data.notes_by_pk;
    console.log(name)

    return (
        <div className="single-container">
            <p className="single-note-name">{name}</p>
            <hr />
            <p className="single-note-desc">{description}</p>
            <p className="single-note-tag"><span>{tag}</span></p>
        </div >
    );
}
```
*Note:*

- Some required libraries are imported.
- Required objects were de-structured from the `getSingleNoteQuery` query.
- Finally, in order to render the results, a `return` function is declared by rendering the values gotten from the data object.

Create another file called `getSingleNote.css` and add the following code to style the page: <a name="get-single-note-css"></a>

```
.single-container {
    margin-top: 15%;
    margin: auto;
    width: 30%;
    padding: 50px;
    border: 1px solid beige;
    color: white;
    padding-inline-start: 30px;
}

.single-note-name {
    font-size: 30px;
    text-align: center;
}

.single-note-desc {
    font-size: 15px;
    text-align: center;
}

.single-note-tag {
    margin-top: 12%;
    font-size: 16px;
}

.single-note-tag span {
    background-color: purple;
}

@media screen and (max-width: 800px) {
    .single-container {
        display: inline-block;
        width: 78%;
        margin: 0 auto;
    }
}
```

<hr>

4. #### <ins>Updating a note:</ins> <a name="update-note"></a> <a name="update-note"></a>

In the file called `index.js` in the _queries_ folder, add the following code:

##### A query to update a note <a name="update-note-query"></a>

```
export const updateNoteMutation = gql`
  mutation ($name: String!, $description: String!, $tag: String!, $id: Int!) {
    update_notes(where: {id: {_eq: $id}}, _set: {name: $name, description: $description, tag: $tag}) {
      affected_rows
    }
  }
`;
```

*Note:*

- The `updateNoteMutation` is a function created to modify the data in the database using the graphql `mutation query` and the prefix `update` for the table `notes`.

In the _update-note_ folder, create a file called `updateNote.jsx` and add the following code: <a name="update-note-jsx"></a>

```
import React, { useState } from "react";
import { updateNoteMutation } from "../../queries";
import { useMutation } from "@apollo/client";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";

export default function UpdateNote(props) {
    const [loading, setLoading] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [tag, setTag] = useState("");
    const [updateNote] = useMutation(updateNoteMutation);

    const {
        match: {
            params: { id },
        },
    } = props;


    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            setLoading(true);
            await updateNote({
                variables: { id, name, description, tag }
            });
            props.history.push("/notes");
            if (true) toast.notify("Successful")
            window.location.reload();
        } catch (error) {
            setLoading(false);
            if (error) toast.notify("Something went wrong. Please try again later.");
        }
    }

    if (loading) {
        return <p className="load">Loading...</p>
    }

    return (
        <>
            <p className="title">Update your note.</p>
            <div className="container">
                <form onSubmit={handleSubmit} align="center">
                    <input
                        type="text"
                        value={name}
                        placeholder="Name"
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <textarea
                        type="text"
                        value={description}
                        placeholder="Description"
                        onChange={e => setDescription(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        value={tag}
                        placeholder="Tag"
                        onChange={e => setTag(e.target.value)}
                        required
                    />
                    <br />
                    <input type="submit" value="update" className="button" />
                </form>
            </div>
        </>
    );
};
```
*Note:*

- Declare all the required states.
- A function called `handleSubmit` is created to destructure objects(variables) from the `updateNote` state, remember that the `updateNote` state was already assigned to the imported function `updateNoteMutation`. This function helps to modify the exsiting data.
- Finally in order to render the results, a `return` function is declared by creating a form and input boxes that each take in a variable/state and the `onchange` event is used when the value changes.

<hr>

Add this to `index.css` to style the overall pages: <a name="index-css"></a>

```
@import url('https://fonts.googleapis.com/css2?family=Quicksand&display=swap');

body {
  font-family: 'Quicksand', sans-serif;
  background-color: #0f1012;
}

.load {
  margin-top: 20%;
  text-align: center;
  font-size: 25px;
  color: white;
}

input[type=text] {
  width: 100%;
  padding: 12px;
  margin: 1px 0 10px 0;
  border: 1px solid #3b3c40;
  background: white;

}

textarea {
  width: 100%;
  padding: 10px;
  margin: 1px 0 10px 0;
  border: 1px solid #3b3c40;
  background: white;

}
```


<hr>

## Step 5:

Finally, let us create the routes in the `App.js` file and add the following code:

```
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
```
*Note:*

- The functions are imported and passed in as an object in different routes.
- `The ApolloProvider` wraps up all the routes.

<hr>

Run `npm start` to start the server and the routes should be able to function in your browser.

The routes. <a name="routes"></a>

| Routes                   | Description             |
| ------------------------ | ----------------------- |
| localhost:3000           | A form to add a note    |
| localhost:3000/notes     | All notes ever created  |
| localhost:3000/notes/:id | A single note           |
| localhost:3000/note/:id  | A form to update a note |

_There is no route for the delete option but it(delete) acts as a button function on the `get all notes` route._

**That marks the end of this tutorial. I hope you find it worthwhile!** :heart:
