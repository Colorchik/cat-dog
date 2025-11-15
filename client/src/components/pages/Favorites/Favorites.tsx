import { useState, useEffect } from "react";
import { $api } from "../../../utils/axios.instance";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [currentFavorite, setCurrentFavorite] = useState(null);
  const [loading, setLoading] = useState(true);

  // Загружаем список избранных картинок
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await $api.get("/favorites");
      setFavorites(response.data);
      
      // Показываем рандомную картинку при загрузке
      if (response.data.length > 0) {
        showRandomFavorite(response.data);
      }
    } catch (err) {
      // Ошибка при загрузке избранного
    } finally {
      setLoading(false);
    }
  };

  // Показываем рандомную картинку из списка
  const showRandomFavorite = (favoritesList = favorites) => {
    if (favoritesList.length === 0) {
      setCurrentFavorite(null);
      return;
    }
    
    // Выбираем случайный индекс
    const randomIndex = Math.floor(Math.random() * favoritesList.length);
    setCurrentFavorite(favoritesList[randomIndex]);
  };

  // Обработчик кнопки "Следующая картинка"
  const handleNext = () => {
    showRandomFavorite();
  };

  if (loading) {
    return (
      <div className="colum">
        <p className="loading">Загрузка...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="colum">
        <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-md)' }}>Избранное</h2>
        <p className="text-muted" style={{ fontSize: 'var(--font-size-lg)' }}>
          У вас пока нет избранных картинок
        </p>
      </div>
    );
  }

  return (
    <div className="colum">
      <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-lg)' }}>Избранное</h2>
      {currentFavorite ? (
        <>
          <img
            src={currentFavorite.imageURL}
            alt="Избранное"
            className="dog-picture"
          />
          {currentFavorite.comment && (
            <div className="favorites-comment">
              <p><strong>Комментарий:</strong></p>
              <p>{currentFavorite.comment}</p>
            </div>
          )}
          <button 
            onClick={handleNext}
            className="favorites-button"
          >
            Следующая картинка
          </button>
        </>
      ) : (
        <p className="text-muted">Нет доступных картинок</p>
      )}
    </div>
  );
}

export default Favorites;

