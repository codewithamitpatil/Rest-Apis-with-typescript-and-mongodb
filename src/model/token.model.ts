
import mongoose from 'mongoose';
import config from 'config';

import { UserDocument } from './user.model';

// time to token live
const expire = config.get( 'resetTokenTtl' ) as string;

// interface
export interface TokenDocument
    extends mongoose.Document {

    userId: UserDocument["_id"];
    token: string;
    createdAt: Date;

}

// schema
const TokenSchema = new mongoose.Schema( {

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiredAt: {
        type: Date,
        default: Date.now,
        expires: expire
    }


}, { timestamps: false } );


// model 
const Token = mongoose.model<TokenDocument>( "Token", TokenSchema );

// export
export default Token;