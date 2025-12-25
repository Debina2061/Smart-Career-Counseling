process.loadEnvFile(".env.local")


export const envConfig = {
    portNumber : process.env.PORT_NUMBER,
    backendUrl: process.env.BACKEND_URL,
    mongoUrl: process.env.DB_URL,
    githubClinet: process.env.GITHUB_CLIENT_KEY,
    githubSecretClient: process.env.GITHUB_SECRET_CLIENT_KEY,
    googleClinet: process.env.GOOGLE_CLIENT_KEY,
    googleSecretClient: process.env.GOOGLE_SECRET_CLIENT_KEY,
    jwtSecretToken: process.env.JWT_SECRET_TOKEN,
    emailUser:process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_NODEMAILER_PASSWORD,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudSecret: process.env.CLOUDINARY_API_SECRET,
    cloudKey: process.env.CLOUDINARY_API_KEY,
    groqApiUrl: process.env.GROQ_SECRET_API_KEY
}