import type { PersonType } from '../instant';
import { useMemo, useCallback } from 'react';

interface PersonListProps {
  list: PersonType[];
  currId: number;
  setCurr?: (person: PersonType) => void;
}
function PersonList({ list, setCurr, currId }: PersonListProps) {
  //   const [list, setList] = useState<PersonList[]>([]);

  const setC = useCallback(
    (item: PersonType) => {
      setCurr?.(item);
    },
    [setCurr]
  );
  console.log('第二层', 'PersonList');

  const listItem = useMemo(() => {
    return list.map((item: PersonType) => {
      console.log('第二层useMemo', 'PersonList');
      return (
        <li
          style={{
            listStyle: 'none',
            display: 'inline-block',
            margin: '10px',
            cursor: 'pointer',
            color: item.id === currId ? 'yellow' : '',
          }}
          key={item.id}
          onClick={() => {
            setC(item);
          }}
        >
          {item.name}
        </li>
      );
    });
  }, [currId, list, setC]);

  return (
    <>
      <ul>{listItem}</ul>
    </>
  );
}
export default PersonList;
