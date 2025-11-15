import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { loadDogs } from "../../redux/dog.slice";
import { loadCats } from "../../redux/cat.slice";
import TypeHere from "../typeHere/TypeHere";
import { $api } from "../../utils/axios.instance";
import { isBlacklisted } from "../../utils/blacklist";

function Pictures({ type, showInput, setShowInput }) {
  const dogs = useAppSelector((state) => state.dogs);
  const cats = useAppSelector((state) => state.cats);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (type === "dogs") {
      dispatch(loadDogs());
    } else if (type === "cats") {
      dispatch(loadCats());
    }
  }, [dispatch, type]);

  const resDog = dogs?.dogs?.url;
  const resCat = cats?.dogs?.[0]?.url;

  let imageURL = type === "dogs" ? resDog : resCat;

  useEffect(() => {
    if (imageURL && isBlacklisted(imageURL)) {
      if (type === "dogs") {
        dispatch(loadDogs());
      } else if (type === "cats") {
        dispatch(loadCats());
      }
    }
  }, [imageURL, type, dispatch]);

  const shouldShowImage = imageURL && !isBlacklisted(imageURL);

  const handleSubmit = async (comment) => {
    try {
      if (!imageURL) {
        return;
      }
      await $api.post("/favorites", {
        imageURL,
        comment,
      });
      setShowInput(false);
      if (type === "dogs") dispatch(loadDogs());
      if (type === "cats") dispatch(loadCats());
    } catch (err) {
      if (err.response) {
        console.log(`Ошибка: ${err.response.data?.error || err.message}`);
      } else if (err.request) {
        console.log("Ошибка: не удалось подключиться к серверу");
      } else {
        console.log(`Ошибка: ${err.message}`);
      }
    }
  };

  return (
    <>
      {shouldShowImage ? (
        <img
          src={imageURL}
          alt="picture"
          className={type === "dogs" ? "dog-picture" : "cat-picture"}
        />
      ) : (
        <p className="loading">Загрузка...</p>
      )}

      {showInput && shouldShowImage && (
        <TypeHere
          imageURL={imageURL}
          onSubmit={handleSubmit}
          onCancel={() => setShowInput(false)}
        />
      )}
    </>
  );
}

export default Pictures;