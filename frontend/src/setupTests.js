// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
// src/setupTests.js
// Mock the localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// // Mock react-router-dom
// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   BrowserRouter: ({ children }) => <div>{children}</div>,
//   Route: ({ children }) => children,
//   useHistory: () => ({ push: jest.fn() }),
// }));

// // Mock your API module
// jest.mock('./api/api', () => ({
//   __esModule: true,
//   default: {
//     // Mock your API methods as needed for testing
//   },
// }));

import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';
// Set up a Mock Service Worker server with the provided request handlers
const server = setupServer(...handlers);
// Start the server before running your tests
beforeAll(() => server.listen());
// Reset and stop the server after all tests finish
afterAll(() => server.resetHandlers(), server.close());