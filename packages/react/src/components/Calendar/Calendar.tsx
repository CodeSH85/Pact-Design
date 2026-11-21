import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import {
  Button as AriaButton,
  Calendar as AriaCalendar,
  CalendarCell as AriaCalendarCell,
  type CalendarCellProps as AriaCalendarCellProps,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridBody as AriaCalendarGridBody,
  type CalendarGridBodyProps as AriaCalendarGridBodyProps,
  CalendarGridHeader as AriaCalendarGridHeader,
  type CalendarGridHeaderProps as AriaCalendarGridHeaderProps,
  type CalendarGridProps as AriaCalendarGridProps,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  type CalendarHeaderCellProps as AriaCalendarHeaderCellProps,
  CalendarHeading as AriaCalendarHeading,
  type CalendarHeadingProps as AriaCalendarHeadingProps,
  type CalendarProps as AriaCalendarProps,
  composeRenderProps,
  type DateValue
} from 'react-aria-components'
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react'

export type CalendarCellProps = AriaCalendarCellProps

export function CalendarCell({ className, ...props }: CalendarCellProps) {
  return (
    <AriaCalendarCell
      className={composeRenderProps(className, (cn) => clsx('pd-calendar-cell', cn))}
      {...props}
    />
  )
}

export function CalendarHeading({ className, ...props }: AriaCalendarHeadingProps) {
  return (
    <AriaCalendarHeading
      className={clsx('pd-calendar-heading', className)}
      {...props}
    />
  )
}

export function CalendarHeaderCell({ className, ...props }: AriaCalendarHeaderCellProps) {
  return (
    <AriaCalendarHeaderCell
      className={clsx('pd-calendar-header-cell', className)}
      {...props}
    />
  )
}

export function CalendarGridHeader({ className, children, ...props }: AriaCalendarGridHeaderProps) {
  return (
    <AriaCalendarGridHeader className={clsx(className)} {...props}>
      {children}
    </AriaCalendarGridHeader>
  )
}

export function CalendarGridBody({ className, children, ...props }: AriaCalendarGridBodyProps) {
  return (
    <AriaCalendarGridBody className={clsx(className)} {...props}>
      {children}
    </AriaCalendarGridBody>
  )
}

export function CalendarGrid({ className, children, ...props }: AriaCalendarGridProps) {
  return (
    <AriaCalendarGrid className={clsx('pd-calendar-grid', className)} {...props}>
      {children ?? (
        <>
          <CalendarGridHeader>
            {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
          </CalendarGridHeader>
          <CalendarGridBody>
            {(date) => <CalendarCell date={date} />}
          </CalendarGridBody>
        </>
      )}
    </AriaCalendarGrid>
  )
}

export interface CalendarProps<T extends DateValue> extends Omit<AriaCalendarProps<T>, 'children'> {
  children?: ReactNode
}

export function Calendar<T extends DateValue>({
  className,
  children,
  ...props
}: CalendarProps<T>) {
  return (
    <AriaCalendar
      className={composeRenderProps(className, (cn) => clsx('pd-calendar', cn))}
      {...props}
    >
      {children ?? (
        <>
          <header className="pd-calendar-header">
            <AriaButton slot="previous" className="pd-reset pd-calendar-nav-btn">
              <RiArrowLeftSLine className="pd-calendar-nav-icon" aria-hidden="true" />
            </AriaButton>
            <CalendarHeading />
            <AriaButton slot="next" className="pd-reset pd-calendar-nav-btn">
              <RiArrowRightSLine className="pd-calendar-nav-icon" aria-hidden="true" />
            </AriaButton>
          </header>
          <CalendarGrid />
        </>
      )}
    </AriaCalendar>
  )
}

export type { DateValue }
export default Calendar
