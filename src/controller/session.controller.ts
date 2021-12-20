// packages
import express, { NextFunction, Request, Response, Router } from 'express';
import config from 'config';
import httpErrors from 'http-errors';
import { get } from 'lodash';
import parser from 'ua-parser-js';
import ip from 'ip';

// uitls
import { sign } from '../utils/jwt.utils';

// models
import { SessionDocument } from '../model/session.model';
import { UserDocument } from '../model/user.model';

// services
import {
    CreateSession,
    createAccessToken,
    updateSession,
    findSession
} from '../service/session.service';

import { validatePassword } from '../service/user.service';


// login
export async function createUserSessionHandler(
    req: Request,
    res: Response,
    next: NextFunction ) {

    // validate password
    const user: any = await validatePassword( req.body );

    if ( !user || get( user, "status" ) ) {
        console.log( user )
        //@ts-ignore
        const error = user.message || "Invalid Credentials";

        return next( new httpErrors.Unauthorized( error ) );
    }

    // to get user meta data
    const ua = parser( req.headers['user-agent'] );
    const browser = ua.browser.name || "";
    const os = ua.os.name || "";
    const ip4 = ip.address() || "";

    // create session
    const session: any = await CreateSession( {
        user: user._id, browser, os, ip4
    } );

    // create access token
    const accessToken = await createAccessToken( {
        user,
        session
    } );

    // create refresh token
    const refreshToken = sign( session,
        { expiresIn: config.get( 'refreshTokenTtl' ) }
    );

    // return tokens
    return res.send( { accessToken, refreshToken } );

}

// logout
export async function invalidateUserSessionHandler(
    req: Request,
    res: Response,
    next: NextFunction ) {

    const sessionId = get( req, "user.session" );
    await updateSession( { _id: sessionId }, { valid: false } );
    res.send( 'logout user' );

}

// sessions
export async function getUserSessions(
    req: Request,
    res: Response,
    next: NextFunction
) {

    const userId = get( req, "user._id" );
    const session = await findSession( { user: userId } );
    res.send( session );

}

