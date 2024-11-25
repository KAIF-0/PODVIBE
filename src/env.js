const env = {
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    APPWRITE_URL: process.env.NEXT_PUBLIC_APPWRITE_URL,
    APPWRITE_PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    APPWRITE_DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID,
    APPWRITE_YTCREDENTIALS_COLLECTION_ID: process.env.NEXT_PUBLIC_APPWRITE_YTCREDENTIALS_COLLECTION_ID,
    ZEGOCLOUD_APP_ID : process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID,
    ZEGOCLOUD_SERVER_URL : process.env.NEXT_PUBLIC_ZEGOCLOUD_SERVER_URL,
    ZEGOCLOUD_SERVER_SECRET : process.env.NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET,
    GOOGLE_CLIENT_ID : process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET : process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    YOUTUBE_API_KEY : process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
    STREAM_SERVER_URL : process.env.NEXT_PUBLIC_STREAM_SERVER_URL,
}

// The variables might be undefined because:
// 1. Environment variables in Next.js that need to be accessible on the client-side
//    should be prefixed with NEXT_PUBLIC_
// 2. The .env file might not be properly configured or loaded
// 3. The environment variables might not be set in your deployment environment

// To fix this:
// 1. Ensure all these variables are defined in your .env file
// 2. Prefix all variables with NEXT_PUBLIC_ in both .env file and here
// 3. Make sure the .env file is in the root of your project
// 4. If deploying, ensure these environment variables are set in your deployment platform

export default env;