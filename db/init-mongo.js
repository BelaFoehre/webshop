db.createUser({
    user: "root",
    pwd: "pwd",
    roles: [
        {
            role: "readWrite",
            db: "db-name"
        }
    ]
})