
import React, { useEffect, useState } from "react";
import { Plus, Trash2, CreditCard, UserRound } from "lucide-react";

import { djangoApi, errorMessage, rows } from "../api";
import { PageHeading, Alert, Empty } from "../components/UI";

export default function Cards() {
  const [cards, setCards] = useState([]);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const initialForm = {
    card_holder_name: "",
    last4: "",
    expiry_month: "",
    expiry_year: ""
  };

  const [form, setForm] = useState(initialForm);

  // Fetch saved cards
  const load = async () => {
    try {
      const response = await djangoApi.get("/api/cards/");
      setCards(rows(response.data));
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // Add new card
  const add = async (e) => {
    e.preventDefault();

    setBusy(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        card_holder_name: form.card_holder_name.trim(),
        last4: form.last4,
        expiry_month: Number(form.expiry_month),
        expiry_year: Number(form.expiry_year)
      };

      await djangoApi.post("/api/cards/", payload);

      setSuccess("Card added successfully!");
      setForm(initialForm);
      setShow(false);

      await load();

    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  // Delete card
  const remove = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this card?"
    );

    if (!confirmDelete) return;

    setError("");
    setSuccess("");

    try {
      await djangoApi.delete(`/api/cards/${id}/`);

      setSuccess("Card deleted successfully!");
      await load();

    } catch (e) {
      setError(errorMessage(e));
    }
  };

  return (
    <>
      <PageHeading
        eyebrow="WALLET"
        title="My cards"
        subtitle="Manage your saved card details."
        action={
          <button
            className="primary"
            onClick={() => {
              setShow(!show);
              setError("");
              setSuccess("");
            }}
          >
            <Plus size={17} />
            Add card
          </button>
        }
      />

      {error && <Alert>{error}</Alert>}

      {success && (
        <div className="alert success-message">
          {success}
        </div>
      )}

      {/* Add Card Form */}
      {show && (
        <div className="panel form-panel">
          <h2>Add a new demo card</h2>

          <p className="muted">
            Enter cardholder name and demo card metadata.
            Never enter a real card number or CVV.
          </p>

          <form className="form-grid" onSubmit={add}>

            <label>
              Cardholder Name

              <input
                type="text"
                name="card_holder_name"
                placeholder="e.g. Chandan Kumar"
                value={form.card_holder_name}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </label>

            <label>
              Last 4 Digits

              <input
                type="text"
                name="last4"
                placeholder="4242"
                value={form.last4}
                onChange={handleChange}
                maxLength={4}
                pattern="[0-9]{4}"
                inputMode="numeric"
                required
              />
            </label>

            <label>
              Expiry Month

              <input
                type="number"
                name="expiry_month"
                placeholder="12"
                min="1"
                max="12"
                value={form.expiry_month}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Expiry Year

              <input
                type="number"
                name="expiry_year"
                placeholder="2027"
                min="2026"
                max="2100"
                value={form.expiry_year}
                onChange={handleChange}
                required
              />
            </label>

            <div className="form-actions">
              <button
                type="submit"
                className="primary"
                disabled={busy}
              >
                {busy ? "Saving..." : "Save Card"}
              </button>

              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setShow(false);
                  setForm(initialForm);
                }}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Saved Cards */}
      <div className="cards-grid">

        {cards.map((card) => {

          const holderName =
            card.card_holder_name ||
            card.holder_name ||
            "Cardholder";

          return (
            <div className="saved-card" key={card.id}>

              <div className="saved-card-top">
                <CreditCard size={28} />

                <span>DEMO CARD</span>
              </div>

              <div className="card-number">
                •••• •••• •••• {card.last4 || "----"}
              </div>

              <div className="saved-card-bottom">

                <div>
                  <small>CARDHOLDER</small>

                  <b className="card-holder-name">
                    {holderName.toUpperCase()}
                  </b>
                </div>

                <div>
                  <small>EXPIRES</small>

                  <b>
                    {card.expiry_month || "--"}/
                    {card.expiry_year || "----"}
                  </b>
                </div>

                <button
                  className="icon-button"
                  onClick={() => remove(card.id)}
                  title="Delete card"
                >
                  <Trash2 size={17} />
                </button>

              </div>
            </div>
          );
        })}

      </div>

      {!cards.length && !show && (
        <div className="panel">
          <Empty text="No saved cards. Add your first demo card." />
        </div>
      )}
    </>
  );
}
