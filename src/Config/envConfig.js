process.loadEnvFile(".env.local")


export const envConfig = {
    portNumber : process.env.PORT_NUMBER,
    backendUrl: process.env.BACKEND_URL,
    mongoUrl: process.env.DB_URL,
    githubClinet: process.env.GITHUB_CLIENT_KEY,
    githubSecretClient: process.env.GITHUB_SECRET_CLIENT_KEY,
    googleClinet: process.env.GOOGLE_CLIENT_KEY,
    googleSecretClient: process.env.GOOGLE_SECRET_CLIENT_KEY,
    jwtSecretToken: process.env.JWT_SECRET_TOKEN
}