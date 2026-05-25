import { fixture, expect, html } from "@open-wc/testing";
import "../src/components/WarningBadge.js";


describe("WarningBadge", () => {


  describe("Renderizado básico", () => {

    it("se define como elemento personalizado", () => {
      expect(customElements.get("warning-badge")).to.exist;
    });

    it("monta en el DOM sin errores", async () => {
      const el = await fixture(html`<warning-badge>Hola</warning-badge>`);
      expect(el).to.exist;
    });

    it("tiene un Shadow DOM adjunto en modo 'open'", async () => {
      const el = await fixture(html`<warning-badge>Test</warning-badge>`);
      expect(el.shadowRoot).to.exist;
    });

    it("renderiza el ícono de advertencia ", async () => {
      const el = await fixture(html`<warning-badge>Mensaje</warning-badge>`);
      expect(el.shadowRoot.innerHTML).to.include("⚠️");
    });

    it("renderiza el texto pasado como textContent", async () => {
      const el = await fixture(html`<warning-badge>Sesión por expirar</warning-badge>`);
      const badge = el.shadowRoot.querySelector(".badge");
      expect(badge.textContent).to.include("Sesión por expirar");
    });

  });


  describe("Atributo 'message'", () => {

    it("usa el atributo message si está presente", async () => {
      const el = await fixture(
        html`<warning-badge message="Error crítico">Texto ignorado</warning-badge>`
      );
      const badge = el.shadowRoot.querySelector(".badge");
      expect(badge.textContent).to.include("Error crítico");
    });

    it("actualiza el contenido cuando se cambia el atributo message", async () => {
      const el = await fixture(html`<warning-badge message="Original">X</warning-badge>`);

      el.setAttribute("message", "Actualizado");
      // attributeChangedCallback es síncrono; el shadow se re-renderiza de inmediato
      const badge = el.shadowRoot.querySelector(".badge");
      expect(badge.textContent).to.include("Actualizado");
    });

    it("no re-renderiza si el nuevo valor de message es igual al anterior", async () => {
      const el = await fixture(html`<warning-badge message="Igual">X</warning-badge>`);
      let renderCount = 0;
      const original = el._render.bind(el);
      el._render = () => { renderCount++; original(); };

      el.setAttribute("message", "Igual"); // mismo valor 
      expect(renderCount).to.equal(0);
    });

  });


  describe("Atributo 'pulsing'", () => {

    it("tiene el atributo pulsing cuando se declara en el HTML", async () => {
      const el = await fixture(html`<warning-badge pulsing>Alerta</warning-badge>`);
      expect(el.hasAttribute("pulsing")).to.be.true;
    });

    it("aplica la animación pulse al badge cuando pulsing está presente", async () => {
      const el = await fixture(html`<warning-badge pulsing>Alerta</warning-badge>`);
      const badge = el.shadowRoot.querySelector(".badge");
      const style = getComputedStyle(badge);
      // La propiedad animation-name debe contener 'pulse'
      expect(style.animationName).to.include("pulse");
    });

    it("activa la animación al agregar el atributo pulsing dinámicamente", async () => {
      const el = await fixture(html`<warning-badge>Sin pulso</warning-badge>`);
      el.setAttribute("pulsing", "");
      const badge = el.shadowRoot.querySelector(".badge");
      const style = getComputedStyle(badge);
      expect(style.animationName).to.include("pulse");
    });

    it("desactiva la animación al remover el atributo pulsing", async () => {
      const el = await fixture(html`<warning-badge pulsing>Con pulso</warning-badge>`);
      el.removeAttribute("pulsing");
      const badge = el.shadowRoot.querySelector(".badge");
      const style = getComputedStyle(badge);
      expect(style.animationName).to.not.include("pulse");
    });

  });


  describe("observedAttributes", () => {

    it("declara 'pulsing' y 'message' como atributos observados", () => {
      const observed = customElements.get("warning-badge").observedAttributes;
      expect(observed).to.include("pulsing");
      expect(observed).to.include("message");
    });

  });


  describe("Estilo del badge", () => {

    it("el badge tiene border-radius (forma de píldora)", async () => {
      const el = await fixture(html`<warning-badge>Test</warning-badge>`);
      const badge = el.shadowRoot.querySelector(".badge");
      const style = getComputedStyle(badge);
      expect(parseInt(style.borderRadius)).to.be.greaterThan(0);
    });

    it("el host tiene display 'inline-block'", async () => {
      const el = await fixture(html`<warning-badge>Test</warning-badge>`);
      const style = getComputedStyle(el);
      expect(style.display).to.equal("inline-block");
    });

  });

});