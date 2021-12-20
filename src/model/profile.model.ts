
import mongoose from 'mongoose';
import config from 'config';

import { UserDocument } from './user.model';

// interface
export interface ProfileDocument extends mongoose.Document {
    userId: UserDocument["_id"];
    fname: string;
    lname: string;
    gender: string;
    address: string;
    phone: string;
    profile: string;
    clg: string;
    nation: string;
    education: string;
    points: number;
    rank: number;
    intro: string;
    createdAt: Date;
    updatedAt: Date;
}

// schema 
const ProfileSchema = new mongoose.Schema( {

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fname: {
        type: String,
        default: null
    },
    lname: {
        type: String,
        default: null
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"]
    },
    address: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    profile: {
        type: String,
        default: null
    },
    clg: {
        type: String,
        default: null
    },
    nation: {
        type: String,
        default: null
    },
    education: {
        type: String,
        default: null
    },
    points: {
        type: Number,
        default: 0
    },
    rank: {
        type: Number,
        default: 0
    },
    intro: {
        type: String,
        default: null
    }


}, { timestamps: true } );

// model
const Profile = mongoose.model<ProfileDocument>( "Profile", ProfileSchema );

// export
export default Profile;