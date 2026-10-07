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


export enum NotificationType {
    // --- Proposals & Offers ---
    PROPOSAL_RECEIVED = "proposal_received",
    PROPOSAL_ACCEPTED = "proposal_accepted",
    PROPOSAL_REJECTED = "proposal_rejected",
    PROPOSAL_WITHDRAWN = "proposal_withdrawn",

    // --- Invitations ---
    INVITATION_RECEIVED = "invitation_received",
    INVITATION_ACCEPTED = "invitation_accepted",
    INVITATION_DECLINED = "invitation_declined",

    // --- Contracts ---
    CONTRACT_CREATED = "contract_created",
    CONTRACT_UPDATED = "contract_updated",
    CONTRACT_COMPLETED = "contract_completed",
    CONTRACT_CANCELLED = "contract_cancelled",
    CONTRACT_PAUSED = "contract_paused",

    // --- Milestones ---
    MILESTONE_CREATED = "milestone_created",
    MILESTONE_SUBMITTED = "milestone_submitted",
    MILESTONE_APPROVED = "milestone_approved",
    MILESTONE_REJECTED = "milestone_rejected",
    MILESTONE_REVISED = "milestone_revised",

    // --- Payments & Escrow ---
    PAYMENT_RECEIVED = "payment_received",
    PAYMENT_SENT = "payment_sent",
    PAYMENT_FAILED = "payment_failed",
    PAYMENT_ESCROW_FUNDED = "payment_escrow_funded",
    PAYMENT_REFUNDED = "payment_refunded",

    // --- Messaging ---
    // MESSAGE_RECEIVED = "message_received",

    // --- Jobs ---
    JOB_POSTED = "job_posted",
    JOB_UPDATED = "job_updated",
    JOB_CLOSED = "job_closed",

    // --- Reviews & Feedback ---
    REVIEW_RECEIVED = "review_received",
    REVIEW_UPDATED = "review_updated",

    // --- Account Verification & KYC ---
    VERIFICATION_APPROVED = "verification_approved",
    VERIFICATION_REJECTED = "verification_rejected",
    VERIFICATION_PENDING = "verification_pending",

    // --- Payouts & Withdrawals ---
    WITHDRAWAL_REQUESTED = "withdrawal_requested",
    WITHDRAWAL_COMPLETED = "withdrawal_completed",
    WITHDRAWAL_FAILED = "withdrawal_failed",

    // --- Disputes ---
    DISPUTE_OPENED = "dispute_opened",
    DISPUTE_RESOLVED = "dispute_resolved",

    // --- System & Announcements ---
    SYSTEM = "system",
}

export enum NotificationEntityType {
    JOB = "job",
    PROPOSAL = "proposal",
    CONTRACT = "contract",
    MILESTONE = "milestone",
    PAYMENT = "payment",
    MESSAGE = "message",
    REVIEW = "review",
    VERIFICATION = "verification",
    WITHDRAWAL = "withdrawal",
    SYSTEM = "system",
}


export enum ProposalStatus {
    PENDING = "pending",
    SHORTLISTED = "shortlisted",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    WITHDRAWN = "withdrawn",
}

export enum DeliveryDurationUnit {
    HOURS = 'hours',
    DAYS = "days",
    WEEKS = "weeks",
    MONTHS = "months",
    YEARS = "years",
}


export enum ConversationStatus {
    ACTIVE = "active",
    ARCHIVED = "archived",
    BLOCKED = "blocked",
}

export enum MessageType {
    TEXT = "text",
    IMAGE = "image",
    FILE = "file",
    SYSTEM = "system",
}

export enum MessageStatus {
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read",
    FAILED = "failed",
}


export enum ContractType {
    FIXED = "fixed",
    HOURLY = "hourly",
}

export enum ContractStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    PAUSED = "paused",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    REJECTED = "rejected",
    DISPUTED = "disputed",
}


export enum MilestoneStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    SUBMITTED = "submitted",
    APPROVED = "approved",
    REJECTED = "rejected",
    CANCELLED = "cancelled",
}

export enum PaymentMethod {
    CARD = "card",
    US_BANK_ACCOUNT = "us_bank_account",
    PAYPAL = "paypal",
}

export enum PaymentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    PAID = "paid",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded",
    PARTIALLY_REFUNDED = "partially_refunded",
    CANCELLED = "cancelled",
}

export enum PaymentType {
    MILESTONE = "milestone",
    CONTRACT = "contract",
}

export enum TransactionType {
    CLIENT_PAYMENT = "client_payment",
    PLATFORM_FEE = "platform_fee",
    FREELANCER_PAYOUT = "freelancer_payout",
    REFUND = "refund",
    PARTIAL_REFUND = "partial_refund",
}

export enum TransactionStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
}

export enum TransactionDirection {
    CREDIT = "credit",
    DEBIT = "debit",
}

export enum ContactSupportCategory {
    GENERAL_INQUIRY = "general_inquiry",
    ACCOUNT = "account",
    PAYMENT = "payment",
    JOB = "job",
    PROPOSAL = "proposal",
    CONTRACT = "contract",
    TECHNICAL = "technical",
    SECURITY = "security",
    OTHER = "other",
}

export enum ContactSupportStatus {
    NEW = "new",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    CLOSED = "closed",
}