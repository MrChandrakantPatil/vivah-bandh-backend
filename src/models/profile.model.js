import mongoose from 'mongoose';

const { Schema } = mongoose;

// ==========================================
// Constants
// ==========================================

const profileForOptions = ['self', 'son', 'daughter', 'brother', 'sister', 'relative', 'friend'];

const genderOptions = ['male', 'female'];

const complexionOptions = [
  'fair',
  'medium',
  'dark',
];

const maritalStatusOptions = [
  'openToAll',
  'neverMarried',
  'divorced',
  'widowed',
  'awaitingDivorce',
  'separated',
  'annulled',
];

const disabilityOptions = [
  'none',
  'physicalDisability',
  'visualImpairment',
  'hearingImpairment',
  'speechImpairment',
  'intellectualDisability',
  'other',
];

const healthInformationOptions = [
  'noHealthProblem',
  'hivPositive',
  'diabetes',
  'lowBP',
  'highBP',
  'heartAilments',
  'other',
];

const annualIncomeOptions = [
  'below5Lakh',
  '5To10Lakh',
  '10To20Lakh',
  '20To30Lakh',
  '30To50Lakh',
  'above50Lakh',
];

const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const financialStatusOptions = ['middleClass', 'upperMiddleClass', 'rich', 'affluent'];

const parentDetailsOptions = ['employed', 'businessman', 'retired', 'homemaker', 'passedAway'];

const dietOptions = ['veg', 'nonVeg', 'occasionallyNonVeg', 'eggetarian', 'jain', 'vegan'];

const partnerPreferencesDietOptions = ['openToAll', 'vegetarian', 'eggearian', 'nonVegetarian'];

const profileManagedByOptions = ['self', 'parents', 'siblings', 'relatives', 'friends', 'other'];

const hobbiesOptions = {
  creative: [
    'writing',
    'cooking',
    'singing',
    'photography',
    'playingInstruments',
    'painting',
    'diyCrafts',
    'dancing',
    'acting',
    'poetry',
    'gardening',
    'blogging',
    'contentCreation',
    'designing',
    'doodling',
  ],
  fun: [
    'movies',
    'music',
    'travelling',
    'reading',
    'sports',
    'socialMedia',
    'gaming',
    'bingeWatching',
    'biking',
    'clubbing',
    'shopping',
    'theaterAndEvents',
    'anime',
    'standUps',
  ],
  fitness: [
    'running',
    'cycling',
    'yogaAndMeditation',
    'walking',
    'workingOut',
    'trekking',
    'aerobicsZumba',
    'swimming',
  ],
  otherInterests: [
    'pets',
    'foodie',
    'vegan',
    'newsAndPolitics',
    'socialService',
    'entrepreneurship',
    'homeDecor',
    'investments',
    'fashionAndBeauty',
  ],
};

const profileStatusOptions = ['draft', 'active', 'hidden', 'underReview', 'rejected'];

const profileWithChildrenOptions = [
  'openToAll',
  'yesIfTheyLiveSeparate',
  'no',
];

// ==========================================
// Reusable Location Schema
// ==========================================

const locationSchema = new Schema(
  {
    country: {
      type: String,
      trim: true,
      default: null,
    },

    state: {
      type: String,
      trim: true,
      default: null,
    },

    city: {
      type: String,
      trim: true,
      default: null,
    },

    zip: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    _id: false,
  }
);

// ==========================================
// Profile Schema
// ==========================================

const profileSchema = new Schema(
  {
    profileId: {
      type: String,
      required: true,
      trim: true,
      immutable: true,
    },

    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true,
    },

    profileFor: {
      type: String,
      enum: profileForOptions,
      required: true,
    },

    gender: {
      type: String,
      enum: genderOptions,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    dob: {
      type: Date,
      default: null,
    },

    height: {
      type: Number,
      min: 50,
      max: 250,
      default: null,
    },

    complexion: {
      type: String,
      enum: complexionOptions,
      default: null,
    },

    maritalStatus: {
      type: String,
      enum: maritalStatusOptions,
      default: null,
    },

    location: {
      type: locationSchema,
      default: () => ({}),
    },

    disability: {
      type: String,
      enum: disabilityOptions,
      default: 'none',
    },

    healthInformation: {
      type: [
        {
          type: String,
          enum: healthInformationOptions,
        },
      ],
      default: ['noHealthProblem'],
      validate: {
        validator: (values) => !values.includes('noHealthProblem') || values.length === 1,
        message: 'No Health Problem cannot be combined with other health conditions.',
      },
    },

    bloodGroup: {
      type: String,
      enum: bloodGroupOptions,
      default: null,
    },

    religiousBackground: {
      religion: {
        type: String,
        trim: true,
        default: null,
      },

      community: {
        type: String,
        trim: true,
        default: null,
      },

      subCommunity: {
        type: String,
        trim: true,
        default: null,
      },

      motherTongue: {
        type: String,
        trim: true,
        default: null,
      },

      gothra: {
        type: String,
        trim: true,
        maxlength: 100,
        default: null,
      },
    },

    astroDetails: {
      countryOfBirth: {
        type: String,
        trim: true,
        default: null,
      },

      stateOfBirth: {
        type: String,
        trim: true,
        default: null,
      },

      cityOfBirth: {
        type: String,
        trim: true,
        default: null,
      },

      timeOfBirth: {
        type: String,
        trim: true,
        default: null,
      },

      manglik: {
        type: String,
        enum: ['yes', 'no', 'unknown'],
        default: null,
      },
    },

    education: {
      highestQualification: {
        type: String,
        trim: true,
        default: null,
      },

      educationField: {
        type: String,
        trim: true,
        default: null,
      },

      collegeName: {
        type: String,
        trim: true,
        maxlength: 200,
        default: null,
      },
    },

    career: {
      workingSector: {
        type: String,
        trim: true,
        default: null,
      },

      profession: {
        type: String,
        trim: true,
        default: null,
      },

      employer: {
        type: String,
        trim: true,
        maxlength: 200,
        default: null,
      },

      annualIncome: {
        type: String,
        enum: annualIncomeOptions,
        default: null,
      },
    },

    familyDetails: {
      location: {
        type: locationSchema,
        default: () => ({}),
      },

      financialStatus: {
        type: String,
        enum: financialStatusOptions,
        default: null,
      },

      fatherDetails: {
        type: String,
        enum: parentDetailsOptions,
        default: null,
      },

      motherDetails: {
        type: String,
        enum: parentDetailsOptions,
        default: null,
      },

      brothers: {
        type: Number,
        min: 0,
        default: null,
      },

      sisters: {
        type: Number,
        min: 0,
        default: null,
      },
    },

    lifestyle: {
      diet: {
        type: String,
        enum: dietOptions,
        default: null,
      },
    },

    hobbies: {
      type: [
        {
          category: {
            type: String,
            enum: Object.keys(hobbiesOptions),
            required: true,
          },

          value: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
      validate: {
        validator: (items) =>
          items.length <= 5 && new Set(items.map((item) => item.value)).size === items.length,
        message: 'Select up to 5 unique hobbies and interests.',
      },
    },

    partnerPreferences: {
      basicDetails: {
        minAge: {
          type: Number,
          min: 18,
          max: 100,
          default: null,
        },

        maxAge: {
          type: Number,
          min: 18,
          max: 100,
          default: null,
        },

        minHeight: {
          type: Number,
          min: 50,
          max: 250,
          default: null,
        },

        maxHeight: {
          type: Number,
          min: 50,
          max: 250,
          default: null,
        },

        maritalStatus: {
          type: [
            {
              type: String,
              enum: maritalStatusOptions,
            },
          ],
          default: [],
        },

        profileWithChildren: {
          type: String,
          enum: profileWithChildrenOptions,
          default: null,
        },
      },

      religion: {
        religion: {
          type: [String],
          default: [],
        },

        community: {
          type: [String],
          default: [],
        },

        subCommunity: {
          type: [String],
          default: [],
        },

        motherTongue: {
          type: [String],
          default: [],
        },
      },

      location: {
        country: {
          type: [String],
          default: [],
        },

        state: {
          type: [String],
          default: [],
        },

        city: {
          type: [String],
          default: [],
        },
      },

      educationAndCareer: {
        qualification: {
          type: [String],
          default: [],
        },

        workingSector: {
          type: [String],
          default: [],
        },

        profession: {
          type: [String],
          default: [],
        },

        annualIncome: {
          mode: {
            type: String,
            enum: ['openToAll', 'range'],
            default: 'openToAll',
          },
          min: {
            type: String,
            enum: ['>1', '2', '5', '7', '10', '15', '20', '30', '50'],
            default: null,
          },
          max: {
            type: String,
            enum: ['5', '7', '10', '15', '20', '30', '50', '75', '100', '>100'],
            default: null,
          },
        },
      },

      other: {
        profileManagedBy: {
          type: [
            {
              type: String,
              enum: profileManagedByOptions,
            },
          ],
          default: [],
        },

        diet: {
          type: [
            {
              type: String,
              enum: partnerPreferencesDietOptions,
            },
          ],
          default: [],
        },
      },
    },

    aboutMe: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: null,
    },

    profilePhotos: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
      validate: [
        {
          validator: (photos) => Array.isArray(photos) && photos.length <= 5,
          message: 'A maximum of 5 profile photos is allowed.',
        },
        {
          validator: (photos) => new Set(photos).size === photos.length,
          message: 'Duplicate profile photos are not allowed.',
        },
      ],
    },

    primaryPhoto: {
      type: String,
      trim: true,
      default: null,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: profileStatusOptions,
      default: 'draft',
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    lastActiveAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// Validations
// ==========================================

profileSchema.pre('validate', function () {
  const preferences = this.partnerPreferences?.basicDetails;

  if (
    preferences?.minAge != null &&
    preferences?.maxAge != null &&
    preferences.minAge > preferences.maxAge
  ) {
    this.invalidate(
      'partnerPreferences.basicDetails.maxAge',
      'Maximum age must be greater than or equal to minimum age.'
    );
  }

  if (
    preferences?.minHeight != null &&
    preferences?.maxHeight != null &&
    preferences.minHeight > preferences.maxHeight
  ) {
    this.invalidate(
      'partnerPreferences.basicDetails.maxHeight',
      'Maximum height must be greater than or equal to minimum height.'
    );
  }

  if (this.dob && this.dob > new Date()) {
    this.invalidate('dob', 'Date of birth cannot be in the future.');
  }

  if (this.primaryPhoto && !this.profilePhotos.includes(this.primaryPhoto)) {
    this.invalidate('primaryPhoto', 'Primary photo must exist in profilePhotos.');
  }

  for (const item of this.hobbies || []) {
    if (!hobbiesOptions[item.category]?.includes(item.value)) {
      this.invalidate('hobbies', `${item.value} is not valid for ${item.category}.`);
    }
  }
});

// ==========================================
// Indexes
// ==========================================

profileSchema.index(
  { profileId: 1 },
  {
    unique: true,
    name: 'uq_profile_profile_id',
  }
);

profileSchema.index(
  { createdByUserId: 1 },
  {
    unique: true,
    name: 'uq_profile_created_by_user',
  }
);

profileSchema.index(
  { gender: 1, dob: 1 },
  {
    name: 'idx_profile_gender_dob_active',
    partialFilterExpression: {
      status: 'active',
    },
  }
);

profileSchema.index(
  { gender: 1, 'location.city': 1, dob: 1 },
  {
    name: 'idx_profile_city_dob_active',
    partialFilterExpression: {
      status: 'active',
    },
  }
);

profileSchema.index(
  {
    gender: 1,
    'religiousBackground.religion': 1,
    'religiousBackground.community': 1,
    dob: 1,
  },
  {
    name: 'idx_profile_religion_community_active',
    partialFilterExpression: {
      status: 'active',
    },
  }
);

profileSchema.index(
  { gender: 1, 'career.profession': 1 },
  {
    name: 'idx_profile_profession_active',
    partialFilterExpression: {
      status: 'active',
    },
  }
);

// ==========================================
// Model
// ==========================================

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default Profile;
