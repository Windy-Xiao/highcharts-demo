import { graphql } from "msw";

const postHandler = graphql.query("Posts", (req, res, ctx) => {
  return res(ctx.errors([{ message: "user not found" }]));
});

export const handlers = [postHandler];
