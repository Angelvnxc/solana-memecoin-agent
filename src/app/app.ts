import { Agent } from "../core/agent";
import { ResearchEngine } from "../research/research-engine";
import { ResearchOrchestrator } from "../research/orchestration/research-orchestrator";
import { ResearchQualityGate } from "../research/research-quality";
import { EvidenceEngine } from "../research/evidence-engine";
import { OpportunityProfileEngine } from "../research/opportunity-profile";
import { ThesisEngine } from "../thesis/thesis-engine";
import { DecisionEngine } from "../decision/decision-engine";
import { PositionManager } from "../position/position-manager";
import { PositionMonitor } from "../position/position-monitor";
import { TradeExecutor } from "../execution/trade-executor";
import { TradeMemoryStore } from "../memory/trade-memory";
import { TradeReviewEngine } from "../review/trade-review";
import { Authorization } from "../safety/authorization";

export function createAgentSystem() {
  const agent = new Agent();

  const researchEngine =
    new ResearchEngine();

  const researchOrchestrator =
    new ResearchOrchestrator(researchEngine);

  const researchQualityGate =
    new ResearchQualityGate();

  const evidenceEngine =
    new EvidenceEngine();

  const opportunityProfileEngine =
    new OpportunityProfileEngine();

  const thesisEngine =
    new ThesisEngine();

  const decisionEngine =
    new DecisionEngine();

  const positionManager =
    new PositionManager();

  const positionMonitor =
    new PositionMonitor();

  const tradeExecutor =
    new TradeExecutor();

  const tradeMemory =
    new TradeMemoryStore();

  const tradeReview =
    new TradeReviewEngine();

  const authorization =
    new Authorization();

  return {
    agent,
    researchEngine,
    researchOrchestrator,
    researchQualityGate,
    evidenceEngine,
    opportunityProfileEngine,
    thesisEngine,
    decisionEngine,
    positionManager,
    positionMonitor,
    tradeExecutor,
    tradeMemory,
    tradeReview,
    authorization,
  };
}