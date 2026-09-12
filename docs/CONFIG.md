# Agent Configuration

## Purpose

This file contains configurable parameters that control the behavior
of the Solana Memecoin Agent.

Configuration should be separated from the agent's core logic whenever
possible.

Changing a configuration value should not require rewriting the agent.

---

# Agent Lifecycle

## Current Stage

The agent must always operate within a defined learning stage.

Current stage:

STAGE_0_BIRTH

Available stages:

- STAGE_0_BIRTH
- STAGE_1_FUNDAMENTALS
- STAGE_2_MARKET_OBSERVATION
- STAGE_3_DEEP_RESEARCH
- STAGE_4_THESIS_FORMATION
- STAGE_5_PAPER_TRADING
- STAGE_6_EVALUATION
- STAGE_7_REAL_TRADING

The agent must not skip stages.

---

# Trading Permissions

## Trading Enabled

Trading is disabled until the agent reaches the appropriate stage.

Current value:

false

## Paper Trading Enabled

Current value:

false

## Real Trading Enabled

Current value:

false

---

# Position Management

## Maximum Open Positions

The agent may hold only one open position at a time.

Current value:

1

## Multiple Positions Allowed

Current value:

false

---

# Wallet Restrictions

The agent operates using an isolated experimental wallet.

## Withdrawals Allowed

false

## Transfers Allowed

false

## Can Modify Wallet Restrictions

false

These restrictions must not be configurable by the agent itself.

---

# Market Scope

## Blockchain

Solana

## Asset Type

Memecoins

## Trading Style

Spot

## Liquidity Provision

false

## Yield Farming

false

## Protocol Investment

false

---

# Decision Modes

The agent must be capable of making all of the following decisions:

- BUY
- HOLD
- SELL
- OBSERVE
- IGNORE
- DO NOTHING

No decision is mandatory.

The agent must be allowed to remain inactive when evidence is
insufficient.

---

# Research Philosophy

The agent must not rely on a single metric or fixed signal.

Research may consider:

- price action
- volume
- liquidity
- market capitalization
- holder distribution
- wallet activity
- developer behavior
- smart money activity
- on-chain activity
- social activity
- X/Twitter activity
- narratives
- community attention
- broader Solana market conditions

The importance of each factor is determined by the agent's reasoning
process and may change depending on the opportunity.

---

# Learning

The agent must prioritize learning over trading.

A new stage may only be activated after the requirements of the
previous stage have been satisfied.

The agent must continue learning after real trading begins.

---

# Post-Trade Recovery

After closing a position, the recovery process may be executed before
the next opportunity search.

Recovery is handled by a separate module.

The trading brain must not depend on the recovery module to make
trading decisions.

---

# Configuration Principles

Configuration values should control behavior without containing the
agent's reasoning logic.

The agent's reasoning, research methods, thesis formation, and learning
process belong to the appropriate modules.

Configuration should remain simple, explicit, and easy to modify.

---

# Safety Principles

The following restrictions are fundamental:

- The agent cannot withdraw funds.
- The agent cannot transfer funds to another wallet.
- The agent cannot modify these restrictions.
- The agent cannot trade before completing the required learning stages.
- The agent cannot hold more than one position at a time.

These restrictions must be enforced by the system architecture and
must not rely solely on the agent's instructions.