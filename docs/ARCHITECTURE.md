# System Architecture

## Purpose

The Solana Memecoin Agent is designed as a modular autonomous system.

Each major responsibility should exist in a separate module.

The architecture must prevent the project from becoming a single large
codebase where research, reasoning, execution, wallet management, and
learning are mixed together.

Modules should communicate through clear interfaces.

Changing one module should not require rewriting unrelated modules.

---

# High-Level Architecture

The system is divided into the following major components:

- Brain
- Research
- Market Data
- On-Chain Analysis
- Social Intelligence
- Thesis
- Decision Engine
- Trading
- Wallet
- Position Management
- Recovery
- Memory
- Learning
- Configuration
- Safety
- Logging

The final implementation may contain additional modules when necessary.

---

# 1. Brain

## Responsibility

The Brain coordinates the agent's overall reasoning process.

It decides:

- what should be investigated
- when research should begin
- how much research is necessary
- which modules should provide information
- when enough evidence has been collected
- when a decision should be made
- when the agent should remain inactive

The Brain does not directly execute blockchain transactions.

It coordinates the other components.

---

# 2. Research

## Responsibility

The Research module investigates potential opportunities.

It combines information from multiple sources and prepares structured
research for the decision system.

Research may include:

- token history
- market structure
- liquidity
- holders
- wallets
- developer activity
- smart money
- on-chain activity
- social activity
- narratives
- market context

Research should be adaptive.

Not every token deserves the same amount of investigation.

---

# 3. Market Data

## Responsibility

The Market Data module provides market information.

Possible data includes:

- price
- volume
- liquidity
- market capitalization
- trading pairs
- historical price data
- market structure
- transaction activity

This module provides data.

It does not decide whether the data is bullish or bearish.

---

# 4. On-Chain Analysis

## Responsibility

The On-Chain module analyzes blockchain activity.

Possible information includes:

- wallet movements
- holder distribution
- token transfers
- developer wallets
- liquidity movements
- large transactions
- wallet relationships
- smart money behavior
- token creation information

The module should transform raw blockchain data into useful evidence.

It should not independently execute trades.

---

# 5. Social Intelligence

## Responsibility

The Social Intelligence module analyzes attention and narratives.

Possible sources include:

- X/Twitter
- social communities
- public discussions
- emerging narratives
- community growth
- engagement
- sentiment
- recurring themes

Social information must be treated as evidence rather than truth.

The module must distinguish between attention and genuine narrative
strength.

---

# 6. Thesis

## Responsibility

The Thesis module transforms research into a structured trading thesis.

A thesis contains:

- opportunity
- reasoning
- supporting evidence
- contradicting evidence
- uncertainty
- expected scenario
- risks
- invalidation conditions
- confidence

The thesis must be specific to the individual opportunity.

---

# 7. Decision Engine

## Responsibility

The Decision Engine evaluates the thesis and determines the current
action.

Possible decisions include:

- BUY
- HOLD
- SELL
- OBSERVE
- IGNORE
- DO NOTHING

The Decision Engine must not rely on a single metric.

It should evaluate evidence in context.

---

# 8. Trading

## Responsibility

The Trading module handles trade execution.

It is responsible for:

- preparing transactions
- calculating execution parameters
- submitting transactions
- confirming transactions
- handling execution failures
- reporting execution results

Trading must not decide whether an opportunity is good.

The Decision Engine decides.

Trading executes.

---

# 9. Wallet

## Responsibility

The Wallet module manages interaction with the experimental wallet.

It may:

- read balances
- read token holdings
- sign authorized transactions
- provide wallet state to other modules

It must never:

- withdraw funds
- transfer funds to another wallet
- modify wallet restrictions

These restrictions must be enforced independently of the agent's
reasoning.

---

# 10. Position Management

## Responsibility

The Position Management module tracks the current position.

It maintains information such as:

- token
- entry
- position size
- current value
- unrealized profit or loss
- thesis
- invalidation conditions
- position state

The system must enforce the one-position rule.

At most one position may be open at any time.

---

# 11. Recovery

## Responsibility

The Recovery module handles post-trade resource recovery.

After a position is closed, the module may perform the defined
Solana account/resource cleanup process.

The current design may integrate with Sol Incinerator for this purpose.

Recovery is independent from trading decisions.

A failure in recovery must not cause the agent to make a bad trading
decision.

---

# 12. Memory

## Responsibility

The Memory module stores information that should persist.

Possible information includes:

- research history
- previous opportunities
- previous theses
- completed trades
- mistakes
- successful decisions
- lessons
- discovered patterns
- important market observations

Memory should be structured so that the agent can retrieve relevant
past information without loading the entire history every time.

---

# 13. Learning

## Responsibility

The Learning module controls the agent's progression through its
learning stages.

It determines:

- current stage
- stage requirements
- completed learning objectives
- evaluation results
- eligibility for advancement

The Learning module must prevent the agent from trading before it is
authorized to do so.

---

# 14. Configuration

## Responsibility

The Configuration module stores adjustable system parameters.

Examples include:

- current learning stage
- trading permissions
- maximum open positions
- wallet restrictions
- market scope
- execution settings
- research limits
- logging settings

Configuration should not contain reasoning logic.

---

# 15. Safety

## Responsibility

The Safety module enforces critical restrictions independently of the
agent's reasoning.

Critical restrictions include:

- no unauthorized withdrawals
- no transfers to external wallets
- one open position maximum
- no trading before authorization
- only Solana memecoin trading
- no unauthorized protocol investment behavior

Safety controls should be enforced at the system level.

The Brain must not be able to simply override them.

---

# 16. Logging

## Responsibility

The Logging module records system activity.

It should record:

- decisions
- research events
- transactions
- errors
- state changes
- learning events
- recovery events

Logs should make it possible to reconstruct what the agent knew and
why it acted.

---

# Module Separation

The following separation is fundamental:

Research provides evidence.

Thesis organizes evidence into reasoning.

Decision Engine makes decisions.

Trading executes decisions.

Wallet provides controlled access to funds.

Position Management tracks positions.

Memory stores history.

Learning controls progression.

Safety enforces restrictions.

Brain coordinates the entire process.

No module should silently assume the responsibilities of another module.

---

# Data Flow

The intended high-level flow is:

Market
    ↓
Observation
    ↓
Research
    ↓
Evidence
    ↓
Thesis
    ↓
Decision Engine
    ↓
BUY / OBSERVE / IGNORE / DO NOTHING
    ↓
Trading
    ↓
Position Management
    ↓
Monitoring
    ↓
SELL / HOLD
    ↓
Trade Review
    ↓
Memory
    ↓
Learning

Safety controls operate across the entire system.

Configuration provides parameters to the modules.

---

# One Position Constraint

The one-position rule must be enforced outside the reasoning process.

Even if the Brain incorrectly attempts to open a second position, the
system must reject the action.

This prevents reasoning errors from becoming account-level violations.

---

# Wallet Isolation

The experimental wallet must remain isolated.

The architecture must prevent the agent from creating an alternative
path to move funds outside the authorized trading system.

Wallet restrictions must not depend exclusively on prompts or natural
language instructions.

---

# Modularity Principle

A module should be replaceable without rebuilding the entire system.

For example:

A market data provider may be replaced without rewriting the Brain.

A social data provider may be replaced without rewriting Trading.

A research method may evolve without changing Wallet security.

A different execution provider may be introduced without changing the
Learning system.

This modularity is a core architectural requirement.

---

# Future Expansion

The architecture may eventually support:

- additional research providers
- additional market data providers
- multiple analysis methods
- advanced memory systems
- improved learning systems
- backtesting
- paper trading
- real trading
- stronger safety controls
- additional observability tools

Expansion must preserve the separation of responsibilities.

---

# Final Principle

The agent should be built as a system of specialized components rather
than a single intelligent script.

The Brain coordinates.

Research investigates.

Evidence informs.

Thesis reasons.

Decision Engine decides.

Trading executes.

Position Management monitors.

Memory remembers.

Learning improves.

Safety protects.

The modules work together, but each module has a clearly defined job.