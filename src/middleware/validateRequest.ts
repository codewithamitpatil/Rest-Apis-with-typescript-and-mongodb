
import express, { NextFunction, Request, Response, Router } from 'express';
import config from 'config';

const validateRequest = ( schema: any ) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        await schema.validateAsync( {
            body: req.body
        } );

        return next();

    } catch ( error: any ) {
        return next( error );
    }


};

// export
export default validateRequest;