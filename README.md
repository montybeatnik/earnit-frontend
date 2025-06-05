# 📱 EarnIt App – User Flow Overview

This document outlines the onboarding and navigation flow for both **Parent** and **Child** users in the EarnIt mobile app.

---

## 🔰 Entry Point

**LandingScreen**
- CTA: “Join Early Access” → navigates to `RegisterScreen`

---

## 📝 Registration Flow

**RegisterScreen**
- Inputs: Name, Email, Password, Role (Parent or Child)
- On Success:
  - If **Parent** → navigates to `WelcomeScreen`
  - If **Child** → navigates to `ParentLinkScreen`

---

## 👨‍👧 Parent Onboarding Flow

```text
WelcomeScreen
   ↓****
RoleSelectionScreen  (→ Parent selected)
   ↓
BoilerplateSelectionScreen
   ↓
ConfirmSelectionScreen
   ↓
ChildSetupScreen
   ↓
ParentDashboard
```

## Child Onboarding Flow
```text
WelcomeScreen
   ↓
RoleSelectionScreen  (→ Child selected)
   ↓
ParentLinkScreen  (enter Parent ID)
   ↓
ConfirmLinkScreen
   ↓
ChildDashboard
```

<!-- <details>
<summary>Click to Expand</summary> -->
```mermaid
graph TD
%% Entry
A[Landing Screen] --> B[Register Screen]

%% Role Selection
B --> C{User Role?}
C -->|Parent| D[Welcome Screen]
C -->|Child| I[Parent Link Screen]

%% Parent Flow
D --> E[Role Selection Screen]
E --> F[Boilerplate Selection Screen]
F --> G[Confirm Selection]
G --> H[Parent Dashboard]

%% Child Flow
I --> J[Confirm Parent Link]
J --> K[Child Dashboard]

%% Dashboards
H --> H1[Assign Tasks / Approve Submissions]
K --> K1[View / Submit Tasks]
K --> K2[Redeem Rewards]

%% Shared
F --> S1[✓ Save Selected Tasks/Rewards to Profile]
```
<!-- </details> -->