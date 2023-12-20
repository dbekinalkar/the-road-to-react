import "./App.css";
import * as React from "react";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const welcome = {
  greeting: "Hello",
  title: "React",
};

// const initialStories = [
//   {
//     title: "React",
//     url: "https://reactjs.org/",
//     author: "Jordan Walke",
//     num_comments: 3,
//     points: 4,
//     objectID: 0,
//   },
//   {
//     title: "Redux",
//     url: "https://redux.js.org/",
//     author: "Dan Abramov, Andrew Clark",
//     num_comments: 2,
//     points: 5,
//     objectID: 1,
//   },
// ];

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);
  return [value, setValue];
};

// const getAsyncStories = () =>
//   new Promise((resolve) =>
//     setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
//   );

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState("search", "");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const [stories, dispatchStories] = React.useReducer(
    (state, action) => {
      switch (action.type) {
        case "STORIES_FETCH_INIT":
          return { ...state, isLoading: true, isError: false };
        case "STORIES_FETCH_SUCCESS":
          return {
            ...state,
            isLoading: false,
            isError: false,
            data: action.payload,
          };
        case "STORIES_FETCH_FAILURE":
          return {
            ...state,
            isLoading: false,
            isError: true,
          };
        case "REMOVE_STORY":
          return {
            ...state,
            data: state.data.filter(
              (story) => action.payload.objectID !== story.objectID
            ),
          };
        default:
          throw new Error();
      }
    },
    { data: [], isLoading: false, isError: false }
  );

  React.useEffect(() => {
    if (!searchTerm) return;

    dispatchStories({ type: "STORIES_FETCH_INIT" });

    fetch(`${API_ENDPOINT}${searchTerm}`)
      .then((response) => response.json())
      .then((result) => {
        dispatchStories({
          type: "STORIES_FETCH_SUCCESS",
          payload: result.hits,
        });
      })
      .catch(() => dispatchStories({ type: "STORIES_FETCH_FAILURE" }));
  }, [searchTerm]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  // const searchedStories = stories.data.filter(({ title }) =>
  //   title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <>
      <h1>
        {welcome.greeting} {welcome.title}
      </h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={handleSearch}
      >
        Search:
      </InputWithLabel>

      {stories.isError && <p>An error occured</p>}

      {stories.isLoading || !stories.data ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </>
  );
};

const InputWithLabel = ({
  id,
  type = "text",
  value,
  onInputChange,
  children,
}) => (
  <>
    <label htmlFor={id}>{children}</label>
    <input id={id} type={type} value={value} onChange={onInputChange} />
  </>
);

const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
);

const Item = ({ item, onRemoveItem }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </li>
);

export default App;
