/v1/
 ├─ presets/
 │    ├─ GET    /           → Liste verfügbarer Presets
 │    └─ GET    /{slug}     → Detail: Punkte, Tags, SVG-Preview
 │
 ├─ curves/
 │    ├─ POST   /bezier     →  Body: {p1:[x,y], p2:[x,y]}                ↴
 │    │                        Rückgabe: {css:"cubic-bezier(...)" , tailwind:"…", svg:"…"}
 │    ├─ POST   /spring      →  Body: {mass, tension, friction, …}
 │    ├─ POST   /bounce      →  …
 │    └─ GET    /{id|hash}   →  Wiederholbare Ausgabe + Metadaten
 │
 ├─ healthz                →  GET, liefert „ok“, Build-Sha
 └─ openapi.yaml           →  GET, maschinenlesbare Spec


 POST /v1/generate-bezier
POST /v1/generate-spring
POST /v1/list-presets



Optionales Feld-Negotiation
	•	?fields=css,tailwind → Response auf das Wesentliche stutzen
	•	Accept: text/plain   → nur den CSS-String zurückgeben
	•	Accept: image/svg+xml → reines <svg> (kein JSON)

So bleibt der Standard-JSON-Block komplett, aber Heavy-User / KI-Hosts können Bandbreite sparen.