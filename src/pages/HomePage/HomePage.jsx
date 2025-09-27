import { NavList } from '../../components/NavList/NavList';
import { Link } from 'react-router-dom';

import styles from './HomePage.module.css';
import camper_img from "../../assets/images/image.png";

const Home = () => {
  return (
    <div>
      <NavList/> 
        <div className={styles.home_wrapper}>
          <img
            className={styles.hero_image}
            src={camper_img}
            alt="Campers"
            width="625"
            height="222"
          />
          <div>
            <Link to="/catalog" className={styles.hero_btn}>
              Buy a camper
            </Link>
          </div>
        </div>
    </div>
  );
};
  

export default Home;
