import { Link } from 'react-router-dom';

import { NavList } from '../../components/NavList/NavList';
import { RentalSearch } from '../../components/RentalSearch/RentalSearch';

import styles from './HomePage.module.css';
import camperImg from '../../assets/images/image.png';

const Home = () => {
  return (
    <div>
      <NavList />
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Adventure awaits</p>
          <h1 className={styles.heroTitle}>Rent a campervan for your dream getaway</h1>
          <p className={styles.heroSubtitle}>
            Flexible pick-up dates, transparent pricing and curated campers for every
            kind of journey.
          </p>
          <Link to="/catalog" className={styles.heroBtn}>
            Browse rental catalog
          </Link>
        </div>
        <div className={styles.heroMedia}>
          <img src={camperImg} alt="Campervan at sunset" className={styles.heroImage} />
        </div>
      </div>
      <RentalSearch />
    </div>
  );
};

export default Home;
