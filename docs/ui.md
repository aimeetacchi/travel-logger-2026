# UI Coding Standards

## Component Library

**Only shadcn/ui components may be used for UI in this project.**

Do not create custom components. If a UI element is needed, find the closest shadcn/ui component and use or compose it. Adding a new shadcn component (`npx shadcn@latest add <component>`) is always preferred over building something from scratch.

This rule applies everywhere: pages, layouts, forms, dialogs, tables, navigation, feedback, and any other visual element.

## Date Formatting

Use `date-fns` for all date formatting. Do not use `Date.prototype.toLocaleDateString`, `Intl.DateTimeFormat`, or any other date library.

Dates must be formatted as:

```
1st Sept 2025
21st Nov 2025
```

Use `format` with an ordinal day, abbreviated month, and full year:

```ts
import { format } from "date-fns";

// "1st Sept 2025"
format(date, "do MMM yyyy");
```

`date-fns` `do` token produces the ordinal day (1st, 2nd, 3rd, 21st, etc.) and `MMM` produces the abbreviated month name.
