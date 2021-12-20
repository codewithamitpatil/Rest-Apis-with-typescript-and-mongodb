
import express, { NextFunction, Request, Response, Router } from 'express';
import config from 'config';

import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const router: Router = express.Router();

import parser from 'ua-parser-js';
import ip from 'ip';

// health check
router.get( '/health', async (
    req: Request,
    res: Response,
    next: NextFunction ) => {

    var ua = parser( req.headers['user-agent'] );

    const browser = ua.browser.name || "";
    const os = ua.os.name || "";
    const ip4 = ip.address() || "";

    // write the result as response
    res.send( { ip4, browser, os } );

} );


// intialize routes
router.use( '/auth', authRoutes );
router.use( '/user', userRoutes );


// exports
export default router;