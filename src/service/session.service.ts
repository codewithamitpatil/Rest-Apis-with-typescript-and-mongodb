
import { LeanDocument, FilterQuery, UpdateQuery } from 'mongoose';
import Session, { SessionDocument } from '../model/session.model';
import User, { UserDocument } from '../model/user.model';
import httpErrors from 'http-errors';
import config from 'config';

import { sign, decode } from '../utils/jwt.utils';
import { get, omit } from 'lodash';
import { findUser } from './user.service';


// create session
export async function CreateSession( {
    user,
    os,
    ip4,
    browser }: {
        user: UserDocument["_id"],
        os: string,
        ip4: string,
        browser: string
    } ) {

    const session = await Session.create( {
        user, os, ip4, browser
    } );

    return session.toJSON();
}

// create access token
export async function createAccessToken( {
    user,
    session
}: {
    user:
    | Omit<UserDocument, "password">
    | LeanDocument<Omit<UserDocument, "password">>;
    session:
    | Omit<SessionDocument, "password">
    | LeanDocument<Omit<SessionDocument, "password">>;
} ) {

    // to omit password for user object
    user = omit( user, "password" );

    // genrate access token
    const accessToken = sign(
        { ...user, session: session._id },
        { expiresIn: config.get( 'accessTokenTtl' ) as string }
    );

    // check toke  is genrated or not
    if ( !accessToken ) {
        return new httpErrors.InternalServerError();
    }

    return accessToken;

}

// reIssueAccessToken
export async function reIssueAccessToken( {
    refreshToken,
}: {
    refreshToken: string;
} ) {
    // Decode the refresh token
    const { decoded } = decode( refreshToken );

    if ( !decoded || !get( decoded, "_id" ) ) return false;

    // Get the session
    const session = await Session.findById( get( decoded, "_id" ) );

    // Make sure the session is still valid
    if ( !session || !session?.valid ) return false;

    let user = await findUser( { _id: session.user } );

    if ( !user ) return false;

    const accessToken = await createAccessToken( { user, session } );

    return accessToken;
}


// update session
export async function updateSession(
    query: FilterQuery<SessionDocument>,
    update: UpdateQuery<SessionDocument>
) {
    return await Session.updateOne( query, update );
}


// find sessions
export async function findSession(
    query: FilterQuery<SessionDocument>
) {
    return await Session.find( query ).lean();
}