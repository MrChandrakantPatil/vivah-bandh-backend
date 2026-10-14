import Profile from '../../../models/profile.model.js';
import { calculateAge } from '../../matches/matches.utils.js';
import { PROFILE_ERRORS } from '../profile.errors.js';

const ALLOWED_PROFILE_FIELDS = [
  'profileFor',
  'gender',
  'name',
  'dob',
  'maritalStatus',

  'religion',
  'community',
  'motherTongue',
  'height',
  'color',

  'education',
  'occupation',
  'annualIncome',

  'familyType',
  'familyStatus',
  'fatherOccupation',
  'motherOccupation',
  'brothers',
  'sisters',

  'location',

  'aboutMe',
  'hobbies',
  'lifestyle',

  'partnerPreference',

  'profilePhotos',
  'primaryPhoto',
];

export const updateProfileService = async (userId, payload) => {
  if (typeof userId !== 'string' || !userId.trim()) {
    throw new Error(PROFILE_ERRORS.INVALID_USER_ID.code);
  }

  console.log('Payload :-', payload);

  const userProfileId = userId.trim();

  const profile = await Profile.findOne({
    userId: userProfileId,
  });

  if (!profile) {
    throw new Error(PROFILE_ERRORS.PROFILE_NOT_FOUND.code);
  }

  const updates = {};

  for (const field of ALLOWED_PROFILE_FIELDS) {
    if (Object.hasOwn(payload, field)) {
      updates[field] = payload[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new Error(PROFILE_ERRORS.NO_UPDATABLE_FIELDS.code);
  }

  Object.assign(profile, updates);

  const updatedProfile = await profile.save();

  return {
    userId: updatedProfile.userId,
    profileFor: updatedProfile.profileFor,
    gender: updatedProfile.gender,
    name: updatedProfile.name,
    dob: updatedProfile.dob,
    age: calculateAge(updatedProfile.dob),
    religion: updatedProfile.religion,
    community: updatedProfile.community,
    height: updatedProfile.height,
    color: updatedProfile.color,
    maritalStatus: updatedProfile.maritalStatus,
    motherTongue: updatedProfile.motherTongue,
    education: updatedProfile.education,
    occupation: updatedProfile.occupation,
    annualIncome: updatedProfile.annualIncome,
    familyType: updatedProfile.familyType,
    familyStatus: updatedProfile.familyStatus,
    fatherOccupation: updatedProfile.fatherOccupation,
    motherOccupation: updatedProfile.motherOccupation,
    brothers: updatedProfile.brothers,
    sisters: updatedProfile.sisters,
    location: updatedProfile.location,
    partnerPreference: updatedProfile.partnerPreference,
    profilePhotos: updatedProfile.profilePhotos,
    primaryPhoto: updatedProfile.primaryPhoto,
    aboutMe: updatedProfile.aboutMe,
    profileCompleted: updatedProfile.profileCompleted,
    status: updatedProfile.status,
  };
};
