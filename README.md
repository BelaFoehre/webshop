# prereq

- run docker compose in /db to init database required for auth `$ cd db && docker-compose up`
- start backend `$ cd backend && npm run dev`
- start frontend `$ cd frontend && npm start`


# Backend APIs
| URL | type | expl |
|---|---|---|
|
| `api/dev/popSample` | post | adds 3 sample inventory entries
| `api/dev/popSample2` | post | adds another sample inventory entry
| `api/dev/popSample` | delete | deletes inventory
| `api/dev/popSample` | get | retrieves inventory
|
| `api/kategories` | get | retrieves category data
| `api/auth/login` | post | login request (nb modified logic)
| `api/auth/register` | post | register request (nb modified logic)
