import { useState } from 'react';
import type { ReactNode, MouseEvent } from 'react';
interface TwoLevelProps {
  name?: string;
  count: number;
  golbalVal: number;
  hasTips: boolean;
  children?: ReactNode;
  onClear: (a?: number) => void;
}
function TwoLevel(props: TwoLevelProps) {
  function clear() {
    props.onClear(4);
  }
  const [count, setCount] = useState(0);
  const handle = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setCount(count + 1);
  };
  console.log('第二层');
  return (
    <>
      <div>TwoLevel</div>
      <div>{props.count}，你试试Two</div>
      <button onClick={clear}>重新计数</button>
      {props.children}
      {props.hasTips && <div onClick={handle}>我有提示{count}</div>}
    </>
  );
}
export default TwoLevel;
