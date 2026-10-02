# Veille techno hebdomadaire

Veille automatisée envoyée chaque dimanche à 18 h (heure de Paris) :
un mail par section, et un site GitHub Pages pour les sections publiques.

| Section | Mail | Site public |
|---|---|---|
| Nouveautés Microsoft | oui | oui |
| Attaques et menaces | oui | oui |
| Outils | oui | **non** |

Fonctionnement : GitHub Actions lance `veille.py`, qui interroge l'API Gemini
(recherche Google intégrée), vérifie chaque lien, envoie les mails via Gmail,
puis publie le site. Coût : 0 € (palier gratuit Gemini 2.5 Flash).

## Mise en place

### 1. Créer le repo
1. Crée un repo **public** (ex. `veille-hebdo`) et dépose-y tous ces fichiers.
2. *Settings → General → Features* : décoche **Issues**, **Wikis**, **Projects**, **Discussions**.
3. *Settings → Moderation options → Interaction limits* : limite aux collaborateurs.
4. *Settings → Branches* : ajoute une règle de protection sur `main`
   (bloquer les suppressions et les force-push).

### 2. Ajouter les secrets
*Settings → Secrets and variables → Actions → New repository secret* :

| Secret | Contenu |
|---|---|
| `GEMINI_API_KEY` | clé créée dans Google AI Studio |
| `GMAIL_ADDRESS` | adresse du compte Gmail dédié à l'envoi |
| `GMAIL_APP_PASSWORD` | mot de passe d'application (16 caractères, sans espaces) |
| `MAIL_TO` | adresse de réception par défaut |
| `MAIL_TO_MICROSOFT`, `MAIL_TO_MENACES`, `MAIL_TO_OUTILS` | *(facultatif)* destinataire propre à une section |

Les secrets ne sont jamais visibles, même sur un repo public.

### 3. Activer GitHub Pages
*Settings → Pages → Build and deployment → Source* : **GitHub Actions**.

### 4. Autoriser l'écriture du workflow
*Settings → Actions → General → Workflow permissions* : **Read and write permissions**.
Laisse décochée l'option qui autorise Actions à créer des pull requests.

### 5. Tester
*Actions → Veille hebdo → Run workflow* :
- `dry_run` coché : génère tout sans envoyer de mail ni publier (vérifie les logs) ;
- `dry_run` décoché : envoi réel et publication immédiate.
Champ `sections` : limiter le test, par exemple `microsoft`.

Ensuite, plus rien à faire : l'envoi part tout seul chaque dimanche.

## Personnaliser
Tout se passe dans `config.yaml` :
- **ajouter une section** : copier un bloc dans `sections` et adapter `id`, `title`,
  `subject_prefix`, `instructions` ;
- **ajouter une techno** : l'ajouter à la liste `technologies` (partagée) ;
- **changer de modèle** : `general.model` ;
- **fréquence** d'une section : `weekly`, `biweekly` ou `monthly`.

`config.yaml` est public : n'y mets jamais d'adresse, de nom de client ou
d'information interne.

## Sécurité
- Compte Gmail dédié à l'envoi uniquement ; compte GitHub protégé par MFA.
- Workflow sans droits par défaut, droits minimaux par job ; actions épinglées
  par empreinte ; dépendances épinglées ; Dependabot actif.
- Pas de déclencheur `pull_request_target`.
- Contenu généré systématiquement échappé (mail et site) ; politique CSP stricte sur le site.
- Sources : uniquement des domaines réellement consultés par la recherche ou
  déclarés de confiance, liens testés, liens de téléchargement direct refusés,
  information sans source valide écartée.
- La section Outils n'est jamais publiée sur le site.

## En cas d'échec
GitHub t'envoie un mail si le workflow échoue. Les sections réussies sont
enregistrées ; relance simplement *Run workflow* (dry_run décoché) : les
sections déjà envoyées cette semaine sont ignorées.
