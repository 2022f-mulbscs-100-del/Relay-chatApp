import jwt from "jsonwebtoken";
export const GenerateRefreshToken = (userId) => {
    const token = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });
    return token;
}