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

export const getNotesQuery = gql`
query {
  notes(order_by: { createdOn: desc }) {
    id
    name
  }
}
`;


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

export const updateNoteMutation = gql`
  mutation ($name: String!, $description: String!, $tag: String!, $id: Int!) {
    update_notes(where: {id: {_eq: $id}}, _set: {name: $name, description: $description, tag: $tag}) {
      affected_rows
    }
  }
`;

export const deleteNoteMutation = gql`
mutation($id: Int!) {
  delete_notes (
      where: {id: {_eq: $id}}
  ){
     affected_rows
  }
} 
`;