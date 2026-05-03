# MINDCOMPILE UI Design Guide

## 🎮 Design Philosophy

**Terminal Hacker Aesthetic** — A competitive coding platform with a hacker/terminal theme optimized for blind coding contests.

### Core Principles

- **Dark Mode Only**: Slate-950 background (`bg-slate-950`)
- **Green Primary**: Terminal green (`#00ff00` / `#22c55e`)
- **Cyan Accent**: Neon cyan (`#00ffff` / `#06b6d4`)
- **Monospace Typography**: `font-mono` for all UI
- **Glassmorphism**: Blurred backgrounds with transparency
- **Scanlines & Grid**: Subtle visual texture for tech feel

---

## 🎨 Color Palette

```
Primary Colors:
  - Green:       #00ff00 / #22c55e (green-400/300)
  - Cyan:        #00ffff / #06b6d4 (cyan-400/300)
  - Red (Alert): #ef4444 (red-500)

Background:
  - Dark:        #0f172a (slate-950)
  - Semi-dark:   #1e293b (slate-800)
  - Glass:       rgba(15, 23, 42, 0.7) with backdrop blur

Text Colors:
  - Primary:     text-green-400
  - Secondary:   text-green-300/600
  - Accent:      text-cyan-400
  - Error:       text-red-400/500
  - Disabled:    text-green-600/50
```

---

## 📦 Key CSS Classes

### Borders & Glows

```jsx
// Terminal-style borders
className = "terminal-border"; // Light glow: 20px shadow
className = "terminal-border-bright"; // Strong glow: 30px shadow

// Scanlines (texture)
className = "scanlines"; // Repeating horizontal lines
className = "scanlines-fine"; // Finer, more subtle
className = "grid-pattern"; // Grid background
```

### Text Effects

```jsx
className = "glow-text"; // Green text glow
className = "glow-text-cyan"; // Cyan text glow

// Animations
className = "animate-flicker"; // Green flicker
className = "animate-neon-flicker"; // Stronger flicker
className = "animate-pulse-glow"; // Box glow pulse
className = "animate-cyber-pulse"; // Fade pulse
className = "animate-glitch"; // Glitch effect
```

### Buttons

```jsx
// Primary CTA
className = "btn-primary"; // Green border, hover fill
// Usage: <button className="btn-primary">Start</button>

// Secondary
className = "btn-secondary"; // Subtle green border

// Danger
className = "btn-danger"; // Red styling for destructive actions
```

### Form Inputs

```jsx
className = "form-input"; // Terminal-style input field
className = "form-select"; // Terminal-style dropdown

// Styling applied:
// - Dark background (black/60)
// - Green text
// - Green borders with glow on focus
// - Rounded corners
```

### Terminal Windows

```jsx
className = "terminal-window"; // Container with border & glow
className = "terminal-header"; // Header bar with dots
className = "terminal-dot"; // Red/Yellow/Green dots
```

---

## 🎯 Component Patterns

### Hero Section

- Large gradient title with neon flicker animation
- Terminal window with fake logs
- Animated typing effect
- Stats grid

### Navigation Bar

- Sticky positioning (z-50)
- Status indicators (●/○) for active links
- Terminal-style status bar at bottom
- Sticky glow effect

### Auth Form

- Centered terminal window
- Labeled inputs with `$` prefix
- Status messages with color coding
- Terminal header with dots

### Code Editor

- Enhanced focus states with glow
- Green text on dark background
- Tab indentation support
- No copy/paste allowed

### Problem Display

- Difficulty color coding:
  - Easy: Green
  - Medium: Yellow
  - Hard: Red
- Read-only display with enhanced borders
- Sample I/O in separate boxes

### Output Console

- Green for success, Red for errors
- Status indicator dot (animated)
- Cursor animation
- Scroll support

---

## 🔧 Tailwind Configuration Extensions

### Custom Animations

```css
@keyframes flicker {
  /* Green text flicker effect */
}

@keyframes neon-flicker {
  /* More pronounced flicker */
}

@keyframes glitch {
  /* Glitch distortion effect */
}

@keyframes cyber-pulse {
  /* Fade in/out pulse */
}

@keyframes matrix-rain {
  /* Falling text animation */
}
```

### Custom Utilities

```css
.terminal-border       /* 20px glow shadow */
.terminal-border-bright /* 30px glow shadow */
.scanlines            /* Horizontal line pattern */
.grid-pattern         /* Grid background */
.glow-text            /* Green text shadow */
.glow-box             /* Box shadow glow */
.glass-dark           /* Glassmorphism container */
```

---

## 📱 Responsive Design

- **Mobile First**: All components scale properly
- **Breakpoints**: Use Tailwind's `sm:`, `md:`, `lg:` prefixes
- **Typography**: Scale text sizes for readability
  - Mobile: `text-sm sm:text-base lg:text-lg`
- **Spacing**: Consistent padding/margin scaling
- **Nav**: Hide desktop nav on mobile, show strip

---

## ✨ Animation Guidelines

### When to use:

1. **Flicker**: Text emphasis, warnings
2. **Pulse**: Activity indicators, loading states
3. **Glitch**: Error states, attention grabbing
4. **Glow**: Focus states, hover effects
5. **Cyber-pulse**: Subtle activity

### Performance Tips:

- Limit simultaneous animations (max 3-4 on page)
- Use `animation-delay` for staggered effects
- Prefer GPU-accelerated properties: `transform`, `opacity`
- Avoid animating dimensions (width/height)

---

## 🚀 Best Practices

### DO ✅

- Use `terminal-border` for containers
- Apply `glow-text` to important headings
- Use `btn-primary` for CTAs
- Animate on hover/focus for interactivity
- Use cyan (`text-cyan-400`) as accent color
- Add scanlines for visual depth
- Use monospace fonts everywhere

### DON'T ❌

- Avoid light colors or white backgrounds
- Don't use rounded corners excessively
- Avoid bright colors beyond green/cyan/red
- Don't remove borders/glows (they define the theme)
- Avoid serif fonts
- Don't animate on load (hurts performance)
- Avoid color schemes outside the palette

---

## 🎬 Component Examples

### Button with Glow

```jsx
<button className="btn-primary hover:shadow-[0_0_30px_rgba(0,255,0,0.6)]">
  → SUBMIT
</button>
```

### Terminal Card

```jsx
<div className="terminal-window p-6">
  <div className="terminal-header">
    <span className="terminal-dot bg-red-500" />
    <span className="terminal-dot bg-yellow-500" />
    <span className="terminal-dot bg-green-500" />
  </div>
  <p className="glow-text">Content here</p>
</div>
```

### Form Input Group

```jsx
<div>
  <label className="text-xs text-cyan-400 block mb-2">$ NAME</label>
  <input type="text" className="form-input" placeholder="enter_value" />
</div>
```

---

## 📊 Current Styled Components

✅ **Updated to v2.0 Hacker Theme:**

- Hero.jsx
- NavBar.jsx
- Auth.jsx
- CodeScreen.jsx
- Problem.jsx
- Output.jsx
- App.css (Global styles)
- index.css (Base styles)

⏳ **Still need updates:**

- Admin components
- Leaderboard pages
- Rounds/Problems listing
- Footer
- Rules component

---

## 🔄 Maintenance

### When adding new components:

1. Use `terminal-window` or `terminal-border` for containers
2. Apply `glow-text` to headings
3. Use `form-input` for all inputs
4. Use `btn-primary`/`btn-secondary` for buttons
5. Keep text in `font-mono`
6. Use only green/cyan/red colors
7. Add scanlines to large areas

### Testing the Theme:

- Check on mobile (sm, md, lg breakpoints)
- Verify animations don't lag
- Test color contrast for accessibility
- Check that all interactive elements have hover states
- Ensure glows/shadows don't overwhelm

---

## 🎨 Theme Inspiration

- **VS Code Dark Theme**
- **Cyberpunk aesthetics**
- **Matrix-style terminal UI**
- **Retro arcade/vector design**
- **Hacker movie styling**

---

**Version:** 2.0 - Terminal Hacker Theme  
**Last Updated:** May 4, 2026  
**Theme:** `MINDCOMPILE` - Competitive Coding Platform
