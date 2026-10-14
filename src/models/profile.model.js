import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    profileFor: {
      type: String,
      enum: ['self', 'son', 'daughter', 'brother', 'sister', 'relative', 'friend'],
      required: true,
    },

    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    maritalStatus: {
      type: String,
      enum: ['Never Married', 'Divorced', 'Widowed', 'Separated'],
      default: null,
    },

    religion: {
      type: String,
      required: true,
      trim: true,
    },

    community: {
      type: String,
      required: true,
      trim: true,
    },

    motherTongue: {
      type: String,
      trim: true,
      default: null,
    },

    height: {
      type: Number,
      min: 50,
      max: 250,
      default: null,
    },

    color: {
      type: String,
      trim: true,
      default: null,
    },

    education: {
      type: String,
      trim: true,
      default: null,
    },

    occupation: {
      type: String,
      trim: true,
      default: null,
    },

    annualIncome: {
      type: String,
      enum: [
        'Below ₹5 Lakh',
        '₹5 - ₹10 Lakh',
        '₹10 - ₹20 Lakh',
        '₹20 - ₹30 Lakh',
        '₹30 - ₹50 Lakh',
        'Above ₹50 Lakh',
      ],
      default: null,
    },

    familyType: {
      type: String,
      enum: ['Joint Family', 'Nuclear Family', 'Extended Family'],
      default: null,
    },

    familyStatus: {
      type: String,
      enum: ['Middle Class', 'Upper Middle Class', 'Rich', 'Affluent'],
      default: null,
    },

    fatherOccupation: {
      type: String,
      trim: true,
      default: null,
    },

    motherOccupation: {
      type: String,
      trim: true,
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

    location: {
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
    },

    aboutMe: {
      type: String,
      maxlength: 2000,
      trim: true,
      default: null,
    },

    hobbies: {
      type: [String],
      default: [],
    },

    lifestyle: {
      type: String,
      trim: true,
      default: null,
    },

    partnerPreference: {
      minAge: {
        type: Number,
        min: 18,
        default: null,
      },
      maxAge: {
        type: Number,
        max: 100,
        default: null,
      },
      religion: {
        type: [String],
        default: [],
      },
      community: {
        type: [String],
        default: [],
      },
      education: {
        type: [String],
        default: [],
      },
      occupation: {
        type: [String],
        default: [],
      },
    },

    profilePhotos: {
      type: [String],
      default: [],
      validate: {
        validator: (photos) => photos.length <= 5,
        message: 'A maximum of 5 profile photos is allowed.',
      },
    },

    primaryPhoto: {
      type: String,
      default: null,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ['draft', 'active', 'hidden', 'under_review', 'rejected'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Profile', profileSchema);
