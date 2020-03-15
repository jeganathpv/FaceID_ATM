export enum AuthState {
    authenticated,
    invalidusername,
    invalidpassword,
    loggedout
}

export enum EnrollmentStep {
    selectbranch,
    enterdetails,
    facedetection
}

export interface Bank {
    branchCode?: string,
    ifscCode?: string,
    location?: string,
    lastAddedAcNo?: number
}

export interface Customer {
    customerID?: string,
    accountNo?: string,
    name?: string,
    balance?: number
}