// UI Component Props
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export interface ChartProps {
  data: any[];
  height?: number;
  width?: number;
  loading?: boolean;
  error?: string;
}

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

// Hero Slider Types
export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  gradient: string;
}

export interface HeroSliderProps {
  slides: HeroSlide[];
  onLoginClick: () => void;
  onFeaturesClick: () => void;
}

// Feature Types
export interface Feature {
  icon: string;
  title: string;
  description: string;
  gradient: string;
  benefits: string[];
}

export interface FeatureCardProps {
  feature: Feature;
  index: number;
}

// Navigation Types
export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  active?: boolean;
}

export interface NavigationProps {
  items: NavigationItem[];
  currentPath: string;
}

// Toast Types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Form Types
export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: (value: any) => string | null;
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  success: string;
  warning: string;
  error: string;
}

export interface Theme {
  colors: ThemeColors;
  fonts: {
    sans: string;
    serif: string;
    mono: string;
  };
  spacing: Record<string, string>;
  breakpoints: Record<string, string>;
}

// Responsive Types
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

// Animation Types
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface TransitionProps {
  show: boolean;
  enter?: string;
  enterFrom?: string;
  enterTo?: string;
  leave?: string;
  leaveFrom?: string;
  leaveTo?: string;
} 