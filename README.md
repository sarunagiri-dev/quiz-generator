# AI Quiz Generator MVP

This project is a full-stack web application that serves as a Minimum Viable Product (MVP) for an AI-powered quiz generator. Users can provide a topic, and the application uses an AI model to generate a 5-question multiple-choice quiz.

## Features

-   **Dynamic Quiz Generation:** Generates quizzes on any topic using an AI model (GPT-3.5-Turbo).
-   **Interactive UI:** Users can take the quiz and receive immediate feedback on their score.
-   **Clear Feedback:** Shows correct and incorrect answers after submission.
-   **Robust Backend:** Built with Node.js and Express, with error handling.
-   **Modern Frontend:** Built with Next.js, React, and TypeScript for a type-safe and responsive user experience.
-   **Unit Tested:** The backend API includes a suite of unit tests using Jest and Supertest.

## Architecture

The application follows a classic client-server architecture.

```
+-----------------+      +----------------------+      +--------------------+
|                 |      |                      |      |                    |
|  User's Browser |----->|   Frontend Server    |----->|   Backend Server   |
| (React/Next.js) |      | (Next.js on Port 3000) |      | (Express on Port 5000) |
|                 |      |                      |      |                    |
+-----------------+      +----------------------+      +----------+---------+
       ^                                                            |
       |                                                            | HTTP API Request
       |  (HTML/CSS/JS)                                             | (e.g., /api/quiz)
       |                                                            |
       +------------------------------------------------------------+
                                                                    |
                                                                    v
                                                          +--------------------+
                                                          |    OpenAI API      |
                                                          | (gpt-3.5-turbo)    |
                                                          +--------------------+
```

1.  The **User** interacts with the frontend application in their browser.
2.  The **Frontend** (Next.js/React) sends an HTTP POST request with the desired topic to the backend.
3.  The **Backend** (Node.js/Express) receives the request, constructs a prompt, and sends it to the **OpenAI API**.
4.  The **OpenAI API** returns the generated quiz data as a JSON object.
5.  The **Backend** forwards this JSON data to the frontend.
6.  The **Frontend** displays the quiz to the user.

## Tech Stack

-   **Backend:** Node.js, Express.js
-   **Frontend:** Next.js, React, TypeScript, Tailwind CSS
-   **AI:** OpenAI API (gpt-3.5-turbo)
-   **Testing:** Jest, Supertest

## Prerequisites

-   Node.js (v18 or later recommended)
-   npm (or yarn/pnpm)
-   An OpenAI API Key

## Setup and Installation

### 1. Environment Variables

The backend server requires an API key from OpenAI to function.

1.  **Obtain an API Key:**
    -   Go to the [OpenAI Platform website](https://platform.openai.com/).
    -   Sign up or log in to your account.
    -   Navigate to the "API keys" section in your account settings.
    -   Create a new secret key and copy it.

2.  **Configure the Backend:**
    -   In the `backend` directory, create a new file named `.env`.
    -   Add the following line to the `.env` file, replacing `YOUR_API_KEY_HERE` with the key you copied:
        ```
        OPENAI_API_KEY=YOUR_API_KEY_HERE
        ```
    -   The application is now configured to use your API key.

### 2. Running the Application

You need to run two separate processes for the backend and the frontend.

**Backend Server:**

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm start
```

The backend server will start on `http://localhost:5000`.

**Frontend Server:**

```bash
# Open a new terminal window
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will be available at `http://localhost:3000`. You can now open this URL in your browser to use the app.

## Running Tests

The backend has a suite of unit tests. To run them:

```bash
# Navigate to the backend directory
cd backend

# Run the tests
npm test
```
