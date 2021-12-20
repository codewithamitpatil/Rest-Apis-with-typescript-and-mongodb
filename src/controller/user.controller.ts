// packages
import express, { NextFunction, Request, Response, Router } from 'express';
import config from 'config';
import httpErrors from 'http-errors';
import { get } from 'lodash';

import {
    createUser,
    changePassword,
    forgetPassword,
    resetPassword,
    verifyAccount,
    verifyLink
} from '../service/user.service';

import {
    createProfile
} from '../service/profile.service';

import { UserDocument } from '../model/user.model';

// signup
export async function createUserHandler(
    req: Request,
    res: Response,
    next: NextFunction ) {

    // create account
    const user = await createUser( req.body );

    // create profile 
    const profile = await createProfile( {
        userId: user._id
    } );

    const link = await verifyLink( user.email );

    // return
    res.send( { status: 200, message: "Account Created SuccessFully .Plz verify your email", link } );

}

// reset password
export async function changePasswordhandler(
    req: Request,
    res: Response,
    next: NextFunction ) {

    const userId = get( req, "user._id" );
    const password = get( req, "body.password" );
    const newpassword = get( req, "body.newpassword" );

    // change password
    const isUpdated = await changePassword(
        userId,
        password,
        newpassword
    );

    // check password is updated or not
    if ( !isUpdated ) {
        return next( new httpErrors.BadRequest( 'Old Password Does Not Match' ) );
    }

    return res.send( { status: 200, message: "password Updated SuccessFully" } );

}

// forget password
export async function forgetPasswordhandler(
    req: Request,
    res: Response,
    next: NextFunction
) {

    const email: string = get( req, "body.email" );
    const data = await forgetPassword( email );

    if ( !data || get( data, "message" ) ) {
        const message: string = get( data, "message" ) || "Invalid Email"
        return next( new httpErrors.BadRequest( message ) );
    }

    res.send( data );

}

// new Password
export async function resetPasswordhandler(
    req: Request,
    res: Response,
    next: NextFunction ) {

    const utoken = get( req, "params.token" );
    const userId = get( req, "params.uid" );
    const password = get( req, "body.password" );

    const result = await resetPassword( userId, password, utoken );

    if ( !result || get( result, "status" ) ) return next( result );

    return res.send( { status: 200, message: "password Updated SuccessFully" } );

}

// verify account by link
export async function verifyAccountHandler(
    req: Request,
    res: Response,
    next: NextFunction ) {

    const userId = get( req, "params.uid" );
    const token = get( req, "params.token" );

    const result = await verifyAccount( userId, token );
    if ( !result || get( result, "status" ) ) return next( result );

    res.send( 'Your account is verified . you may login now' );
}
