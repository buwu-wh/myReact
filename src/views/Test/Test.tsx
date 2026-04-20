import TwoLevel from './TwoLevel';
import ThreeLevel from './ThreeLevel';
import { useState, useEffect, useRef } from 'react';
import emitter from '@/units/eventBus';
import { produce } from 'immer';

function autoAdd(callBack: () => void) {
  setTimeout(() => {
    callBack();
    // autoAdd(callBack);
  }, 1000);
}
const golbalVal = 1234;
function Test() {
  const [count, setCount] = useState(0);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const hasExecuted = useRef(false);

  const testGolbal = () => {};
  function onClear(init = 0) {
    setCount(init);
  }
  console.log('第一层');
  const handle = (e: MouseEvent) => {
    setMousePosition(
      produce((draft) => {
        draft.x = e.clientX;
        draft.y = e.clientY;
      })
    );
  };
  useEffect(() => {
    if (!hasExecuted?.current) {
      autoAdd(() => setCount((count) => count + 1));
      hasExecuted.current = true;
    }
    document.addEventListener('click', handle, false);
    emitter.on('clear', () => {
      onClear();
    });
    return () => {
      emitter.off('clear');
      document.removeEventListener('click', handle);
    };
  }, []);
  useEffect(() => {
    console.log(mousePosition.x, 'countcount');
  }, [mousePosition]);
  return (
    <>
      <TwoLevel
        count={count}
        golbalVal={golbalVal}
        hasTips={true}
        onClear={onClear}
      >
        <ThreeLevel count={count} golbalVal={golbalVal} />
      </TwoLevel>
      <div onClick={testGolbal}>测试</div>
      <div>
        当前点击时鼠标位置x：{mousePosition.x},y：{mousePosition.y}
      </div>
    </>
  );
}
export default Test;
