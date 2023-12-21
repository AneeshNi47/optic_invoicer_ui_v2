import { Interface } from "readline"


export interface OrganisationModel  {
    name: string
    address_first_line: string
    email: string
    secondary_email: string
    primary_phone_mobile: string
    other_contact_numbers: string
    phone_landline: string
    logo: string
    translation_required: boolean
    country: string
    city: string,
    post_box_number: string,
    services: string,
    is_active: boolean
}

export interface StaffModel  {
    first_name: string
    last_name: string
    designation: string
    phone: string
    email: string
    staff_superuser: boolean,
    user: {
        username: string,
        password: string
    }
}

export interface AddOrganisationModel {
    organisation: OrganisationModel
    staff: StaffModel
}
