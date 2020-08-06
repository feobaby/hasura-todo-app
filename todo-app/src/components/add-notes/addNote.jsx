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
            window.location.reload();
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
