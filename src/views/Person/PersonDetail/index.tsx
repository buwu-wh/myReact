import type { JSX } from 'react';
import React, { useEffect } from 'react';
import type { PersonType } from '../instant';
import api from '@/apis/requests/appInfo';
import { useQuery } from '@tanstack/react-query';
interface PersonDetailProps {
  person: PersonType;
}
function PersonDetail({ person }: PersonDetailProps) {
  //   const [list, setList] = useState<PersonList[]>([]);
  let avaItem: JSX.Element | undefined;
  if (person.ava) {
    avaItem = (
      <li>
        <img src={person.ava} width={800} />
      </li>
    );
  }
  const { data } = useQuery({
    queryKey: ['todo', person.id],
    queryFn: () => {
      const aa = api.getUserInfo({ id: person.id }).then((res) => res.data);
      console.log(aa, 'aa');
      return aa;
    },
  });
  return (
    <>
      <ul>
        <li>{data?.name}</li>
        <li>{person.age}</li>
        {avaItem}
        <li>{person.sex}</li>
      </ul>
    </>
  );
}
const MemoPersonDetail = React.memo(PersonDetail);
export default MemoPersonDetail;
