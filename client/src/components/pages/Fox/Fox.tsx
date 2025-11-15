import { useEffect, useState } from 'react';
import Button from '../../button/Button';
import TypeHere from '../../typeHere/TypeHere';
import { addToBlacklist, isBlacklisted } from '../../../utils/blacklist';
import { $api } from '../../../utils/axios.instance';

// Тип для данных о лисе
type FoxData = {
  image: string;
};

const Fox = () => {
  const [fox, setFox] = useState<FoxData | null>(null);
  const [showInput, setShowInput] = useState(false);

  const loadFox = () => {
    fetch('https://randomfox.ca/floof')
      .then(response => response.json())
      .then(data => {
        // Проверяем, не в черном списке ли картинка
        if (data.image && isBlacklisted(data.image)) {
          // Если в черном списке, загружаем новую
          loadFox();
        } else {
          setFox(data);
        }
      })
      .catch(error => console.error('Ошибка:', error));
  };

  useEffect(() => {
    loadFox();
  }, []);

  
  const handleSubmit = async (comment: string) => {
    try {
      
      if (!fox || !fox.image) {
        console.log('Нет картинки для добавления');
        return;
      }

      // Отправляем запрос на сервер
      await $api.post("/favorites", {
        imageURL: fox.image,
        comment: comment,
      });

      // Закрываем поле ввода
      setShowInput(false);
      
      // Загружаем новую картинку
      loadFox();
      
      console.log('Картинка добавлена в избранное!');
    } catch (err: any) {
      // Обрабатываем ошибки
      if (err.response) {
        console.log(`Ошибка: ${err.response.data?.error || err.message}`);
      } else if (err.request) {
        console.log("Ошибка: не удалось подключиться к серверу");
      } else {
        console.log(`Ошибка: ${err.message}`);
      }
    }
  };

  function handleClick(actionType: string) {
    switch (actionType) {
      case "like":
        // При лайке показываем поле для комментария
        setShowInput(true);
        break;
      case "neutral":
        // При нейтральном просто загружаем новую картинку
        loadFox();
        break;
      case "dislike":
        // Добавляем текущую картинку в черный список
        if (fox && fox.image) {
          addToBlacklist(fox.image);
        }
        // Загружаем новую картинку
        loadFox();
        break;
      default:
        break;
    }
  }

  return (
    <div className="colum">
      {fox ? (
        <>
          <h2 style={{ 
            fontSize: 'var(--font-size-2xl)', 
            marginBottom: 'var(--spacing-lg)',
            color: 'var(--color-text-primary)'
          }}>
            Кошки и собаки - зло. Лисички - няшки:
          </h2>
          <img src={fox.image} className="cat-picture" alt="Random Fox" />
          
          {/* Показываем поле для комментария, если был лайк */}
          {showInput && (
            <TypeHere
              imageURL={fox.image}
              onSubmit={handleSubmit}
              onCancel={() => setShowInput(false)}
            />
          )}
          
          {/* Показываем кнопки только если поле ввода скрыто */}
          {!showInput && <Button handleClick={handleClick} />}
        </>
      ) : (
        <p className="loading">Загрузка...</p>
      )}
    </div>
  );
};

export default Fox;