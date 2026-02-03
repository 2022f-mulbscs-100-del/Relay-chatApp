import jwt from "jsonwebtoken";
export const GenerateAccessToken = (userId) => {
    const token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
    });
    return token;
}