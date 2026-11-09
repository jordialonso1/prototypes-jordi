/* Logic map of the Miro board "[Jordi] Sign up and login", transcribed from
   the PDF export. Positions follow the board layout (board units).

   - screen   (yellow): a prototype screen, clickable. `screen` is its
                         data-screen id in prototype/index.html.
   - decision (blue):   a logic branch, not interactable.
   - backend  (orange / purple / green): consequence of the journey (account
                         linked, signup, login), not interactable. */

export type NodeKind = 'screen' | 'decision' | 'backend'
export type Tone = 'orange' | 'purple' | 'green'

export interface FlowNode {
  /** Internal id, referenced by edges. */
  id: string
  /** Stable design id shown on yellow nodes (S01, S02...). Never renumber; append new ones. */
  code?: string
  label: string
  kind: NodeKind
  tone?: Tone
  /** Screen no longer in the design: drawn red with a DEPRECATED caption. */
  deprecated?: boolean
  /** Prototype screen id (screen nodes only). */
  screen?: string
  x: number
  y: number
}

export interface FlowEdge {
  from: string
  to: string
  label?: string
  /** x (board units) of the vertical segment of the elbow. Defaults to the midpoint. */
  bendX?: number
  /** Leave from the bottom of the source node (down, then across) instead of its right side. */
  exit?: 'bottom'
  /** Arrive at the top of the target (right, then down) instead of its left side. */
  enter?: 'top'
}

export interface ScreenDef {
  id: string
  title: string
}

/* One entry per distinct screen. Several yellow nodes can share a screen. */
export const SCREENS: ScreenDef[] = [
  /* Designed (Figma) */
  { id: 'start', title: 'Start' },
  { id: 'start-phone', title: 'Start (phone number filled in)' },
  { id: 'otp-phone', title: 'OTP phone' },
  { id: 'otp-phone-filled', title: 'OTP phone (code filled in)' },
  { id: 'otp-email', title: 'OTP email' },
  { id: 'otp-email-visible', title: 'OTP email (email visible)' },
  { id: 'protect', title: 'Protect your account' },
  { id: 'welcome-back-phone', title: 'Welcome back (phone)' },
  { id: 'welcome-back-email', title: 'Welcome back (email)' },
  { id: 'welcome-back-email-password', title: 'Welcome back (email) - password' },
  { id: 'email-start', title: 'Email start' },
  { id: 'email-protect', title: 'Enter email (protect your account)' },
  { id: 'password', title: 'Password' },
  { id: 'name', title: 'What is your name?' },
  /* Still placeholders ("Design pending") */
  { id: 'end', title: 'End (home)' },
  { id: 'welcome-no-methods', title: 'Welcome back! No linked methods' },
]

const S = (code: string, id: string, label: string, screen: string, x: number, y: number): FlowNode => ({
  id, code, label, kind: 'screen', screen, x, y,
})
/* Signup: a screen node (opens the name screen) drawn in purple like the other signup consequences. */
const SP = (code: string, id: string, label: string, x: number, y: number): FlowNode => ({
  id, code, label, kind: 'screen', screen: 'name', tone: 'purple', x, y,
})
const D = (id: string, label: string, x: number, y: number): FlowNode => ({
  id, label, kind: 'decision', x, y,
})
const B = (id: string, label: string, tone: Tone, x: number, y: number): FlowNode => ({
  id, label, kind: 'backend', tone, x, y,
})
/* Login: a screen node (opens the end screen) drawn in green like the other login consequences. */
const LOGIN = (code: string, id: string, x: number, y: number, label = 'Login'): FlowNode => ({
  id, code, label, kind: 'screen', screen: 'end', tone: 'green', x, y,
})

export const NODES: FlowNode[] = [
  /* Landing + phone. Codes S06, S23, S24, S25-S29 are retired (screens removed or turned into decisions in the 2026-11 map update). */
  S('S01', 'landing', 'Sign-in landing', 'start', 497, 380),
  S('S02', 'phone-entry', 'Introduce phone number and choose OTP method', 'start-phone', 614, 346),
  S('S03', 'phone-send', 'Send One Time Password (OTP)', 'otp-phone', 669, 346),
  S('S04', 'phone-input', 'Input OTP', 'otp-phone-filled', 717, 346),
  D('d-newphone', 'New phone number?', 817, 301),
  D('d-known', 'Known device?', 953, 301),
  LOGIN('S38', 'l-known', 1110, 301),
  D('d-second', 'Multiple methods?', 953, 346),
  S('S05', 'welcome-methods', 'Welcome back! Screen with existing methods', 'welcome-back-phone', 1068, 346),
  S('S69', 'verify-single', 'Verify OTP', 'otp-email', 1068, 429),
  LOGIN('S70', 'l-single', 1130, 429),

  /* Protect your account (new phone) */
  S('S07', 'protect-new', 'Protect your account', 'protect', 877, 262),
  D('d-emailexists', 'Email exists?', 902, 200),
  S('S08', 'verify-a', 'Verify OTP', 'otp-email-visible', 1012, 200),
  SP('S30', 'signup-a', 'Signup', 1148, 200),
  LOGIN('S39', 'l-a', 1199, 200),
  S('S09', 'welcome-top', 'Welcome back! Screen with existing methods', 'welcome-back-phone', 902, 155),
  D('d-top-social', 'Social', 1007, 90),
  B('be-top-social', 'New phone linked to existing account', 'orange', 1071, 90),
  LOGIN('S40', 'l-top-social', 1121, 90),
  D('d-top-pw', 'Password', 1007, 123),
  B('be-top-pw', 'New phone linked to existing account', 'orange', 1071, 123),
  LOGIN('S41', 'l-top-pw', 1121, 123),
  S('S10', 'verify-top', 'Verify OTP', 'otp-email-visible', 1012, 155),
  B('be-top-email', 'New phone linked to existing account', 'orange', 1129, 155),
  LOGIN('S42', 'l-top-email', 1192, 155),
  D('d-socialother', 'Social linked to another account?', 999, 262),
  SP('S31', 'signup-s', 'Signup', 1061, 228),
  LOGIN('S43', 'l-s-no', 1110, 228),
  B('be-s', 'New phone linked to existing account', 'orange', 1061, 262),
  LOGIN('S44', 'l-s-yes', 1110, 262),

  /* Welcome back (existing methods) outcomes */
  D('d-linkedA', 'Linked to Account A (of initial phone no.)?', 1163, 316),
  LOGIN('S45', 'l-A', 1163, 250, 'Login to Account A'),
  D('d-existingacct', 'Existing account?', 1228, 316),
  B('be-linkedB', 'Phone linked to existing account', 'orange', 1228, 251),
  LOGIN('S46', 'l-B', 1278, 251, 'Login to Account B'),
  SP('S32', 'signup-e', 'Signup', 1283, 316),
  B('be-newacct', 'Phone linked to new account', 'orange', 1330, 276),
  LOGIN('S47', 'l-newacct', 1374, 276),
  D('d-pw', 'Password', 1164, 346),
  LOGIN('S48', 'l-pw', 1228, 346),
  D('d-emailotp', 'Email OTP', 1164, 377),
  LOGIN('S49', 'l-emailotp', 1228, 377),

  /* Protect your account (existing account) */
  S('S11', 'protect-exist', 'Protect your account', 'protect', 1262, 406),
  D('d-selects', 'Selects existing method?', 1305, 355),
  LOGIN('S50', 'l-selA', 1428, 355, 'Login to Account A'),
  B('be-selB', 'Phone linked to existing account', 'orange', 1375, 380),
  LOGIN('S51', 'l-selB', 1440, 380, 'Login to Account B'),
  SP('S33', 'signup-sel', 'Signup', 1360, 330),
  B('be-selNo', 'Phone linked to new account', 'orange', 1415, 330),
  LOGIN('S52', 'l-selNo', 1470, 330),
  D('d-existingemail', 'Existing email?', 1326, 436),
  S('S12', 'validate-email', 'Validate email OTP page', 'otp-email-visible', 1387, 418),
  D('d-verify-new', 'Verify OTP', 1458, 418),
  SP('S34', 'signup-new', 'Signup', 1520, 380),
  B('be-new2', 'Phone linked to new account', 'orange', 1520, 342),
  LOGIN('S53', 'l-new2', 1520, 304),
  D('d-verify-exist', 'Verify OTP', 1458, 451),
  LOGIN('S54', 'l-verify-exist', 1546, 451),
  S('S13', 'welcome-right', 'Welcome back! Screen with existing methods', 'welcome-back-phone', 1400, 486),
  D('d-pw-r', 'Password', 1481, 486),
  LOGIN('S55', 'l-pw-r', 1546, 486),
  D('d-emailotp-r', 'Email OTP', 1481, 519),
  LOGIN('S56', 'l-emailotp-r', 1546, 519),
  LOGIN('S57', 'l-social-r', 1482, 552),

  /* Social */
  S('S14', 'social-3p', 'Select methods and performs steps on 3rd party', 'start', 614, 425),
  D('d-newaccount', 'New account?', 689, 425),
  LOGIN('S58', 'l-social-exist', 871, 397),
  SP('S35', 'signup-f', 'Signup', 818, 459),
  LOGIN('S59', 'l-social-new', 871, 459),

  /* Email */
  S('S15', 'email-entry', 'Introduces email', 'email-start', 601, 515),
  D('d-emailexists2', 'Email exists?', 690, 515),
  S('S16', 'verify-c', 'Verify OTP', 'otp-email-visible', 777, 515),
  SP('S36', 'signup-c', 'Signup', 885, 515),
  LOGIN('S60', 'l-c', 947, 515),
  D('d-haslogin', 'Has login methods?', 690, 565),
  S('S17', 'verify-d', 'Verify OTP', 'otp-email-visible', 777, 565),
  LOGIN('S61', 'l-d', 855, 565),
  S('S18', 'welcome-otp', 'Welcome back!! login methods + OTP', 'welcome-back-email', 690, 636),
  S('S19', 'verify-e', 'Verify OTP', 'otp-email-visible', 777, 636),
  D('d-known3', 'Known device?', 853, 636),
  LOGIN('S62', 'l-e', 853, 592),
  S('S20', 'verify-pw', 'Verify Password', 'welcome-back-email-password', 777, 672),
  D('d-known2', 'Known device?', 853, 672),
  LOGIN('S63', 'l-known2', 853, 715),
  D('d-phone', 'Has phone associated?', 955, 672),
  LOGIN('S64', 'l-phone', 1045, 672),
  S('S21', 'send-auto', 'Send One Time Password (OTP) automatically', 'otp-phone', 955, 715),
  S('S22', 'input-auto', 'Input OTP', 'otp-phone-filled', 1035, 715),
  LOGIN('S65', 'l-auto', 1105, 715),
  D('d-emailmatch', 'Email matches initial email?', 690, 706),
  LOGIN('S66', 'l-match', 782, 706),
  LOGIN('S67', 'l-matchB', 782, 737, 'Login to account B'),
  SP('S37', 'signup-b', 'Signup (creates Account B)', 782, 768),
  LOGIN('S68', 'l-signupB', 840, 768, 'Login to Account B'),
]

export const EDGES: FlowEdge[] = [
  { from: 'landing', to: 'phone-entry', label: 'Phone' },
  { from: 'landing', to: 'social-3p', label: 'Social' },
  { from: 'landing', to: 'email-entry', label: 'Email' },

  /* Phone */
  { from: 'phone-entry', to: 'phone-send' },
  { from: 'phone-send', to: 'phone-input' },
  { from: 'phone-input', to: 'd-newphone' },
  { from: 'd-newphone', to: 'protect-new', label: 'Yes' },
  { from: 'd-newphone', to: 'd-known', label: 'No' },
  { from: 'd-known', to: 'l-known', label: 'Yes' },
  { from: 'd-known', to: 'd-second', label: 'No' },
  { from: 'd-second', to: 'welcome-methods', label: 'Yes' },
  { from: 'd-second', to: 'verify-single', label: 'No' },
  { from: 'verify-single', to: 'l-single' },

  /* Protect your account (new phone) */
  { from: 'protect-new', to: 'd-emailexists', label: 'email' },
  { from: 'protect-new', to: 'd-socialother', label: 'social' },
  { from: 'd-emailexists', to: 'welcome-top', label: 'Yes' },
  { from: 'd-emailexists', to: 'verify-a', label: 'No' },
  { from: 'verify-a', to: 'signup-a' },
  { from: 'signup-a', to: 'l-a' },
  { from: 'welcome-top', to: 'd-top-social', label: 'social', bendX: 960 },
  { from: 'welcome-top', to: 'd-top-pw', label: 'password', bendX: 960 },
  { from: 'welcome-top', to: 'verify-top', label: 'email OTP' },
  { from: 'd-top-social', to: 'be-top-social' },
  { from: 'be-top-social', to: 'l-top-social' },
  { from: 'd-top-pw', to: 'be-top-pw' },
  { from: 'be-top-pw', to: 'l-top-pw' },
  { from: 'verify-top', to: 'be-top-email' },
  { from: 'be-top-email', to: 'l-top-email' },
  { from: 'd-socialother', to: 'signup-s', label: 'No' },
  { from: 'signup-s', to: 'l-s-no' },
  { from: 'd-socialother', to: 'be-s', label: 'Yes' },
  { from: 'be-s', to: 'l-s-yes' },

  /* Welcome back (existing methods) */
  { from: 'welcome-methods', to: 'd-linkedA', label: 'Socials' },
  { from: 'welcome-methods', to: 'd-pw', label: 'password' },
  { from: 'welcome-methods', to: 'd-emailotp', label: 'email OTP' },
  { from: 'welcome-methods', to: 'protect-exist', label: 'Not me', exit: 'bottom' },
  { from: 'd-linkedA', to: 'l-A', label: 'Yes' },
  { from: 'd-linkedA', to: 'd-existingacct', label: 'No' },
  { from: 'd-existingacct', to: 'be-linkedB', label: 'Yes (linked to B)' },
  { from: 'be-linkedB', to: 'l-B' },
  { from: 'd-existingacct', to: 'signup-e', label: 'No' },
  { from: 'signup-e', to: 'be-newacct' },
  { from: 'be-newacct', to: 'l-newacct' },
  { from: 'd-pw', to: 'l-pw' },
  { from: 'd-emailotp', to: 'l-emailotp' },

  /* Protect your account (existing account) */
  { from: 'protect-exist', to: 'd-selects', label: 'social' },
  { from: 'protect-exist', to: 'd-existingemail', label: 'email' },
  { from: 'd-selects', to: 'l-selA', label: 'Yes, same account A' },
  { from: 'd-selects', to: 'be-selB', label: 'Yes, different account B' },
  { from: 'be-selB', to: 'l-selB' },
  { from: 'd-selects', to: 'signup-sel', label: 'No' },
  { from: 'signup-sel', to: 'be-selNo' },
  { from: 'be-selNo', to: 'l-selNo' },
  { from: 'd-existingemail', to: 'validate-email', label: 'No' },
  { from: 'validate-email', to: 'd-verify-new' },
  { from: 'd-verify-new', to: 'signup-new' },
  { from: 'signup-new', to: 'be-new2' },
  { from: 'be-new2', to: 'l-new2' },
  { from: 'd-existingemail', to: 'd-verify-exist', label: 'Yes, no password' },
  { from: 'd-verify-exist', to: 'l-verify-exist' },
  { from: 'd-existingemail', to: 'welcome-right', label: 'Yes, has password' },
  { from: 'welcome-right', to: 'd-pw-r', label: 'password' },
  { from: 'welcome-right', to: 'd-emailotp-r', label: 'email OTP' },
  { from: 'welcome-right', to: 'l-social-r', label: 'social' },
  { from: 'd-pw-r', to: 'l-pw-r' },
  { from: 'd-emailotp-r', to: 'l-emailotp-r' },

  /* Social */
  { from: 'social-3p', to: 'd-newaccount' },
  { from: 'd-newaccount', to: 'l-social-exist', label: 'No' },
  { from: 'd-newaccount', to: 'signup-f', label: 'Yes' },
  { from: 'signup-f', to: 'l-social-new' },

  /* Email */
  { from: 'email-entry', to: 'd-emailexists2' },
  { from: 'd-emailexists2', to: 'verify-c', label: 'No' },
  { from: 'verify-c', to: 'signup-c' },
  { from: 'signup-c', to: 'l-c' },
  { from: 'd-emailexists2', to: 'd-haslogin', label: 'Yes, matches account A' },
  { from: 'd-haslogin', to: 'verify-d', label: 'No' },
  { from: 'verify-d', to: 'l-d' },
  { from: 'd-haslogin', to: 'welcome-otp', label: 'Yes' },
  { from: 'welcome-otp', to: 'verify-e', label: 'OTP' },
  { from: 'verify-e', to: 'd-known3' },
  { from: 'd-known3', to: 'l-e', label: 'Yes' },
  { from: 'd-known3', to: 'd-phone', label: 'No', enter: 'top' },
  { from: 'welcome-otp', to: 'verify-pw', label: 'Password' },
  { from: 'verify-pw', to: 'd-known2' },
  { from: 'd-known2', to: 'l-known2', label: 'Yes' },
  { from: 'd-known2', to: 'd-phone', label: 'No', bendX: 904 },
  { from: 'd-phone', to: 'l-phone', label: 'No' },
  { from: 'd-phone', to: 'send-auto', label: 'Yes' },
  { from: 'send-auto', to: 'input-auto' },
  { from: 'input-auto', to: 'l-auto' },
  { from: 'welcome-otp', to: 'd-emailmatch', label: 'Social' },
  { from: 'd-emailmatch', to: 'l-match', label: 'Yes' },
  { from: 'd-emailmatch', to: 'l-matchB', label: 'No, matches account B' },
  { from: 'd-emailmatch', to: 'signup-b', label: 'No, matches no Glovo account' },
  { from: 'signup-b', to: 'l-signupB' },
]
