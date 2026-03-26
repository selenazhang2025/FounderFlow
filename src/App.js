import React, { useMemo, useState } from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";

const html = htm.bind(React.createElement);

const stages = [
  { id: "new", title: "Just started", description: "New people interested" },
  { id: "talking", title: "In conversation", description: "You're talking details" },
  { id: "ready", title: "Close to yes", description: "Time to follow up" },
  { id: "won", title: "Said yes", description: "You earned the win" },
];

const learningPrompts = [
  "People are most likely to reply when your message is short, clear, and sent within 24 hours.",
  "A follow-up is not annoying when it adds value. Share a next step, answer a question, or make it easier to say yes.",
  "Keeping notes on personal details builds trust. Remember schedules, goals, and concerns so each message feels thoughtful.",
  "When someone hesitates, give them one simple choice instead of a long menu. Lowering effort often raises replies.",
];

const starterBusiness = {
  product: "Weekly math tutoring for high school students",
  customers: "Parents of Grade 9-12 students who need extra support",
  channels: "Instagram DMs, school referrals, and email",
};

const starterOpportunities = [
  {
    id: "c1",
    name: "Sarah Chen",
    business: "Parent referral",
    stage: "ready",
    value: "$180 / month",
    lastContactDays: 5,
    nextStep: "Send trial lesson offer",
    note: "Asked whether sessions can happen on Sundays.",
  },
  {
    id: "c2",
    name: "Amir Rahman",
    business: "School robotics club",
    stage: "talking",
    value: "$250 workshop",
    lastContactDays: 2,
    nextStep: "Share workshop outline",
    note: "Interested in a group session before exams.",
  },
  {
    id: "c3",
    name: "Maya Singh",
    business: "Instagram inquiry",
    stage: "new",
    value: "$90 starter pack",
    lastContactDays: 1,
    nextStep: "Reply to her DM",
    note: "Wants help catching up before midterms.",
  },
  {
    id: "c4",
    name: "Jordan Lee",
    business: "Existing customer referral",
    stage: "won",
    value: "$220 / month",
    lastContactDays: 0,
    nextStep: "Prepare welcome note",
    note: "Signed up after a trial class last night.",
  },
];

function getDueStatus(lastContactDays) {
  if (lastContactDays >= 5) return { label: "Follow up now", className: "overdue" };
  if (lastContactDays >= 3) return { label: "Follow up today", className: "today" };
  return { label: "On track", className: "win" };
}

function buildDraftMessage(person, business) {
  if (!person) {
    return "Pick a person to generate a personalized message draft.";
  }

  const intro = business.product.split(" ").slice(0, 5).join(" ").toLowerCase();
  const urgencyLine =
    person.lastContactDays >= 5
      ? "I wanted to follow up before this slips through the cracks."
      : "I wanted to check in and make the next step easy.";

  return [
    `Hi ${person.name.split(" ")[0]},`,
    "",
    `${urgencyLine} Based on what you shared about ${person.note.toLowerCase()}, I think ${intro} could be a strong fit.`,
    "",
    `If it helps, I can send a quick option for ${person.nextStep.toLowerCase()} and answer any questions today.`,
    "",
    "Would you like me to send that over?",
  ].join("\n");
}

function SetupPanel({ business, onSubmit }) {
  const [draft, setDraft] = useState(business);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(draft);
  }

  return html`
    <section className="panel setup-panel">
      <div className="panel-heading">
        <div>
          <p className="section-label">1-minute setup</p>
          <h2>Tell FounderFlow about your hustle</h2>
        </div>
        <span className="status-pill">Personalized</span>
      </div>

      <form className="setup-form" onSubmit=${handleSubmit}>
        <label>
          What are you selling?
          <input
            type="text"
            value=${draft.product}
            placeholder="Tutoring, thrift bundles, web apps..."
            onChange=${(event) =>
              setDraft((current) => ({ ...current, product: event.target.value }))}
          />
        </label>
        <label>
          Who are your customers?
          <input
            type="text"
            value=${draft.customers}
            placeholder="Students, parents, creators..."
            onChange=${(event) =>
              setDraft((current) => ({ ...current, customers: event.target.value }))}
          />
        </label>
        <label>
          How do people contact you?
          <input
            type="text"
            value=${draft.channels}
            placeholder="Instagram, email, WhatsApp..."
            onChange=${(event) =>
              setDraft((current) => ({ ...current, channels: event.target.value }))}
          />
        </label>
        <button type="submit">Build my CRM</button>
      </form>

      <div className="snapshot">
        <strong>Your CRM is ready.</strong><br />
        FounderFlow is now tuned for <strong>${business.product}</strong>, helping
        you stay on top of conversations with <strong>${business.customers}</strong>
        through <strong>${business.channels}</strong>.
      </div>
    </section>
  `;
}

function DashboardPanel({ opportunities, learningPrompt }) {
  const total = opportunities.length;
  const won = opportunities.filter((item) => item.stage === "won").length;
  const needsFollowUp = opportunities.filter((item) => item.lastContactDays >= 3).length;
  const topOpportunity = [...opportunities]
    .filter((item) => item.stage !== "won")
    .sort((a, b) => b.lastContactDays - a.lastContactDays)[0];

  return html`
    <section className="panel dashboard-panel">
      <div className="panel-heading">
        <div>
          <p className="section-label">Daily focus</p>
          <h2>Your founder dashboard</h2>
        </div>
        <div className="mini-stats">
          <span className="stat-chip">${total} active people</span>
          <span className="stat-chip">${won} yes so far</span>
          <span className="stat-chip">${needsFollowUp} follow-up needed</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <article className="insight-card accent-card">
          <p className="card-label">Coach note</p>
          <h3>
            ${topOpportunity
              ? `${topOpportunity.name} is your best next move.`
              : "You're caught up and building momentum."}
          </h3>
          <p>
            ${topOpportunity
              ? `It has been ${topOpportunity.lastContactDays} days since your last message. A simple note about ${topOpportunity.nextStep.toLowerCase()} could keep this opportunity alive.`
              : "Every active opportunity has a recent touchpoint. Keep the energy going with one new outreach."}
          </p>
        </article>

        <article className="insight-card">
          <p className="card-label">Quick learning</p>
          <div className="learning-prompt">${learningPrompt}</div>
        </article>

        <article className="insight-card">
          <p className="card-label">Next action</p>
          <div className="next-action">
            ${topOpportunity
              ? html`<span>
                  <strong>${topOpportunity.name}</strong> has been waiting
                  ${topOpportunity.lastContactDays} days. Send a message about
                  <strong>${topOpportunity.nextStep.toLowerCase()}</strong>.
                </span>`
              : "Celebrate your wins and add a new person interested to keep growing."}
          </div>
        </article>
      </div>
    </section>
  `;
}

function OpportunityBoard({ opportunities, onMove }) {
  const [draggedId, setDraggedId] = useState(null);

  return html`
    <section className="panel board-panel">
      <div className="panel-heading">
        <div>
          <p className="section-label">Your opportunities</p>
          <h2>Move cards as conversations progress</h2>
        </div>
        <span className="status-pill warm">Drag and drop enabled</span>
      </div>

      <div className="board">
        ${stages.map((stage) => {
          const items = opportunities.filter((opportunity) => opportunity.stage === stage.id);

          return html`
            <section
              key=${stage.id}
              className="column"
              onDragOver=${(event) => event.preventDefault()}
              onDrop=${() => {
                if (draggedId) onMove(draggedId, stage.id);
                setDraggedId(null);
              }}
            >
              <div className="column-header">
                <div>
                  <h3>${stage.title}</h3>
                  <p className="opportunity-meta">${stage.description}</p>
                </div>
                <span className="column-count">${items.length}</span>
              </div>

              <div className="opportunity-list">
                ${items.map((item) => {
                  const due = getDueStatus(item.lastContactDays);

                  return html`
                    <article
                      key=${item.id}
                      className="card"
                      draggable="true"
                      onDragStart=${() => setDraggedId(item.id)}
                    >
                      <strong>${item.name}</strong>
                      <h4>${item.business}</h4>
                      <p className="opportunity-meta">${item.note}</p>
                      <div className="tag-row">
                        <span className="tag">${item.value}</span>
                        <span className=${`tag ${due.className}`}>${due.label}</span>
                      </div>
                    </article>
                  `;
                })}
              </div>
            </section>
          `;
        })}
      </div>
    </section>
  `;
}

function ContactsPanel({ opportunities }) {
  return html`
    <section className="panel contacts-panel">
      <div className="panel-heading">
        <div>
          <p className="section-label">People interested</p>
          <h2>Relationship tracker</h2>
        </div>
      </div>

      <div className="contact-list">
        ${opportunities.map((person) => {
          const due = getDueStatus(person.lastContactDays);

          return html`
            <article key=${person.id} className="contact-card">
              <div className="contact-topline">
                <span>${person.business}</span>
                <span>${person.value}</span>
              </div>
              <h3>${person.name}</h3>
              <p className="contact-note">${person.note}</p>
              <div className="tag-row">
                <span className="tag">${person.nextStep}</span>
                <span className=${`tag ${due.className}`}>${due.label}</span>
              </div>
            </article>
          `;
        })}
      </div>
    </section>
  `;
}

function MessageHelper({ opportunities, business }) {
  const selectable = opportunities.filter((person) => person.stage !== "won");
  const [selectedId, setSelectedId] = useState(selectable[0]?.id ?? "");
  const [refreshCount, setRefreshCount] = useState(0);

  const selectedPerson = selectable.find((person) => person.id === selectedId) ?? null;
  const message = useMemo(() => {
    const draft = buildDraftMessage(selectedPerson, business);
    if (!selectedPerson) return draft;

    const closingOptions = [
      "Would you like me to send that over?",
      "If you're interested, I can send the next step today.",
      "Happy to send a simple option if that would help.",
    ];
    const selectedClosing = closingOptions[refreshCount % closingOptions.length];

    return draft.replace(
      "Would you like me to send that over?",
      selectedClosing
    );
  }, [business, refreshCount, selectedPerson]);

  return html`
    <section className="panel suggestion-panel">
      <div className="panel-heading">
        <div>
          <p className="section-label">Message helper</p>
          <h2>AI-style follow-up suggestion</h2>
        </div>
      </div>

      <label className="message-label" htmlFor="contactSelect">Choose a person</label>
      <select
        id="contactSelect"
        value=${selectedId}
        onChange=${(event) => setSelectedId(event.target.value)}
      >
        ${selectable.map(
          (person) =>
            html`<option key=${person.id} value=${person.id}>
              ${person.name} - ${person.business}
            </option>`
        )}
      </select>

      <button
        type="button"
        className="secondary-button"
        onClick=${() => setRefreshCount((current) => current + 1)}
      >
        Refresh message tone
      </button>

      <div className="message-output">${message}</div>
    </section>
  `;
}

export function App() {
  const [business, setBusiness] = useState(starterBusiness);
  const [opportunities, setOpportunities] = useState(starterOpportunities);
  const [learningIndex, setLearningIndex] = useState(0);

  const learningPrompt = useMemo(
    () => learningPrompts[learningIndex % learningPrompts.length],
    [learningIndex]
  );

  function handleSetupSubmit(nextBusiness) {
    setBusiness(nextBusiness);
    setLearningIndex((current) => current + 1);
  }

  function handleMoveOpportunity(id, newStage) {
    setOpportunities((current) =>
      current.map((item) => {
        if (item.id !== id || item.stage === newStage) return item;

        return {
          ...item,
          stage: newStage,
          lastContactDays: newStage === "won" ? 0 : Math.max(0, item.lastContactDays - 1),
        };
      })
    );
  }

  return html`
    <div className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Beginner-first CRM for student founders</p>
          <h1>FounderFlow helps first-time entrepreneurs learn how to sell.</h1>
          <p className="hero-text">
            Track people interested, organize opportunities, and get gentle
            coaching without needing to understand business jargon first.
          </p>
        </div>
        <div className="hero-card">
          <p className="hero-card-label">What makes this different</p>
          <ul>
            <li>Human language instead of sales jargon</li>
            <li>Built-in reminders and AI-style message help</li>
            <li>Teaching moments inside the workflow</li>
          </ul>
        </div>
      </header>

      <main className="grid">
        <${SetupPanel} business=${business} onSubmit=${handleSetupSubmit} />
        <${DashboardPanel}
          opportunities=${opportunities}
          learningPrompt=${learningPrompt}
        />
        <${OpportunityBoard}
          opportunities=${opportunities}
          onMove=${handleMoveOpportunity}
        />
        <${ContactsPanel} opportunities=${opportunities} />
        <${MessageHelper} opportunities=${opportunities} business=${business} />
      </main>
    </div>
  `;
}
