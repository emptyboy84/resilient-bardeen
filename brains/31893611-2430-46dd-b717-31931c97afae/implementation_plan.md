# Touchpad Support and Gestures Implementation Plan

This plan aims to fix touchpad and trackpad usability issues in AetherOS. Specifically, we will resolve window dragging/resizing stuttering (often caused by the iframe stealing mouse events), enable native touch/touchpad dragging/resizing via Pointer Events, and introduce a two-finger horizontal scroll gesture on the touchpad to switch virtual workspaces.

## Proposed Changes

### Core Desktop logic

#### [MODIFY] [app.js](file:///c:/Users/lg/fix/public/app.js)

1. **Pointer Event Migration**:
   - Update window focus activation listener to use `pointerdown` instead of `mousedown`.
   - Update window drag listeners (`mousedown` / `mousemove` / `mouseup`) to use `pointerdown` / `pointermove` / `pointerup` on `document`.
   - Update window resize listeners to use pointer events as well.
2. **Iframe Pointer Event Disabling during Drag/Resize**:
   - Add the class `dragging-window` to `document.body` when window drag starts, and remove it on drag end.
   - Add the class `resizing-window` to `document.body` when window resize starts, and remove it on resize end.
3. **Workspace Switcher Touchpad Gesture**:
   - Listen to the `wheel` event on the `#desktop-container`.
   - Detect horizontal scrolls (where horizontal delta `deltaX` is dominant and exceeds a threshold).
   - Ignore wheel events that occur inside any `.window-body` to allow normal app-internal horizontal scrolling.
   - Switch to the next or previous workspace with an `800ms` cooldown window to prevent rapid workspace skipping.

### Styling

#### [MODIFY] [style.css](file:///c:/Users/lg/fix/public/style.css)

1. **Overlay & Iframe Rules**:
   - Add styles to temporarily disable pointer events on all iframes when `body` has `.dragging-window` or `.resizing-window` class:
     ```css
     body.dragging-window iframe,
     body.resizing-window iframe {
       pointer-events: none !important;
     }
     ```

## Verification Plan

### Automated Tests
- None. This is a frontend interaction enhancement.

### Manual Verification
- Deploy the app and test:
  1. Click-and-drag windows rapidly using a touchpad (or mouse) over the browser iframe to ensure it doesn't freeze or stick.
  2. Resize windows from all resize handles using a touchpad to ensure fluid movement.
  3. Perform a two-finger horizontal swipe gesture on the desktop background to switch virtual screens (workspaces) smoothly.
  4. Verify that swiping inside scrollable app containers doesn't trigger workspace switching.
