---
title: "Timing de capture"
sourceRevision: "d8fdcbd1f3e1cbbf7c658054109d1ceca1c924c0b9c2800d05ca8111d7904a23"
---

# Configurer le timing de capture

Utilisez `captureDelayMs` lorsqu’une mise à jour native est signalée avant la stabilisation visuelle, par exemple pour la surbrillance d’un onglet. Ce paramètre d’enregistrement facultatif est partagé par Capacitor, Cordova et les options de bas niveau de `createWebProjection`. La valeur par défaut est **50 millisecondes** ; elle doit être finie, non négative et ne pas dépasser la limite du minuteur du navigateur, soit 2 147 483 647 ms.

Sur les hôtes natifs capables de détecter le contact, la requête est armée immédiatement et la géométrie native est échantillonnée pendant l’attente configurée. Un contact peut promouvoir cette requête avant la fin du délai. Les autres hôtes appliquent un debounce côté Web. Un rectangle stable ne prouve pas la fin d’une animation visuelle.

Jusqu’à disponibilité des nouveaux pixels, l’image précédemment terminée peut rester utilisable selon la propriété de la source et la validité du layout. L’ouverture d’une superposition utilise une image éligible ou le repli Web, sans attendre le debounce au repos. Un délai plus long peut donc conserver plus longtemps une apparence antérieure.

Choisissez le délai selon la sélection, la resélection et les mises à jour successives du contrôle. Il n’existe pas de durée universelle pour les animations Liquid Glass, et un contenu en évolution continue ne garantit aucune image stable. L’ordre d’acquisition, la politique d’interaction et les événements de timing sont regroupés dans la [capture avant interaction](../advanced/preinteraction-capture.md).
