import Profile from '../../../models/profile.model.js';
import { calculateAge } from '../../matches/matches.utils.js';
import { calculateMatchScore } from '../../matches/score.service.js';
import { PROFILE_ERRORS } from '../../profile/profile.errors.js';

export const getProfileDetailsService = async (currentUserId, candidateUserId) => {
  if (
    typeof currentUserId !== 'string' ||
    !currentUserId.trim() ||
    typeof candidateUserId !== 'string' ||
    !candidateUserId.trim()
  ) {
    throw new Error(PROFILE_ERRORS.INVALID_USER_ID.code);
  }

  const [currentProfile, candidateProfile] = await Promise.all([
    Profile.findOne({ userId: currentUserId.trim() }).lean(),
    Profile.findOne({ userId: candidateUserId.trim() }).lean(),
  ]);

  if (!currentProfile) {
    throw new Error(PROFILE_ERRORS.PROFILE_NOT_FOUND.code);
  }

  if (!candidateProfile) {
    throw new Error(PROFILE_ERRORS.PROFILE_NOT_FOUND.code);
  }

  const matchPercentage = calculateMatchScore(
    currentProfile,
    candidateProfile,
  );

  return {
    // Basic identification
    userId: candidateProfile.userId,
    profileFor: candidateProfile.profileFor,
    gender: candidateProfile.gender,
    name: candidateProfile.name,

    // Personal details
    dob: candidateProfile.dob,
    age: candidateProfile.dob
      ? calculateAge(candidateProfile.dob)
      : null,
    religion: candidateProfile.religion,
    community: candidateProfile.community,
    height: candidateProfile.height,
    color: candidateProfile.color,
    maritalStatus: candidateProfile.maritalStatus,
    motherTongue: candidateProfile.motherTongue,

    // Education and career
    education: candidateProfile.education,
    occupation: candidateProfile.occupation,
    annualIncome: candidateProfile.annualIncome,

    // Family details
    familyType: candidateProfile.familyType,
    familyStatus: candidateProfile.familyStatus,
    fatherOccupation: candidateProfile.fatherOccupation,
    motherOccupation: candidateProfile.motherOccupation,
    brothers: candidateProfile.brothers,
    sisters: candidateProfile.sisters,

    // Location
    location: candidateProfile.location,

    // Partner preferences
    partnerPreference: candidateProfile.partnerPreference,

    // Photos
    profilePhotos: candidateProfile.profilePhotos ?? [],
    primaryPhoto: candidateProfile.primaryPhoto ?? null,

    // About
    aboutMe: candidateProfile.aboutMe,

    // Match percentage
    matchPercentage,

    // Profile status
    profileCompleted: candidateProfile.profileCompleted,
    status: candidateProfile.status,
  };
};