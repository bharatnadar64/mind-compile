# UI Animations Reference

## Available Animations

### 1. **Flicker Animation**

```css
.animate-flicker
```

- Green text flicker effect
- Used for warnings, emphasis
- Example: Warning messages, alert text
- Duration: 2.5s infinite

### 2. **Neon Flicker**

```css
.animate-neon-flicker
```

- Stronger flicker with larger glow
- Used for hero titles, main headings
- Duration: 3s infinite
- More aggressive than flicker

### 3. **Pulse Glow**

```css
.animate-pulse-glow
```

- Box/text glow pulse effect
- Used for important containers
- Subtle breathing animation
- Duration: 2s infinite

### 4. **Cyber Pulse**

```css
.animate-cyber-pulse
```

- Fade in/out pulse
- Used for status indicators, active states
- More subtle than pulse-glow
- Duration: 2s infinite

### 5. **Glitch**

```css
.animate-glitch
```

- Glitch distortion effect
- Used for error states, attention grabbing
- Combines clipping and translate
- Duration: 4s infinite

### 6. **Matrix Rain**

```css
.animate-matrix-rain
```

- Falling text animation
- Used for background effects
- Duration: 20s linear infinite
- Requires height/positioning setup

### 7. **Pulse (Tailwind Built-in)**

```jsx
className = "animate-pulse";
```

- Standard opacity pulse
- Used for dots, indicators
- Duration: 2s
- Example: Animated dots in terminal headers

---

## Usage Examples

### Hero Title (with gradient)

```jsx
<h1 className="animate-neon-flicker text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
  MINDCOMPILE
</h1>
```

### Warning Text

```jsx
<p className="animate-flicker text-red-500">⚠ Unauthorized access detected</p>
```

### Status Indicator

```jsx
<span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
```

### Terminal Dots

```jsx
<span
  className="terminal-dot bg-red-500 animate-pulse"
  style={{ animationDelay: "0.3s" }}
/>
```

### Active Container

```jsx
<div className="terminal-border animate-pulse-glow">Content here</div>
```

### Loading State

```jsx
<div className="text-green-600 animate-cyber-pulse">Processing...</div>
```

---

## Animation Delay Pattern

For staggered animations on multiple elements:

```jsx
<span className="terminal-dot bg-red-500 animate-pulse" />
<span className="terminal-dot bg-yellow-500 animate-pulse" style={{animationDelay: '0.3s'}} />
<span className="terminal-dot bg-green-500 animate-pulse" style={{animationDelay: '0.6s'}} />
```

---

## Performance Tips

1. **Limit Simultaneous Animations**
   - Max 3-4 animations on page
   - Reduces CPU/GPU load
   - Smoother 60fps performance

2. **Use GPU-Accelerated Properties**
   - `transform` (translate, scale, rotate)
   - `opacity` (fade)
   - Avoid: width, height, left, right

3. **Animation Timing**
   - Short animations: 1-2s (interactive)
   - Medium: 2-3s (focus draws)
   - Long: 5s+ (background effects)

4. **When Not to Animate**
   - Page load (unless short fade-in)
   - Mobile devices with low performance
   - Background elements not in focus
   - Frequently changing elements

---

## Combining Animations

### Text with Glow

```jsx
<h2 className="animate-neon-flicker glow-text">IMPORTANT HEADING</h2>
```

### Container with Pulse

```jsx
<div className="terminal-window animate-pulse-glow">Content</div>
```

### Indicator with Custom Delay

```jsx
<div className="flex gap-2">
  {[0, 0.3, 0.6].map((delay, i) => (
    <span
      key={i}
      className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
      style={{ animationDelay: `${delay}s` }}
    />
  ))}
</div>
```

---

## Keyframe Definitions (App.css)

All keyframes are defined in `App.css`:

- `@keyframes flicker`
- `@keyframes neon-flicker`
- `@keyframes pulse-glow`
- `@keyframes cyber-pulse`
- `@keyframes glitch`
- `@keyframes matrix-rain`
- `@keyframes scanMove` (internal scan bar movement)

---

## Mobile Consideration

Some animations may need disabling on mobile for performance:

```jsx
<div className="hidden md:block animate-neon-flicker">Only on desktop</div>
```

---

**Last Updated:** May 4, 2026  
**Framework:** Tailwind CSS + Custom Keyframes  
**Theme:** Terminal Hacker Aesthetic
