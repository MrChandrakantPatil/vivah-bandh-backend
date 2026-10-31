export const calculateProfilePercentage = (profile) => {
  const fields = [
    profile.profileFor,
    profile.gender,
    profile.name,
    profile.dob,
    profile.religion,
    profile.community,
    profile.height,
    profile.maritalStatus,
    profile.motherTongue,
    profile.education,
    profile.occupation,
    profile.annualIncome,
    profile.familyType,
    profile.familyStatus,
    profile.fatherOccupation,
    profile.motherOccupation,
    profile.brothers,
    profile.sisters,
    profile.location,
    profile.profilePhotos?.length > 0,
    profile.aboutMe,
  ];

  const completedFields = fields.filter((value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value !== null && value !== undefined;
  }).length;

  return Math.round((completedFields / fields.length) * 100);
};
