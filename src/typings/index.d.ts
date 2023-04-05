import { SlashCommandBuilder } from "discord.js";

export interface Command {
    permissions?: string[];
    cooldown?: number;
    data: SlashCommandBuilder;
    execute(...args: any): any;
}

export interface RequestBuilder {
    api_key: string;
    subDomain?: string;
    format?: string;
    timeout?: number;
    messageProperties?: boolean;
}

export interface ITournament {
    acceptAttachments: boolean;
    allowParticipantMatchReporting: boolean;
    anonymousVoting: boolean;
    category: null;
    checkInDuration: null;
    completedAt: null;
    createdAt: Date;
    createdByAPI: boolean;
    creditCapped: boolean;
    description: string;
    gameID: number;
    groupStagesEnabled: boolean;
    hideForum: boolean;
    hideSeeds: boolean;
    holdThirdPlaceMatch: boolean;
    id: number;
    maxPredictionsPerUser: number;
    name: string;
    notifyUsersWhenMatchesOpen: boolean;
    notifyUsersWhenTheTournamentEnds: boolean;
    openSignup: boolean;
    participantsCount: number;
    predictionMethod: number;
    predictionsOpenedAt: null;
    private: boolean;
    progressMeter: number;
    ptsForBye: string;
    ptsForGameTie: string;
    ptsForGameWin: string;
    ptsForMatchTie: string;
    ptsForMatchWin: string;
    quickAdvance: boolean;
    rankedBy: string;
    requireScoreAgreement: boolean;
    rrPtsForGameTie: string;
    rrPtsForGameWin: string;
    rrPtsForMatchTie: string;
    rrPtsForMatchWin: string;
    sequentialPairings: boolean;
    showRounds: boolean;
    signupCap: null;
    startAt: null;
    startedAt: Date;
    startedCheckingInAt: null;
    state: string;
    swissRounds: number;
    teams: boolean;
    tieBreaks: string[];
    tournamentType: string;
    updatedAt: Date;
    url: string;
    descriptionSource: string;
    subdomain: null;
    fullChallongeURL: string;
    liveImageURL: string;
    signUpURL: null;
    reviewBeforeFinalizing: boolean;
    acceptingPredictions: boolean;
    participantsLocked: boolean;
    gameName: string;
    participantsSwappable: boolean;
    teamConvertable: boolean;
    groupStagesWereStarted: boolean;
}
