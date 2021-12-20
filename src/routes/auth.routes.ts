
import express, { NextFunction, Request, Response, Router } from 'express';
import config from 'config';

import {
    createUserSessionHandler,
    invalidateUserSessionHandler,
    getUserSessions,

} from '../controller/session.controller';

import {
    createUserHandler,
    changePasswordhandler,
    resetPasswordhandler,
    forgetPasswordhandler,
    verifyAccountHandler
} from '../controller/user.controller';

import {
    signupSchema,
    signinSchema,
    changepassSchema,
    forgetpassSchema,
    resetpassSchema
} from '../schema/user.schema';

import {
    validateRequest,
    asyncHandler,
    requiresUser
} from '../middleware/index.middleware';

// intialize router
const router: Router = express.Router();

//  signup
router.post( '/signup',
    validateRequest( signupSchema ),
    asyncHandler( createUserHandler ) );

// signin
router.post( '/signin',
    validateRequest( signinSchema ),
    asyncHandler( createUserSessionHandler ) );

// logout
router.delete( '/logout',
    requiresUser,
    asyncHandler( invalidateUserSessionHandler ) );

// sessions
router.get( '/session',
    requiresUser,
    asyncHandler( getUserSessions ) );

// cheche passowrd
router.post( '/changePass',
    requiresUser,
    validateRequest( changepassSchema ),
    asyncHandler( changePasswordhandler ) );

// forget password
router.post( '/forgetPass',
    validateRequest( forgetpassSchema ),
    asyncHandler( forgetPasswordhandler ) );

// newpass password
router.post( '/resetPass/:uid/:token',
    validateRequest( resetpassSchema ),
    asyncHandler( resetPasswordhandler ) );

// newpass password
router.get( '/verify/:uid/:token',
    asyncHandler( verifyAccountHandler ) );

// exports
export default router;