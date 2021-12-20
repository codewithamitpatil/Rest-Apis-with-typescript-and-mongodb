
import { DocumentDefinition, FilterQuery, UpdateQuery } from 'mongoose';
import Profile, { ProfileDocument } from '../model/profile.model';
import { UserDocument } from '../model/user.model';


// create profile
export async function createProfile( input: DocumentDefinition<ProfileDocument> | any ) {
    return await Profile.create( input );
}

// update profile
export async function updateProfile(
    query: FilterQuery<ProfileDocument>,
    update: UpdateQuery<ProfileDocument>
) {
    return await Profile.findOneAndUpdate( query, update );
}

// fetch profile 
export async function getProfile(
    query: FilterQuery<ProfileDocument>
) {
    return await Profile.findOne( query ).lean();
}
