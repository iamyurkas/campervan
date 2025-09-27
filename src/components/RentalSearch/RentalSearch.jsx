import { forwardRef, useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import styles from './RentalSearch.module.css';

const useMediaQuery = query => {
  const getMatches = () => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQueryList = window.matchMedia(query);
    const listener = event => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener('change', listener);
    setMatches(mediaQueryList.matches);

    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
};

const RangeInput = forwardRef(({ onClick, displayValue }, ref) => (
  <button type="button" className={styles.dateTrigger} onClick={onClick} ref={ref}>
    <span className={displayValue ? styles.triggerValue : styles.triggerPlaceholder}>
      {displayValue || 'Pick-up — Drop-off'}
    </span>
  </button>
));

RangeInput.displayName = 'RangeInput';

const formatDate = date =>
  new Intl.DateTimeFormat('uk-UA', { day: '2-digit', month: 'short' }).format(date);

export const RentalSearch = () => {
  const [location, setLocation] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [guests, setGuests] = useState('2');

  const [startDate, endDate] = dateRange;

  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 767px)');

  const formattedRange = useMemo(() => {
    if (startDate && endDate) {
      return `${formatDate(startDate)} – ${formatDate(endDate)}`;
    }

    if (startDate) {
      return `${formatDate(startDate)} – …`;
    }

    return '';
  }, [startDate, endDate]);

  const handleSubmit = event => {
    event.preventDefault();
    // Placeholder for future integration with catalog filters
  };

  const handleGuestsChange = event => {
    const { value } = event.target;

    if (value === '') {
      setGuests('');
      return;
    }

    const numericValue = Math.max(1, Math.min(12, Number(value)));
    setGuests(String(numericValue));
  };

  const monthsShown = isDesktop ? 2 : 1;
  const calendarClassName = `${styles.calendar} ${
    isMobile ? styles.mobileCalendar : styles.desktopCalendar
  }`;
  const popperClassName = `${styles.popper} ${
    isDesktop ? styles.desktopPopper : styles.mobilePopper
  }`;

  return (
    <section className={styles.searchSection} aria-label="Rental search">
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <div className={styles.fieldGroup}>
          <label htmlFor="rental-location" className={styles.fieldLabel}>
            Pick-up location
          </label>
          <input
            id="rental-location"
            name="location"
            type="text"
            value={location}
            onChange={event => setLocation(event.target.value)}
            placeholder="Where do you want to start?"
            className={styles.textInput}
          />
        </div>

        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Rental dates</span>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={update => {
              setDateRange(update);
            }}
            monthsShown={monthsShown}
            withPortal={isMobile}
            showPopperArrow={isDesktop}
            popperPlacement={isDesktop ? 'bottom-start' : 'auto'}
            calendarClassName={calendarClassName}
            popperClassName={popperClassName}
            minDate={new Date()}
            fixedHeight
            customInput={<RangeInput displayValue={formattedRange} />}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="rental-guests" className={styles.fieldLabel}>
            Guests
          </label>
          <input
            id="rental-guests"
            name="guests"
            type="number"
            min="1"
            max="12"
            value={guests}
            onChange={handleGuestsChange}
            className={styles.textInput}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Search rentals
        </button>
      </form>
    </section>
  );
};
