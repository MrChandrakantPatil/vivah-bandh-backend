import Profile from '../../../models/profile.model.js';
import { calculateAge } from '../../matches/matches.utils.js';
import { calculateProfilePercentage } from '../profile.utils.js';
import { PROFILE_ERRORS } from '../profile.errors.js';

export const getProfileService = async (userId) => {
  if (typeof userId !== 'string' || !userId.trim()) {
    throw new Error(PROFILE_ERRORS.INVALID_USER_ID.code);
  }

  const profile = await Profile.findOne({
    userId: userId.trim(),
  }).lean();

  if (!profile) {
    throw new Error(PROFILE_ERRORS.PROFILE_NOT_FOUND.code);
  }

  const profilePercentage = calculateProfilePercentage(profile);

  return {
    userId: profile.userId,
    profileFor: profile.profileFor,
    gender: profile.gender,
    name: profile.name,
    dob: profile.dob,
    age: calculateAge(profile.dob),
    religion: profile.religion,
    community: profile.community,
    height: profile.height,
    color: profile.color,
    maritalStatus: profile.maritalStatus,
    motherTongue: profile.motherTongue,
    education: profile.education,
    occupation: profile.occupation,
    annualIncome: profile.annualIncome,
    familyType: profile.familyType,
    familyStatus: profile.familyStatus,
    fatherOccupation: profile.fatherOccupation,
    motherOccupation: profile.motherOccupation,
    brothers: profile.brothers,
    sisters: profile.sisters,
    location: profile.location,
    partnerPreference: profile.partnerPreference,
    profilePhotos: profile.profilePhotos,
    primaryPhoto: profile.primaryPhoto,
    aboutMe: profile.aboutMe,
    profileCompleted: profile.profileCompleted,
    profilePercentage,
    status: profile.status,
  };
};
