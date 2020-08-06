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