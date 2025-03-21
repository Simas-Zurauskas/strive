import { createGlobalStyle } from "styled-components";

export type Scheme = "light" | "dark";

export interface CustomColors {
  // Base colors
  background: string;
  foreground: string;

  // Component colors
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;

  // UI elements
  border: string;
  input: string;
  ring: string;

  // Chart colors
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;

  // Sidebar specific colors
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

export interface BorderRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ExtendedTheme {
  colors: CustomColors;
  radius: BorderRadius;
  scheme: Scheme;
}

export const createTheme = (scheme: Scheme = "light"): ExtendedTheme => {
  // Apply the scheme to the document
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", scheme === "dark");
  }

  return {
    colors: {
      // Base colors
      background: "var(--background)",
      foreground: "var(--foreground)",

      // Component colors
      card: "var(--card)",
      cardForeground: "var(--card-foreground)",
      popover: "var(--popover)",
      popoverForeground: "var(--popover-foreground)",
      primary: "var(--primary)",
      primaryForeground: "var(--primary-foreground)",
      secondary: "var(--secondary)",
      secondaryForeground: "var(--secondary-foreground)",
      muted: "var(--muted)",
      mutedForeground: "var(--muted-foreground)",
      accent: "var(--accent)",
      accentForeground: "var(--accent-foreground)",
      destructive: "var(--destructive)",
      destructiveForeground: "var(--destructive-foreground)",

      // UI elements
      border: "var(--border)",
      input: "var(--input)",
      ring: "var(--ring)",

      // Chart colors
      chart1: "var(--chart-1)",
      chart2: "var(--chart-2)",
      chart3: "var(--chart-3)",
      chart4: "var(--chart-4)",
      chart5: "var(--chart-5)",

      // Sidebar specific colors
      sidebar: "var(--sidebar)",
      sidebarForeground: "var(--sidebar-foreground)",
      sidebarPrimary: "var(--sidebar-primary)",
      sidebarPrimaryForeground: "var(--sidebar-primary-foreground)",
      sidebarAccent: "var(--sidebar-accent)",
      sidebarAccentForeground: "var(--sidebar-accent-foreground)",
      sidebarBorder: "var(--sidebar-border)",
      sidebarRing: "var(--sidebar-ring)",
    },
    radius: {
      sm: "var(--radius-sm)",
      md: "var(--radius-md)",
      lg: "var(--radius-lg)",
      xl: "var(--radius-xl)",
    },
    scheme,
  };
};

export const GlobalStyles = createGlobalStyle`
`;
