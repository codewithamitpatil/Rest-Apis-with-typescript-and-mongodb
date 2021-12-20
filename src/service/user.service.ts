
import mongoose, { DocumentDefinition, FilterQuery, UpdateQuery } from 'mongoose';
import { omit, get } from 'lodash';
import httpErrors from 'http-errors';
import crypto from 'crypto';
import config from 'config';

import User, { UserDocument } from '../model/user.model';
import Token, { TokenDocument } from '../model/token.model';

import { sendMail } from '../utils/nodemailer.utils';

// create user
export async function createUser(
    input: DocumentDefinition<UserDocument> ) {

    const user = await User.create( input );
    return omit( user.toJSON(), "password" );

}

// validate password
export async function validatePassword( {
    email,
    password }: {
        email: UserDocument["email"],
        password: string
    } ) {

    // check for user exist with email
    const user = await User.findOne( { email } );

    if ( !user ) return false;

    // check user is verified
    if ( !get( user.toJSON(), "verified" ) ) {
        return ( new httpErrors.Unauthorized( 'Plz Verify Your Account' ) );
    };

    // check for password  
    const isValid = await user.comparePass( password );

    if ( !isValid ) return false;

    return omit( user.toJSON(), "password" );

}

// find user
export async function findUser( query: FilterQuery<UserDocument> ) {
    return await User.findOne( query ).lean();
}

// update user
export async function updateUser(
    query: FilterQuery<UserDocument>,
    update: UpdateQuery<UserDocument>
) {
    return await User.updateOne( query, update );
}

// change password
export async function changePassword(
    userId: UserDocument["_id"],
    password: string,
    newpassword: string
) {
    // find the user
    const user = await User.findOne( { _id: userId } );

    if ( !user ) {
        return false;
    }

    // compare old password
    const isValid = await user.comparePass( password );

    if ( !isValid ) {
        return false;
    }

    // save new password
    return await user.changePass( newpassword );

}

// forget password
export async function forgetPassword(
    email: string ) {

    const user = await findUser( { email } );

    if ( !user ) {
        return new httpErrors.BadRequest( 'We could not found any account with this email' );
    }

    // find token
    let token = await Token.findOne( { userId: user._id } ).lean();

    if ( !token ) {
        token = await Token.create( {
            userId: user._id,
            token: crypto.randomBytes( 32 ).toString( 'hex' )
        } );
    }

    // genrate link
    let baseurl = `http://${ config.get( "host" ) }:${ config.get( 'port' ) }`;
    let link = `${ baseurl }/api/auth/resetPass/${ user._id }/${ token.token }`;

    return link;

}

// reset password
export async function resetPassword(
    userId: UserDocument["_id"],
    password: string,
    utoken: string
) {

    // check user 
    const user = await User.findById( userId );

    if ( !user ) {
        return new httpErrors.BadRequest( 'Invalid Link or Expired")' );
    }

    // check token
    const token = await Token.findOne( {
        userId: user._id,
        token: utoken
    } );

    if ( !token ) {
        return new httpErrors.BadRequest( 'Invalid Link or Expired")' );
    }

    const update = await user.changePass( password );

    if ( !update ) {
        return new httpErrors.BadRequest( 'Invalid Link or Expired")' );
    }
    await token.delete();
    return true;
}

// verify account
export async function verifyAccount(
    userId: UserDocument["_id"],
    utoken: string
) {

    // check user 
    const user = await User.findById( userId );

    if ( !user ) {
        return new httpErrors.BadRequest( 'Invalid Link or Expired")' );
    }

    // check token
    const token = await Token.findOne( {
        userId: user._id,
        token: utoken
    } );

    if ( !token ) {
        return new httpErrors.BadRequest( 'Invalid Link or Expired")' );
    }

    const update = await user.changeStatus( true );

    if ( !update ) {
        return new httpErrors.BadRequest( 'Invalid Link or Expired")' );
    }
    await token.delete();
    return true;
}

// verification link 
export async function verifyLink(
    email: string ) {

    const user = await findUser( { email } );

    if ( !user ) {
        return new httpErrors.BadRequest( 'We could not found any account with this email' );
    }

    // find token
    let token = await Token.findOne( { userId: user._id } ).lean();

    if ( !token ) {
        token = await Token.create( {
            userId: user._id,
            token: crypto.randomBytes( 32 ).toString( 'hex' )
        } );
    }

    // genrate link
    let baseurl = `http://${ config.get( "host" ) }:${ config.get( 'port' ) }`;
    let link = `${ baseurl }/api/auth/verify/${ user._id }/${ token.token }`;

    let template = `
    <p>Thank you for registering.</p><br/>
    <p>This is a verification eMail, 
    please click the link to verify your
    eMail address by
    clicking this <a href="${ link }">Link</>.</p><br/>
    <p>In case if you have any
     difficulty please eMail us.</p><br/>
    <p>Thank you.</p><br/>
    <p>Url Shortner</p><br/>
    `;

    await sendMail( email, "Socials Verification", template );

}