### TASK

- make a landing page of my personal resume, i want it to look professional, clean and %50 minimal but captures the eyes of the users.
- make it fit marginally and appealing at the screen.

### FRONTEND PORTFOLIO FEATURES

- dedicated listed project page
- personal contact page
- ai chatbot that impersonates me
- the ai chatbot suited for google gemini-2.5 api
- responsive ui design
- generate template projects in the project page.
- contact form page that routes to post to an api when form submitted.
- use react routing.

### PROJECT FEATURES

- gitignore sensitive files like .env, node_modules, critical security files. ignore for avoiding pushing it to repos
- use react, nodejs, and express js for the stack.
- create multistage dockercompose for this project that manages the frontend and backend so i can run locally.
- the docker compose should have live reloading suited for vite-react for code edits.
- automatically make .env.example files for files that needs the api within the dir.
- implement rate limiting for apis
- docker ignore node modules

### YOUR SYSTEM

- plan first on the given CLAUDE.md file.
- update CLAUDE.md for up to date and better implementation, also write there what the client should do next, like api routing and important details that requires client/user intervention.

### DO / DONT

- use camelcase for variables (not strict)
- dont use npm install to locally install packages and dependencies
- dont use comments
- do not use next.js framework

### CRITICAL

- ignore/do not update "codesave.md"
- prioritize codesave.md for prompting.
- read CLAUDE.md for anything new, if so update based on that file.
- always read and compare personal.md file for up to date information regarding personals
- if theres question or clarification that you want, you can ask me.

### USER NOTES // DO NOT TOUCH

PERFORM SECURITY AUDITS

docker compose -f compose.yml -f compose.dev.yml build --no-cache
docker compose -f compose.yml -f compose.dev.yml up -d

docker compose -f compose.yml -f compose.prod.yml build --no-cache
docker compose -f compose.yml -f compose.prod.yml up -d
