
import express, { NextFunction, Request, Response, Router } from 'express';
import config from 'config';

import {
    updateProfileHandler,
    profileHandler,

} from '../controller/profile.controller';

import {
    validateRequest,
    asyncHandler,
    requiresUser
} from '../middleware/index.middleware';

import {
    updateSchema
} from '../schema/profile.schema';

const router: Router = express.Router();


// update profile
router.put( '/profile',
    requiresUser,
    validateRequest( updateSchema ),
    asyncHandler( updateProfileHandler ) );

// get user profile
router.get( '/profile',
    requiresUser,
    asyncHandler( profileHandler ) );







// export
export default router;

