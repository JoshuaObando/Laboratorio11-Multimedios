class WeatherTime extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" });
    this._timerInterval = null;
  }

  connectedCallback() {
    this._render();
    this._timerInterval = setInterval(() => this._updateTime(), 1000);
  }

  disconnectedCallback() {
    if (this._timerInterval) clearInterval(this._timerInterval);
  }

  _getWeatherIcon(condition) {
    const icons = {
      sunny: "☀️", cloudy: "☁️", rainy: "🌧️",
      stormy: "⛈️", windy: "💨", snowy: "❄️",
      foggy: "🌫️", partlycloudy: "⛅",
    };
    const key = condition.toLowerCase().replace(/\s+/g, "");
    return icons[key] || "🌡️";
  }

  _getCurrentTime() {
    return new Date().toLocaleTimeString("es-CR", {
      hour: "2-digit", minute: "2-digit",
      second: "2-digit", hour12: true,
    });
  }

  _updateTime() {
    const timeEl = this._shadow.querySelector(".time");
    if (timeEl) timeEl.textContent = this._getCurrentTime();
  }

  _render() {
    const parts = this.textContent.trim().split(/\s{2,}/);
    const city      = parts[0] || "Liberia";
    const temp      = parts[1] || "31 °C";
    const condition = parts[2] || "Sunny";
    const icon      = this._getWeatherIcon(condition);

    this._shadow.innerHTML = `
      <style>
        :host { display: block; font-family: 'Segoe UI', sans-serif; }

        .weather-card {
          background: linear-gradient(160deg, #0f2557 0%, #1a3a8f 50%, #2255c4 100%);
          color: #e8f0fe;
          border-radius: 20px;
          padding: 20px 28px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          box-shadow: 0 8px 32px rgba(15, 37, 87, 0.45);
          min-width: 200px;
          position: relative;
          overflow: hidden;
        }

        .weather-card::before {
          content: '';
          position: absolute;
          top: -20px; right: -20px;
          width: 120px; height: 120px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
        }

        .city {
          font-size: 0.8rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.12em;
          color: #93b4f8;
        }

        .temp-row { display: flex; align-items: center; gap: 10px; }
        .icon { font-size: 2rem; line-height: 1; }
        .temp { font-size: 2.2rem; font-weight: 800; line-height: 1; color: #ffffff; }
        .condition { font-size: 0.85rem; color: #bcd0fc; font-weight: 500; }

        .divider {
          width: 100%; height: 1px;
          background: rgba(255,255,255,0.12); margin: 4px 0;
        }

        .time {
          font-size: 1rem; font-weight: 700; color: #ffffff;
          letter-spacing: 0.06em; font-variant-numeric: tabular-nums;
        }
      </style>

      <div class="weather-card">
        <span class="city">${city}</span>
        <div class="temp-row">
          <span class="icon">${icon}</span>
          <span class="temp">${temp}</span>
        </div>
        <span class="condition">${condition}</span>
        <div class="divider"></div>
        <span class="time">${this._getCurrentTime()}</span>
      </div>
    `;
  }
}

customElements.define("weather-time", WeatherTime);