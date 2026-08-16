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