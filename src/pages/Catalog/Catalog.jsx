import React, { useEffect, useState } from 'react';

import { NavList } from '../../components/NavList/NavList';
import { Filter } from '../../components/Filter/Filter';
import { CardInfo } from '../../components/CardInfo/CardInfo';
import { Loader } from '../../components/Loader/Loader';

import styles from './Catalog.module.css';

const Catalog = () => {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleOpenFilters = () => {
    setIsFilterOpen(true);
  };

  const handleCloseFilters = () => {
    setIsFilterOpen(false);
  };

  const handleFiltersApplied = () => {
    if (isMobile) {
      setIsFilterOpen(false);
    }
  };

  return (
    <div className={styles.catalog_page}>
      <NavList />
      {isMobile && (
        <button
          type="button"
          className={styles.mobile_search_button}
          onClick={handleOpenFilters}
          aria-haspopup="dialog"
          aria-expanded={isFilterOpen}
        >
          Search
        </button>
      )}
      {isMobile && isFilterOpen && (
        <div className={styles.mobile_filters_overlay} role="dialog" aria-modal="true">
          <div className={styles.mobile_filters_content}>
            <button
              type="button"
              className={styles.mobile_filters_close}
              aria-label="Close filters"
              onClick={handleCloseFilters}
            >
              ×
            </button>
            <Filter onSearchComplete={handleFiltersApplied} />
          </div>
        </div>
      )}
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.catalog_wrapper}>
          {!isMobile && <Filter />}
          <CardInfo />
        </div>
      )}
    </div>
  );
};

export default Catalog;
