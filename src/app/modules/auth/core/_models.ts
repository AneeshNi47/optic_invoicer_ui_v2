export interface StaffDetails {
  first_name: string
  last_name: string
  designation: string
  phone: string
  email: string
  staff_superuser: boolean
  organization: OrganizationDetails
}

export interface OrganizationDetails {
  id: number
  name: string
  address_first_line: string
  email: string
  secondary_email: string | null
  primary_phone_mobile: string
  other_contact_numbers: string
  phone_landline: string
  logo: string
  translation_required: boolean
  country: string
  city: string
  post_box_number: string
  services: string
  is_active: boolean
  created_on: string
  updated_on: string
  created_by: number
  updated_by: number
  owner: number
}

export interface User {
  id: number
  username: string
  email: string
  groups: any[]
  is_superuser: boolean
  staff_details: StaffDetails
  customer_details: any | null
  user_type: string
}

export interface NewAuthModel {
  user: User
  token: string
}

export interface AuthModel {
  token: string
  api_token: string
  refreshToken?: string
}

export interface UserAddressModel {
  addressLine: string
  city: string
  state: string
  postCode: string
}

export interface UserCommunicationModel {
  email: boolean
  sms: boolean
  phone: boolean
}

export interface UserEmailSettingsModel {
  emailNotification?: boolean
  sendCopyToPersonalEmail?: boolean
  activityRelatesEmail?: {
    youHaveNewNotifications?: boolean
    youAreSentADirectMessage?: boolean
    someoneAddsYouAsAsAConnection?: boolean
    uponNewOrder?: boolean
    newMembershipApproval?: boolean
    memberRegistration?: boolean
  }
  updatesFromKeenthemes?: {
    newsAboutKeenthemesProductsAndFeatureUpdates?: boolean
    tipsOnGettingMoreOutOfKeen?: boolean
    thingsYouMissedSindeYouLastLoggedIntoKeen?: boolean
    newsAboutStartOnPartnerProductsAndOtherServices?: boolean
    tipsOnStartBusinessProducts?: boolean
  }
}

export interface UserSocialNetworksModel {
  linkedIn: string
  facebook: string
  twitter: string
  instagram: string
}

export interface UserModel {
  id: number
  username: string
  email: string
  groups: any[]
  is_superuser: boolean
  staff_details: StaffDetails
  customer_details: any | null
  user_type: string
  // Optional fields from the original UserModel
  fullname?: string
  occupation?: string
  companyName?: string
  phone?: string
  roles?: Array<number>
  pic?: string
  language?: 'en' | 'de' | 'es' | 'fr' | 'ja' | 'zh' | 'ru'
  timeZone?: string
  website?: string
  emailSettings?: UserEmailSettingsModel
  auth?: AuthModel
  communication?: UserCommunicationModel
  address?: UserAddressModel
  socialNetworks?: UserSocialNetworksModel
}
