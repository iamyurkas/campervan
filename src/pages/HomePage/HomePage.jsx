import { NavList } from '../../components/NavList/NavList';
import { Link } from 'react-router-dom';

import styles from './HomePage.module.css';
import camper_img from "../../assets/images/image.png";

const Home = () => {
  return (
    <div>
      <NavList/> 
        <div className={styles.home_wrapper}> 
          <img src={camper_img} alt="Campervan rentals" width="625" height="222"/>
          <div>
            <Link to="/catalog" className={styles.hero_btn}>
              Find a campervan to rent
            </Link>
          </div>
        </div>
    </div>
  );
};
  

export default Home;
