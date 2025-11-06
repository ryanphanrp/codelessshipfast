# Component Replacement Plan: Shadcn → HextaUI

## Overview
Replace all Shadcn UI components with HextaUI equivalents to get enhanced styling, better animations, and more modern design patterns.

## Current Components (30 Shadcn)

### ✅ Direct HextaUI Equivalents (25 components)
These have direct replacements in HextaUI:

| Shadcn Component | HextaUI Equivalent | Priority | Notes |
|------------------|-------------------|----------|-------|
| avatar.tsx | Avatar | HIGH | User profile avatars |
| badge.tsx | Badge | HIGH | Status indicators |
| button.tsx | Button | HIGH | Already have custom AnimatedButton |
| card.tsx | Card | HIGH | Content containers |
| checkbox.tsx | Checkbox | MEDIUM | Form inputs |
| command.tsx | CommandMenu | MEDIUM | Command palette |
| dialog.tsx | Modal | HIGH | Modal dialogs |
| dropdown-menu.tsx | DropdownMenu | MEDIUM | Dropdown menus |
| input.tsx | Input | HIGH | Text inputs |
| label.tsx | Label | MEDIUM | Form labels |
| progress.tsx | Progress | LOW | Progress indicators |
| resizable.tsx | Resizable | LOW | Resizable panels |
| scroll-area.tsx | ScrollArea | MEDIUM | Custom scrollbars |
| select.tsx | Select | MEDIUM | Select dropdowns |
| separator.tsx | Separator | LOW | Visual separators |
| sheet.tsx | Drawer | MEDIUM | Side drawers |
| sidebar.tsx | Sidebar | HIGH | Navigation sidebar |
| skeleton.tsx | Skeleton + Loader | MEDIUM | Loading states |
| slider.tsx | Slider | LOW | Range sliders |
| switch.tsx | Switch | MEDIUM | Toggle switches |
| tabs.tsx | Tabs | MEDIUM | Tabbed content |
| textarea.tsx | Textarea | MEDIUM | Multi-line inputs |
| toast.tsx | Toast | MEDIUM | Toast notifications |
| toaster.tsx | Toast (container) | MEDIUM | Toast system |
| tooltip.tsx | Tooltip | MEDIUM | Hover tooltips |

### 🆕 New HextaUI Components (Not in Shadcn)
Additional components HextaUI provides:

| Component | Description | Usefulness |
|-----------|-------------|------------|
| **Accordion** | Collapsible content | HIGH - Add to dashboard |
| Alert | Alert notifications | HIGH - Error/success messages |
| Breadcrumb | Navigation breadcrumbs | MEDIUM - Page hierarchy |
| Calendar | Date selection | HIGH - Date inputs |
| Chip | Interactive tags | MEDIUM - Tag management |
| ColorPicker | Color selection | LOW - Design tools |
| DatePicker | Date picker with calendar | HIGH - Date selection |
| File Upload | Drag & drop file upload | MEDIUM - File handling |
| InputOTP | One-time password input | LOW - Security features |
| Kbd | Keyboard key display | LOW - Documentation |
| Marquee | Scrolling content | LOW - Announcements |
| MenuBar | Application menu | MEDIUM - Top navigation |
| Pagination | Page navigation | HIGH - List views |
| Radio | Radio button groups | MEDIUM - Form inputs |
| Table | Data tables | HIGH - Data display |
| TagInput | Tag management input | MEDIUM - Multi-select |
| Toggle | Toggle buttons | LOW - Settings |
| TreeView | Hierarchical tree | MEDIUM - File explorers |
| VideoPlayer | Video with controls | LOW - Media content |

### ⚠️ Keep from Shadcn (5 components)
These don't have HextaUI equivalents or are custom:

| Component | Reason to Keep | Alternative |
|-----------|----------------|-------------|
| carousel.tsx | No HextaUI equivalent | Keep Shadcn version |
| form.tsx | Form wrapper, not a component | Keep Shadcn version |
| function-textarea.tsx | Custom component | Keep custom version |
| popover.tsx | No direct equivalent | Use Modal/Drawer instead |
| sonner.tsx | External toast library | Migrate to HextaUI Toast |

## Replacement Strategy

### Phase 1: High Priority (5-7 components)
**Impact**: Visible UI improvements, commonly used

1. **Accordion** ⭐ (NEW - user requested)
2. **Button** (enhance existing AnimatedButton)
3. **Card** (enhance existing FeatureCard)
4. **Input** (forms, search)
5. **Dialog/Modal** (popups, confirmations)
6. **Alert** (NEW - error/success messages)
7. **Badge** (status indicators)

### Phase 2: Medium Priority (10-12 components)
**Impact**: Form inputs, navigation

8. **Select**
9. **Checkbox**
10. **Switch**
11. **Textarea**
12. **Label**
13. **Tabs**
14. **Dropdown Menu**
15. **Command Menu**
16. **Sidebar** (enhance existing)
17. **Sheet/Drawer**
18. **Tooltip**

### Phase 3: Low Priority (8-10 components)
**Impact**: Visual polish, advanced features

19. **Toast/Toaster**
20. **Avatar**
21. **Skeleton/Loader**
22. **Progress**
23. **Slider**
24. **Separator**
25. **Scroll Area**
26. **Resizable**
27. **Pagination** (NEW)
28. **Table** (NEW)

### Phase 4: Optional New Components
**Impact**: Additional features not currently used

- **DatePicker** (useful for date inputs)
- **Calendar** (date selection)
- **File Upload** (if needed)
- **Radio** (radio button groups)
- **Chip** (tag display)
- **TagInput** (tag management)
- **Breadcrumb** (navigation)

## Implementation Plan

### Step 1: Setup HextaUI Component System
```bash
# Already done:
# - Created src/components/hexta-ui/
# - Added @hexta/* alias
# - Configured tsconfig and components.json
```

### Step 2: Add Components Progressively
```bash
# High priority components
npx hextaui add Accordion
npx hextaui add Alert
npx hextaui add Modal
npx hextaui add Input
npx hextaui add Badge

# Medium priority
npx hextaui add Select Checkbox Switch Textarea Label
npx hextaui add Tabs DropdownMenu Tooltip

# Low priority
npx hextaui add Toast Avatar Skeleton Progress
```

### Step 3: Update Imports Gradually
```typescript
// Old (Shadcn)
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// New (HextaUI)
import { AnimatedButton } from "@hexta/animated-button"
import { Card } from "@hexta/card"
```

### Step 4: Keep Both Libraries During Migration
- Shadcn in `src/components/ui/`
- HextaUI in `src/components/hexta-ui/`
- Migrate imports file-by-file
- Test each component replacement

## Migration Approach

### Option A: Gradual (Recommended) ✅
- Add HextaUI components alongside Shadcn
- Update imports in new features first
- Migrate existing features one by one
- Keep Shadcn as fallback
- Timeline: 1-2 weeks

### Option B: Complete Replace
- Replace all Shadcn components at once
- Update all imports simultaneously
- Remove Shadcn components
- Higher risk of breakage
- Timeline: 2-3 days

## Benefits of HextaUI Over Shadcn

1. **Enhanced Styling** - More polished, modern designs
2. **Better Animations** - Smooth transitions and effects
3. **Improved Defaults** - Better out-of-box appearance
4. **Additional Components** - Accordion, Alert, Table, etc.
5. **Same Foundation** - Still uses Radix UI primitives
6. **Theme Compatible** - Works with existing design system

## Compatibility Matrix

| Feature | Shadcn | HextaUI | Compatible? |
|---------|--------|---------|-------------|
| Radix UI | ✅ | ✅ | ✅ |
| Tailwind CSS | ✅ | ✅ | ✅ |
| Dark Mode | ✅ | ✅ | ✅ |
| TypeScript | ✅ | ✅ | ✅ |
| Next.js 15 | ✅ | ✅ | ✅ |
| React 19 | ✅ | ✅ | ✅ |

## Next Steps

1. ✅ Research HextaUI components (DONE)
2. ✅ Create replacement plan (DONE)
3. 🔄 Start with Accordion (user requested)
4. 🔄 Add high-priority components
5. 🔄 Update imports progressively
6. 🔄 Test each replacement
7. 🔄 Document changes

## Success Criteria

- [ ] All high-priority components replaced
- [ ] No build errors
- [ ] All features working correctly
- [ ] Dark/light mode compatibility maintained
- [ ] No visual regressions
- [ ] Performance maintained or improved
- [ ] Documentation updated

---

**Status**: Ready to begin Phase 1 implementation
**Next Action**: Add Accordion component (user requested)
