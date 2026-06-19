import { tv } from "tailwind-variants";
import { buttonVariants, type Button } from "@/components/ui/button";
import { getDefaultClassNames } from "react-day-picker";
import type React from "react";

type DefaultClassNames = ReturnType<typeof getDefaultClassNames>;
type ButtonVariant = React.ComponentProps<typeof Button>["variant"];
type CaptionLayout = "label" | "dropdown" | "dropdown-months" | "dropdown-years";

export const calendarRoot = tv({
  base: [
    "group/calendar bg-background p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
    String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
    String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
  ],
});

const calendarSlots = tv({
  slots: {
    root: "w-fit",
    months: "relative flex flex-col gap-4 md:flex-row",
    month: "flex w-full flex-col gap-4",
    nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
    button_previous: "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
    button_next: "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
    month_caption: "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
    dropdowns: "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
    dropdown_root: "relative rounded-(--cell-radius)",
    dropdown: "absolute inset-0 bg-popover opacity-0",
    caption_label: "font-medium select-none",
    weekdays: "flex",
    weekday: "flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none",
    week: "mt-2 flex w-full",
    week_number_header: "w-(--cell-size) select-none",
    week_number: "text-[0.8rem] text-muted-foreground select-none",
    day: "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
    range_start: "relative isolate z-0 rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted",
    range_middle: "rounded-none",
    range_end: "relative isolate z-0 rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted",
    today: "rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none",
    outside: "text-muted-foreground aria-selected:text-muted-foreground",
    disabled: "text-muted-foreground opacity-50",
    hidden: "invisible",
  },
  variants: {
    captionLayout: {
      label: {
        caption_label: "text-sm",
      },
      dropdown: {
        caption_label: "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
      },
      "dropdown-months": {
        caption_label: "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
      },
      "dropdown-years": {
        caption_label: "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
      },
    },
    showWeekNumber: {
      true: {
        day: "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)",
      },
      false: {
        day: "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
      },
    },
  },
  defaultVariants: {
    captionLayout: "label",
    showWeekNumber: false,
  },
});

export function getCalendarClassNames(
  defaultClassNames: DefaultClassNames,
  captionLayout: CaptionLayout,
  buttonVariant: ButtonVariant,
  showWeekNumber?: boolean,
) {
  const slots = calendarSlots({ captionLayout, showWeekNumber: showWeekNumber ?? false });

  return {
    root: slots.root({ class: defaultClassNames.root }),
    months: slots.months({ class: defaultClassNames.months }),
    month: slots.month({ class: defaultClassNames.month }),
    nav: slots.nav({ class: defaultClassNames.nav }),
    button_previous: slots.button_previous({ class: [buttonVariants({ variant: buttonVariant }), defaultClassNames.button_previous] }),
    button_next: slots.button_next({ class: [buttonVariants({ variant: buttonVariant }), defaultClassNames.button_next] }),
    month_caption: slots.month_caption({ class: defaultClassNames.month_caption }),
    dropdowns: slots.dropdowns({ class: defaultClassNames.dropdowns }),
    dropdown_root: slots.dropdown_root({ class: defaultClassNames.dropdown_root }),
    dropdown: slots.dropdown({ class: defaultClassNames.dropdown }),
    caption_label: slots.caption_label({ class: defaultClassNames.caption_label }),
    weekdays: slots.weekdays({ class: defaultClassNames.weekdays }),
    weekday: slots.weekday({ class: defaultClassNames.weekday }),
    week: slots.week({ class: defaultClassNames.week }),
    week_number_header: slots.week_number_header({ class: defaultClassNames.week_number_header }),
    week_number: slots.week_number({ class: defaultClassNames.week_number }),
    day: slots.day({ class: defaultClassNames.day }),
    range_start: slots.range_start({ class: defaultClassNames.range_start }),
    range_middle: slots.range_middle({ class: defaultClassNames.range_middle }),
    range_end: slots.range_end({ class: defaultClassNames.range_end }),
    today: slots.today({ class: defaultClassNames.today }),
    outside: slots.outside({ class: defaultClassNames.outside }),
    disabled: slots.disabled({ class: defaultClassNames.disabled }),
    hidden: slots.hidden({ class: defaultClassNames.hidden }),
  };
}

export const dayButton = tv({
  base: "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70",
});
