import React, { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "200") {
          setEmail("");
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='email'>Email:</label>
      <input type='text' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type='submit'> Register</button>
    </form>
  );
}
