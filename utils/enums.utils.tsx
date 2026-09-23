export enum UserRole {
    CLIENT = "client",
    FREELANCER = "freelancer",
    ADMIN = "admin",
}

export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    BANNED = "banned",
}

export enum Sign {
    REGISTER = "register",
    LOGIN = "login",
}


export enum DocumentType {
    NATIONAL_ID = "national_id",
    PASSPORT = "passport",
    DRIVING_LICENSE = "driving_license",
}

export enum AttachmentEntityType {
    JOB = "job",
    PROPOSAL = "proposal",
    MESSAGE = "message",
    MILESTONE = "milestone",
    PORTFOLIO = "portfolio",
    VERIFICATION = "verification",
}



export enum VerificationStatus {
    PENDING = "pending",
    IN_REVIEW = "in_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    CANCELLED = "cancelled",
}


export enum ExperienceLevel {
    ENTRY = "entry",
    INTERMEDIATE = "intermediate",
    EXPERT = "expert",
}

export enum AvailabilityStatus {
    AVAILABLE = "available",
    BUSY = "busy",
    NOT_AVAILABLE = "not_available",
}

export enum ProfileVisibility {
    PUBLIC = "public",
    PRIVATE = "private",
    CLIENTS_ONLY = "clients_only",
}

export enum SkillLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced",
    EXPERT = "expert",
}

export enum LanguageLevel {
    BASIC = "basic",
    CONVERSATIONAL = "conversational",
    FLUENT = "fluent",
    NATIVE = "native",
}


export enum PortfolioProjectStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
}


export enum EmploymentType {
    FULL_TIME = "full-time",
    PART_TIME = "part-time",
    FREELANCE = "freelance",
    INTERNSHIP = "internship",
    CONTRACT = "contract",
}


export enum JobType {
    FIXED = "fixed",
    HOURLY = "hourly",
}

export enum JobDuration {
    LESS_THAN_1_MONTH = "less_than_1_month",
    ONE_TO_THREE_MONTHS = "1_to_3_months",
    THREE_TO_SIX_MONTHS = "3_to_6_months",
    MORE_THAN_6_MONTHS = "more_than_6_months",
}

export enum JobStatus {
    DRAFT = "draft",
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    CLOSED = "closed",
}

export enum JobVisibility {
    PUBLIC = "public",
    PRIVATE = "private",
    INVITE_ONLY = "invite_only",
}
