import { NavList } from '../../components/NavList/NavList';
import { RentalSearchForm } from '../../components/RentalSearchForm/RentalSearchForm';

import styles from './HomePage.module.css';
import camperImg from '../../assets/images/image.png';

const Home = () => {
  return (
    <div className={styles.page}>
      <NavList />
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.subtitle}>Camper rentals across Ukraine</p>
          <h1 className={styles.title}>Create your own road trip adventure</h1>
          <p className={styles.description}>
            Choose the perfect home on wheels for a family holiday or a spontaneous weekend escape.
            Flexible rental terms, trusted campers, and transparent pricing without hidden fees.
          </p>
          <RentalSearchForm />
        </div>
        <div className={styles.heroImageWrapper}>
          <img src={camperImg} alt="Camper van on a road trip" className={styles.heroImage} />
        </div>
      </section>
    </div>
  );
};
  

export default Home;
