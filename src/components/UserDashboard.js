class UserDashboard extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this._render();
    this._attachEvents();
  }

  _render() {
    this._shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Segoe UI', sans-serif;
          min-height: 100vh;
          background: linear-gradient(145deg, #f0f4ff 0%, #e8eeff 60%, #dde5ff 100%);
          padding: 40px 32px;
          box-sizing: border-box;
        }

        .dashboard-title {
          font-size: 0.75rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.18em;
          color: #6b7a99; margin-bottom: 24px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          max-width: 700px;
        }

        ::slotted(warning-badge) {
          grid-column: 1 / -1;
        }
      </style>

      <div class="dashboard-title">Panel de Usuario</div>
      <div class="dashboard-grid">
        <slot></slot>
      </div>
    `;
  }

  _attachEvents() {
    this.addEventListener("user-greeted", (e) => {
      const { name, role } = e.detail;

      const badge = this.querySelector("warning-badge");

      if (badge) {
        // El nuevo mensaje va dentro del warning-badge
        badge.setAttribute("message", `Saludo de ${name} (${role}) — sesión por expirar`);
        badge.setAttribute("pulsing", "");
      }
    });
  }
}

customElements.define("user-dashboard", UserDashboard);