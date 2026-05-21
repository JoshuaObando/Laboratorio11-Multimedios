class WarningBadge extends HTMLElement {
  static get observedAttributes() {
    
    return ["pulsing", "message"];
  }

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this._render();
    }
  }

  _render() {
    
    const message = this.getAttribute("message") || this.textContent.trim();

    this._shadow.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: 'Segoe UI', sans-serif;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: linear-gradient(135deg, #ff6b35, #f7c59f);
          color: #1a0a00;
          border-radius: 24px;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          box-shadow: 0 2px 12px rgba(255, 107, 53, 0.35);
          transition: transform 0.2s ease;
        }

        .badge:hover { transform: scale(1.04); }

        :host([pulsing]) .badge {
          animation: pulse 1.6s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 2px 12px rgba(255, 107, 53, 0.35);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 4px 24px rgba(255, 107, 53, 0.75);
            transform: scale(1.06);
          }
        }
      </style>

      <span class="badge">
        <span>⚠️</span>
        <span>${message}</span>
      </span>
    `;
  }
}

customElements.define("warning-badge", WarningBadge);