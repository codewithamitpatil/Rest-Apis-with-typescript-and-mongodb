

export default {
    port: 3002,
    host: 'localhost',
    mongoUri: 'mongodb://localhost:27017/TestMyApp',
    mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // promiseLibrary: global.Promise
    },
    saltWorkFactor: 10,
    // for jwt token
    privateKey: 'amitisgood',
    accessTokenTtl: "5s",
    refreshTokenTtl: "1y",
    redisDb: {
        port: 6379,
        host: '127.0.0.1'
    },
    // for reset password token
    resetTokenTtl: '5m',

    // for nodemailer
    nodemailerOptions: {
        service: "gmail",
        auth: {
            user: 'amitwebdev2019@gmail.com',
            pass: '8888565473'
        },
        tls: {
            rejectUnauthorized: false
        }
    },
    adminMail: 'amitwebdev2019@gmail.com',

}