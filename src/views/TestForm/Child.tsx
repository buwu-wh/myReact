import { forwardRef, useRef, useImperativeHandle } from 'react';
import type { InputHTMLAttributes } from 'react';

interface ChildRef {
  focus: () => void;
  validate: () => { isValid: boolean; message?: string };
  clear: () => void;
}

const Child = forwardRef<ChildRef, InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const childVal = 'ndnf';

    // 使用 useImperativeHandle 暴露自定义方法
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      validate: () => {
        const value = inputRef.current?.value ?? '';
        if (value.length < 3) {
          return { isValid: false, message: '长度至少3位' };
        }
        return { isValid: true };
      },
      clear: () => {
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      },
      $ref: inputRef.current,
    }));
    return <input ref={inputRef} {...props} value={childVal} />;
  }
);
export default Child;
