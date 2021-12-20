
// packages
import express, { NextFunction, Request, Response, Router } from 'express';
import config from 'config';
import httpErrors from 'http-errors';
import { get } from 'lodash';

import {
    updateProfile,
    getProfile
} from '../service/profile.service';


// update profile 
export async function updateProfileHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userId = get( req, "user._id" );
    const body = get( req, "body" );
    const profile = await updateProfile( { userId }, body );
    res.send( { status: 200, message: "Profile Updated SuccessFully" } );
}

// get profile details
export async function profileHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userId = get( req, "user._id" );
    const email = get( req, "user.email" );
    const profile = await getProfile( { userId } );
    res.send( { status: 200, ...profile, email } );

}