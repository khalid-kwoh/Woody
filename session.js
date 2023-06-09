function createSessionKey() {
    const expirationTime = Date.now() + 30 * 60 * 1000; // 30분 후의 시간
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const sessionKey = `${randomString}.${expirationTime}`;
    return sessionKey;
}

module.exports = {
    createSessionKey
};