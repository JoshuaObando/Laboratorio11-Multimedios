import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import "../src/components/UserCard.js";


describe("UserCard", () => {


  describe("Registro del elemento", () => {

    it("se define como elemento personalizado 'user-card'", () => {
      expect(customElements.get("user-card")).to.exist;
    });

    it("monta en el DOM sin errores", async () => {
      const el = await fixture(
        html`<user-card> Avatar  Alonso  Profesor  [Saludar] </user-card>`
      );
      expect(el).to.exist;
    });

    it("tiene Shadow DOM en modo 'open'", async () => {
      const el = await fixture(
        html`<user-card> Avatar  Alonso  Profesor  [Saludar] </user-card>`
      );
      expect(el.shadowRoot).to.exist;
    });

  });


  describe("Parseo del textContent", () => {

    it("extrae el nombre correctamente", async () => {
      const el = await fixture(
        html`<user-card> Avatar  María  Estudiante  [Saludar] </user-card>`
      );
      expect(el._name).to.equal("María");
    });

    it("extrae el rol correctamente", async () => {
      const el = await fixture(
        html`<user-card> Avatar  Carlos  Coordinador  [Hola] </user-card>`
      );
      expect(el._role).to.equal("Coordinador");
    });

    it("extrae la etiqueta del botón sin corchetes", async () => {
      const el = await fixture(
        html`<user-card> Avatar  Ana  Asistente  [Contactar] </user-card>`
      );
      expect(el._btnLabel).to.equal("Contactar");
    });

    it("usa 'Usuario' como nombre por defecto si el parseo falla", async () => {
      const el = await fixture(html`<user-card></user-card>`);
      expect(el._name).to.equal("Usuario");
    });

    it("usa 'Invitado' como rol por defecto si el parseo falla", async () => {
      const el = await fixture(html`<user-card></user-card>`);
      expect(el._role).to.equal("Invitado");
    });

  });


  describe("Renderizado del avatar (iniciales)", () => {

    it("muestra las iniciales del nombre en el avatar", async () => {
      const el = await fixture(
        html`<user-card> Avatar  Alonso Lopez Profesor  [Saludar] </user-card>`
      );
      const avatar = el.shadowRoot.querySelector(".avatar");
      expect(avatar.textContent.trim()).to.equal("AL");
    });

    it("genera iniciales correctas para nombre compuesto", async () => {
      const el = await fixture(
        html`<user-card> Avatar  Joshua Obando  Estudiante  [Hi] </user-card>`
      );
      const avatar = el.shadowRoot.querySelector(".avatar");
      
      expect(avatar.textContent.trim()).to.equal("JO");
    });

    it("limita las iniciales a 2 caracteres", async () => {
      const el = await fixture(
        html`<user-card> Avatar  Ana Belen Cruz  Profesora  [Ok] </user-card>`
      );
      const avatar = el.shadowRoot.querySelector(".avatar");
      expect(avatar.textContent.trim().length).to.equal(2);
    });

  });


  describe("Renderizado de nombre y rol", () => {

    it("muestra el nombre en el elemento .name", async () => {
      const el = await fixture(
        html`<user-card> Avatar  Alonso  Profesor  [Saludar] </user-card>`
      );
      const name = el.shadowRoot.querySelector(".name");
      expect(name.textContent.trim()).to.equal("Alonso");
    });

    it("muestra el rol en el elemento .role", async () => {
      const el = await fixture(
        html`<user-card> Avatar  Alonso  Profesor  [Saludar] </user-card>`
      );
      const role = el.shadowRoot.querySelector(".role");
      expect(role.textContent.trim()).to.equal("Profesor");
    });

    it("muestra la etiqueta del botón correctamente", async () => {
      const el = await fixture(
        html`<user-card> Avatar  Alonso  Profesor  [Saludar] </user-card>`
      );
      const btn = el.shadowRoot.querySelector("#greet-btn");
      expect(btn.textContent.trim()).to.equal("Saludar");
    });

  });


  describe("Evento personalizado 'user-greeted'", () => {

    it("emite 'user-greeted' al hacer click en el botón", async () => {
      const el = await fixture(
        html`<user-card> Avatar  Alonso  Profesor  [Saludar] </user-card>`
      );
      const btn = el.shadowRoot.querySelector("#greet-btn");

      setTimeout(() => btn.click());
      const event = await oneEvent(el, "user-greeted");

      expect(event).to.exist;
    });

    it("el evento incluye el nombre en detail", async () => {
      const el = await fixture(
        html`<user-card> Avatar  María  Directora  [Saludar] </user-card>`
      );
      const btn = el.shadowRoot.querySelector("#greet-btn");

      setTimeout(() => btn.click());
      const event = await oneEvent(el, "user-greeted");

      expect(event.detail.name).to.equal("María");
    });

    it("el evento incluye el rol en detail", async () => {
      const el = await fixture(
        html`<user-card> Avatar  María  Directora  [Saludar] </user-card>`
      );
      const btn = el.shadowRoot.querySelector("#greet-btn");

      setTimeout(() => btn.click());
      const event = await oneEvent(el, "user-greeted");

      expect(event.detail.role).to.equal("Directora");
    });

    it("el evento incluye un timestamp ISO válido", async () => {
      const el = await fixture(
        html`<user-card> Avatar  Alonso  Profesor  [Saludar] </user-card>`
      );
      const btn = el.shadowRoot.querySelector("#greet-btn");

      setTimeout(() => btn.click());
      const event = await oneEvent(el, "user-greeted");

      const ts = new Date(event.detail.timestamp);
      expect(ts.toString()).to.not.equal("Invalid Date");
    });

    it("el evento tiene bubbles: true", async () => {
      const el = await fixture(
        html`<user-card> Avatar  Alonso  Profesor  [Saludar] </user-card>`
      );
      const btn = el.shadowRoot.querySelector("#greet-btn");

      setTimeout(() => btn.click());
      const event = await oneEvent(el, "user-greeted");

      expect(event.bubbles).to.be.true;
    });

    it("el evento tiene composed: true (cruza el Shadow DOM)", async () => {
      const el = await fixture(
        html`<user-card> Avatar  Alonso  Profesor  [Saludar] </user-card>`
      );
      const btn = el.shadowRoot.querySelector("#greet-btn");

      setTimeout(() => btn.click());
      const event = await oneEvent(el, "user-greeted");

      expect(event.composed).to.be.true;
    });

    it("también emite 'user-greeted' al hacer click en la card ", async () => {
      const el = await fixture(
        html`<user-card> Avatar  Alonso  Profesor  [Saludar] </user-card>`
      );
      const card = el.shadowRoot.querySelector("#card");

      setTimeout(() => card.click());
      const event = await oneEvent(el, "user-greeted");

      expect(event).to.exist;
    });

  });

  // ─Estructura del Shadow DOM ─────────────────────────

  describe("Estructura del Shadow DOM", () => {

    it("contiene un elemento .card", async () => {
      const el = await fixture(
        html`<user-card> Avatar  Alonso  Profesor  [Saludar] </user-card>`
      );
      expect(el.shadowRoot.querySelector(".card")).to.exist;
    });

    it("contiene un elemento .avatar", async () => {
      const el = await fixture(
        html`<user-card> Avatar  Alonso  Profesor  [Saludar] </user-card>`
      );
      expect(el.shadowRoot.querySelector(".avatar")).to.exist;
    });

    it("contiene un botón con id 'greet-btn'", async () => {
      const el = await fixture(
        html`<user-card> Avatar  Alonso  Profesor  [Saludar] </user-card>`
      );
      expect(el.shadowRoot.querySelector("#greet-btn")).to.exist;
    });

  });

});