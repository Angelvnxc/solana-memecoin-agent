# Research Schema

## Purpose

The Research Schema defines the structured information collected when
the agent investigates a Solana memecoin opportunity.

The schema provides a common structure that allows different research
modules to contribute information without becoming tightly coupled.

Research is evidence.

Research does not automatically produce a trading decision.

---

# Research Record

Each investigated opportunity should produce a structured research
record.

A research record may contain:

- identity
- market
- liquidity
- holders
- wallets
- developer information
- on-chain activity
- social activity
- narrative
- risks
- evidence
- uncertainty
- research metadata

---

# 1. Identity

The identity section describes the asset being investigated.

Expected information may include:

- token name
- token symbol
- mint address
- blockchain
- creation time
- token age
- metadata
- known authorities

The mint address is the primary token identifier.

---

# 2. Market

The market section describes current and historical market behavior.

Possible fields include:

- current price
- market capitalization
- fully diluted valuation
- trading volume
- volume history
- price change
- price history
- trading pairs
- active markets
- recent transactions

Market values must include timestamps whenever appropriate.

---

# 3. Liquidity

The liquidity section describes the ability to enter or exit the market.

Possible information includes:

- total liquidity
- liquidity by pool
- liquidity changes
- pool age
- pool concentration
- estimated price impact
- estimated slippage
- liquidity history

Liquidity must be evaluated relative to the intended position size.

A large liquidity number does not automatically mean that execution
risk is low.

---

# 4. Holders

The holders section describes token ownership.

Possible information includes:

- holder count
- top holders
- holder concentration
- concentration excluding known system addresses
- changes in holder distribution
- large holder activity
- new holder growth
- holder retention

The agent should distinguish between:

- exchange or infrastructure addresses
- liquidity-related addresses
- developer-related addresses
- ordinary holders
- potentially related wallets

Raw holder count alone is not sufficient to evaluate distribution.

---

# 5. Wallet Analysis

The wallet section describes relevant wallet behavior.

Possible information includes:

- wallet age
- historical activity
- token purchases
- token sales
- average holding behavior
- realized performance
- interaction patterns
- relationships between wallets
- repeated behavior across tokens

The system should attempt to distinguish meaningful wallet behavior
from random activity.

---

# 6. Developer Analysis

The developer section evaluates relevant developer behavior.

Possible information includes:

- developer wallet
- developer holdings
- developer transactions
- token distribution
- liquidity actions
- historical token launches
- previous projects
- wallet relationships
- suspicious activity

Developer information should be treated as evidence rather than an
automatic judgment.

---

# 7. On-Chain Activity

The on-chain section describes blockchain behavior.

Possible information includes:

- transaction count
- transaction frequency
- active wallets
- token transfers
- large transfers
- wallet flows
- liquidity movements
- contract interactions
- program interactions
- notable transaction clusters

The agent should search for behavior that is relevant to the thesis.

---

# 8. Social Activity

The social section describes public attention.

Possible sources may include:

- X/Twitter
- public communities
- public discussions
- social posts
- engagement
- mentions
- follower growth
- narrative development
- community activity

The agent should distinguish between:

- organic attention
- coordinated promotion
- bot-like activity
- paid promotion
- genuine community growth

Social metrics are evidence, not proof of future price movement.

---

# 9. Narrative

The narrative section describes why people may currently care about
the token.

Possible fields include:

- primary narrative
- secondary narratives
- narrative origin
- narrative age
- narrative strength
- narrative growth
- narrative saturation
- related trends
- competing narratives
- broader market relevance

The agent should ask whether the narrative is:

- emerging
- growing
- established
- saturated
- declining
- irrelevant

---

# 10. Price Structure

Price structure should be analyzed separately from raw price.

Possible observations include:

- trend
- consolidation
- breakout
- rejection
- support
- resistance
- range
- volatility
- liquidity reactions
- previous highs
- previous lows
- failed breakouts
- accumulation-like behavior
- distribution-like behavior

These observations must be interpreted in context.

---

# 11. Evidence

Every important observation should be represented as evidence.

An evidence record should contain:

- observation
- source
- timestamp
- category
- interpretation
- confidence
- supporting data

Possible evidence categories include:

- MARKET
- LIQUIDITY
- HOLDERS
- WALLET
- DEVELOPER
- ON_CHAIN
- SOCIAL
- NARRATIVE
- PRICE_STRUCTURE
- MACRO

---

# 12. Supporting Evidence

Supporting evidence strengthens the current opportunity thesis.

Examples:

- improving holder distribution
- sustainable volume growth
- strengthening narrative
- healthy liquidity
- meaningful wallet accumulation
- improving market structure

Supporting evidence must still be interpreted in context.

---

# 13. Contradicting Evidence

Contradicting evidence weakens the thesis.

Examples:

- concentrated ownership
- declining liquidity
- suspicious developer activity
- weakening narrative
- aggressive distribution
- deteriorating market structure
- abnormal wallet behavior

Contradicting evidence must never be hidden because it makes an
opportunity less attractive.

---

# 14. Unknowns

The research record must explicitly track important unknown information.

Examples:

- unknown developer identity
- incomplete wallet history
- unavailable social information
- uncertain token relationships
- insufficient historical data

Unknown information should not be silently treated as safe.

---

# 15. Risks

The research record should contain token-specific risks.

Possible categories include:

- liquidity risk
- holder concentration
- developer risk
- smart-money concentration
- market manipulation
- social manipulation
- narrative risk
- execution risk
- volatility risk
- broader market risk

Risk descriptions should explain why the risk matters.

---

# 16. Research Confidence

The research record may contain an overall research confidence.

Possible levels:

- LOW
- MEDIUM
- HIGH

Confidence represents confidence in the quality and completeness of
the research.

It does not represent the probability that the token will increase
in price.

---

# 17. Research Completeness

The agent should track whether important research areas were
investigated.

Example:

```text
MARKET: COMPLETE
LIQUIDITY: COMPLETE
HOLDERS: COMPLETE
WALLETS: PARTIAL
DEVELOPER: COMPLETE
ON_CHAIN: COMPLETE
SOCIAL: PARTIAL
NARRATIVE: COMPLETE
PRICE_STRUCTURE: COMPLETE