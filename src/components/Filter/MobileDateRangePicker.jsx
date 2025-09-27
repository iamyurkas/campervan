import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './MobileDateRangePicker.module.css';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const normalizeDate = date => {
  const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const formatISODate = date => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseISODate = value => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const isSameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const isBetweenExclusive = (target, start, end) => {
  if (!start || !end) return false;
  return target > start && target < end;
};

const addMonths = (date, count) => new Date(date.getFullYear(), date.getMonth() + count, 1);

const getMonthMatrix = date => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstWeekdayIndex = (firstDayOfMonth.getDay() + 6) % 7; // Monday start
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstWeekdayIndex);

  const weeks = [];
  const currentDay = new Date(startDate);
  for (let weekIndex = 0; weekIndex < 6; weekIndex += 1) {
    const week = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      week.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
};

const formatDisplayDate = value => {
  if (!value) {
    return 'Add date';
  }

  const date = parseISODate(value);
  if (!date) {
    return 'Add date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const formatSummaryDate = value => {
  if (!value) {
    return 'Add date';
  }

  const date = parseISODate(value);
  if (!date) {
    return 'Add date';
  }

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const MobileDateRangePicker = ({ startDate, endDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draftStart, setDraftStart] = useState(() => (startDate ? parseISODate(startDate) : null));
  const [draftEnd, setDraftEnd] = useState(() => (endDate ? parseISODate(endDate) : null));

  const today = useMemo(() => normalizeDate(new Date()), []);

  useEffect(() => {
    setDraftStart(startDate ? parseISODate(startDate) : null);
  }, [startDate]);

  useEffect(() => {
    setDraftEnd(endDate ? parseISODate(endDate) : null);
  }, [endDate]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const months = useMemo(() => {
    const baseMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return Array.from({ length: 12 }).map((_, index) => {
      const monthDate = addMonths(baseMonth, index);
      return {
        monthDate,
        label: new Intl.DateTimeFormat('en-US', {
          month: 'long',
          year: 'numeric',
        }).format(monthDate),
        matrix: getMonthMatrix(monthDate),
      };
    });
  }, [today]);

  const handleDaySelect = day => {
    const normalizedDay = normalizeDate(day);
    if (normalizedDay < today) {
      return;
    }

    if (!draftStart || (draftStart && draftEnd)) {
      setDraftStart(normalizedDay);
      setDraftEnd(null);
      return;
    }

    if (isSameDay(normalizedDay, draftStart)) {
      return;
    }

    if (normalizedDay < draftStart) {
      setDraftStart(normalizedDay);
      setDraftEnd(null);
      return;
    }

    setDraftEnd(normalizedDay);
  };

  const handleApply = () => {
    onChange({
      startDate: draftStart ? formatISODate(draftStart) : '',
      endDate: draftEnd ? formatISODate(draftEnd) : '',
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    setDraftStart(null);
    setDraftEnd(null);
    onChange({ startDate: '', endDate: '' });
  };

  const handleClose = () => {
    setDraftStart(startDate ? parseISODate(startDate) : null);
    setDraftEnd(endDate ? parseISODate(endDate) : null);
    setIsOpen(false);
  };

  const nights = useMemo(() => {
    if (!draftStart || !draftEnd) {
      return 0;
    }
    const diff = draftEnd.getTime() - draftStart.getTime();
    return Math.max(Math.round(diff / (1000 * 60 * 60 * 24)), 0);
  }, [draftEnd, draftStart]);

  const renderOverlay = () => (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Select travel dates">
      <div className={styles.backdrop} onClick={handleClose} />
      <div className={styles.sheet} role="presentation">
        <div className={styles.sheet_header}>
          <button
            type="button"
            className={styles.clear_button}
            onClick={handleClear}
            disabled={!draftStart && !draftEnd}
          >
            Clear
          </button>
          <p className={styles.sheet_title}>Select your travel dates</p>
          <button type="button" className={styles.close_button} onClick={handleClose} aria-label="Close date picker">
            ×
          </button>
        </div>
        <div className={styles.summary_row}>
          <div className={styles.summary_block}>
            <span className={styles.summary_label}>Check-in</span>
            <span className={styles.summary_value}>{formatSummaryDate(draftStart ? formatISODate(draftStart) : '')}</span>
          </div>
          <div className={styles.summary_block}>
            <span className={styles.summary_label}>Check-out</span>
            <span className={styles.summary_value}>{formatSummaryDate(draftEnd ? formatISODate(draftEnd) : '')}</span>
          </div>
        </div>
        {nights > 0 && <p className={styles.nights_text}>{`${nights} night${nights > 1 ? 's' : ''}`}</p>}
        <div className={styles.calendar_scroller}>
          {months.map(month => (
            <div key={month.label} className={styles.month_section}>
              <p className={styles.month_label}>{month.label}</p>
              <div className={styles.weekday_row}>
                {WEEK_DAYS.map(dayName => (
                  <span key={dayName} className={styles.weekday}>
                    {dayName}
                  </span>
                ))}
              </div>
              {month.matrix.map((week, index) => (
                <div key={`${month.label}-week-${index}`} className={styles.week_row}>
                  {week.map(day => {
                    const isFromCurrentMonth = day.getMonth() === month.monthDate.getMonth();
                    const iso = formatISODate(day);
                    const disabled = normalizeDate(day) < today || !isFromCurrentMonth;
                    const selectedStart = draftStart && isSameDay(day, draftStart);
                    const selectedEnd = draftEnd && isSameDay(day, draftEnd);
                    const inRange = isBetweenExclusive(day, draftStart, draftEnd);

                    const dayClasses = [styles.day_button];
                    if (!isFromCurrentMonth) {
                      dayClasses.push(styles.day_outside);
                    }
                    if (disabled) {
                      dayClasses.push(styles.day_disabled);
                    }
                    if (selectedStart || selectedEnd) {
                      dayClasses.push(styles.day_selected);
                    }

                    const cellClasses = [styles.day_cell];
                    if (inRange) {
                      cellClasses.push(styles.day_cell_in_range);
                    }
                    if (selectedStart && selectedEnd) {
                      cellClasses.push(styles.day_cell_single);
                    } else {
                      if (selectedStart && draftEnd) {
                        cellClasses.push(styles.day_cell_start);
                      }
                      if (selectedEnd && draftStart) {
                        cellClasses.push(styles.day_cell_end);
                      }
                    }

                    return (
                      <div key={iso} className={cellClasses.join(' ')}>
                        <button
                          type="button"
                          className={dayClasses.join(' ')}
                          onClick={() => handleDaySelect(day)}
                          disabled={disabled}
                        >
                          {day.getDate()}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
        <button
          type="button"
          className={styles.apply_button}
          onClick={handleApply}
          disabled={!draftStart || !draftEnd}
        >
          Apply dates
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <button type="button" className={styles.trigger} onClick={() => setIsOpen(true)}>
        <div className={styles.trigger_column}>
          <span className={styles.trigger_label}>Check-in</span>
          <span className={styles.trigger_value}>{formatDisplayDate(startDate)}</span>
        </div>
        <span className={styles.trigger_divider} aria-hidden="true" />
        <div className={styles.trigger_column}>
          <span className={styles.trigger_label}>Check-out</span>
          <span className={styles.trigger_value}>{formatDisplayDate(endDate)}</span>
        </div>
      </button>
      {isOpen && createPortal(renderOverlay(), document.body)}
    </div>
  );
};

