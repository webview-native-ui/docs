---
title: "Aufnahmezeitpunkt"
sourceRevision: "d8fdcbd1f3e1cbbf7c658054109d1ceca1c924c0b9c2800d05ca8111d7904a23"
---

# Den Aufnahmezeitpunkt konfigurieren

Verwenden Sie `captureDelayMs`, wenn eine native Aktualisierung vor der visuellen Stabilisierung gemeldet wird, etwa bei der Hervorhebung eines Tabs. Die optionale Registrierungseinstellung gilt für Capacitor, Cordova und die Low-Level-Optionen von `createWebProjection`. Standard sind **50 Millisekunden**; der Wert muss endlich, nicht negativ und höchstens 2.147.483.647 ms sein, die Timer-Grenze des Browsers.

Auf nativen Hosts mit Kontakterkennung wird die Anfrage sofort aktiviert und die native Geometrie während der konfigurierten Wartezeit abgetastet. Ein Kontakt kann die Anfrage vor Ablauf dieser Zeit vorziehen. Andere Hosts entprellen die Vorbereitung auf Web-Seite. Ein stabiles Rechteck beweist nicht das Ende einer visuellen Animation.

Bis neue Bildpunkte bereitstehen, kann das zuvor fertiggestellte Bild abhängig von Quellbesitz und Layoutgültigkeit weiter verwendbar sein. Ein Overlay verwendet ein geeignetes Bild oder den Web-Fallback und wartet nicht auf die Entprellung im Ruhezustand. Eine längere Verzögerung kann daher die frühere Darstellung länger erhalten.

Wählen Sie die Verzögerung anhand von Auswahl, erneuter Auswahl und aufeinanderfolgenden Aktualisierungen des Steuerelements. Es gibt keine universelle Liquid-Glass-Animationsdauer; bei ständig wechselndem Inhalt ist kein stabiles Bild garantiert. Aufnahmereihenfolge, Interaktionsregeln und Zeitereignisse sind unter [Aufnahme vor der Interaktion](../advanced/preinteraction-capture.md) beschrieben.
