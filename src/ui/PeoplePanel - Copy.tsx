import React from "react";

export default function PeoplePanel() {
  // Placeholder host/audience list – wire to your backend later
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 16, padding: 12 }}>
      <b>People</b>
      <div style={{ marginTop: 8, fontSize: 12, opacity: .8 }}>
        Host & queue controls coming soon. This panel will show:
        <ul style={{ marginTop: 6 }}>
          <li>Host (you)</li>
          <li>Backstage (speakers you can bring on-air)</li>
          <li>Audience (click to invite / promote)</li>
        </ul>
      </div>
    </div>
  );
}
