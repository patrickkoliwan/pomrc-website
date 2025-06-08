export interface PersonalInfo {
  firstName: string;
  surname: string;
  phone: string;
  email: string;
  address?: string;
}

export interface Endorser {
  name: string;
  contact: string;
}

export interface Endorsements {
  firstEndorser: Endorser;
  secondEndorser: Endorser;
}

export interface FamilyMember {
  name: string;
  gender: string;
  playingLevel: 'A_GRADE' | 'B_GRADE' | 'SOCIAL' | 'BEGINNER' | 'JUNIOR';
}

export interface Child extends FamilyMember {
  dateOfBirth: string;
}

export interface FamilyDetails {
  spouse?: {
    name: string;
    gender: string;
    playingLevel: 'A_GRADE' | 'B_GRADE' | 'SOCIAL' | 'BEGINNER';
  };
  children?: Array<{
    name: string;
    gender: string;
    dateOfBirth: string;
    playingLevel: 'A_GRADE' | 'B_GRADE' | 'SOCIAL' | 'BEGINNER' | 'JUNIOR';
  }>;
}

export interface ClubInvolvement {
  interestedInClubOfficer: boolean;
  skills?: string;
}

export type MembershipStatus = 'new' | 'renewal';
export type MembershipType = 'FAMILY' | 'SINGLE_ADULT' | 'JUNIORS' | 'SOCIAL';

export interface MembershipFormData {
  personalInfo: PersonalInfo;
  membershipStatus: MembershipStatus;
  membershipType: MembershipType;
  endorsements?: Endorsements;
  familyDetails?: FamilyDetails;
  clubInvolvement: ClubInvolvement;
  declaration: boolean;
} 