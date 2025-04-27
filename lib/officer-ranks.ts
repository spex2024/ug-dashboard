// Define rank enums
export enum JuniorOfficerRank {
    RFM = "Recruit Fireman",
    RFW = "Recruit Firewoman",
    FM = "Fireman",
    FW = "Firewoman",
    LFM = "Leading Fireman",
    LFW = "Leading Firewoman",
    SUB = "Sub-Officer",
    ASTNO = "Assistant Station Officer",
    AGO = "Acting Group Officer",
    "STNO II" = "Station Officer II",
    "STNO I" = "Station Officer I",
    DGO = "Divisional Officer",
    GO = "Group Officer",
}

export enum SeniorOfficerRank {
    "ADO II" = "Assistant Divisional Officer II",
    "ADO I" = "Assistant Divisional Officer I",
    "DO III" = "Divisional Officer III",
    "DO II" = "Divisional Officer II",
    "DO I" = "Divisional Officer I",
    "AFCO II" = "Assistant Fire Commander Officer II",
    "ACFO I" = "Assistant Chief Fire Officer I",
    DCFO = "Deputy Chief Fire Officer",
}

// Utility function to get full rank name
export const getFullRankName = (rankCode: string | undefined): string => {
    if (!rankCode) return "Unknown Rank" // check for undefined first

    if (Object.prototype.hasOwnProperty.call(JuniorOfficerRank, rankCode)) {
        return JuniorOfficerRank[rankCode as keyof typeof JuniorOfficerRank]
    }

    if (Object.prototype.hasOwnProperty.call(SeniorOfficerRank, rankCode)) {
        return SeniorOfficerRank[rankCode as keyof typeof SeniorOfficerRank]
    }

    return rankCode
}
