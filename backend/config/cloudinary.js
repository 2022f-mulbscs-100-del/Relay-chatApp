import { v2 as cloudinary } from "cloudinary";

let isConfigured = false;

const ensureConfigured = () => {
    if (!isConfigured) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });
        
        isConfigured = true;
    }
    return cloudinary;
};

export const claudinaryConfig = new Proxy(cloudinary, {
    get(target, prop) {
        ensureConfigured();
        return target[prop];
    }
});

// Lazy initialization: Only configure Cloudinary when it’s first accessed


//lazy intialiization
// What is Proxy
// Why using Proxy here
// What problem it solves
// What happens internally
// Complete flow step-by-step
// Why this pattern exists in real apps