import emitter from '@/units/eventBus';
import { useContext } from 'react';
import { UserContext } from '@/hooks/userContext';
interface ThreeLevelProps {
  name?: string;
  count: number;
  golbalVal: number;
}
function ThreeLevel(props: ThreeLevelProps) {
  const { message, setMessage } = useContext(UserContext);
  const clear = () => {
    console.log('emit,clear');
    emitter.emit('clear', {});
  };
  function changeMessage() {
    setMessage('我还哈哈哈哈IG');
  }
  return (
    <>
      <div>ThreeLevel</div>
      <div>{props.count}，你试试Three</div>
      <button onClick={clear}>emit重新计数</button>
      <div onClick={changeMessage}>第三层：{message}</div>
    </>
  );
}
export default ThreeLevel;
