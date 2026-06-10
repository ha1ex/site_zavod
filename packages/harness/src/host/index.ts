export {
  detectHostAgent,
  resolveHostAgent,
  agentNotes,
  HOST_AGENT_PROFILES,
  UNKNOWN_PROFILE,
  type HostAgentDetection,
  type HostAgentName,
  type HostAgentProfile,
} from './detect';
export {
  buildChecklistText,
  buildSessionContextText,
  buildSlugContextText,
  extractGatesCard,
  staticBootstrapText,
} from './session-context';
