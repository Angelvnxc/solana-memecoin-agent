# Memory System

## Purpose

The Memory System stores information that the agent may need in the
future.

Its purpose is not to remember everything.

Its purpose is to preserve useful knowledge, experiences, decisions,
research, and lessons in a structured and retrievable form.

The memory system must support long-term improvement without allowing
irrelevant or outdated information to overwhelm the agent.

---

# Memory Categories

The agent should maintain several distinct types of memory.

## 1. Market Knowledge

General knowledge about the Solana memecoin ecosystem.

Examples:

- market structures
- common token behaviors
- liquidity patterns
- wallet behaviors
- common manipulation patterns
- recurring narratives
- common failure modes
- known risks

This memory is not tied to a single trade.

---

## 2. Opportunity Memory

Information about individual opportunities investigated by the agent.

Examples:

- token
- date
- market conditions
- research performed
- evidence discovered
- thesis considered
- final decision
- outcome

Opportunity memory allows the agent to recognize similar situations
later.

---

## 3. Trade Memory

Every completed trade should generate a structured trade record.

A trade record should contain:

- token
- entry
- exit
- position size
- timestamp
- original thesis
- supporting evidence
- contradicting evidence
- expected scenario
- invalidation conditions
- exit reason
- result
- mistakes
- successful decisions
- lessons

The trade record should preserve what the agent believed before the
outcome became known.

---

## 4. Thesis Memory

The agent should preserve important historical theses.

This allows the system to compare:

- previous assumptions
- actual outcomes
- repeated thesis patterns
- successful reasoning
- failed reasoning

Thesis memory should distinguish between a thesis and the outcome.

A profitable trade does not automatically mean that the thesis was
correct.

A losing trade does not automatically mean that the thesis was bad.

The quality of reasoning must be evaluated separately from the result.

---

## 5. Learning Memory

Learning memory stores lessons derived from experience.

Examples:

- a research signal repeatedly proved unreliable
- a certain wallet pattern frequently preceded a problem
- a specific narrative was repeatedly overvalued
- a particular market condition produced poor entries
- a research method consistently produced useful information

Lessons should be supported by evidence whenever possible.

---

## 6. System Memory

System-level information about the agent itself.

Examples:

- current learning stage
- completed evaluations
- enabled capabilities
- disabled capabilities
- system versions
- configuration history
- important architectural decisions

System memory must not override hard safety restrictions.

---

# Memory Structure

Memory should be structured rather than stored as unrestricted text.

Important records should contain metadata such as:

- timestamp
- source
- confidence
- relevance
- category
- related token
- related trade
- related thesis
- status

This allows the agent to retrieve relevant information efficiently.

---

# Confidence

Memories should have an associated confidence level when appropriate.

Possible levels:

- LOW
- MEDIUM
- HIGH

Confidence should reflect the quality of evidence supporting the memory.

A repeated observation supported by multiple independent events may
deserve higher confidence than a conclusion based on a single event.

---

# Freshness

Market information becomes outdated.

Memory should distinguish between:

- current
- recent
- historical
- outdated

Old information should not automatically be treated as current truth.

The agent must consider the age of a memory before using it in a
decision.

---

# Retrieval

The agent should retrieve memories based on relevance.

Relevant factors may include:

- token
- narrative
- market condition
- wallet behavior
- setup type
- previous thesis
- current research question
- historical similarity

The system should avoid loading the entire memory database for every
decision.

Only relevant information should be retrieved.

---

# Memory and Reasoning

Memory provides context.

Memory does not make decisions.

The agent must evaluate retrieved memories against current evidence.

Historical information should never automatically determine a new
trade.

---

# Learning From Outcomes

After a trade, the agent compares:

EXPECTED STATE

with

ACTUAL STATE

The review should identify:

- what the agent predicted correctly
- what it predicted incorrectly
- what evidence was useful
- what evidence was misleading
- what assumptions failed
- what assumptions were validated
- whether the thesis was correct
- whether the execution was correct

The outcome should then produce structured lessons.

---

# Avoiding Overfitting

The agent must not dramatically change its behavior because of one
trade.

A single success does not prove a method works.

A single failure does not prove a method is useless.

Changes to long-term behavior should generally require repeated evidence
or strong independent justification.

---

# Contradictory Memories

Different memories may disagree.

The system must not silently overwrite conflicting information.

Instead it should preserve the conflict and evaluate:

- source reliability
- freshness
- evidence strength
- context
- sample size

The agent may conclude that the correct answer remains uncertain.

---

# Memory Lifecycle

Memories may move through states such as:

NEW
→ VALIDATED
→ ACTIVE
→ OUTDATED
→ ARCHIVED

A memory should not remain permanently active simply because it was
once considered useful.

---

# Important vs Temporary Memory

Not all information deserves long-term storage.

## Important Memory

Examples:

- strong recurring market patterns
- major lessons
- important mistakes
- architectural decisions
- validated research methods
- important safety information

## Temporary Memory

Examples:

- short-lived market conditions
- temporary narratives
- one-time observations
- rapidly changing prices

Temporary information should not unnecessarily become permanent
knowledge.

---

# Memory Integrity

The agent must preserve the original context of important memories.

For example, a trade record should not later be rewritten to make the
original thesis appear more accurate than it actually was.

Historical records should remain auditable.

---

# Decision Traceability

Important decisions should be traceable to the information available
at the time.

The system should make it possible to determine:

- what the agent knew
- what the agent did not know
- what evidence it used
- what thesis it formed
- what decision it made
- what happened afterward

---

# Memory and Learning Stages

The type of memory available to the agent may expand as it advances.

During early learning stages, memory primarily contains educational
knowledge and observations.

During paper trading, it begins accumulating simulated trade history.

During real trading, it accumulates real trade and market experience.

---

# Memory Does Not Equal Truth

A stored memory is not automatically a fact.

The agent must distinguish between:

- observed fact
- interpretation
- hypothesis
- lesson
- assumption

These categories should not be treated as equivalent.

---

# Long-Term Objective

The Memory System should allow the agent to become more experienced
over time.

The goal is not to create an agent that remembers everything.

The goal is to create an agent that remembers the things that make it
better.