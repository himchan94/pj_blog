import { GraphQLClient, gql } from "graphql-request";

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;
const GRAPHCMS_TOKEN = process.env.GRAPHCMS_TOKEN;

/** *************************************************************
 * Any file inside the folder pages/api is mapped to /api/* and  *
 * will be treated as an API endpoint instead of a page.         *
 *************************************************************** */

// export a default function for API route to work
export default async function comments(req, res) {
  const graphQLClient = new GraphQLClient(graphqlAPI, {
    headers: {
      authorization: `Bearer ${GRAPHCMS_TOKEN}`,
    },
  });

  ///update or add new data mutation
  const query = gql`
    mutation CreateComment(
      $name: String!
      $email: String!
      $comment: String!
      $slug: String!
    ) {
      createComment(
        data: {
          name: $name
          email: $email
          comment: $comment
          post: { connect: { slug: $slug } }
        }
      ) {
        id
      }
    }
  `;

  // const query = gql`
  //   mutation CreateComment(
  //     $name: String!
  //     $email: String!
  //     $comment: String!
  //     $slug: String!
  //     $title:String!
  //   ) {
  //     createComment(
  //       data: {
  //         name: $name
  //         email: $email
  //         comment: $comment
  //         post: { connect: { slug: $slug } }
  //       }
  //     ) {
  //       id
  //     }
  //     publishComment(where: { slug: $slug }) {
  //       title: $title
  //     }
  //   }
  // `;

  try {
    const result = await graphQLClient.request(query, req.body);
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }

  // const result = await graphQLClient.request(query, {
  //   name: req.body.name,
  //   email: req.body.email,
  //   comment: req.body.comment,
  //   slug: req.body.slug,
  // });
}
