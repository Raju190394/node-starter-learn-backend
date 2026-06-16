import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My API Documentation",
            version: "1.0.0",
            description: "API docs for my Node.js project"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["./src/modules/users/*.js"] // scan user route/controller files
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;