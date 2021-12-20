
import jwt from 'jsonwebtoken';
import config from 'config';


const privateKey = config.get( 'privateKey' ) as string;

// genrate token
export function sign(
    obj: Object,
    options?: jwt.SignOptions | undefined ) {

    return jwt.sign( obj, privateKey, options );

}

// decode token
export function decode( token: any ) {

    try {
        const decoded = jwt.verify( token, privateKey );
        return {
            decoded,
            valid: true,
            expired: false
        }
    } catch ( error: any ) {
        return {
            decoded: null,
            valid: true,
            expired: error.message === "jwt expired"
        }
    }

}