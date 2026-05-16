import {
  AbTestResultsMock,
  AnalyticsKpiMock,
  ApprovalChainMock,
  AudienceSegmentsMock,
  BookingCalendarMock,
  CallOverlayMock,
  CampaignDashboardMock,
  CandidateCardMock,
  CrmAnalyticsMock,
  CrmClientCardMock,
  DocTemplateMock,
  EmailSequenceMock,
  HiringPipelineMock,
  IntegrationsConsoleMock,
  InventoryGridMock,
  InvoiceStatusMock,
  KnowledgeBaseMock,
  LedgerViewMock,
  MarketplaceConnectorMock,
  MobileCrmMock,
  ModulesMatrixMock,
  OmnichannelInboxMock,
  OnboardingChecklistMock,
  OrderQueueMock,
  OrgChartMock,
  PerformanceReviewMock,
  PmBoardMock,
  ProcessFlowchartMock,
  ReconciliationMatrixMock,
  RequestCardMock,
  SalesFunnelMock,
  SlaTrackerMock,
  SupportBoardMock,
} from '.';

/**
 * Полный набор slug'ов mock-вариантов. Источник истины для
 * `HeroSection.visual.variant`, `MediaCopy.mediaVariant` и интерактивных
 * секций (`TabbedFeatureSection.tabs[].mockVariant`,
 * `ScenarioWalkthroughSection.steps[].mockVariant`).
 */
export type MockVariant =
  // PM
  | 'pm-board'
  | 'analytics-kpi'
  | 'integrations-console'
  | 'modules-matrix'
  // Support
  | 'support-board'
  | 'request-card'
  | 'kb-public'
  | 'kb-internal'
  // CRM
  | 'sales-funnel'
  | 'crm-client-card'
  | 'omnichannel-inbox'
  | 'call-overlay'
  | 'booking-calendar'
  | 'crm-analytics'
  | 'doc-template'
  | 'mobile-crm'
  // HR
  | 'hiring-pipeline'
  | 'candidate-card'
  | 'onboarding-checklist'
  | 'org-chart'
  | 'performance-review'
  // Marketing
  | 'campaign-dashboard'
  | 'email-sequence'
  | 'ab-test-results'
  | 'audience-segments'
  // BPM
  | 'process-flowchart'
  | 'approval-chain'
  | 'sla-tracker'
  // Finance
  | 'ledger-view'
  | 'invoice-status'
  | 'reconciliation-matrix'
  // E-commerce
  | 'order-queue'
  | 'inventory-grid'
  | 'marketplace-connector';

export function MockVisual({ variant }: { variant: MockVariant | undefined }) {
  switch (variant) {
    case 'support-board':
      return <SupportBoardMock />;
    case 'request-card':
      return <RequestCardMock />;
    case 'kb-public':
      return <KnowledgeBaseMock variant="public" />;
    case 'kb-internal':
      return <KnowledgeBaseMock variant="internal" />;
    case 'pm-board':
      return <PmBoardMock />;
    case 'analytics-kpi':
      return <AnalyticsKpiMock />;
    case 'integrations-console':
      return <IntegrationsConsoleMock />;
    case 'modules-matrix':
      return <ModulesMatrixMock />;
    case 'sales-funnel':
      return <SalesFunnelMock />;
    case 'crm-client-card':
      return <CrmClientCardMock />;
    case 'omnichannel-inbox':
      return <OmnichannelInboxMock />;
    case 'call-overlay':
      return <CallOverlayMock />;
    case 'booking-calendar':
      return <BookingCalendarMock />;
    case 'crm-analytics':
      return <CrmAnalyticsMock />;
    case 'doc-template':
      return <DocTemplateMock />;
    case 'mobile-crm':
      return <MobileCrmMock />;
    case 'hiring-pipeline':
      return <HiringPipelineMock />;
    case 'candidate-card':
      return <CandidateCardMock />;
    case 'onboarding-checklist':
      return <OnboardingChecklistMock />;
    case 'org-chart':
      return <OrgChartMock />;
    case 'performance-review':
      return <PerformanceReviewMock />;
    case 'campaign-dashboard':
      return <CampaignDashboardMock />;
    case 'email-sequence':
      return <EmailSequenceMock />;
    case 'ab-test-results':
      return <AbTestResultsMock />;
    case 'audience-segments':
      return <AudienceSegmentsMock />;
    case 'process-flowchart':
      return <ProcessFlowchartMock />;
    case 'approval-chain':
      return <ApprovalChainMock />;
    case 'sla-tracker':
      return <SlaTrackerMock />;
    case 'ledger-view':
      return <LedgerViewMock />;
    case 'invoice-status':
      return <InvoiceStatusMock />;
    case 'reconciliation-matrix':
      return <ReconciliationMatrixMock />;
    case 'order-queue':
      return <OrderQueueMock />;
    case 'inventory-grid':
      return <InventoryGridMock />;
    case 'marketplace-connector':
      return <MarketplaceConnectorMock />;
    default:
      return null;
  }
}
