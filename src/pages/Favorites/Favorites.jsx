import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { connect } from 'react-redux';

import { setFavoriteCards, removeFavoriteCard } from '../../redux/actions/actions';
import { NavList } from '../../components/NavList/NavList';
import { Loader } from '../../components/Loader/Loader';
import { Modal } from '../../components/Modal/Modal';

import heart_red_icon from '../../assets/icons/heart_red.svg';
import wind_icon from '../../assets/icons/wind.svg';
import bed_icon from '../../assets/icons/bed.svg';
import kitchen_icon from '../../assets/icons/kitchen.svg';
import fuel_icon from '../../assets/icons/fuel.svg';
import transmission_icon from '../../assets/icons/transmission.svg';
import persons_icon from '../../assets/icons/persons.svg';
import star_icon from '../../assets/icons/star.svg';
import location_icon from '../../assets/icons/location.svg';

import styles from './Favorites.module.css';
import cardStyles from '../../components/CardInfo/CardInfo.module.css';

const Favorites = ({ loading, error, favoriteCards }) => {
  const dispatch = useDispatch();

  const [modalStates, setModalStates] = useState({});

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteCards'));
    if (storedFavorites) {
      dispatch(setFavoriteCards(storedFavorites));
    }
  }, [dispatch]);

  const openModal = camperId => {
    setModalStates(prevStates => ({
      ...prevStates,
      [camperId]: true,
    }));
  };

  const closeModal = camperId => {
    setModalStates(prevStates => ({
      ...prevStates,
      [camperId]: false,
    }));
  };

  const notifyRemove = () => toast.info('Camper removed from favorites!');

  const handleLikeClick = camper => {
    const camperId = camper._id;

    dispatch(removeFavoriteCard(camperId));

    notifyRemove();
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteCards')) || [];

    const updatedFavorites = storedFavorites.filter(
      favorite => favorite._id !== camperId
    );

    localStorage.setItem('favoriteCards', JSON.stringify(updatedFavorites));
  };

  return (
    <div>
      <NavList />
      {favoriteCards.length === 0 ? (
        <div className={styles.empty_template}>
          <h2 className={styles.empty_template_title}>There are no favorite campers</h2> 
          <ToastContainer autoClose={3000} />
        </div>
      ) : (
        <div className={styles.favorites_container}>
          {loading && <Loader size={80} color="#00BFFF" />}
          {error && (
            <div className={styles.error}>
              An error occurred: {error.message}
            </div>
          )}
          {!loading && !error && (
            <div className={cardStyles.card_wrapper}>
              {favoriteCards.map(
                camper =>
                  camper && (
                    <ul key={camper._id} className={cardStyles.card_list_wrapper}>
                      <li className={cardStyles.card_info}>
                        <div className={cardStyles.card_img_wrapper}>
                          <img
                            className={cardStyles.card_img}
                            src={camper.gallery[0]}
                            alt={camper.name}
                            width={290}
                            height={310}
                          />
                        </div>
                        <div>
                          <div className={cardStyles.info}>
                            <h2>{camper.name}</h2>
                            <div className={cardStyles.left_info}>
                              <h2>€{camper.price.toFixed(2)}</h2>
                              <button
                                className={cardStyles.fav_btn}
                                onClick={() => handleLikeClick(camper)}
                              >
                                <img src={heart_red_icon} alt="favorite icon" />
                              </button>
                            </div>
                          </div>
                          <div className={cardStyles.secondary_info}>
                            <div className={cardStyles.rating_wrapper}>
                              <img className={cardStyles.star_icon} src={star_icon} alt="star icon" />
                              {camper.rating}({camper.reviews.length} Reviews)
                            </div>

                            <div className={cardStyles.flex_box}>
                              <img className={cardStyles.star_icon} src={location_icon} alt="star icon" />
                              <span>{camper.location}</span>
                            </div>
                          </div>
                          <p className={cardStyles.description}>{camper.description}...</p>
                          <ul className={cardStyles.list_details}>
                            <li className={cardStyles.item_details}>
                              <img className={cardStyles.icons} src={persons_icon} alt="persons icon" />
                              <p className={cardStyles.header_detail}>
                                {camper.adults} adults
                              </p>
                            </li>
                            <li className={cardStyles.item_details}>
                              <img className={cardStyles.icons} src={transmission_icon} alt="persons icon" />
                              <p className={cardStyles.header_detail}>{camper.transmission}</p>
                            </li>
                            <li className={cardStyles.item_details}>
                              <img className={cardStyles.icons} src={fuel_icon} alt="persons icon" />
                              <p className={cardStyles.header_detail}>{camper.engine}</p>
                            </li>
                            <li className={cardStyles.item_details}>
                              <img className={cardStyles.icons} src={kitchen_icon} alt="persons icon" />
                              <p className={cardStyles.header_detail}>
                                {camper.details.kitchen && 'Kitchen'}
                              </p>
                            </li>
                            <li className={cardStyles.item_details}>
                              <img className={cardStyles.icons} src={bed_icon} alt="persons icon" />
                              <p className={cardStyles.header_detail}>
                                {camper.details.beds + ' beds'}
                              </p>
                            </li>
                            <li className={cardStyles.item_details}>
                              <img className={cardStyles.icons} src={wind_icon} alt="persons icon" />
                              <p className={cardStyles.header_detail}>
                                {camper.details.airConditioner > 0 && 'AC'}
                              </p>
                            </li>
                          </ul>

                          <button className={cardStyles.show_btn} onClick={() => openModal(camper._id)}>
                            Show more
                          </button>
                        </div>
                        {modalStates[camper._id] && (
                          <Modal
                            camper={camper}
                            closeModal={() => closeModal(camper._id)}
                          />
                        )}
                      </li>
                    </ul>
                  )
              )}
            </div>
          )}
          <ToastContainer autoClose={3000} />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  loading: state.favorite.loading,
  error: state.favorite.error,
  favoriteCards: state.favorite.favoriteCards,
});

export default connect(mapStateToProps)(Favorites);
