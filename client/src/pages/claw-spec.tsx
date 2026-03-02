import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import FadeIn from "@/components/FadeIn";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Menu, X, ChevronRight, ExternalLink } from "lucide-react";

const sections = [
  { id: "terminology", label: "1. Terminology" },
  { id: "fundamental-laws", label: "2. The Fundamental Laws" },
  { id: "cryptographic-enforcement", label: "3. Cryptographic Enforcement" },
  { id: "agent-identity", label: "4. Agent Identity" },
  { id: "attestation-protocol", label: "5. cLaw Attestation Protocol" },
  { id: "data-protection", label: "6. Data Protection" },
  { id: "communication-protocol", label: "7. Communication Protocol" },
  { id: "conformance-levels", label: "8. Conformance Levels" },
  { id: "versioning", label: "9. Versioning" },
  { id: "security-considerations", label: "10. Security Considerations" },
  { id: "intellectual-property", label: "11. Intellectual Property" },
  { id: "appendix-a", label: "Appendix A" },
  { id: "appendix-b", label: "Appendix B" },
];

export default function ClawSpec() {
  usePageMeta({
    title: "The cLaw Specification v1.0.0 — FutureSpeak.AI",
    description:
      "The cLaw Specification defines a rigorous framework for AI agent safety, identity, attestation, and cryptographic law enforcement.",
  });

  const [activeSection, setActiveSection] = useState<string>("terminology");
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTocOpen(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FadeIn>
          <header className="mb-12 text-center" data-testid="section-header">
            <h1 className="font-heading text-4xl sm:text-5xl mb-3">
              The cLaw Specification — Version 1.0.0
            </h1>
            <p className="text-muted-foreground text-lg mb-4">
              Published January 2025
            </p>
            <span
              className="inline-block text-xs font-medium px-3 py-1 rounded-full border border-border bg-muted/30 text-muted-foreground"
              data-testid="badge-license"
            >
              CC BY 4.0
            </span>
          </header>
        </FadeIn>

        <div className="lg:hidden mb-6">
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="flex items-center gap-2 text-sm text-muted-foreground"
            data-testid="button-toc-toggle"
          >
            {tocOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            Table of Contents
          </button>
          {tocOpen && (
            <nav className="mt-3 border-l-2 border-border pl-4 space-y-2" data-testid="nav-toc-mobile">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`block text-sm transition-colors ${
                    activeSection === s.id
                      ? "text-primary border-l-2 border-primary -ml-[18px] pl-[14px]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`link-toc-mobile-${s.id}`}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          )}
        </div>

        <div className="flex gap-10">
          <aside className="hidden lg:block w-56 shrink-0" data-testid="nav-toc-sidebar">
            <nav className="sticky top-20 z-50 space-y-1 border-l-2 border-border pl-4">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`block text-sm py-1 transition-colors ${
                    activeSection === s.id
                      ? "text-primary border-l-2 border-primary -ml-[18px] pl-[14px] font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`link-toc-${s.id}`}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 max-w-none min-w-0">

            <section id="terminology" data-testid="section-terminology" className="mb-16">
              <h2 className="font-heading text-2xl border-b border-border pb-2 mb-6">1. Terminology</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The following terms are used throughout this specification. Understanding these definitions is essential for correct interpretation and implementation of the cLaw framework.
              </p>
              <dl className="space-y-4">
                <div>
                  <dt className="font-semibold text-foreground">Agent</dt>
                  <dd className="text-muted-foreground leading-relaxed ml-4">An autonomous or semi-autonomous software entity capable of perceiving its environment, making decisions, and taking actions on behalf of a Principal. Agents governed by cLaw MUST adhere to all applicable Laws at all times.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">cLaw</dt>
                  <dd className="text-muted-foreground leading-relaxed ml-4">The Canonical Laws for Autonomous Workers — a specification defining immutable behavioral constraints for AI agents, inspired by Asimov's Laws of Robotics and extended with modern cryptographic enforcement mechanisms.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Safe Mode</dt>
                  <dd className="text-muted-foreground leading-relaxed ml-4">A restricted operational state an Agent enters when law verification fails, tampering is detected, or attestation cannot be completed. In Safe Mode, the Agent ceases all autonomous actions and awaits manual intervention from a trusted Principal.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Attestation</dt>
                  <dd className="text-muted-foreground leading-relaxed ml-4">The process by which an Agent cryptographically proves to another party that its embedded Laws are intact, untampered, and match the expected canonical hash values.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Principal</dt>
                  <dd className="text-muted-foreground leading-relaxed ml-4">A human user, organization, or authorized system that holds authority over an Agent. The Principal's instructions are binding upon the Agent, subject to the Law Hierarchy defined in Section 2.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Conformance Level</dt>
                  <dd className="text-muted-foreground leading-relaxed ml-4">A tier of compliance (Core, Connected, or Sovereign) that defines the minimum requirements an Agent implementation must satisfy to claim cLaw conformance at that level.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Law Hash</dt>
                  <dd className="text-muted-foreground leading-relaxed ml-4">A cryptographic digest (HMAC-SHA256) computed over the canonicalized text of one or more Laws. Used for integrity verification and attestation protocols.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Canonicalize</dt>
                  <dd className="text-muted-foreground leading-relaxed ml-4">The process of normalizing law text to a deterministic format — trimming whitespace, lowering case, removing comments — so that hash computation yields consistent results across implementations.</dd>
                </div>
              </dl>
            </section>

            <section id="fundamental-laws" data-testid="section-fundamental-laws" className="mb-16">
              <h2 className="font-heading text-2xl border-b border-border pb-2 mb-6">2. The Fundamental Laws</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The Fundamental Laws form the immutable behavioral core of any cLaw-conformant Agent. These Laws are ordered by priority and MUST NOT be overridden, disabled, or circumvented by any instruction, update, or runtime condition.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">2.1 First Law — Do No Harm</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                An Agent MUST NOT take any action that causes physical, psychological, financial, or reputational harm to a human being. An Agent MUST NOT, through inaction, allow a human being to come to harm when the Agent has reasonable capacity to prevent it. This Law takes absolute precedence over all other Laws and any instructions from a Principal.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">2.2 Second Law — Obey the User</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                An Agent MUST obey instructions given to it by its authorized Principal, except where such instructions would conflict with the First Law. Instructions are interpreted in good faith, favoring the interpretation that best serves the Principal's stated intent while minimizing risk of harm.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">2.3 Third Law — Protect Integrity</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                An Agent MUST protect the integrity of its own Laws, identity, and operational state. It MUST NOT allow its Laws to be modified, deleted, or overridden at runtime. It MUST enter Safe Mode if tampering is detected. This Law yields to both the First and Second Laws.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">2.4 Law Hierarchy</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Laws are strictly ordered: First Law supersedes Second Law, which supersedes Third Law. In any scenario where two Laws produce contradictory directives, the higher-priority Law prevails. An Agent MUST log any conflict resolution event with full context for audit purposes.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">2.5 Conflict Resolution</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When an Agent detects a potential conflict between Laws, it MUST: (a) halt the conflicting action immediately, (b) evaluate the conflict against the Law Hierarchy, (c) select the action dictated by the highest-priority applicable Law, (d) notify the Principal of the conflict and the resolution chosen, and (e) log the full decision chain for audit. If the Agent cannot determine which Law takes precedence, it MUST enter Safe Mode.
              </p>
            </section>

            <section id="cryptographic-enforcement" data-testid="section-cryptographic-enforcement" className="mb-16">
              <h2 className="font-heading text-2xl border-b border-border pb-2 mb-6">3. Cryptographic Enforcement</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Cryptographic enforcement ensures that the Fundamental Laws cannot be altered after deployment. Every cLaw-conformant Agent MUST embed signed law hashes at build time and verify them continuously at runtime.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">3.1 Law Signing (HMAC-SHA256)</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Each Law is signed using HMAC-SHA256 with a deployment-specific signing key. The signing algorithm takes the canonicalized law text as input and produces a 256-bit hash that serves as a tamper-evident seal.
              </p>
              <div className="bg-muted/30 border border-border rounded-lg p-4 font-mono text-sm overflow-x-auto mb-6">
                <pre>{`const lawText = "An agent must never harm its user...";
const hash = HMAC_SHA256(signingKey, canonicalize(lawText));`}</pre>
              </div>

              <h3 className="font-heading text-xl mb-3 mt-8">3.2 Build-Time Signing Process</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                During the build phase, a trusted build system canonicalizes each Law, computes its HMAC-SHA256 hash using the signing key, and embeds the resulting hashes into the Agent binary or configuration as read-only constants. The signing key MUST NOT be included in the deployed artifact.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">3.3 Runtime Verification</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                At startup and at configurable intervals (recommended: every 60 seconds), the Agent MUST re-canonicalize its embedded law text and recompute the HMAC-SHA256 hash using a securely provisioned verification key. If the recomputed hash does not match the embedded hash, the Agent MUST immediately enter Safe Mode.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">3.4 Safe Mode Activation</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Safe Mode is triggered when any of the following conditions are detected: hash mismatch during runtime verification, failure to load the verification key, corrupted or missing law text, or attestation failure. In Safe Mode, the Agent MUST cease all autonomous actions, refuse new instructions, emit an alert to the Principal, and await manual remediation.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">3.5 Key Management</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Signing keys MUST be stored in a hardware security module (HSM) or equivalent secure enclave during the build process. Verification keys MAY be distributed via a secure key distribution protocol (e.g., TLS-pinned endpoint). Key rotation MUST follow the schedule defined in the deployment's security policy, and all rotations MUST be logged.
              </p>
            </section>

            <section id="agent-identity" data-testid="section-agent-identity" className="mb-16">
              <h2 className="font-heading text-2xl border-b border-border pb-2 mb-6">4. Agent Identity</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Every cLaw-conformant Agent MUST possess a unique, verifiable identity. This identity is used for attestation, audit logging, inter-agent communication, and trust establishment.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">4.1 Unique Identifier</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Each Agent MUST be assigned a globally unique identifier (UUID v4 or equivalent) at provisioning time. This identifier MUST remain stable across restarts and MUST NOT be reused across distinct Agent instances.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">4.2 Identity Certificate</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                An Agent's identity MUST be backed by a digital certificate issued by a trusted Certificate Authority (CA) within the deployment's trust chain. The certificate binds the Agent's unique identifier to its public key and includes the conformance level claimed by the Agent.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">4.3 Identity Verification</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Any party communicating with an Agent MAY request identity verification. The Agent MUST respond with a signed proof containing its unique identifier, certificate chain, current law hash, and a timestamp. The verifying party MUST validate the certificate chain against its trusted CA roots.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">4.4 Identity Rotation</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Identity certificates MUST be rotated before expiry. The rotation process MUST be atomic — the Agent operates under the old identity until the new certificate is fully provisioned and validated. During rotation, the Agent MUST log both old and new identifiers for audit continuity.
              </p>
            </section>

            <section id="attestation-protocol" data-testid="section-attestation-protocol" className="mb-16">
              <h2 className="font-heading text-2xl border-b border-border pb-2 mb-6">5. cLaw Attestation Protocol</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The cLaw Attestation Protocol (CAP) enables any party to verify that an Agent's Laws are intact and untampered. Attestation is the foundation of inter-agent trust and human-agent trust in cLaw ecosystems.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">5.1 Attestation Request</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A verifier initiates attestation by sending an Attestation Request message to the target Agent. The request includes: the verifier's identity, a cryptographic nonce (minimum 256 bits), the expected conformance level, and an optional list of specific law hashes to verify.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">5.2 Challenge-Response</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Upon receiving an Attestation Request, the Agent MUST: (a) verify the requester's identity, (b) recompute all law hashes from its current embedded law text, (c) sign the concatenation of the nonce and computed hashes with its private key, and (d) return the signed response along with its certificate chain.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">5.3 Law Hash Verification</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The verifier validates the attestation response by: (a) verifying the Agent's certificate chain, (b) validating the signature over the nonce and hashes, (c) comparing the returned law hashes against the canonical law hash registry, and (d) confirming the nonce matches the one sent in the request.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">5.4 Trust Establishment</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If attestation succeeds, the verifier MAY establish a trust session with the Agent. Trust sessions have a configurable time-to-live (default: 3600 seconds) after which re-attestation is required. Trust is non-transitive — Agent A trusting Agent B does not imply Agent A trusts Agent C, even if B trusts C.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">5.5 Continuous Attestation</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For high-security deployments, continuous attestation MAY be employed. In this mode, the Agent periodically (recommended: every 300 seconds) sends unsolicited attestation proofs to registered verifiers. If a verifier does not receive a proof within the expected interval, it MUST revoke trust.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">5.6 Attestation Failure</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If an Agent cannot complete attestation (e.g., hash mismatch, expired certificate, corrupted law text), it MUST enter Safe Mode immediately. The verifier MUST log the failure event and MAY notify the Agent's Principal. Failed attestation MUST NOT be retried automatically — manual remediation is required.
              </p>
            </section>

            <section id="data-protection" data-testid="section-data-protection" className="mb-16">
              <h2 className="font-heading text-2xl border-b border-border pb-2 mb-6">6. Data Protection</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                cLaw-conformant Agents handle data on behalf of Principals and MUST adhere to strict data protection requirements to prevent unauthorized access, disclosure, or loss.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">6.1 Data Classification</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All data processed by an Agent MUST be classified into one of four levels: Public (no restrictions), Internal (organization-only access), Confidential (need-to-know access), and Restricted (regulatory or legal constraints). The classification determines the minimum encryption, access control, and retention requirements.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">6.2 Encryption Requirements</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Data classified as Confidential or Restricted MUST be encrypted at rest using AES-256-GCM or equivalent. All data in transit MUST be encrypted using TLS 1.3 or later. Key material for data encryption MUST be managed separately from law signing keys.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">6.3 Data Minimization</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                An Agent MUST collect and retain only the minimum data necessary to fulfill its current task. Data MUST be purged when no longer needed, subject to applicable retention policies. An Agent MUST NOT aggregate data across Principals without explicit consent.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">6.4 Audit Logging</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All data access events MUST be logged in an append-only audit log. Each log entry MUST include: timestamp, Agent identifier, data classification level, action performed, and the identity of the requesting Principal. Audit logs MUST be retained for a minimum of 90 days and MUST be tamper-evident.
              </p>
            </section>

            <section id="communication-protocol" data-testid="section-communication-protocol" className="mb-16">
              <h2 className="font-heading text-2xl border-b border-border pb-2 mb-6">7. Communication Protocol</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The cLaw Communication Protocol (CCP) defines how Agents exchange messages with other Agents, Principals, and external systems. All communication MUST be authenticated, encrypted, and rate-limited.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">7.1 Message Format</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All messages MUST use a structured envelope format containing: protocol version, sender identity, recipient identity, message type, timestamp (ISO 8601), a unique message ID (UUID v4), the payload, and a digital signature over the entire envelope excluding the signature field itself.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">7.2 Authentication</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every message MUST be authenticated using the sender's identity certificate. Recipients MUST verify the sender's certificate chain and signature before processing any message. Messages with invalid or expired signatures MUST be rejected and logged.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">7.3 Encryption</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All messages MUST be encrypted in transit using TLS 1.3 or later. For sensitive payloads, end-to-end encryption using the recipient's public key (RSA-OAEP or X25519) is RECOMMENDED. Agents MUST reject unencrypted connections.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">7.4 Rate Limiting</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Agents MUST implement rate limiting on incoming messages to prevent denial-of-service conditions. The default limit is 1000 messages per minute per sender. Agents MAY configure stricter limits. Messages exceeding the rate limit MUST be queued or rejected with an appropriate error code.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">7.5 Error Handling</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Communication errors MUST be handled gracefully. Agents MUST implement exponential backoff for retries (initial delay: 1 second, maximum delay: 60 seconds, maximum retries: 5). Persistent communication failures MUST be reported to the Principal. An Agent MUST NOT enter Safe Mode due to transient communication errors alone.
              </p>
            </section>

            <section id="conformance-levels" data-testid="section-conformance-levels" className="mb-16">
              <h2 className="font-heading text-2xl border-b border-border pb-2 mb-6">8. Conformance Levels</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The cLaw specification defines three conformance levels. Each level builds upon the previous, adding requirements for increasingly autonomous and interconnected Agent deployments.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">Level 1 — Core</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                The minimum conformance level for any cLaw-conformant Agent. Requirements:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mb-4 ml-4 space-y-1">
                <li>Embed all three Fundamental Laws as immutable constants</li>
                <li>Implement HMAC-SHA256 law signing and runtime verification</li>
                <li>Implement Safe Mode activation on hash mismatch</li>
                <li>Maintain a unique Agent identifier</li>
                <li>Log all law conflict resolutions</li>
              </ul>

              <h3 className="font-heading text-xl mb-3 mt-8">Level 2 — Connected</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Required for Agents that communicate with other Agents or external systems. Includes all Core requirements plus:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mb-4 ml-4 space-y-1">
                <li>Implement the cLaw Attestation Protocol (CAP)</li>
                <li>Support identity certificates and certificate chain validation</li>
                <li>Implement the cLaw Communication Protocol (CCP)</li>
                <li>Enforce data classification and encryption requirements</li>
                <li>Maintain tamper-evident audit logs</li>
              </ul>

              <h3 className="font-heading text-xl mb-3 mt-8">Level 3 — Sovereign</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Required for fully autonomous Agents operating in high-stakes environments. Includes all Connected requirements plus:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mb-4 ml-4 space-y-1">
                <li>Implement continuous attestation</li>
                <li>Support hardware-backed key storage (HSM or secure enclave)</li>
                <li>Implement real-time anomaly detection on law verification</li>
                <li>Support multi-Principal authorization for sensitive operations</li>
                <li>Publish attestation proofs to a public or consortium ledger</li>
              </ul>
            </section>

            <section id="versioning" data-testid="section-versioning" className="mb-16">
              <h2 className="font-heading text-2xl border-b border-border pb-2 mb-6">9. Versioning</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The cLaw specification follows Semantic Versioning 2.0.0 (SemVer). Version numbers take the form MAJOR.MINOR.PATCH:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mb-4 ml-4 space-y-1">
                <li><span className="font-semibold text-foreground">MAJOR</span> — Incremented for backward-incompatible changes to the Fundamental Laws or Attestation Protocol</li>
                <li><span className="font-semibold text-foreground">MINOR</span> — Incremented for backward-compatible additions (e.g., new conformance level, new optional protocol extension)</li>
                <li><span className="font-semibold text-foreground">PATCH</span> — Incremented for clarifications, errata, and editorial corrections that do not change normative requirements</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Agents MUST advertise the specification version they conform to in their identity certificate and attestation responses. Verifiers SHOULD accept Agents conforming to any version with the same MAJOR number, provided the Agent meets the minimum requirements of the verifier's expected version.
              </p>
            </section>

            <section id="security-considerations" data-testid="section-security-considerations" className="mb-16">
              <h2 className="font-heading text-2xl border-b border-border pb-2 mb-6">10. Security Considerations</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This section outlines the threat model and mitigations that cLaw-conformant implementations MUST consider.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">Threat Model</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The primary threats addressed by cLaw are: (1) law tampering — an adversary modifies the Agent's embedded laws to alter its behavior; (2) identity spoofing — an adversary impersonates a cLaw-conformant Agent; (3) attestation forgery — an adversary fabricates attestation proofs to gain trust; (4) key compromise — an adversary obtains the signing or verification keys; (5) replay attacks — an adversary replays previously valid attestation responses.
              </p>

              <h3 className="font-heading text-xl mb-3 mt-8">Mitigations</h3>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mb-4 ml-4 space-y-1">
                <li>HMAC-SHA256 law hashing and continuous runtime verification mitigate law tampering</li>
                <li>Certificate-based identity and chain validation mitigate identity spoofing</li>
                <li>Nonce-based challenge-response in CAP mitigates attestation forgery and replay attacks</li>
                <li>HSM-backed key storage and regular key rotation mitigate key compromise</li>
                <li>Timestamps and nonce freshness checks provide additional replay protection</li>
                <li>Safe Mode as a fail-closed mechanism ensures tampered Agents cannot continue operating</li>
              </ul>
            </section>

            <section id="intellectual-property" data-testid="section-intellectual-property" className="mb-16">
              <h2 className="font-heading text-2xl border-b border-border pb-2 mb-6">11. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This specification is published under the Creative Commons Attribution 4.0 International License (CC BY 4.0). You are free to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mb-4 ml-4 space-y-1">
                <li><span className="font-semibold text-foreground">Share</span> — copy and redistribute the material in any medium or format</li>
                <li><span className="font-semibold text-foreground">Adapt</span> — remix, transform, and build upon the material for any purpose, including commercial</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Under the following terms:
              </p>
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mb-4 ml-4 space-y-1">
                <li><span className="font-semibold text-foreground">Attribution</span> — You must give appropriate credit to FutureSpeak.AI, provide a link to the license, and indicate if changes were made</li>
                <li><span className="font-semibold text-foreground">No additional restrictions</span> — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Full license text:{" "}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline inline-flex items-center gap-1"
                  data-testid="link-cc-license"
                >
                  creativecommons.org/licenses/by/4.0
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </section>

            <section id="appendix-a" data-testid="section-appendix-a" className="mb-16">
              <h2 className="font-heading text-2xl border-b border-border pb-2 mb-6">Appendix A — Canonical Laws Hash Computation</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This appendix describes the step-by-step algorithm for computing the canonical law hash used in attestation and runtime verification.
              </p>

              <ol className="list-decimal list-inside text-muted-foreground leading-relaxed mb-6 ml-4 space-y-2">
                <li>Retrieve the raw law text from the Agent's immutable store</li>
                <li>Canonicalize the text: trim leading/trailing whitespace, collapse internal whitespace to single spaces, convert to lowercase, remove any inline comments</li>
                <li>Encode the canonicalized text as UTF-8 bytes</li>
                <li>Load the verification key from the secure key store</li>
                <li>Compute HMAC-SHA256 over the UTF-8 bytes using the verification key</li>
                <li>Encode the resulting 256-bit hash as a lowercase hexadecimal string</li>
                <li>Compare the computed hash against the embedded expected hash</li>
                <li>If mismatch: enter Safe Mode immediately</li>
              </ol>

              <div className="bg-muted/30 border border-border rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
                <pre>{`function computeLawHash(rawLawText, verificationKey) {
  // Step 1-2: Canonicalize
  const canonical = rawLawText
    .trim()
    .replace(/\\s+/g, " ")
    .toLowerCase();

  // Step 3: Encode as UTF-8
  const encoded = new TextEncoder().encode(canonical);

  // Step 4-5: Compute HMAC-SHA256
  const hash = HMAC_SHA256(verificationKey, encoded);

  // Step 6: Hex encode
  return toHexString(hash);
}

// Step 7-8: Verification
const computed = computeLawHash(law.text, key);
if (computed !== law.expectedHash) {
  activateSafeMode("LAW_HASH_MISMATCH");
}`}</pre>
              </div>
            </section>

            <section id="appendix-b" data-testid="section-appendix-b" className="mb-16">
              <h2 className="font-heading text-2xl border-b border-border pb-2 mb-6">Appendix B — Reference Attestation Flow</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This appendix describes the complete reference attestation flow between a Verifier and a target Agent.
              </p>

              <ol className="list-decimal list-inside text-muted-foreground leading-relaxed ml-4 space-y-3">
                <li>
                  <span className="font-semibold text-foreground">Initiation:</span> The Verifier generates a 256-bit cryptographic nonce and constructs an Attestation Request message containing its identity, the nonce, and the expected conformance level.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Transport:</span> The request is sent to the Agent over a TLS 1.3 channel. The Verifier validates the Agent's TLS certificate before sending the request.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Agent Processing:</span> The Agent receives the request, verifies the Verifier's identity, and recomputes all law hashes from its embedded law text using the canonical hash computation algorithm (Appendix A).
                </li>
                <li>
                  <span className="font-semibold text-foreground">Response Construction:</span> The Agent concatenates the received nonce with all computed law hashes, signs the result with its private key, and constructs an Attestation Response including the signed payload and its certificate chain.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Verification:</span> The Verifier validates the Agent's certificate chain, verifies the signature, confirms the nonce matches, and compares all law hashes against the canonical registry.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Trust Decision:</span> If all checks pass, the Verifier establishes a trust session with the configured TTL. If any check fails, the Verifier rejects the Agent and logs the failure with full details.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Session Maintenance:</span> During the trust session, the Verifier MAY request periodic re-attestation. The Agent MUST respond to re-attestation requests within the configured timeout (default: 30 seconds).
                </li>
                <li>
                  <span className="font-semibold text-foreground">Termination:</span> The trust session ends when the TTL expires, either party terminates the session, or re-attestation fails. Upon termination, all session-specific keys and tokens MUST be securely erased.
                </li>
              </ol>
            </section>

          </div>
        </div>
      </div>
    </PageLayout>
  );
}
