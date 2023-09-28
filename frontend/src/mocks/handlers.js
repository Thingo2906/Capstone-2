// src/mocks/handlers.js
import { rest } from "msw";
export const handlers = [
  rest.get("/api/data", (req, res, ctx) => {
    // Simulate a successful response with mock data
    return res(ctx.status(200), ctx.json({ data: "Mocked response" }));
  }),
];
