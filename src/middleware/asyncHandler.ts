
import { Request, Response, NextFunction } from 'express';

// to avoid try and catch

export const asyncHandler = ( fn: Function ) => {
    return ( req: Request, res: Response, next: NextFunction ) => {
        Promise
            .resolve( fn( req, res, next ) ).
            catch( next );
    }
}

// export
export default asyncHandler; 