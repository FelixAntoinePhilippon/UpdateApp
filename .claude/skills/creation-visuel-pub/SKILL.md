---
name: creation-visuel-pub
description: Créer des visuels publicitaires et creatives pour campagnes (bannières, posts social, landing hero, miniatures YouTube). Produit briefs visuels détaillés et prompts IA prêts à l'emploi. À utiliser par design-ux-ui quand marketing-lead demande un visuel.
---

# SKILL : Création de Visuels Publicitaires

Ce skill transforme une intention marketing en un visuel ou un brief visuel prêt à produire.

## Quand utiliser ce skill

- Lancement produit → hero sections, pubs ciblées
- Campagne saisonnière → banners + social
- Annonce de feature → post LinkedIn, Twitter, email
- Trafic froid / retargeting → creatives multiples variants

## Anatomie d'un visuel pub efficace

1. **Hook visuel** (80% de l'impact) : image, couleur, contraste qui stoppe le scroll.
2. **Promesse écrite** (en 5 mots max) : le bénéfice, pas la feature.
3. **Preuve** (optionnelle) : chiffre, logo client, quote.
4. **CTA** (si le format le permet) : verbe d'action.
5. **Branding** : logo discret mais reconnaissable.

## Formats par plateforme (dimensions 2026)

| Plateforme | Format | Dimensions | Note |
|------------|--------|------------|------|
| Instagram Feed | Carré | 1080×1080 | Universel |
| Instagram Story | Vertical | 1080×1920 | Safe zones importantes |
| Instagram Reels | Vertical | 1080×1920 | Native |
| TikTok | Vertical | 1080×1920 | First 3s décisives |
| LinkedIn post | Carré ou paysage | 1200×1200 ou 1200×627 | Pro |
| LinkedIn single image ad | Paysage | 1200×627 | |
| X/Twitter post | Paysage | 1600×900 | |
| Facebook feed | Paysage | 1200×628 | |
| YouTube thumbnail | Paysage | 1280×720 | Lisible en 200px |
| Google Display 300×250 | Medium rect | 300×250 | Formats IAB |
| Google Display 728×90 | Leaderboard | 728×90 | |
| Google Display 160×600 | Wide skyscraper | 160×600 | |
| Email hero | Paysage | 600×300 | |
| Web hero | Paysage | 1920×800 | Responsive nécessaire |

## Brief visuel — template

Remplis cette fiche pour chaque visuel à produire :

```
# VISUEL : [nom court]

## Contexte
- Campagne : [nom]
- Objectif : [awareness / click / conversion / retargeting]
- Audience : [persona + stade funnel]
- Plateforme : [où ça sera diffusé]
- Format : [dimensions + variants si plusieurs]

## Message
- Hook (ce qu'on voit en 1 sec) : "[...]"
- Headline (titre principal) : "[...]" (< 10 mots)
- Sous-titre (optionnel) : "[...]"
- Preuve : [chiffre / logo / quote]
- CTA : "[verbe d'action]" → destination

## Direction visuelle
- Style : [photo / illustration / UI screenshot / collage / minimaliste]
- Ambiance : [calme / énergique / corporate / fun / technique]
- Palette : [primaire + accents]
- Typographie : [display + body]
- Éléments à intégrer : [logo, icônes, mockups]

## Composition
- Focal point : [où l'œil doit tomber en premier]
- Hiérarchie visuelle : [1→2→3 de lecture]
- Espace négatif : [% approximatif]

## Variations à produire
- A/B test : [2-3 variantes avec 1 seul élément qui change]
- Déclinaisons formats : [lister les tailles]

## Livrables attendus
- [ ] Fichier source éditable
- [ ] Exports PNG (haute def) + JPG (optimisé web)
- [ ] Version mobile si différente
- [ ] Annotations (ce qu'il faudrait tester)
```

## Prompt IA générative — structure

Pour Midjourney / DALL-E / Firefly / Stable Diffusion :

```
[sujet principal], [action/pose], [éclairage], [angle de caméra],
[ambiance/humeur], [palette couleurs], [style artistique],
[matériel/rendu], --ar [ratio] --s [stylize] --q 2 --v 6
```

Exemple concret pour un SaaS de finance :
```
Young professional using a laptop on a minimal wooden desk, 
soft morning light through window, shallow depth of field, 
calm and focused atmosphere, navy blue and cream color palette, 
modern editorial photography style, Fujifilm look, 
--ar 16:9 --s 100 --v 6
```

Règles :
- **Spécifique > générique** : "Asian woman in her 30s" > "person"
- **Préciser éclairage** : change radicalement la qualité
- **Style de référence** : "in the style of Monocle magazine" > abstrait
- **Éviter** : "professional", "modern" (trop vagues)
- **Ratio** via --ar : 1:1, 16:9, 9:16, 4:5 selon destination

## Règles d'or pour pubs qui convertissent

1. **Test du pouce** : fige l'écran à 1 seconde — qu'est-ce qu'on voit ? Est-ce que ça stoppe le scroll ?
2. **Règle du 40/40/20** : 40% headline, 40% visuel, 20% CTA/branding.
3. **Contraste produit vs fond** : le produit doit pop.
4. **Lisibilité mobile** : texte ≥ 24pt, lisible à 300px.
5. **Une idée par creative** : pas de fourre-tout.
6. **Safe zones Stories/Reels** : ne pas coller du texte à moins de 150px du haut (UI) et 350px du bas (CTA).
7. **Cinq secondes test** : affiche le creative à un inconnu 5 sec → qu'a-t-il retenu ?

## Anti-patterns fréquents

- Trop de texte sur un seul visuel (règle Meta : <20% surface)
- Stock photos génériques reconnaissables au premier coup d'œil
- Pixelisation (toujours vectoriel ou 2× résolution finale)
- Logo trop gros (au max 10% surface)
- Coupure de parties importantes sur crop Stories
- Fonts illisibles en version mobile

## Par type de creative — recettes qui marchent

**Produit en contexte** (SaaS) : screenshot produit + headline bénéfice + quote client
**Before/After** (outil productivité) : split screen avec chiffre "2h → 20min"
**Portrait + quote** (B2B humain) : photo cliente + citation entre guillemets + entreprise
**Chiffre choc** (data-driven) : gros nombre + bénéfice + micro-explication
**Comparatif vs concurrent** (challenger) : tableau 3 lignes + check/croix + notre logo en vainqueur
**Lifestyle** (B2C émotionnel) : photo d'ambiance + tagline aspirationnelle + logo discret
