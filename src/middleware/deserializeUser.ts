
import express, { NextFunction, Request, Response, Router } from 'express';
import config from 'config';
import httpErrors from 'http-errors';
import { get } from 'lodash';
import { decode } from '../utils/jwt.utils';
import { reIssueAccessToken } from '../service/session.service';

const deserializeUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    let accessToken = get( req, "headers.authorization", "" );
    accessToken = accessToken.replace( /^Bearer\s/, "" );


    let refreshToken = get( req, "headers.x-refresh", "" );

    // access token check
    if ( !accessToken ) return next();

    let { decoded, expired } = decode( accessToken );

    if ( decoded ) {
        //@ts-ignore
        req.user = decoded;
        return next();
    }

    if ( expired && refreshToken ) {

        let newAccessToken = await reIssueAccessToken( { refreshToken } );
        if ( newAccessToken ) {
            // Add the new access token to the response header

            res.setHeader( "x-access-token", <string>newAccessToken );

            let { decoded } = decode( newAccessToken );

            // @ts-ignore
            req.user = decoded;
            return next();
        }

    }

    return next();


};


// export
export default deserializeUser;