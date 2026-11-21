import User from '../../../models/user.model.js';
import Profile from '../../../models/profile.model.js';

import { calculateAge } from '../../matches/matches.utils.js';
import { calculateProfilePercentage } from '../profile.utils.js';
import { PROFILE_ERRORS } from '../profile.errors.js';

export const getProfileService = async (userId) => {
  if (typeof userId !== 'string' || !userId.trim()) {
    throw new Error(PROFILE_ERRORS.INVALID_USER_ID.code);
  }

  const user = await User.findOne({
    userId: userId.trim(),
  }).select('_id userId');

  if (!user) {
    throw new Error(PROFILE_ERRORS.PROFILE_NOT_FOUND.code);
  }

  const profile = await Profile.findOne({
    createdByUserId: user._id,
  }).lean();

  if (!profile) {
    throw new Error(PROFILE_ERRORS.PROFILE_NOT_FOUND.code);
  }

  const profilePercentage = calculateProfilePercentage(profile);

  return {
    profileId: profile.profileId,

    profileFor: profile.profileFor,
    gender: profile.gender,
    name: profile.name,
    dob: profile.dob,
    age: profile.dob ? calculateAge(profile.dob) : null,
    height: profile.height,
    diet: profile.diet,
    complexion: profile.complexion,
    maritalStatus: profile.maritalStatus,

    location: profile.location,

    disability: profile.disability,
    healthInformation: profile.healthInformation,
    bloodGroup: profile.bloodGroup,

    religiousBackground: profile.religiousBackground,
    astroDetails: profile.astroDetails,

    education: profile.education,
    career: profile.career,

    horoscope: profile.horoscope,
    familyDetails: profile.familyDetails,
    lifestyle: profile.lifestyle,

    hobbies: profile.hobbies,
    partnerPreferences: profile.partnerPreferences,

    aboutMe: profile.aboutMe,
    profilePhotos: profile.profilePhotos,
    primaryPhoto: profile.primaryPhoto,

    profileCompleted: profile.profileCompleted,
    profilePercentage,
    status: profile.status,

    publishedAt: profile.publishedAt,
    lastActiveAt: profile.lastActiveAt,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
};
