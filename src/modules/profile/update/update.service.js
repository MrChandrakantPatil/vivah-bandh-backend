import User from '../../../models/user.model.js';
import Profile from '../../../models/profile.model.js';

import { calculateAge } from '../../matches/matches.utils.js';
import { PROFILE_ERRORS } from '../profile.errors.js';
import { calculateProfilePercentage } from '../profile.utils.js';

// ==========================================
// Allowed Profile Fields
// ==========================================

const ALLOWED_PROFILE_FIELDS = {
  profileFor: true,
  gender: true,
  name: true,
  dob: true,
  height: true,
  complexion: true,
  maritalStatus: true,
  disability: true,
  healthInformation: true,
  bloodGroup: true,

  location: {
    country: true,
    state: true,
    city: true,
    zip: true,
  },

  religiousBackground: {
    religion: true,
    community: true,
    subCommunity: true,
    motherTongue: true,
    gothra: true,
  },

  education: {
    highestQualification: true,
    educationField: true,
    collegeName: true,
  },

  career: {
    workingSector: true,
    profession: true,
    employer: true,
    annualIncome: true,
  },

  astroDetails: {
    countryOfBirth: true,
    stateOfBirth: true,
    cityOfBirth: true,
    timeOfBirth: true,
    manglik: true,
  },

  familyDetails: {
    location: {
      country: true,
      state: true,
      city: true,
      zip: true,
    },
    financialStatus: true,
    fatherDetails: true,
    motherDetails: true,
    brothers: true,
    sisters: true,
  },

  lifestyle: {
    diet: true,
  },

  hobbies: true,

  partnerPreferences: {
    basicDetails: {
      minAge: true,
      maxAge: true,
      minHeight: true,
      maxHeight: true,
      maritalStatus: true,
      profileWithChildren: true,
    },

    religion: {
      religion: true,
      community: true,
      subCommunity: true,
      motherTongue: true,
    },

    location: {
      country: true,
      state: true,
      city: true,
    },

    educationAndCareer: {
      qualification: true,
      workingSector: true,
      profession: true,
      annualIncome: true,
    },

    other: {
      profileManagedBy: true,
      diet: true,
    },
  },

  aboutMe: true,
  profilePhotos: true,
  primaryPhoto: true,
};

// ==========================================
// Apply Allowed Updates
// ==========================================

const applyAllowedUpdates = (document, payload, allowedFields, parentPath = '') => {
  let updated = false;

  for (const [field, value] of Object.entries(payload)) {
    if (!Object.hasOwn(allowedFields, field)) {
      continue;
    }

    const currentPath = parentPath ? `${parentPath}.${field}` : field;

    const allowedValue = allowedFields[field];

    if (
      allowedValue !== true &&
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      updated = applyAllowedUpdates(document, value, allowedValue, currentPath) || updated;

      continue;
    }

    document.set(currentPath, value);

    updated = true;
  }

  return updated;
};

// ==========================================
// Update Profile Service
// ==========================================

export const updateProfileService = async (userId, payload) => {
  if (typeof userId !== 'string' || !userId.trim()) {
    throw new Error(PROFILE_ERRORS.INVALID_USER_ID.code);
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error(PROFILE_ERRORS.NO_UPDATABLE_FIELDS.code);
  }

  const user = await User.findOne({
    userId: userId.trim(),
  }).select('_id');

  if (!user) {
    throw new Error(PROFILE_ERRORS.PROFILE_NOT_FOUND.code);
  }

  const profile = await Profile.findOne({
    createdByUserId: user._id,
  });

  if (!profile) {
    throw new Error(PROFILE_ERRORS.PROFILE_NOT_FOUND.code);
  }

  const hasUpdates = applyAllowedUpdates(profile, payload, ALLOWED_PROFILE_FIELDS);

  if (!hasUpdates) {
    throw new Error(PROFILE_ERRORS.NO_UPDATABLE_FIELDS.code);
  }

  const updatedProfile = await profile.save();

  const profilePercentage = calculateProfilePercentage(updatedProfile);

  return {
    profileId: updatedProfile.profileId,

    profileFor: updatedProfile.profileFor,
    gender: updatedProfile.gender,
    name: updatedProfile.name,
    dob: updatedProfile.dob,
    age: updatedProfile.dob ? calculateAge(updatedProfile.dob) : null,
    height: updatedProfile.height,
    diet: updatedProfile.diet,
    maritalStatus: updatedProfile.maritalStatus,

    location: updatedProfile.location,

    disability: updatedProfile.disability,
    healthInformation: updatedProfile.healthInformation,
    bloodGroup: updatedProfile.bloodGroup,

    religiousBackground: updatedProfile.religiousBackground,
    astroDetails: profile.astroDetails,

    education: updatedProfile.education,
    career: updatedProfile.career,

    horoscope: updatedProfile.horoscope,
    familyDetails: updatedProfile.familyDetails,
    lifestyle: updatedProfile.lifestyle,

    hobbies: updatedProfile.hobbies,
    partnerPreferences: updatedProfile.partnerPreferences,

    aboutMe: updatedProfile.aboutMe,
    profilePhotos: updatedProfile.profilePhotos,
    primaryPhoto: updatedProfile.primaryPhoto,

    profileCompleted: updatedProfile.profileCompleted,
    profilePercentage,
    status: updatedProfile.status,

    publishedAt: updatedProfile.publishedAt,
    lastActiveAt: updatedProfile.lastActiveAt,
    createdAt: updatedProfile.createdAt,
    updatedAt: updatedProfile.updatedAt,
  };
};
