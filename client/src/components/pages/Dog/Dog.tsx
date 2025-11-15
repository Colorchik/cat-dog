import { useState } from "react";
import dogSlice from "../../../redux/cat.slice"
import { useAppSelector, useAppDispatch } from "../../../redux/store";
import Button from "../../button/Button";
import Pictures from "../../picture/Pictures";
import { loadDogs } from "../../../redux/dog.slice";
import { addToBlacklist } from "../../../utils/blacklist";

function Dog() {
    const dogs = useAppSelector((state) => state.dogs)
    const dispatch = useAppDispatch()
    const [showInput, setShowInput] = useState(false);

    // Получаем текущий URL картинки
    const currentImageURL = dogs?.dogs?.url;

    function handleClick(actionType) {
        switch (actionType) {
            case "like":
                setShowInput(true);
                break;
            case "neutral":
                dispatch(loadDogs());
                break;
            case "dislike":
                // Добавляем текущую картинку в черный список
                if (currentImageURL) {
                    addToBlacklist(currentImageURL);
                }
                // Загружаем новую картинку
                dispatch(loadDogs());
                break;                
            default:
                break;    
        }
    }    
    return (
        <div className="colum">
            <h2 style={{ 
                fontSize: 'var(--font-size-2xl)', 
                marginBottom: 'var(--spacing-lg)',
                color: 'var(--color-text-primary)'
            }}>
                Милые собачки 🐶
            </h2>
            <Pictures 
                type="dogs"
                showInput={showInput}
                setShowInput={setShowInput}
            />
            {!showInput && <Button handleClick={handleClick}/>}
        </div>
    )
}

export default Dog;