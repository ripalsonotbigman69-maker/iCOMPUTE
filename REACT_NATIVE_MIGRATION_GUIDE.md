# React Native Implementation Guide
## Detailed Conversion from iCOMPUTE Web to Mobile App

---

## 1. STYLING ARCHITECTURE CONVERSION

### Web (Current)
```typescript
// Tailwind + CSS Variables (HSL)
<div className="rounded-2xl bg-card border border-border px-4 py-3">
  <p className="text-sm font-semibold">Content</p>
</div>
```

### React Native (Target)
```typescript
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '@react-navigation/native'

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
})

export function CardComponent() {
  const { colors } = useTheme()
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.text, { color: colors.foreground }]}>Content</Text>
    </View>
  )
}
```

### Color System Setup
```typescript
// Create a theme configuration file
// themes.ts
export const lightTheme = {
  primary: '#56d15f',           // hsl(140 75% 45%)
  primaryForeground: '#082404', // hsl(150 60% 6%)
  background: '#f5f5ed',        // hsl(150 15% 96%)
  foreground: '#2d4d2d',        // hsl(150 15% 16%)
  card: '#fafaf8',              // hsl(150 25% 98%)
  cardForeground: '#2d4d2d',
  secondary: '#f0f5ed',         // hsl(150 45% 94%)
  secondaryForeground: '#2d4d2d',
  muted: '#e8e8e0',             // hsl(150 20% 92%)
  mutedForeground: '#5d6d5d',   // hsl(150 15% 35%)
  border: '#e0e0d8',            // hsl(150 20% 88%)
  input: '#edeae5',             // hsl(150 20% 96%)
  destructive: '#ee3d3d',       // hsl(0 75% 55%)
  destructiveForeground: '#faf8f6',
  warning: '#ff9f1c',           // hsl(38 95% 55%)
  info: '#1fb5ff',              // hsl(200 90% 55%)
}

export const darkTheme = {
  primary: '#56d15f',
  primaryForeground: '#082404',
  background: '#0f0f0f',        // hsl(150 40% 8%)
  foreground: '#f5f5ed',        // hsl(145 20% 96%)
  card: '#1a1a1a',              // hsl(150 35% 10%)
  cardForeground: '#f5f5ed',
  secondary: '#1f201f',         // hsl(150 35% 12%)
  secondaryForeground: '#f5f5ed',
  muted: '#2d342d',             // hsl(150 30% 14%)
  mutedForeground: '#c5c9c5',   // hsl(145 20% 72%)
  border: '#2d342d',            // hsl(150 35% 16%)
  input: '#1f201f',             // hsl(150 35% 12%)
  destructive: '#ee3d3d',
  destructiveForeground: '#faf8f6',
  warning: '#ff9f1c',
  info: '#1fb5ff',
}

// For theme variants (blue, pink)
export const blueTheme = { ...darkTheme, primary: '#3b82f6', /* ... */ }
export const pinkTheme = { ...darkTheme, primary: '#ec4899', /* ... */ }
```

### Use Theme Across App
```typescript
// In app navigation setup (RootNavigator.tsx)
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { useAppState } from './context/AppState'
import { lightTheme, darkTheme, blueTheme, pinkTheme } from './themes'

const navigationThemes = {
  light: { ...DefaultTheme, colors: { ...DefaultTheme.colors, ...lightTheme } },
  dark: { ...DarkTheme, colors: { ...DarkTheme.colors, ...darkTheme } },
  blue: { ...DarkTheme, colors: { ...DarkTheme.colors, ...blueTheme } },
  pink: { ...DarkTheme, colors: { ...DarkTheme.colors, ...pinkTheme } },
}

export function RootNavigator() {
  const { isDark, colorTheme } = useAppState()
  const themeKey = isDark ? colorTheme : 'light'
  const theme = navigationThemes[themeKey]

  return (
    <NavigationContainer theme={theme}>
      {/* Navigation structure */}
    </NavigationContainer>
  )
}
```

---

## 2. LAYOUT CONVERSION

### Screen Container
```typescript
// Web
<div className="h-full overflow-y-auto no-scrollbar pb-24 bg-background">
  {content}
</div>

// React Native
import { ScrollView, SafeAreaView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

<SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
  <ScrollView 
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 100 }}
  >
    {content}
  </ScrollView>
</SafeAreaView>
```

### Grid Layouts
```typescript
// Web: grid-cols-3 gap-3
<div className="grid grid-cols-3 gap-3">
  {items}
</div>

// React Native
<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
  {items.map((item, idx) => (
    <View key={idx} style={{ width: '33.333%', paddingHorizontal: 6 }}>
      {item}
    </View>
  ))}
</View>
```

### Flex Centering
```typescript
// Web: flex items-center justify-center
<div className="flex items-center justify-center">

// React Native
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
```

---

## 3. COMPONENTS CONVERSION

### Button Component
```typescript
// Web
import { Button } from '@/components/ui/button'

<Button 
  className="h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow"
  onClick={handleClick}
>
  Click me
</Button>

// React Native
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useTheme } from '@react-navigation/native'

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
    fontSize: 16,
  },
})

export function Button({ onPress, children, variant = 'primary', style }) {
  const { colors } = useTheme()
  
  const bgColors = {
    primary: colors.primary,
    secondary: colors.secondary,
    destructive: colors.destructive,
  }
  
  const textColors = {
    primary: colors.primaryForeground,
    secondary: colors.secondaryForeground,
    destructive: colors.destructiveForeground,
  }

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.button, 
        { backgroundColor: bgColors[variant] },
        style
      ]}
      activeOpacity={0.9}
    >
      <Text style={[styles.text, { color: textColors[variant] }]}>
        {children}
      </Text>
    </TouchableOpacity>
  )
}
```

### TextInput Component
```typescript
// Web
import { Input } from '@/components/ui/input'

<div className="flex items-center gap-2 rounded-xl bg-input border border-border px-4 h-12">
  <Icon className="h-4 w-4" />
  <Input placeholder="Enter text" />
</div>

// React Native
import { View, TextInput, StyleSheet } from 'react-native'
import { useTheme } from '@react-navigation/native'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 8,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
  },
})

export function TextInputField({ icon: Icon, placeholder, value, onChangeText }) {
  const { colors } = useTheme()

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: colors.input,
        borderColor: colors.border,
      }
    ]}>
      {Icon && <Icon size={16} color={colors.mutedForeground} />}
      <TextInput
        style={[styles.input, { color: colors.foreground }]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  )
}
```

### Card Component
```typescript
// Web
<div className="rounded-2xl bg-card border border-border p-4">
  {content}
</div>

// React Native
import { View, StyleSheet } from 'react-native'
import { useTheme } from '@react-navigation/native'

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
})

export function Card({ children, style }) {
  const { colors } = useTheme()

  return (
    <View style={[
      styles.card,
      {
        backgroundColor: colors.card,
        borderColor: colors.border,
      },
      style
    ]}>
      {children}
    </View>
  )
}
```

### Dialog/Modal
```typescript
// Web
import { Dialog, DialogContent } from '@/components/ui/dialog'

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="...">
    {form content}
  </DialogContent>
</Dialog>

// React Native
import { Modal, View, ScrollView, TouchableOpacity, Text } from 'react-native'
import { X } from 'lucide-react-native'

export function TransactionModal({ visible, onClose }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        {/* Semi-transparent backdrop */}
        <TouchableOpacity 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={onClose}
          activeOpacity={1}
        />
        
        {/* Modal content */}
        <View style={{
          backgroundColor: colors.card,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: '85%',
          paddingTop: 16,
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground }}>
                Add Transaction
              </Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground, marginTop: 4 }}>
                Record your income or expense
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          {/* Scrollable content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
          >
            {/* Form fields */}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}
```

### Icon Usage
```typescript
// Web
import { ChevronRight, Plus, ArrowLeft } from 'lucide-react'

<Plus className="h-6 w-6 text-primary" />

// React Native (Option 1: lucide-react-native)
import { ChevronRight, Plus, ArrowLeft } from 'lucide-react-native'
import { useTheme } from '@react-navigation/native'

const { colors } = useTheme()

<Plus size={24} color={colors.primary} />

// React Native (Option 2: react-native-heroicons - more optimized)
import { PlusIcon, ArrowLeftIcon } from 'react-native-heroicons/solid'

<PlusIcon size={24} color={colors.primary} />
```

---

## 4. NAVIGATION STRUCTURE

### Web (Tab-based)
```typescript
const [tab, setTab] = useState<'home' | 'expenses' | 'insight' | 'profile'>('home')

{tab === 'home' && <Home />}
{tab === 'expenses' && <Expenses />}
{tab === 'insight' && <Insight />}
{tab === 'profile' && <Profile />}
```

### React Native (Stack + Tab Navigation)
```typescript
// RootNavigator.tsx
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="GetStarted" component={GetStartedScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="PinScreen" component={PinScreenScreen} />
      <Stack.Screen name="LoginSuccess" component={LoginSuccessScreen} />
    </Stack.Navigator>
  )
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <HomeIcon color={color} size={24} />,
        }}
      />
      <Tab.Screen 
        name="Expenses" 
        component={ExpensesScreen}
        options={{
          tabBarIcon: ({ color }) => <WalletIcon color={color} size={24} />,
        }}
      />
      <Tab.Screen 
        name="Insight" 
        component={InsightScreen}
        options={{
          tabBarIcon: ({ color }) => <PieChartIcon color={color} size={24} />,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <UserIcon color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  )
}

export function RootNavigator() {
  const { stage } = useAppState()
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {stage.includes('auth') || stage === 'onboarding' ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <Stack.Screen name="App" component={AppTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
```

---

## 5. STATE MANAGEMENT CONVERSION

### Keep AppState Pattern (Works in React Native)
```typescript
// state/AppState.tsx (same structure, works for both)
import { createContext, useContext, useState, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const AppProvider = ({ children }) => {
  const [stage, setStage] = useState<Stage>('onboarding')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('green')

  const setColorTheme = useCallback((color: ColorTheme) => {
    setColorThemeState(color)
    // Replace localStorage with AsyncStorage
    AsyncStorage.setItem('icompute_color_theme', color)
  }, [])

  return (
    <AppContext.Provider value={{
      stage, setStage,
      transactions, addTransaction,
      colorTheme, setColorTheme,
      // ... other values
    }}>
      {children}
    </AppContext.Provider>
  )
}
```

### Replace localStorage with AsyncStorage
```typescript
// Old (Web)
window.localStorage.setItem(key, value)
window.localStorage.getItem(key)

// New (React Native)
import AsyncStorage from '@react-native-async-storage/async-storage'

await AsyncStorage.setItem(key, value)
const value = await AsyncStorage.getItem(key)
await AsyncStorage.removeItem(key)
```

---

## 6. LIST RENDERING CONVERSION

### Transaction List
```typescript
// Web (with grouping)
const grouped = useMemo(() => {
  const map = new Map()
  filtered.forEach((t) => {
    const key = t.date.slice(0, 10)
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(t)
  })
  return Array.from(map.entries()).sort(([a], [b]) => (a > b ? -1 : 1))
}, [filtered])

{grouped.map(([day, items]) => (
  <div key={day}>
    <p className="text-xs text-muted-foreground mb-2">{formatDay(day)}</p>
    <ul className="space-y-2">
      {items.map((t) => <TransactionItem key={t.id} transaction={t} />)}
    </ul>
  </div>
))}

// React Native (using SectionList)
import { SectionList, View, Text } from 'react-native'

const sections = grouped.map(([day, items]) => ({
  title: formatDay(day),
  data: items,
}))

<SectionList
  sections={sections}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <TransactionItem transaction={item} />}
  renderSectionHeader={({ section: { title } }) => (
    <Text style={{ fontSize: 12, color: colors.mutedForeground, marginBottom: 8 }}>
      {title}
    </Text>
  )}
  ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
  showsVerticalScrollIndicator={false}
/>
```

### Category Grid
```typescript
// Web
<div className="grid grid-cols-2 gap-3">
  {list.map((k) => <CategoryPill key={k} category={CATEGORIES[k]} />)}
</div>

// React Native
import { FlatList, View } from 'react-native'

<FlatList
  data={list}
  renderItem={({ item }) => (
    <View style={{ width: '50%', paddingHorizontal: 6 }}>
      <CategoryPill category={CATEGORIES[item]} />
    </View>
  )}
  numColumns={2}
  keyExtractor={(item) => item}
  scrollEnabled={false}
  columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
/>
```

---

## 7. FORM HANDLING CONVERSION

### Login Form
```typescript
// Web
<Field label="Email or Phone Number">
  <Mail className="h-4 w-4 text-muted-foreground" />
  <Input 
    value={email} 
    onChange={(e) => setEmail(e.target.value)} 
    placeholder="Enter your email"
  />
</Field>

// React Native
import { View, TextInput, Text } from 'react-native'
import { Mail } from 'lucide-react-native'

<View style={{ marginBottom: 16 }}>
  <Text style={{ fontSize: 12, color: colors.mutedForeground, marginBottom: 6 }}>
    Email or Phone Number
  </Text>
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    gap: 8,
  }}>
    <Mail size={16} color={colors.mutedForeground} />
    <TextInput
      style={{ flex: 1, fontSize: 16, color: colors.foreground }}
      placeholder="Enter your email"
      placeholderTextColor={colors.mutedForeground}
      value={email}
      onChangeText={setEmail}
    />
  </View>
</View>
```

---

## 8. CHART CONVERSION

### Line Chart (Insight)
```typescript
// Web (SVG)
<svg viewBox={`0 0 ${W} ${H}`} className="w-full h-36">
  <defs>
    <linearGradient id="g">
      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
    </linearGradient>
  </defs>
  <path d={area} fill="url(#g)" />
  <path d={path} className="stroke-primary" strokeWidth="2" />
</svg>

// React Native (using react-native-svg)
import { LineChart } from 'react-native-chart-kit'
import { Dimensions } from 'react-native'

const screenWidth = Dimensions.get('window').width

<LineChart
  data={{
    labels: points.map(p => p.label),
    datasets: [{
      data: points.map(p => p.value),
    }],
  }}
  width={screenWidth - 40}
  height={200}
  chartConfig={{
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    color: () => colors.primary,
    fillShadowGradient: colors.primary,
    fillShadowGradientOpacity: 0.4,
    labelColor: () => colors.mutedForeground,
  }}
/>
```

### Progress Bar
```typescript
// Web
<div className="h-1.5 rounded-full bg-muted overflow-hidden">
  <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
</div>

// React Native
import { View } from 'react-native'

<View style={{
  height: 6,
  borderRadius: 3,
  backgroundColor: colors.muted,
  overflow: 'hidden',
}}>
  <View style={{
    height: '100%',
    backgroundColor: colors.primary,
    width: `${pct}%`,
    borderRadius: 3,
  }} />
</View>
```

---

## 9. GESTURE HANDLING

### Button Press
```typescript
// Web
<button onClick={handleClick}>Click</button>

// React Native
import { TouchableOpacity } from 'react-native'

<TouchableOpacity onPress={handleClick} activeOpacity={0.9}>
  {children}
</TouchableOpacity>
```

### Long Press / Swipe
```typescript
import { 
  GestureHandlerRootView, 
  Swipeable,
  LongPressGestureHandler 
} from 'react-native-gesture-handler'

// Swipe to delete transaction
<Swipeable
  renderRightActions={() => <DeleteAction />}
>
  <TransactionItem />
</Swipeable>
```

---

## 10. ANIMATIONS CONVERSION

### Scale Animation (FAB)
```typescript
// Web (CSS)
hover:scale-105 transition-smooth

// React Native (Animated)
import { Animated, TouchableOpacity } from 'react-native'

const scaleAnim = useRef(new Animated.Value(1)).current

const onPressIn = () => {
  Animated.spring(scaleAnim, {
    toValue: 0.95,
    useNativeDriver: true,
  }).start()
}

const onPressOut = () => {
  Animated.spring(scaleAnim, {
    toValue: 1,
    useNativeDriver: true,
  }).start()
}

<Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
  <TouchableOpacity 
    onPressIn={onPressIn}
    onPressOut={onPressOut}
    onPress={handlePress}
  >
    {children}
  </TouchableOpacity>
</Animated.View>
```

### Fade In Animation
```typescript
// React Native (Animated)
import { Animated } from 'react-native'

const fadeAnim = useRef(new Animated.Value(0)).current

useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 500,
    useNativeDriver: true,
  }).start()
}, [])

<Animated.View style={{ opacity: fadeAnim }}>
  {children}
</Animated.View>
```

### Reanimated (Better for complex animations)
```typescript
import Animated, { 
  useAnimatedStyle, 
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

const scale = useSharedValue(1)

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}))

const onPress = () => {
  scale.value = withSpring(1.1)
}

<Animated.View style={animatedStyle}>
  <TouchableOpacity onPress={onPress}>
    {children}
  </TouchableOpacity>
</Animated.View>
```

---

## 11. SAFE AREA & NOTCH HANDLING

```typescript
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Automatic padding
<SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
  {children}
</SafeAreaView>

// Manual spacing for custom layouts
const insets = useSafeAreaInsets()

<View style={{
  paddingTop: insets.top,
  paddingBottom: insets.bottom,
}}>
  {children}
</View>
```

---

## 12. KEYBOARD HANDLING

```typescript
import { KeyboardAvoidingView, Platform } from 'react-native'

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  <ScrollView showsVerticalScrollIndicator={false}>
    {/* Form fields */}
  </ScrollView>
</KeyboardAvoidingView>
```

---

## 13. REQUIRED DEPENDENCIES

```json
{
  "dependencies": {
    "react-native": "latest",
    "@react-navigation/native": "^6.x",
    "@react-navigation/bottom-tabs": "^6.x",
    "@react-navigation/native-stack": "^6.x",
    "react-native-screens": "latest",
    "react-native-safe-area-context": "latest",
    "react-native-gesture-handler": "latest",
    "lucide-react-native": "latest",
    "@react-native-async-storage/async-storage": "latest",
    "react-native-linear-gradient": "latest",
    "react-native-svg": "latest",
    "react-native-chart-kit": "latest",
    "react-native-reanimated": "latest",
    "date-fns": "latest"
  }
}
```

---

## 14. PROJECT STRUCTURE

```
mobile-app/
├── src/
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   └── types.ts
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── OnboardingScreen.tsx
│   │   │   ├── GetStartedScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignUpScreen.tsx
│   │   │   ├── PinScreenScreen.tsx
│   │   │   └── LoginSuccessScreen.tsx
│   │   └── app/
│   │       ├── HomeScreen.tsx
│   │       ├── ExpensesScreen.tsx
│   │       ├── InsightScreen.tsx
│   │       └── ProfileScreen.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── TextInput.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── features/
│   │   │   ├── TransactionItem.tsx
│   │   │   ├── CategoryPill.tsx
│   │   │   ├── AddTransactionModal.tsx
│   │   │   └── ...
│   │   └── common/
│   │       ├── Header.tsx
│   │       └── ...
│   ├── context/
│   │   ├── AppState.tsx
│   │   └── AppProvider.tsx
│   ├── lib/
│   │   ├── types.ts
│   │   ├── categories.ts
│   │   ├── format.ts
│   │   ├── backend.ts
│   │   └── utils.ts
│   ├── theme/
│   │   ├── colors.ts
│   │   └── styles.ts
│   ├── App.tsx
│   └── index.tsx
└── package.json
```

---

## 15. KEY DIFFERENCES SUMMARY

| Aspect | Web (Current) | React Native (Target) |
|--------|---------------|----------------------|
| Styling | Tailwind CSS + CSS Variables | StyleSheet + Theme Context |
| Navigation | Tab state + conditional rendering | React Navigation (Stack + Tabs) |
| Scrolling | `overflow-y-auto` | `ScrollView` / `FlatList` |
| Lists | `.map()` | `FlatList` / `SectionList` |
| Storage | `localStorage` | `AsyncStorage` |
| Icons | lucide-react | lucide-react-native / react-native-heroicons |
| Forms | HTML inputs + onChange | TextInput + onChangeText |
| Modals | shadcn Dialog | React Native Modal |
| Animations | CSS classes | Animated API / Reanimated |
| Gestures | onClick/onChange | Gesture Handler library |
| Safe Area | Manual padding | SafeAreaView component |
| Colors | HSL via CSS vars | JavaScript objects |

---

## MIGRATION CHECKLIST

- [ ] Set up React Native project (Expo/RN CLI)
- [ ] Install dependencies
- [ ] Create theme color configuration
- [ ] Build navigation structure
- [ ] Convert AppState to work with React Native
- [ ] Migrate screens one by one
- [ ] Build reusable UI components
- [ ] Implement authentication flow
- [ ] Connect to backend API
- [ ] Implement AsyncStorage persistence
- [ ] Add animations using Reanimated
- [ ] Test on iOS and Android
- [ ] Optimize performance
- [ ] Implement local testing with backend mock
- [ ] Deploy to app stores

