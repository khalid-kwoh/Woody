const payload = (time, domain) => {
    return {
        time: `${time}`,
        domain: `${domain}`
    }
};

const JWTOptions = (expiresIn, issuer) => {
    return {
        expiresIn: `${expiresIn}`,
        issuer: `${issuer}`
    }
}

module.exports = {
    payload,
    JWTOptions
}