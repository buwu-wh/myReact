import { useState, useCallback } from 'react';
import {
  useLocation,
  useNavigate,
  useSearchParams,
  useParams,
} from 'react-router-dom';
import PersonList from './PersonList';
import PersonDetail from './PersonDetail';
import type { PersonType } from './instant';
import useStore from '@/stores/index';

/**
 * 人员详情组件
 *
 * 展示人员列表，并包含人员列表组件和人员详情展示组件
 *
 * @returns 返回包含人员列表和详情的JSX元素
 */

const list: PersonType[] = [
  {
    name: '张三',
    age: 20,
    ava: 'https://img0.baidu.com/it/u=1440687573,2860717387&fm=253&fmt=auto&app=120&f=JPEG?w=627&h=380',
    sex: '男',
    id: 1,
  },
  {
    name: '吴美珩',
    age: 21,
    ava: 'https://p3-search.byteimg.com/obj/pgc-image/de9929c902d746eeac378f9b7267b8f8',
    sex: '女',
    id: 2,
  },
  {
    name: '王五',
    age: 22,
    ava: 'https://p3-search.byteimg.com/obj/pgc-image/STWhaa73hRTj41',
    sex: '男',
    id: 3,
  },
];
console.log('顶层顶层');
function Person() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const bears = useStore((state) => state.bears);
  const incrementBears = useStore((state) => state.incrementBears);
  console.log(location, 'location');
  console.log(params, 'useParams');
  console.log(searchParams.get('q'), 'searchParams');
  const [person, setPerson] = useState(list[0]);
  const id = person.id;
  const [count, setCount] = useState(0);
  console.log('第一层');
  const setCurr = useCallback(
    (per: PersonType) => {
      setPerson(per);
    },
    [setPerson]
  );
  return (
    <>
      <h1
        onClick={() => {
          incrementBears(7);
          setCount((count) => {
            // setSearchParams({ q: '莫文蔚' });
            return count + 1;
          });
        }}
      >
        bears:{bears}人员详情{count}
      </h1>
      <PersonList list={list} setCurr={setCurr} currId={id} />
      <PersonDetail person={person} />
    </>
  );
}
export default Person;
