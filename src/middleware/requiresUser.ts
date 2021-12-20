
import express, { NextFunction, Request, Response, Router } from 'express';
import config from 'config';
import { get } from 'lodash';

import httpErrors from 'http-errors';

const requiresUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const user = get( req, "user" );

    if ( !user ) {
        return next( new httpErrors.Unauthorized() );
    }

    return next();
};


// export
export default requiresUser;
