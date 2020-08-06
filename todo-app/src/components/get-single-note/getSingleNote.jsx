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