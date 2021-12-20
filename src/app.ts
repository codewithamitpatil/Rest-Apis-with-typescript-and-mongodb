
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from 'config';


// mongo connection
import Con from './db/mongoCon';
// api 
import apiRoutes from './routes/index.routes';
// for error
import { NotFoundPage } from './controller/error.controller';

// importing middlewares
import {
    deserializeUser,
    errorHandler
} from './middleware/index.middleware';


const port = config.get( 'port' ) as number;
const host = config.get( 'host' ) as string;


// intialize app
const app: Express = express();


// enable cors
app.use( cors() );

// enable helmet
app.use( helmet() );

// parse json
app.use( express.json() );

// parse url encoded data
app.use( express.urlencoded( { extended: true } ) );

// deserialize user
app.use( deserializeUser );

// intialize routes
app.use( '/api', apiRoutes );

// 404 wild card route
app.use( '*', NotFoundPage );

// centrlize error handler
app.use( errorHandler );


// server
const server = () => {
    app.listen( port, host, () => {
        console.log( `Server is running on http://${ host }:${ port }` );
    } );
};


// mongodb
const db = () => {

    Con().on( 'error', err => {
        console.error( err );
    } ).on( 'disconnected', () => {
        console.log( 'Mongodb is disconnected' );
    } ).once( 'open', () => {
        console.log( 'Mongodb is connected successfully' );
        // start server
        server();
    } );

};

// start mongodb
db();