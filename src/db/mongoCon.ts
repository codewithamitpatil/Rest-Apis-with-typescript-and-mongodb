
import mongoose from 'mongoose';
import config from 'config';

// connection 
const Con = () => {

    const uri = config.get( 'mongoUri' ) as string;
    const options = config.get( 'mongoOptions' ) as Object;

    mongoose.connect( uri, options );
    mongoose.Promise = global.Promise;
    return mongoose.connection;

};

// export
export default Con;
