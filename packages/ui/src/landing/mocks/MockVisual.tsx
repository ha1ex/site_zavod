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
  DocEditorRichMock,
  DocTemplateMock,
  DocsTreeMock,
  EmailSequenceMock,
  HiringPipelineMock,
  IntegrationsConsoleMock,
  InventoryGridMock,
  InvoiceStatusMock,
  KnowledgeBaseMock,
  LedgerViewMock,
  MarketplaceConnectorMock,
  MobileCrmMock,
  MobileDocReaderMock,
  ModulesMatrixMock,
  OmnichannelInboxMock,
  OnboardingChecklistMock,
  OrderFlowMock,
  OrderQueueMock,
  OrgChartMock,
  PerformanceReviewMock,
  PermissionsPanelMock,
  PmBoardMock,
  ProcessFlowchartMock,
  ProductionBoardMock,
  ProductionDepartmentsMock,
  ProductionGanttMock,
  ProductionTaskCardMock,
  ReconciliationMatrixMock,
  RequestCardMock,
  SalesFunnelMock,
  ShareLinkCardMock,
  SlaTrackerMock,
  SupportBoardMock,
  TemplateGalleryMock,
  VksArtifactFlowMock,
  MeetingRoomMock,
  MeetListMock,
  CTAmainMock,
  PmBoard1Mock,
  ModulePortfolioMock,
  ApprovalBoardMock,
  ReportsChartsMock,
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
  | 'marketplace-connector'
  // Docs / Knowledge base
  | 'docs-tree'
  | 'permissions-panel'
  | 'share-link-card'
  | 'doc-editor-rich'
  | 'template-gallery'
  | 'mobile-doc-reader'
  // Manufacturing / Производство
  | 'production-board'
  | 'order-flow'
  | 'production-gantt'
  | 'production-task-card'
  | 'production-departments'
  // ВКС / Встречи
  | 'vks-artifact-flow'
  | 'meeting-room'
  | 'meet-list'
  | 'pm-board-1'
  // Финансы / портфель
  | 'portfolio-board'
  | 'approval-board'
  | 'reports-charts';

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
    case 'docs-tree':
      return <DocsTreeMock />;
    case 'permissions-panel':
      return <PermissionsPanelMock />;
    case 'share-link-card':
      return <ShareLinkCardMock />;
    case 'doc-editor-rich':
      return <DocEditorRichMock />;
    case 'template-gallery':
      return <TemplateGalleryMock />;
    case 'mobile-doc-reader':
      return <MobileDocReaderMock />;
    case 'production-board':
      return <ProductionBoardMock />;
    case 'order-flow':
      return <OrderFlowMock />;
    case 'production-gantt':
      return <ProductionGanttMock />;
    case 'production-task-card':
      return <ProductionTaskCardMock />;
    case 'production-departments':
      return <ProductionDepartmentsMock />;
    case 'vks-artifact-flow':
      return <VksArtifactFlowMock />;
    case 'meeting-room':
      return <MeetingRoomMock />;
    case 'meet-list':
      return <MeetListMock />;
    case 'pm-board-1':
      return <PmBoard1Mock />;
    case 'portfolio-board':
      return <ModulePortfolioMock />;
    case 'approval-board':
      return <ApprovalBoardMock />;
    case 'reports-charts':
      return <ReportsChartsMock />;
    default:
      return null;
  }
}
