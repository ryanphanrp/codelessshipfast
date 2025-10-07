# Task Completion Checklist for CodelessShipFast

## Pre-Commit Quality Gates
Before completing any development task, run these commands in order:

### 1. Type Safety (Critical)
```bash
bun run check:types
```
- ✅ No TypeScript errors
- ✅ All imports resolve correctly
- ✅ Strict mode compliance

### 2. Code Quality (Critical)
```bash
bun run lint
```
- ✅ No Biome linting errors
- ✅ Code follows project conventions
- ✅ Import organization is correct

### 3. Code Formatting (Required)
```bash
bun run format:check
```
- ✅ Code is properly formatted
- ✅ Tab indentation maintained
- ✅ Line width under 100 characters

### 4. Testing (If Applicable)
```bash
bun run test:run
```
- ✅ All tests pass
- ✅ No test regressions
- ✅ Coverage maintained for utilities

## File Organization Check
- [ ] New files are in appropriate directories
- [ ] Components follow feature-based structure
- [ ] Types are co-located or in types/ directory
- [ ] Tests are alongside source files or in test/ directory

## Functionality Verification
- [ ] Feature works as expected
- [ ] No console errors in development
- [ ] Responsive design works on mobile
- [ ] Dark/light theme compatibility
- [ ] Error handling works appropriately

## Git Hygiene
- [ ] Staged changes reviewed with `git diff`
- [ ] Commit message follows conventional format
- [ ] No temporary files or debug code
- [ ] Feature branch (not main/master)

## Performance Considerations
- [ ] No unnecessary re-renders
- [ ] Appropriate React.memo usage
- [ ] Bundle size impact considered
- [ ] Images optimized if applicable

## Security & Best Practices
- [ ] No hardcoded secrets or API keys
- [ ] Input validation implemented
- [ ] XSS prevention considered
- [ ] Accessible markup used

## Final Validation
- [ ] All quality gates pass
- [ ] Manual testing completed
- [ ] Code review checklist satisfied
- [ ] Ready for deployment

## Emergency Rollback
If any issues are discovered:
1. Stop the current task
2. Investigate the root cause
3. Fix issues or revert changes
4. Re-run quality gates
5. Re-validate functionality