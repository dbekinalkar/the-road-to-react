import "./App.css";
import * as React from "react";

const welcome = {
  greeting: "Hello",
  title: "React",
};

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);
  return [value, setValue];
};

const App = () => {
  const stories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const [searchTerm, setSearchTerm] = useStorageState("search", "");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter(({ title }) =>
    title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <List list={searchedStories} />
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

const List = ({ list }) => (
  <ul>
    {list.map(({ objectID, ...item }) => (
      <Item key={objectID} {...item} />
    ))}
  </ul>
);

const Item = ({ title, url, author, num_comments, points }) => (
  <li>
    <span>
      <a href={url}>{title}</a>
    </span>
    <span>{author}</span>
    <span>{num_comments}</span>
    <span>{points}</span>
  </li>
);

export default App;
