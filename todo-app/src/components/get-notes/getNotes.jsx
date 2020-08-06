import React from "react";
import { Link } from "react-router-dom";
import { getNotesQuery } from "../../queries/index";
import { useQuery, useMutation } from "@apollo/client";
import { FaRegEdit, FaExternalLinkAlt } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { deleteNoteMutation } from "../../queries";
import "./getNotes.css";

export default function GetNotes(props) {
    const [deleteNote] = useMutation(deleteNoteMutation);
    const { error, loading, data }
        = useQuery(getNotesQuery)
    if (loading) {
        return <p className="load">Loading...</p>;
    }
    if (error) {
        return <p>An error occured!</p>;
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