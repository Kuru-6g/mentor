// Payment Service - MentorCruise-style pricing model
// Handles fee calculations and payment utilities

// Platform fee configuration
export const PLATFORM_CONFIG = {
    MARKUP_PERCENTAGE: 0.20, // 20% markup on mentor's payout
    MIN_PLAN_FEE: 20, // $20 minimum fee for plans under $100/month
    CUSTOM_SESSION_FEE: 0.10, // 10% fee for custom sessions
    SMALL_PLAN_THRESHOLD: 100, // Plans under this amount use MIN_PLAN_FEE
};

export interface SessionService {
    id: string;
    mentorId: string;
    title: string;
    description: string;
    durationMinutes: number;
    mentorPayout: number; // What mentor receives
    displayPrice: number; // What mentee pays (auto-calculated)
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MonthlyPlan {
    mentorPayout: number; // What mentor receives
    displayPrice: number; // What mentee pays (auto-calculated)
    callsPerMonth: number;
    chatAccess: boolean;
    resourceAccess: boolean;
    prioritySupport: boolean;
    customIncludes?: string[];
}

/**
 * Calculate the display price (what mentee pays) from mentor's desired payout
 * Uses 20% markup, with $20 minimum for small plans
 */
export function calculateDisplayPrice(
    mentorPayout: number,
    isMonthlyPlan: boolean = false
): number {
    if (mentorPayout <= 0) return 0;

    if (isMonthlyPlan && mentorPayout < PLATFORM_CONFIG.SMALL_PLAN_THRESHOLD) {
        // For small monthly plans, add flat minimum fee
        return mentorPayout + PLATFORM_CONFIG.MIN_PLAN_FEE;
    }

    // Standard 20% markup
    return Math.round(mentorPayout * (1 + PLATFORM_CONFIG.MARKUP_PERCENTAGE));
}

/**
 * Calculate mentor's payout from display price
 */
export function calculateMentorPayout(
    displayPrice: number,
    isMonthlyPlan: boolean = false
): number {
    if (displayPrice <= 0) return 0;

    if (isMonthlyPlan && displayPrice < PLATFORM_CONFIG.SMALL_PLAN_THRESHOLD + PLATFORM_CONFIG.MIN_PLAN_FEE) {
        // For small monthly plans with flat fee
        return displayPrice - PLATFORM_CONFIG.MIN_PLAN_FEE;
    }

    // Reverse 20% markup
    return Math.round(displayPrice / (1 + PLATFORM_CONFIG.MARKUP_PERCENTAGE));
}

/**
 * Calculate platform fee amount
 */
export function calculatePlatformFee(
    mentorPayout: number,
    isMonthlyPlan: boolean = false
): number {
    const displayPrice = calculateDisplayPrice(mentorPayout, isMonthlyPlan);
    return displayPrice - mentorPayout;
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Get fee breakdown for transparency display
 */
export function getFeeBreakdown(mentorPayout: number, isMonthlyPlan: boolean = false) {
    const displayPrice = calculateDisplayPrice(mentorPayout, isMonthlyPlan);
    const platformFee = displayPrice - mentorPayout;
    const feePercentage = mentorPayout > 0 ? ((platformFee / mentorPayout) * 100).toFixed(0) : '0';

    return {
        mentorPayout,
        displayPrice,
        platformFee,
        feePercentage,
        feeType: isMonthlyPlan && mentorPayout < PLATFORM_CONFIG.SMALL_PLAN_THRESHOLD
            ? 'flat'
            : 'percentage',
    };
}

// Default session service templates - Industry Agnostic
// Works for IT, Healthcare, Business, Legal, Creative, and all other fields
export const DEFAULT_SESSION_TEMPLATES = [
    {
        title: 'Introductory Call',
        description: 'Get to know each other and discuss your goals',
        durationMinutes: 30,
        suggestedPayout: 39,
    },
    {
        title: 'Consultation Session',
        description: 'In-depth discussion and expert advice on your specific needs',
        durationMinutes: 60,
        suggestedPayout: 79,
    },
    {
        title: 'Document/Portfolio Review',
        description: 'Detailed feedback on your CV, portfolio, business plan, or documents',
        durationMinutes: 45,
        suggestedPayout: 59,
    },
    {
        title: 'Mock Session / Practice',
        description: 'Practice interviews, presentations, or case studies with real-time feedback',
        durationMinutes: 60,
        suggestedPayout: 79,
    },
    {
        title: 'Strategy & Planning',
        description: 'Career path, business strategy, or long-term planning discussion',
        durationMinutes: 60,
        suggestedPayout: 99,
    },
];

// Industry categories for mentor profiles
export const INDUSTRY_CATEGORIES = [
    { id: 'tech', label: 'Technology & IT', icon: '💻' },
    { id: 'healthcare', label: 'Healthcare & Medicine', icon: '🏥' },
    { id: 'business', label: 'Business & Consulting', icon: '📊' },
    { id: 'finance', label: 'Finance & Accounting', icon: '💰' },
    { id: 'legal', label: 'Legal & Law', icon: '⚖️' },
    { id: 'education', label: 'Education & Academia', icon: '📚' },
    { id: 'creative', label: 'Creative & Design', icon: '🎨' },
    { id: 'marketing', label: 'Marketing & Sales', icon: '📈' },
    { id: 'engineering', label: 'Engineering', icon: '⚙️' },
    { id: 'science', label: 'Science & Research', icon: '🔬' },
    { id: 'hr', label: 'Human Resources', icon: '👥' },
    { id: 'entrepreneurship', label: 'Entrepreneurship', icon: '🚀' },
    { id: 'other', label: 'Other', icon: '✨' },
];

export default {
    calculateDisplayPrice,
    calculateMentorPayout,
    calculatePlatformFee,
    formatPrice,
    getFeeBreakdown,
    PLATFORM_CONFIG,
    DEFAULT_SESSION_TEMPLATES,
    INDUSTRY_CATEGORIES,
};
