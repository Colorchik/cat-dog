import { useState } from "react";
import CatsSlice from "../../../redux/cat.slice"
import { useAppSelector, useAppDispatch } from "../../../redux/store";
import Button from "../../button/Button";
import Pictures from "../../picture/Pictures";
import { loadCats } from "../../../redux/cat.slice";
import { addToBlacklist } from "../../../utils/blacklist";

function Cat() {
    const cats = useAppSelector((state) => state.cats)
    const dispatch = useAppDispatch()
    const [showInput, setShowInput] = useState(false);

    // Получаем текущий URL картинки
    const currentImageURL = cats?.dogs?.[0]?.url;

    function handleClick(actionType) {
        switch (actionType) {
            case "like":
                setShowInput(true);
                break;
            case "neutral":
                dispatch(loadCats());
                break;
            case "dislike":
                // Добавляем текущую картинку в черный список
                if (currentImageURL) {
                    addToBlacklist(currentImageURL);
                }
                // Загружаем новую картинку
                dispatch(loadCats());
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
                Милые котики 🐱
            </h2>
            <Pictures 
                type="cats"
                showInput={showInput}
                setShowInput={setShowInput}
            />
            {!showInput && <Button handleClick={handleClick} />}
        </div>
    )
}

export default Cat;