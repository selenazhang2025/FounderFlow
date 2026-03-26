import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";

const html = htm.bind(React.createElement);

const stages = [
  { id: "new", title: "Just started", description: "New people interested" },
  { id: "talking", title: "In conversation", description: "You're talking details" },
  { id: "ready", title: "Close to yes", description: "Time to follow up" },
  { id: "won", title: "Said yes", description: "You earned the win" },
  { id: "archived", title: "Archived", description: "Paused or not moving right now" },
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

const starterPerson = {
  name: "",
  business: "",
  value: "",
  nextStep: "",
  note: "",
  stage: "new",
};

function getDueStatus(lastContactDays) {
  if (lastContactDays >= 5) return { label: "Follow up now", className: "overdue" };
  if (lastContactDays >= 3) return { label: "Follow up today", className: "today" };
  return { label: "On track", className: "win" };
}

function pickVariant(options, seed) {
  return options[seed % options.length];
}

function cleanFragment(text) {
  return text.trim().replace(/[.!?]+$/g, "");
}

function buildDraftMessage(person, business, refreshCount) {
  if (!person) {
    return "Pick a person to generate a personalized message draft.";
  }

  const firstName = person.name.split(" ")[0];
  const productSnippet = business.product.split(" ").slice(0, 6).join(" ").toLowerCase();
  const cleanNote = cleanFragment(person.note).toLowerCase();
  const cleanNextStep = cleanFragment(person.nextStep).toLowerCase();

  const greeting = pickVariant(
    [`Hi ${firstName},`, `Hey ${firstName},`, `${firstName}, hope you're doing well.`],
    refreshCount
  );

  const urgencyLine = person.lastContactDays >= 5
    ? pickVariant(
        [
          "I wanted to follow up before this slips through the cracks.",
          "Circling back because I did not want this opportunity to go cold.",
          "Checking in again since this felt worth keeping moving.",
        ],
        refreshCount + 1
      )
    : pickVariant(
        [
          "I wanted to check in and make the next step easy.",
          "Following up with a quick update in case helpful.",
          "Reaching out with a simple next step so this stays easy to review.",
        ],
        refreshCount + 1
      );

  const contextLine = pickVariant(
    [
      `Based on what you shared about ${cleanNote}, I think ${productSnippet} could be a strong fit.`,
      `From your note about ${cleanNote}, it sounds like ${productSnippet} could help.`,
      `Because you mentioned ${cleanNote}, I think this could be a practical fit for you.`,
    ],
    refreshCount + 2
  );

  const supportLine = pickVariant(
    [
      `If it helps, I can send a quick option for ${cleanNextStep} and answer any questions today.`,
      `I can also send a simple version of ${cleanNextStep} so you can see exactly what the next step looks like.`,
      `If useful, I can put together a short option for ${cleanNextStep} and keep it easy to review.`,
    ],
    refreshCount + 3
  );

  const closingLine = pickVariant(
    [
      "Would you like me to send that over?",
      "If you're interested, I can send the next step today.",
      "Happy to send a simple option if that would help.",
    ],
    refreshCount + 4
  );

  return [
    greeting,
    "",
    urgencyLine,
    "",
    contextLine,
    "",
    supportLine,
    "",
    closingLine,
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

function AddPersonPanel({ onAddPerson }) {
  const [draft, setDraft] = useState(starterPerson);

  function updateField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.business.trim() || !draft.nextStep.trim()) return;

    onAddPerson({
      id: `c${Date.now()}`,
      name: draft.name.trim(),
      business: draft.business.trim(),
      value: draft.value.trim() || "Value not added yet",
      nextStep: draft.nextStep.trim(),
      note: draft.note.trim() || "No notes yet.",
      stage: draft.stage,
      lastContactDays: 0,
    });

    setDraft(starterPerson);
  }

  return html`
    <section className="panel add-panel">
      <div className="panel-heading">
        <div>
          <p className="section-label">Add a new relationship</p>
          <h2>Log a new person interested</h2>
        </div>
        <span className="status-pill">Live updates</span>
      </div>

      <form className="add-form" onSubmit=${handleSubmit}>
        <label>
          Name
          <input
            type="text"
            value=${draft.name}
            placeholder="Aisha Patel"
            onChange=${(event) => updateField("name", event.target.value)}
          />
        </label>
        <label>
          Where did they come from?
          <input
            type="text"
            value=${draft.business}
            placeholder="Instagram DM, school referral, club intro"
            onChange=${(event) => updateField("business", event.target.value)}
          />
        </label>
        <label>
          Potential value
          <input
            type="text"
            value=${draft.value}
            placeholder="$120 package"
            onChange=${(event) => updateField("value", event.target.value)}
          />
        </label>
        <label>
          Next step
          <input
            type="text"
            value=${draft.nextStep}
            placeholder="Send pricing details"
            onChange=${(event) => updateField("nextStep", event.target.value)}
          />
        </label>
        <label>
          Notes
          <input
            type="text"
            value=${draft.note}
            placeholder="Asked about weekend sessions"
            onChange=${(event) => updateField("note", event.target.value)}
          />
        </label>
        <label>
          Starting stage
          <select
            value=${draft.stage}
            onChange=${(event) => updateField("stage", event.target.value)}
          >
            ${stages
              .filter((stage) => stage.id !== "won" && stage.id !== "archived")
              .map(
                (stage) =>
                  html`<option key=${stage.id} value=${stage.id}>${stage.title}</option>`
              )}
          </select>
        </label>
        <button type="submit">Add person interested</button>
      </form>
    </section>
  `;
}

function DashboardPanel({ opportunities, learningPrompt }) {
  const activeOpportunities = opportunities.filter(
    (item) => item.stage !== "won" && item.stage !== "archived"
  );
  const total = activeOpportunities.length;
  const won = opportunities.filter((item) => item.stage === "won").length;
  const archived = opportunities.filter((item) => item.stage === "archived").length;
  const needsFollowUp = activeOpportunities.filter((item) => item.lastContactDays >= 3).length;
  const topOpportunity = [...activeOpportunities]
    .sort((a, b) => b.lastContactDays - a.lastContactDays)[0];
  const nextActionText = topOpportunity
    ? `${topOpportunity.name} has been waiting ${topOpportunity.lastContactDays} days. Send a message about ${topOpportunity.nextStep.toLowerCase()}.`
    : "Celebrate your wins and add a new person interested to keep growing.";

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
          <span className="stat-chip">${archived} archived</span>
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
              ? html`<span>${nextActionText}</span>`
              : nextActionText}
          </div>
        </article>
      </div>
    </section>
  `;
}

function OpportunityBoard({ opportunities, onMove, onArchive, onRemove }) {
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
                      <div className="card-actions">
                        <button
                          type="button"
                          className="ghost-button"
                          onClick=${() => onArchive(item.id)}
                        >
                          Archive
                        </button>
                        <button
                          type="button"
                          className="ghost-button danger-button"
                          onClick=${() => onRemove(item.id)}
                        >
                          Remove
                        </button>
                      </div>
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

function ContactsPanel({ opportunities, onArchive, onRemove }) {
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
              <div className="card-actions">
                <button
                  type="button"
                  className="ghost-button"
                  onClick=${() => onArchive(person.id)}
                >
                  Archive
                </button>
                <button
                  type="button"
                  className="ghost-button danger-button"
                  onClick=${() => onRemove(person.id)}
                >
                  Remove
                </button>
              </div>
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
  const selectable = opportunities.filter(
    (person) => person.stage !== "won" && person.stage !== "archived"
  );
  const [selectedId, setSelectedId] = useState(selectable[0]?.id ?? "");
  const [refreshCount, setRefreshCount] = useState(() => Math.floor(Math.random() * 12));

  useEffect(() => {
    if (!selectable.length) {
      setSelectedId("");
      return;
    }

    const stillExists = selectable.some((person) => person.id === selectedId);
    if (!stillExists) {
      setSelectedId(selectable[0].id);
    }
  }, [selectable, selectedId]);

  const selectedPerson = selectable.find((person) => person.id === selectedId) ?? null;
  const message = useMemo(
    () => buildDraftMessage(selectedPerson, business, refreshCount),
    [business, refreshCount, selectedPerson]
  );

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
          lastContactDays:
            newStage === "won" || newStage === "archived"
              ? 0
              : Math.max(0, item.lastContactDays - 1),
        };
      })
    );
  }

  function handleAddPerson(person) {
    setOpportunities((current) => [person, ...current]);
  }

  function handleArchiveOpportunity(id) {
    setOpportunities((current) =>
      current.map((item) => {
        if (item.id !== id) return item;

        return {
          ...item,
          stage: "archived",
          lastContactDays: 0,
          nextStep: "Archived for later",
        };
      })
    );
  }

  function handleRemoveOpportunity(id) {
    setOpportunities((current) => current.filter((item) => item.id !== id));
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
        <${AddPersonPanel} onAddPerson=${handleAddPerson} />
        <${OpportunityBoard}
          opportunities=${opportunities}
          onMove=${handleMoveOpportunity}
          onArchive=${handleArchiveOpportunity}
          onRemove=${handleRemoveOpportunity}
        />
        <${ContactsPanel}
          opportunities=${opportunities}
          onArchive=${handleArchiveOpportunity}
          onRemove=${handleRemoveOpportunity}
        />
        <${MessageHelper} opportunities=${opportunities} business=${business} />
      </main>
    </div>
  `;
}
