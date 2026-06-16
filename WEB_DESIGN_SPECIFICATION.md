# iCOMPUTE Web App Design Specification
## Comprehensive Design Guide for Mobile/React Native Replication

---

## 1. COMPONENT STYLING APPROACH

### Styling Framework
- **Primary Framework**: Tailwind CSS with custom configuration
- **Component Library**: Radix UI-based shadcn/ui components
- **Icon Library**: lucide-react (lightweight, consistent SVG icons)
- **Custom Utilities**: className utility function (`cn()`) for conditional styling

### Styling Patterns
```typescript
// Consistent pattern across all components:
// 1. Tailwind for layout and spacing
// 2. CSS variables (HSL-based) for colors
// 3. Rounded corners: rounded-xl (tertiary), rounded-2xl (cards), rounded-3xl (dialogs)
// 4. Borders: border-border with border-border/opacity for subtle dividers
// 5. Text sizing: xs (10px), sm (14px), base (16px), lg, xl (20px), 2xl (24px), 3xl (30px)
// 6. Font weights: light (300), normal (400), medium (500), semibold (600), bold (700)
```

### Common Spacing Pattern
- **Padding**: px-5 to px-7 for horizontal, pt-3/pb-4 for header sections
- **Gap spacing**: gap-2 (small), gap-3 (medium), gap-5 (large)
- **Margin top**: mt-3, mt-4, mt-5, mt-6, mt-8, mt-10
- **Height standardization**: h-9 (buttons), h-11, h-12 (input fields), h-14 (large buttons)

---

## 2. LAYOUT PATTERNS AND STRUCTURES

### Screen Layout Structure
All screens follow a consistent pattern:

```typescript
// Universal screen wrapper
<div className="h-full overflow-y-auto no-scrollbar pb-24 bg-background">
  {/* Header section */}
  <header className="px-5 pt-3 pb-3 flex items-center justify-between">
    {/* Navigation/title */}
  </header>

  {/* Main content area */}
  <div className="px-5">
    {/* Content sections */}
  </div>

  {/* Floating action button (common pattern) */}
  <button className="absolute bottom-20 right-5">
    <Plus className="h-6 w-6" />
  </button>
</div>
```

### Home Screen Layout
1. **Header**: Welcome message + eye icon (hide/show balance toggle)
2. **Balance Card**: Gradient card with available balance, income/expense cards
3. **Category Breakdown**: 3-column grid with circular progress charts
4. **Recent Transactions**: List with category icons, amounts, and descriptions
5. **FAB (Floating Action Button)**: Plus icon at bottom-right for adding transactions

### Expenses Screen Layout
1. **Header**: Back button + title + transaction count + total expense
2. **Search & Filter**: Search input + filter button with dropdown
3. **Grouped Transactions**: Transactions grouped by date with day labels
4. **Transaction Items**: Category icon + description + amount + delete button
5. **Empty State**: Centered message when no transactions

### Insight Screen Layout
1. **Header**: Back button + title + statistics label
2. **Time Range Selector**: 4-button toggle (Daily/Weekly/Monthly/Yearly)
3. **Summary Stats**: Total expense card + avg stat cards
4. **Chart Section**: SVG line chart with gradient fill
5. **Category Breakdown**: List with icons, amounts, and progress bars
6. **Prediction Card**: Forecasted spending based on 6-month trend

### Profile Screen Layout
1. **Header**: Back button + title + theme selector + dark/light toggle
2. **User Card**: Avatar + editable name fields
3. **Balance Section**: 4 balance cards (Bank, Cash, Credit, Debit)
4. **Budget Section**: Monthly budget input
5. **Logout Button**: Red destructive button at bottom

### Auth Flow Layout
- **GetStarted**: Logo in gradient card + hero gradient background
- **Login/SignUp**: Centered form with hero gradient, field components
- **PinScreen**: Large PIN display + numeric keypad grid
- **LoginSuccess**: Success animation with confetti + checkmark icon

---

## 3. TYPOGRAPHY AND TEXT STYLING

### Font Hierarchy
```typescript
// Page titles/headings
<h1 className="text-3xl font-bold">      // GetStarted, large screens
<h1 className="text-2xl font-bold">      // Home dashboard
<h1 className="text-xl font-bold">       // Section headers (Expenses, Profile)

// Secondary headings
<h2 className="text-sm font-semibold">   // Section titles

// Body text
<p className="text-sm font-medium">      // Transaction descriptions
<p className="text-xs">                   // Field labels, muted text
<p className="text-[11px]">               // Sub-labels, very small

// Special typography
<span className="text-[10px]">           // Smallest labels
<span className="text-2xl font-light">   // Large amounts (₱###.##)
<span className="text-3xl font-bold">    // Primary amounts (balance)
```

### Text Color Usage
- **Primary content**: `text-foreground` (dark in light mode, light in dark mode)
- **Secondary content**: `text-muted-foreground` (35% opacity in light, 72% in dark)
- **Accent text**: `text-primary` (green/blue/pink based on theme)
- **Destructive text**: `text-destructive` (red for delete, negative amounts)
- **Success text**: `text-primary` (income amounts, positive actions)

### Letter Spacing
- `tracking-wider`: Used on button labels (uppercase)
- `tracking-[0.2em]`: Used on section labels (uppercase)

---

## 4. COLOR SCHEME AND THEME

### Primary Color System (HSL-based)
```
Light Theme (Default):
├─ Background: 150 15% 96% (off-white with green tint)
├─ Foreground: 150 15% 16% (dark green-tinted text)
├─ Card: 150 25% 98% (slightly more saturated white)
├─ Primary: 140 75% 45% (vibrant green)
├─ Primary-foreground: 150 60% 6% (very dark for text on primary)
├─ Secondary: 150 45% 94% (subtle green background)
├─ Muted: 150 20% 92% (light gray with green tint)
├─ Muted-foreground: 150 15% 35% (medium gray)
└─ Border: 150 20% 88% (light gray borders)

Dark Theme:
├─ Background: 150 40% 8% (very dark with green tint)
├─ Foreground: 145 20% 96% (off-white text)
├─ Card: 150 35% 10% (dark card background)
├─ Primary: 140 75% 45% (same vibrant green)
├─ Secondary: 150 35% 12% (dark gray-green)
├─ Muted-foreground: 145 20% 72% (light gray)
└─ Border: 150 35% 16% (dark gray borders)

Accent Colors (for categories):
├─ Orange (Food): 0 75% 55% / text-orange-300, bg-orange-500/15
├─ Sky (Transport): 200 75% 50% / text-sky-300, bg-sky-500/15
├─ Pink (Shopping): 330 75% 60% / text-pink-300, bg-pink-500/15
├─ Violet (Entertainment): 270 70% 50% / text-violet-300, bg-violet-500/15
├─ Yellow (Bills): 45 75% 55% / text-yellow-300, bg-yellow-500/15
├─ Rose (Healthcare): 0 85% 60% / text-rose-300, bg-rose-500/15
├─ Blue (Education): 220 90% 55% / text-blue-300, bg-blue-500/15
└─ Emerald (Others/Salary): 160 85% 55% / text-emerald-300, bg-emerald-500/15

Destructive/Warning:
├─ Destructive: 0 75% 55% (red)
├─ Warning: 38 95% 55% (amber)
└─ Info: 200 90% 55% (cyan)
```

### Theme Switching
- **Themes Available**: Light (default), Dark
- **Color Themes Available**: Green (default), Blue, Pink
- **Storage**: Persisted in localStorage
- **Implementation**: Via `next-themes` hook + custom CSS data-attribute (`data-color="green"`)

### Gradient Definitions
```css
--gradient-hero: linear-gradient(165deg, hsl(150 30% 90%) 0%, hsl(150 30% 92%) 50%, hsl(150 25% 96%) 100%);
--gradient-card: linear-gradient(155deg, hsl(150 25% 90%) 0%, hsl(150 25% 96%) 100%);
--gradient-primary: linear-gradient(135deg, hsl(140 75% 40%), hsl(140 90% 55%));
--gradient-radial: radial-gradient(circle at 50% 0%, hsl(140 70% 25% / 0.4), transparent 70%);
```

### Shadow Definitions
```css
--shadow-glow: 0 10px 40px -10px hsl(140 90% 50% / 0.15);  // Soft green glow
--shadow-card: 0 8px 30px -10px hsl(150 20% 50% / 0.08);   // Subtle card shadow
--shadow-inset: inset 0 1px 0 0 hsl(140 60% 50% / 0.08);   // Inset divider
```

---

## 5. ICON LIBRARY

### Lucide-react Icons Used
```typescript
// Navigation & UI
- ArrowLeft: Back navigation
- ArrowRight, ChevronRight: Forward navigation
- Plus: Add/create actions
- X: Close dialogs
- Search: Search functionality
- Eye, EyeOff: Show/hide toggles

// Financial
- ArrowDown: Income indicator
- ArrowUp: Expense indicator
- Wallet, Landmark, CreditCard: Account types
- TrendingUp, TrendingDown: Trend indicators (implicit)

// Category Icons
- UtensilsCrossed: Food & Dining
- Car: Transportation
- ShoppingBag: Shopping
- Film: Entertainment
- Receipt: Bills & Utilities
- HeartPulse: Healthcare
- GraduationCap: Education
- Sparkles: Others
- Gift: Gifts/Income
- Wallet: Salary/Income

// Settings & Actions
- Edit3: Edit/pencil
- Save: Save action
- Delete, Trash2: Delete action
- SlidersHorizontal: Filters
- Palette: Theme/color selection
- Sun, Moon: Light/dark theme toggle
- Lock, Mail, User: Auth fields
- Check: Checkmark/confirmation
- LogOut: Logout action

// Stats & Display
- Calendar: Date selection (implicit)
```

### Icon Sizing Pattern
```typescript
// Small icons (inline/adjacent text)
className="h-3 w-3"  // 12px

// Medium icons (next to text, labels)
className="h-4 w-4"  // 16px

// Standard icons (buttons, cards)
className="h-5 w-5"  // 20px

// Large icons (emphasis, featured)
className="h-6 w-6"  // 24px

// Extra large icons (primary focus)
className="h-12 w-12" // 48px
```

---

## 6. KEY UI ELEMENTS AND PATTERNS

### Input Fields
```typescript
// Standard text input with icon
<div className="mt-1.5 flex items-center gap-2 rounded-xl bg-input/60 border border-border px-4 h-12">
  <Icon className="h-4 w-4 text-muted-foreground" />
  <Input 
    className="border-0 bg-transparent focus-visible:ring-0 px-0 h-9"
    placeholder="..."
  />
</div>

// Amount input (special case)
<div className="flex items-baseline gap-1">
  <span className="text-2xl font-light text-muted-foreground">₱</span>
  <Input 
    className="border-0 bg-transparent focus-visible:ring-0 px-0 h-12 text-3xl font-semibold"
    inputMode="decimal"
  />
</div>
```

### Buttons
```typescript
// Primary button
<Button className="h-12/14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow">
  Action Text
</Button>

// Secondary button
<Button variant="secondary" className="h-12/14 rounded-2xl">
  Secondary Action
</Button>

// Icon button
<button className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center">
  <Icon className="h-4 w-4" />
</button>

// Floating action button
<button className="absolute bottom-20 right-5 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-glow flex items-center justify-center hover:scale-105">
  <Plus className="h-6 w-6" />
</button>
```

### Cards
```typescript
// Standard card
<div className="rounded-2xl bg-card border border-border p-3/4">
  {content}
</div>

// Gradient card (balance, featured)
<div className="rounded-3xl p-5 bg-gradient-card border border-primary/20 shadow-card relative overflow-hidden">
  <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
  {content}
</div>

// Stat card (Insight page)
<div className="rounded-2xl border p-3" 
  className={accent ? "border-primary/40 bg-primary/10" : "border-border bg-card"}>
  <p className="text-[10px] text-muted-foreground">{label}</p>
  <p className="text-sm font-semibold mt-0.5">{value}</p>
</div>
```

### Category Selection
```typescript
// Category pill (grid display)
<button className="aspect-square rounded-2xl bg-input border border-border flex flex-col items-center justify-center gap-2 hover:border-primary/60">
  <span className={cn("h-12 w-12 rounded-xl flex items-center justify-center", category.bg)}>
    <CategoryIcon className={cn("h-6 w-6", category.tone)} />
  </span>
  <span className="text-xs font-medium">{category.label}</span>
</button>
```

### Toggle/Radio Buttons
```typescript
// Binary toggle (Expense/Income)
<div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-input">
  {["expense", "income"].map((k) => (
    <button
      className={cn(
        "h-10 rounded-lg text-xs font-bold uppercase tracking-wider transition-smooth",
        kind === k ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
      )}
    >
      {k}
    </button>
  ))}
</div>

// Multi-option toggle (Daily/Weekly/Monthly/Yearly)
<div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-input">
  {["Daily", "Weekly", "Monthly", "Yearly"].map((r) => (
    <button
      className={cn(
        "h-9 rounded-lg text-xs font-semibold transition-smooth",
        range === r ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
      )}
    >
      {r}
    </button>
  ))}
</div>
```

### Dialogs/Modals
```typescript
// Transaction dialog
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="p-0 gap-0 max-w-[390px] w-[calc(100%-2rem)] rounded-3xl bg-card border-border overflow-hidden">
    <DialogHeader className="px-6 pt-5 pb-3 flex-row items-center justify-between space-y-0 border-b border-border/60">
      <DialogTitle className="text-base">Add Transaction</DialogTitle>
    </DialogHeader>
    <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto no-scrollbar">
      {/* Form fields */}
    </div>
  </DialogContent>
</Dialog>
```

### List Items
```typescript
// Transaction item
<li className="flex items-center gap-3 rounded-2xl bg-card border border-border px-3 py-2.5">
  <span className={cn("h-10 w-10 rounded-xl flex items-center justify-center", category.bg)}>
    <CategoryIcon className={cn("h-5 w-5", category.tone)} />
  </span>
  <div className="flex-1 min-w-0">
    <p className="text-sm font-medium truncate">{description}</p>
    <p className="text-[11px] text-muted-foreground">{category.label}</p>
  </div>
  <p className={cn("text-sm font-semibold", isIncome ? "text-primary" : "text-foreground")}>
    {isIncome ? "+" : "-"}{formatPeso(amount)}
  </p>
</li>
```

### Charts
```typescript
// SVG Line chart (Insight page)
<svg viewBox={`0 0 ${W} ${H}`} className="w-full h-36">
  <defs>
    <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
    </linearGradient>
  </defs>
  {/* Grid lines */}
  <path d={area} fill="url(#g)" />  {/* Gradient fill */}
  <path d={path} className="stroke-primary" />  {/* Line */}
</svg>

// Progress bars (category breakdown)
<div className="h-1.5 rounded-full bg-muted overflow-hidden">
  <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
</div>

// Circular progress chart (Home - expense by category)
<svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
  <circle cx="18" cy="18" r="15" className="stroke-muted fill-none" strokeWidth="3" />
  <circle 
    cx="18" cy="18" r="15" 
    className="fill-none" 
    strokeWidth="3" 
    strokeDasharray={`${pct} 100`} 
    pathLength={100} 
  />
</svg>
```

### Dropdowns/Popovers
```typescript
// Filter dropdown (Expenses page)
{filterDropdownOpen && (
  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-card z-50">
    <div className="p-3 border-b border-border">
      <p className="text-xs font-semibold text-muted-foreground">Categories</p>
    </div>
    <div className="max-h-72 overflow-y-auto">
      {/* Checkbox items */}
    </div>
  </div>
)}
```

### Headers/Navigation
```typescript
// Standard header with back button
<header className="px-5 pt-3 pb-3 flex items-center gap-3">
  <button className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center">
    <ArrowLeft className="h-4 w-4" />
  </button>
  <div className="flex-1">
    <h1 className="text-xl font-bold">Title</h1>
    <p className="text-[11px] text-muted-foreground">Subtitle</p>
  </div>
  {/* Optional action buttons */}
</header>
```

---

## 7. STATE MANAGEMENT HOOKS

### Primary State Context: `useApp()`
```typescript
interface AppCtx {
  // Navigation
  stage: "onboarding" | "getStarted" | "login" | "signup" | "createPin" | "enterPin" | "loginSuccess" | "app"
  setStage: (s: Stage) => void
  
  // Tab navigation (within app)
  tab: "home" | "expenses" | "insight" | "profile"
  setTab: (t: Tab) => void
  
  // User data
  user: UserProfile
  setUser: (u: Partial<UserProfile>) => void
  
  // Authentication
  login: (email: string, password: string) => Promise<UserProfile>
  signup: (payload: {...}) => Promise<void>
  
  // PIN security
  pin: string | null
  setPin: (p: string) => Promise<void>
  verifyPin: (pinValue: string) => Promise<boolean>
  
  // Transactions
  transactions: Transaction[]
  addTransaction: (t: Omit<Transaction, "id">) => void
  
  // Financial data
  balance: number  // computed from user accounts
  totals: { income: number; expense: number }  // computed from transactions
  
  // Theme
  colorTheme: "green" | "blue" | "pink"
  setColorTheme: (c: ColorTheme) => void
}
```

### Secondary Hooks
```typescript
// Dark/Light theme
import { useTheme } from "next-themes"
const { theme, setTheme } = useTheme()  // "light" | "dark"

// Toast notifications
import { toast } from "@/hooks/use-toast"
toast({ title: "Success", description: "Message" })

// Mobile detection
import { useIsMobile } from "@/hooks/use-mobile"
const isMobile = useIsMobile()
```

### Local State Patterns (per component)
```typescript
// Toggle states
const [hide, setHide] = useState(false)  // Hide balance
const [open, setOpen] = useState(false)  // Dialog open
const [editing, setEditing] = useState(false)  // Edit mode

// Form data
const [amount, setAmount] = useState("")
const [category, setCategory] = useState<CategoryKey | null>(null)
const [selectedCategories, setSelectedCategories] = useState<Set<CategoryKey>>(new Set())

// Derived/computed state
const filtered = useMemo(() => {
  // Filter and transform transactions
}, [transactions, q, selectedCategories])

const grouped = useMemo(() => {
  // Group transactions by date
}, [filtered])
```

### Persistence Patterns
```typescript
// localStorage keys
const KEEP_SIGNED_IN_KEY = "icompute_last_signed_in_email"
const COLOR_THEME_KEY = "icompute_color_theme"
const PIN_FAILURE_KEY = "icompute_pin_failures"

// Stored in localStorage:
window.localStorage.setItem(key, value)
window.localStorage.getItem(key)
window.localStorage.removeItem(key)
```

---

## 8. NAVIGATION PATTERNS

### Global Navigation Flow
```
Onboarding (2.2s auto-advance)
  ↓
GetStarted (landing screen)
  ├→ Login Screen
  │   ├→ PIN Entry (verify existing PIN)
  │   ├→ LoginSuccess (3.5s auto-advance)
  │   └→ App (main navigation)
  │
  ├→ Signup Screen (multi-step)
  │   ├→ Email step
  │   ├→ Info step (name, password)
  │   └→ Redirect to Login
  │
  └→ Password Reset Flow
      ├→ Forgot request
      ├→ Reset password form
      └→ Back to Login
```

### Tab-based Navigation (within App)
```typescript
// Accessible via bottom navigation or setTab()
const tabs: Tab[] = ["home", "expenses", "insight", "profile"]

// Navigation implementation
<button onClick={() => setTab("home")}>Home</button>
<button onClick={() => setTab("expenses")}>Expenses</button>
<button onClick={() => setTab("insight")}>Insight</button>
<button onClick={() => setTab("profile")}>Profile</button>
```

### Header Navigation Patterns
```typescript
// Back button pattern
<button onClick={() => setTab("home")}>
  <ArrowLeft className="h-4 w-4" />
</button>

// Breadcrumb pattern (via tab switching)
Expenses → (back) → Home

// Modal dialogs
AddTransaction overlays current screen
Category picker overlays AddTransaction
Theme dropdown overlays Profile
Filter dropdown overlays Expenses
```

### Modal/Dialog Navigation
```typescript
// All modals are layer-based with z-index management
<Dialog open={open} onOpenChange={onOpenChange}>
  {/* Dialog content */}
  {/* Can have nested dialogs */}
  <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
    {/* Nested dialog content */}
  </Dialog>
</Dialog>
```

### Transaction Flow Navigation
```
AddTransaction Modal
├─ Select kind (expense/income)
├─ Enter amount
├─ Select category (opens Category Picker)
│  └─ Category Picker Modal
│     └─ Select and close
├─ Enter description
├─ Select date
└─ Save or Cancel

After save:
├─ Toast notification
├─ Dialog closes
└─ Transaction added to list
```

### Authentication Flow Navigation
```
GetStarted
├─ → Signup (if new user)
│   ├─ Step 1: Enter email
│   ├─ Step 2: Enter details + password
│   └─ → Login screen
│
└─ → Login (if returning user)
    ├─ Standard login form
    ├─ Forgot password flow (optional)
    ├─ → PIN creation (if new account)
    │   ├─ Create PIN (4 digits)
    │   ├─ Confirm PIN
    │   └─ → LoginSuccess (3.5s auto-advance) → App
    │
    └─ → PIN verification (if existing account)
        ├─ Enter saved PIN
        ├─ On success: LoginSuccess → App
        └─ On 5 failures: Force app exit
```

---

## 9. RESPONSIVE DESIGN NOTES

### Breakpoints Used
- **Max-width constraint**: `max-w-[390px]` for dialogs (mobile-first)
- **Grid layouts**: 
  - `grid-cols-2` (transactions, categories)
  - `grid-cols-3` (expense charts)
  - `grid-cols-4` (time range selector)
  - `md:grid-cols-2` (responsive on desktop - Profile)
- **Overflow handling**: `overflow-y-auto no-scrollbar` (custom scrollbar hiding)

### Mobile-First Approach
- All screens optimized for mobile viewport first
- Web app appears to target mobile screen sizes
- Desktop layouts use media queries for 2-column layouts (Profile editing)

---

## 10. ANIMATIONS AND INTERACTIONS

### Animation Classes Used
```css
/* Fade-in animation */
animate-fade-in

/* Scale animation */
animate-scale-in

/* Pulse/glow animation */
animate-pulse-glow

/* Hover effects */
hover:scale-105  /* FAB button */
hover:text-primary
hover:bg-primary/5
hover:border-primary/60

/* Transition */
transition-smooth  /* Defined as: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) */
```

### Interaction Patterns
- **Buttons**: Scale on hover, smooth transitions
- **Form inputs**: Transparent background with focus ring disabled
- **Icons**: Smooth color transitions, smooth rotation
- **Toggle buttons**: Instant background swap with shadow glow effect
- **Cards**: Subtle border color change on category filter hover

---

## 11. DATA TYPES AND STRUCTURES

### Core Data Types
```typescript
// Transaction
interface Transaction {
  id: string
  kind: "income" | "expense"
  amount: number
  category: CategoryKey
  description: string
  date: string  // ISO format: "2024-01-15T10:30:00.000Z"
}

// User Profile
interface UserProfile {
  email: string
  firstName?: string
  lastName?: string
  monthlyBudget: number
  bankBalance?: number
  cashOnHand?: number
  creditCardBalance?: number
  debitCardBalance?: number
  pin?: string
}

// Category
interface CategoryMeta {
  key: CategoryKey
  label: string
  icon: LucideIcon
  tone: string  // Tailwind text color class
  bg: string    // Tailwind bg color class
}
```

### Category Keys and Metadata
```
Expense Categories:
├─ food: "Food & Dining" (UtensilsCrossed, orange)
├─ transport: "Transportation" (Car, sky)
├─ shopping: "Shopping" (ShoppingBag, pink)
├─ entertainment: "Entertainment" (Film, violet)
├─ bills: "Bills & Utilities" (Receipt, yellow)
├─ healthcare: "Healthcare" (HeartPulse, rose)
├─ education: "Education" (GraduationCap, blue)
└─ others: "Others" (Sparkles, emerald)

Income Categories:
├─ salary: "Salary" (Wallet, emerald)
├─ gift: "Gift" (Gift, fuchsia)
└─ others: "Others" (Sparkles, emerald)
```

---

## 12. FORMATTING AND LOCALIZATION

### Currency Formatting
```typescript
// Philippine Peso formatting
const formatPeso = (n: number) =>
  "₱" + new Intl.NumberFormat("en-PH", { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(n)
// Result: ₱1,234.56

// Compact format (no decimals)
const formatPesoCompact = (n: number) =>
  "₱" + new Intl.NumberFormat("en-PH", { 
    maximumFractionDigits: 0 
  }).format(n)
// Result: ₱1,235
```

### Date Formatting
```typescript
// Full date: "Monday, January 15"
new Date(iso).toLocaleDateString("en-US", { 
  weekday: "long", 
  month: "long", 
  day: "numeric" 
})

// Short date: "Jan 15"
new Date(iso).toLocaleDateString("en-US", { 
  month: "short", 
  day: "numeric" 
})

// Time range display: "Daily" → "2h", "Weekly" → "Mon", "Monthly" → "Jan 15", "Yearly" → "Jan"
```

---

## 13. KEY IMPLEMENTATION NOTES FOR REACT NATIVE

### Direct Transitions Needed
1. **Tailwind → React Native Styles**
   - Use StyleSheet for all styling
   - Convert Tailwind classes to explicit styles
   - Use react-native-linear-gradient for gradients

2. **Icons**
   - Keep lucide-react but add react-native-svg fallback
   - Or use react-native-heroicons (better for React Native)

3. **Dialogs/Modals**
   - Replace shadcn/ui Dialog with React Native Modal or react-native-dialog

4. **Forms & Inputs**
   - Replace shadcn/ui Input with React Native TextInput
   - Custom styling for focus states

5. **Charts**
   - SVG charts require react-native-svg
   - Consider library like react-native-chart-kit for SVG charts

6. **State Management**
   - Keep useContext pattern (works in React Native)
   - Consider Zustand or Redux for larger scaling

7. **Navigation**
   - Replace tab switching with React Navigation
   - Use stack navigators for screen flow
   - Use bottom tab navigator for app tabs

8. **Scrolling**
   - Replace overflow-y-auto with ScrollView
   - Use FlatList for transaction lists

9. **Animations**
   - Use React Native Animated or Reanimated
   - Convert CSS animations to JS animations

10. **Theme System**
    - Keep HSL color variables
    - Use react-native-appearance + custom hook for theme switching
    - Store theme in AsyncStorage instead of localStorage

11. **Storage**
    - Replace localStorage with AsyncStorage
    - Same persistence patterns (theme, email, PIN failures)

---

## 14. COLOR THEME VARIABLE MAPPING

### How to Apply Themes in React Native
```typescript
// Define theme colors object
const themes = {
  light: {
    primary: '#56d15f',      // hsl(140 75% 45%)
    background: '#f5f5ed',   // hsl(150 15% 96%)
    foreground: '#2d4d2d',   // hsl(150 15% 16%)
    card: '#fafaf8',         // hsl(150 25% 98%)
    border: '#e8e8e0',       // hsl(150 20% 88%)
    input: '#f0f0e8',        // hsl(150 20% 96%)
    destructive: '#ee3d3d',  // hsl(0 75% 55%)
  },
  dark: {
    primary: '#56d15f',
    background: '#141414',
    foreground: '#f5f5ed',
    card: '#1f201f',
    border: '#2d342d',
    input: '#1f201f',
    destructive: '#ee3d3d',
  }
}

// Category colors remain consistent
const categoryColors = {
  food: { tint: '#ff8a5a', background: 'rgba(255, 138, 90, 0.15)' },
  transport: { tint: '#7dd3fc', background: 'rgba(125, 211, 252, 0.15)' },
  // ... etc
}
```

---

## 15. COMPONENT INVENTORY

### Screens (11 total)
1. Onboarding (auto-advance 2.2s)
2. GetStarted
3. Login (with 3 sub-modes: login, forgotRequest, resetPassword)
4. SignUp (2-step: email, info)
5. PinScreen (create/enter modes)
6. LoginSuccess (auto-advance 3.5s)
7. Home
8. Expenses
9. Insight
10. Profile
11. Modals: AddTransaction, CategoryPicker, Filter Dropdown, Color Theme Dropdown, Dark/Light Toggle

### Reusable Components
- Button (primary, secondary variants)
- Input (text, password, number with custom styling)
- Dialog (generic modal container)
- Label
- Checkbox
- Textarea
- Card (implicit in patterns)
- Header (implicit pattern)

### Utilities
- `cn()`: classname utility
- `formatPeso()`, `formatPesoCompact()`: Currency formatting
- `formatDay()`, `formatShortDate()`: Date formatting
- Toast notifications

---

## SUMMARY

This iCOMPUTE web app follows a **modern, cohesive design system** based on:
- **Tailwind CSS** for rapid, consistent styling
- **Lucide-react** for lightweight iconography
- **HSL color variables** for theme flexibility (Green/Blue/Pink + Light/Dark)
- **Mobile-first responsive design** optimized for ~390px viewports
- **Context-based state management** (AppState)
- **Shadcn/ui components** for accessible, unstyled base components
- **Data-driven UI** with computed properties and efficient re-renders

The design prioritizes **clarity, usability, and visual hierarchy** while maintaining **performance and accessibility standards**. All components follow consistent spacing, typography, and color patterns that make replication to React Native straightforward by mapping Tailwind classes to React Native styles.

