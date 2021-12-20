
import { Request, Response, NextFunction } from 'express';
import { handleDuplicateKeyError, handleValidationError } from '../controller/error.controller';

import httpErrors from 'http-errors';


// export
export default async function errorHandler(
    err: any, req: Request, res: Response, next: NextFunction ) {


    if ( err.isJoi ) {
        return res.status( 400 ).json( {
            'status': 400,
            'msg': err.message
        } )
    }

    // for mongoose confilict error 
    if ( err.name === "ValidationError" ) {
        return handleValidationError( err, res );
    }

    // for mongoose confilict error 
    if ( err.code && err.code == 11000 ) {
        return handleDuplicateKeyError( err, res );
    }

    err.status = err.status || 500;

    return res.status( err.status ).json( {
        'status': err.status,
        'msg': err.message
    } )
}

