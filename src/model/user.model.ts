
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';

// enums
import { dbRole } from '../constants/dbRole';


// interface
export interface UserDocument extends mongoose.Document {
    uname: string;
    email: string;
    password: string;
    role: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePass( password: string ): Promise<boolean>;
    changePass( password: string ): Promise<boolean>;
    changeStatus( status: boolean ): Promise<boolean>;
}

// schema
const UserSchema = new mongoose.Schema( {

    uname: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: dbRole,
        default: 'USER'
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true } );

// hash password before saving
UserSchema.pre( "save", async function (
    this: UserDocument,
    next: any ) {

    const user = this as UserDocument;

    if ( !this.isModified( 'password' ) ) return next();

    let salt = await bcrypt.genSalt( config.get( 'saltWorkFactor' ) );
    let hash = await bcrypt.hashSync( user.password, salt );

    this.password = hash;
    return next();

} );


// match password
UserSchema.methods.comparePass = async function (
    this: UserDocument,
    password: string

) {
    const user = this as UserDocument;
    return bcrypt.compare( password, user.password ).catch( ( e ) => false );
}

//change account status
UserSchema.methods.changeStatus = async function (
    status: boolean
) {
    this.verified = status;
    this.save();
    return true;
}



// model
const User = mongoose.model<UserDocument>( 'User', UserSchema );

// export
export default User;
