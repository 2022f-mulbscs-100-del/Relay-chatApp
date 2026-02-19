const CheckCodeExpiry = (expiryTime, tokenCreatedAt) => {

    const currentTime = new Date().getTime();

    const expiryTimeInMs = new Date(tokenCreatedAt).getTime();

    const diffTime = (currentTime - expiryTimeInMs) / (1000 * 60);

    return diffTime < expiryTime
}

export default CheckCodeExpiry;