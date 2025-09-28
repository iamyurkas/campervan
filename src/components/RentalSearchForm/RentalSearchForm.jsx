import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';

import 'react-datepicker/dist/react-datepicker.css';

import styles from './RentalSearchForm.module.css';

import calendarIcon from '../../assets/icons/calendar.svg';
import locationIcon from '../../assets/icons/location.svg';
import personsIcon from '../../assets/icons/persons.svg';

const DateRangeInput = forwardRef(({ displayValue, hasValue, onClick }, ref) => {
  return (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className={`${styles.inputField} ${styles.clickableField}`}
      aria-label="Choose rental dates"
    >
      <img src={calendarIcon} alt="" aria-hidden="true" className={styles.inputIcon} />
      <span className={hasValue ? styles.inputValue : styles.inputPlaceholder}>{displayValue}</span>
    </button>
  );
});

DateRangeInput.displayName = 'DateRangeInput';

export const RentalSearchForm = () => {
  const navigate = useNavigate();
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  const [location, setLocation] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [dateRange, setDateRange] = useState([null, null]);
  const datePickerRef = useRef(null);

  const [startDate, endDate] = dateRange;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (startDate && endDate && datePickerRef.current) {
      datePickerRef.current.setOpen(false);
    }
  }, [startDate, endDate]);

  const isDesktop = viewportWidth >= 1024;
  const isMobile = viewportWidth < 768;

  const displayDateRange = useMemo(() => {
    const formatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };

    if (startDate && endDate) {
      return `${startDate.toLocaleDateString('en-GB', formatOptions)} – ${endDate.toLocaleDateString(
        'en-GB',
        formatOptions
      )}`;
    }

    if (startDate) {
      return `${startDate.toLocaleDateString('en-GB', formatOptions)} – ...`;
    }

    return 'Pick-up date — Drop-off date';
  }, [startDate, endDate]);

  const handleSubmit = event => {
    event.preventDefault();

    navigate('/catalog', {
      state: {
        location,
        startDate,
        endDate,
        travelers,
      },
    });
  };

  const handleTravelersChange = event => {
    const nextValue = Number(event.target.value);

    if (Number.isNaN(nextValue)) {
      setTravelers(1);
      return;
    }

    const clampedValue = Math.min(Math.max(nextValue, 1), 10);
    setTravelers(clampedValue);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={`${styles.fieldGroup} ${styles.locationField}`}>
        <label className={styles.label} htmlFor="rental-location">
          Pick-up location
        </label>
        <div className={styles.inputWrapper}>
          <img src={locationIcon} alt="" aria-hidden="true" className={styles.inputIcon} />
          <input
            id="rental-location"
            name="location"
            type="text"
            className={styles.inputField}
            placeholder="Destination"
            value={location}
            onChange={event => setLocation(event.target.value)}
            autoComplete="off"
          />
        </div>
      </div>
      <div className={`${styles.fieldGroup} ${styles.datesField}`}>
        <span className={styles.label}>Rental dates</span>
        <DatePicker
          ref={datePickerRef}
          selected={startDate}
          onChange={update => {
            setDateRange(update);
          }}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          minDate={new Date()}
          monthsShown={isDesktop ? 2 : 1}
          shouldCloseOnSelect={false}
          withPortal={isMobile}
          dateFormat="dd.MM.yyyy"
          customInput={
            <DateRangeInput displayValue={displayDateRange} hasValue={Boolean(startDate)} />
          }
          calendarClassName={styles.calendar}
          popperClassName={styles.calendarPopper}
          popperPlacement="bottom-start"
        />
      </div>
      <div className={`${styles.fieldGroup} ${styles.travelersField}`}>
        <label className={styles.label} htmlFor="travelers-count">
          Travelers
        </label>
        <div className={styles.inputWrapper}>
          <img src={personsIcon} alt="" aria-hidden="true" className={styles.inputIcon} />
          <input
            id="travelers-count"
            name="travelers"
            type="number"
            min={1}
            max={10}
            className={styles.inputField}
            value={travelers}
            onChange={handleTravelersChange}
          />
        </div>
      </div>
      <button type="submit" className={`${styles.submitButton} ${styles.submitField}`}>
        Find a camper
      </button>
    </form>
  );
};
