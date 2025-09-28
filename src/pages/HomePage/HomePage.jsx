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
          <p className={styles.subtitle}>Оренда кемперів по всій Україні</p>
          <h1 className={styles.title}>Створи власну пригоду на колесах</h1>
          <p className={styles.description}>
            Обирай ідеальний дім на колесах для сімейної відпустки чи швидкої втечі на вихідні.
            Гнучкі умови оренди, перевірені кемпери та прозора ціна без прихованих платежів.
          </p>
          <RentalSearchForm />
        </div>
        <div className={styles.heroImageWrapper}>
          <img src={camperImg} alt="Кемпер в подорожі" className={styles.heroImage} />
        </div>
      </section>
    </div>
  );
};
  

export default Home;
