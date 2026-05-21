class UserCard extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const raw  = this.textContent.trim();
    const parts = raw.split(/\s{2,}/);

    this._name     = parts[1] || "Usuario";
    this._role     = parts[2] || "Invitado";
    this._btnLabel = parts[3]?.replace(/[\[\]]/g, "") || "Saludar";

    this._render();
    this._attachEvents();
  }

  _render() {
    const initials = this._name
      .split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

    this._shadow.innerHTML = `
      <style>
        :host { display: block; font-family: 'Segoe UI', sans-serif; }

        .card {
          background: #ffffff;
          border-radius: 20px;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          gap: 18px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.09);
          transition: box-shadow 0.25s ease;
          cursor: pointer;
        }

        .card:hover { box-shadow: 0 8px 36px rgba(0,0,0,0.16); }
        .card:active { transform: scale(0.98); transition: transform 0.1s ease; }

        .avatar {
          width: 58px; height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2255c4, #0f2557);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem; font-weight: 800;
          flex-shrink: 0;
          box-shadow: 0 3px 12px rgba(34, 85, 196, 0.4);
        }

        .info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .name { font-size: 1.05rem; font-weight: 700; color: #0f2557; }
        .role { font-size: 0.78rem; color: #6b7a99; font-weight: 500;
                text-transform: uppercase; letter-spacing: 0.08em; }

        .greet-btn {
          padding: 8px 18px;
          background: linear-gradient(135deg, #2255c4, #1a3a8f);
          color: #fff; border: none; border-radius: 12px;
          font-size: 0.82rem; font-weight: 700;
          cursor: pointer; letter-spacing: 0.04em;
          transition: opacity 0.2s ease, transform 0.15s ease;
          white-space: nowrap;
        }
        .greet-btn:hover  { opacity: 0.88; transform: translateY(-1px); }
        .greet-btn:active { transform: translateY(0); }
      </style>

      <div class="card" id="card">
        <div class="avatar">${initials}</div>
        <div class="info">
          <span class="name">${this._name}</span>
          <span class="role">${this._role}</span>
        </div>
        <button class="greet-btn" id="greet-btn">${this._btnLabel}</button>
      </div>
    `;
  }

  _fireEvent() {
    // composed: true permite que el evento cruce el boundary del Shadow DOM
    const event = new CustomEvent("user-greeted", {
      bubbles:  true,
      composed: true,
      detail: {
        name:      this._name,
        role:      this._role,
        timestamp: new Date().toISOString(),
      },
    });
    this.dispatchEvent(event);
  }

  _attachEvents() {
    const btn  = this._shadow.querySelector("#greet-btn");
    const card = this._shadow.querySelector("#card");

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      this._fireEvent();
    });

    card.addEventListener("click", (e) => {
      if (e.target !== btn) this._fireEvent();
    });
  }
}

customElements.define("user-card", UserCard);