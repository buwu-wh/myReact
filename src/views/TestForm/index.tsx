import { useReducer, useRef, useEffect, useState } from 'react';
import type { ChangeEvent, JSX } from 'react';
import { produce } from 'immer';
import Child from './Child';
import useStore from '@/stores';
import api from '@/apis/requests/appInfo';
import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal';

interface Person {
  name: string;
  age: number;
  gender: string;
  imgrsc: string;
}

type PersonAction =
  | { type: 'name'; value: string }
  | { type: 'age'; value: number }
  | { type: 'gender'; value: string }
  | { type: 'imgrsc'; value: string };

type ChangeEventCustom = ChangeEvent<HTMLInputElement>;

const personReducer = produce((draft: Person, action: PersonAction) => {
  switch (action.type) {
    case 'name':
      draft.name = action.value;
      break;
    case 'age':
      draft.age = action.value;
      break;
    case 'gender':
      draft.gender = action.value;
      break;
    case 'imgrsc':
      draft.imgrsc = action.value;
      break;
    default:
      throw new Error();
  }
});

const useGetPerson = (
  personInfo: Person
): [Person, React.Dispatch<PersonAction>] => {
  const [person, dispatch] = useReducer(personReducer, personInfo);
  return [person, dispatch];
};
function TestForm() {
  const personInfo: Person = {
    name: '莫文蔚',
    age: 18,
    gender: '女',
    imgrsc:
      'https://img0.baidu.com/it/u=1440687573,2860717387&fm=253&fmt=auto&app=120&f=JPEG?w=627&h=380',
  };
  const bears = useStore((state) => state.bears);
  const incrementBears = useStore((state) => state.incrementBears);
  const [person, dispatch] = useGetPerson(personInfo);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(person, 'person');
  function handleName(e: ChangeEventCustom) {
    console.log(e.currentTarget.value);
    dispatch({ type: 'name', value: e.currentTarget.value });
  }
  function handleAge(e: ChangeEventCustom) {
    dispatch({ type: 'age', value: Number(e.currentTarget.value) });
  }
  function handleGender(e: ChangeEventCustom) {
    dispatch({ type: 'gender', value: e.currentTarget.value });
  }
  function handleImgrsc(e: ChangeEventCustom) {
    dispatch({ type: 'imgrsc', value: e.currentTarget.value });
  }
  function getFormDate() {
    incrementBears(1);
    console.log(person, '个人信息表单');
  }
  let imgItem: JSX.Element | null = null;
  const id = 2;
  const { data, error, isError } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => {
      const aa = api.getUserInfo({ id }).then((res) => res.data);
      return aa;
    },
  });
  console.log(error, 'error', isError);
  if (person.imgrsc) {
    imgItem = (
      <li>
        <img src={person.imgrsc} alt="my" />
      </li>
    );
  }
  const nameRef = useRef<HTMLInputElement>(null);
  const childRef = useRef(null);
  useEffect(() => {
    // api.getUserInfo({ id: 1 }).then((res) => {
    //   setData(res.data);
    //   console.log('res', res.data);
    // });
    console.log(childRef.current, 'childRef.current');

    nameRef.current?.focus();
  }, []);

  if (error)
    return (
      <div>
        {isError}An error occurred: {error?.code}
      </div>
    );
  return (
    <>
      <ul>
        <li>
          <Child ref={childRef} />
          <label htmlFor="name">bears:{bears}姓名</label>
          <input
            id="name"
            type="text"
            ref={nameRef}
            value={person?.name}
            onChange={handleName}
          />
        </li>
        <li>
          <label htmlFor="age">年龄</label>
          <input id="age" type="text" value={person.age} onChange={handleAge} />
        </li>
        <li>
          <label htmlFor="gender">性别</label>
          <input
            id="gender"
            type="text"
            value={person.gender}
            onChange={handleGender}
          />
        </li>
        <li>
          <label htmlFor="imgrsc">图片地址</label>
          <input
            id="imgrsc"
            type="text"
            value={person.imgrsc}
            onChange={handleImgrsc}
          />
          <button onClick={getFormDate}>提交</button>
          <button onClick={() => setIsModalOpen(true)}>打开模态框</button>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <h2>模态框标题</h2>
            <p>这个模态框不会被父组件的样式影响</p>
          </Modal>
        </li>
        {imgItem}
      </ul>
    </>
  );
}
export default TestForm;
