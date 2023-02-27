module.exports = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "AREA",
            version: "1.0.0",
            description: "API for AREA applications"
        },
        servers: [
            {
                // url: `${process.env.API_URL}/api/v1`,
                url: 'http://localhost:4000/api/v1',
                description: "AREA API V1.0"
            }
        ],
    },
    apis: ["/usr/src/app/routes/api/*.js", "/usr/src/app/controllers/*.js"],
}